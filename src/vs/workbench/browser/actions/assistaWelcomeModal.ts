/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { IWorkbenchThemeService } from '../../services/themes/common/workbenchThemeService.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { IFileDialogService } from '../../../platform/dialogs/common/dialogs.js';
import { IHostService } from '../../services/host/browser/host.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../platform/workspace/common/workspace.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../platform/storage/common/storage.js';
import { registerWorkbenchContribution2, WorkbenchPhase, IWorkbenchContribution } from '../../common/contributions.js';
import { URI } from '../../../base/common/uri.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { IFileService, ICreateFileOptions } from '../../../platform/files/common/files.js';
import { AssistaSvgUtils } from './assista-modal-resources/assistaModalSvgUtils.js';
import { AssistaComponents } from './assista-modal-resources/assistaModalComponents.js';
import { AssistaModalStyles } from './assista-modal-resources/assistaModalStyles.js';
import { isMacintosh } from '../../../base/common/platform.js';

// @ts-ignore
declare const window: any;

console.log('[Assista DEBUG] Page refreshed or loaded');

// Add this helper function near the top of the class or file
function getMinimalErrorMessage(error: any): string {
	const msg = error?.message || String(error);
	const lines = msg.split('\n').map((l: string) => l.trim()).filter(Boolean);
	// Look for a line with 'fatal:' or 'Could not resolve host'
	const resolveHostLine = lines.find((line: string) => line.toLowerCase().includes('could not resolve host'));
	if (resolveHostLine) return resolveHostLine;
	const fatalLine = lines.find((line: string) => line.toLowerCase().includes('fatal:'));
	if (fatalLine) return fatalLine;
	// Otherwise, just show the last line or the first line
	return lines[lines.length - 1] || lines[0] || 'Unknown error';
}

// Add this helper function at the top of the class (after getMinimalErrorMessage)
function addTooltipOnOverflow(input: HTMLInputElement) {
	function isInputOverflowing(input: HTMLInputElement) {
		const span = document.createElement('span');
		span.style.visibility = 'hidden';
		span.style.position = 'absolute';
		span.style.whiteSpace = 'pre';
		span.style.font = window.getComputedStyle(input).font;
		span.textContent = input.value;
		document.body.appendChild(span);
		const textWidth = span.offsetWidth;
		document.body.removeChild(span);
		return textWidth > input.offsetWidth;
	}
	input.addEventListener('mouseenter', function () {
		if (isInputOverflowing(input)) {
			input.title = input.value;
		} else {
			input.removeAttribute('title');
		}
	});
	input.addEventListener('mouseleave', function () {
		input.removeAttribute('title');
	});
	input.addEventListener('input', function () {
		input.removeAttribute('title');
	});
}

class AssistaSettingsOverlayService extends Disposable {
	private overlayElement: HTMLElement | null = null;
	public step: number = 0; // 0: welcome, 1: open/clone
	private selectedTheme: string | null = null;
	private themeImages = AssistaSvgUtils.getAllThemeImages();
	private themeService: IWorkbenchThemeService | null = null;
	private debugMode: boolean = false;
	private debugLogs: string[] = [];
	private fileDialogService: IFileDialogService | null = null;
	private hostService: IHostService | null = null;
	private storageService: IStorageService | null = null;
	private pendingFolderUri: any = null; // Store selected folder URI
	private totalSubsteps: number = 4;

	private confData: { db_user: string; db_password: string; xmlrpc_port: string; addons_path: string; conf_required: boolean } = {
		db_user: '',
		db_password: '',
		xmlrpc_port: '',
		addons_path: '',
		conf_required: false
	};

	private debuggerConfig: { pythonPath: string; odooBinPath: string; confPath: string } = { pythonPath: '', odooBinPath: '', confPath: '' };
	private debugger_required: boolean = false;


	private venvInstallData: { odoo_version: string; python_version: string; project_path: string; venv_required: boolean } = {
		odoo_version: '',
		python_version: '',
		project_path: '',
		venv_required: false
	};
	private step3Substep: number = 0; // 0: conf, 1: venv, 2: debugger, 3: all set

	// Theme mapping for the available themes
	private readonly themeMapping: { [key: string]: string } = {
		'Assista Light': 'assista-light-theme',
		'Assista Dark': 'assista-dark-theme',
		'Assista Midnight': 'assista-midnight',
	};

	// Debug methods
	public debugLog(message: string, data?: any): void {
		const timestamp = new Date().toISOString();
		const logEntry = `[${timestamp}] ${message}`;
		this.debugLogs.push(logEntry);

		if (this.debugMode) {
			console.log(`[Assista Debug] ${logEntry}`, data || '');
		}
	}

	private debugError(message: string, error?: any): void {
		const timestamp = new Date().toISOString();
		const logEntry = `[${timestamp}] ERROR: ${message}`;
		this.debugLogs.push(logEntry);

		if (this.debugMode) {
			console.error(`[Assista Debug] ${logEntry}`, error || '');
		}
	}

	private debugWarn(message: string, data?: any): void {
		const timestamp = new Date().toISOString();
		const logEntry = `[${timestamp}] WARN: ${message}`;
		this.debugLogs.push(logEntry);

		if (this.debugMode) {
			console.warn(`[Assista Debug] ${logEntry}`, data || '');
		}
	}

	public enableDebugMode(): void {
		this.debugMode = true;
		this.debugLog('Debug mode enabled');
	}

	public disableDebugMode(): void {
		this.debugMode = false;
		this.debugLog('Debug mode disabled');
	}

	public getDebugLogs(): string[] {
		return [...this.debugLogs];
	}

	public clearDebugLogs(): void {
		this.debugLogs = [];
		this.debugLog('Debug logs cleared');
	}

	public getDebugInfo(): any {
		return {
			step: this.step,
			selectedTheme: this.selectedTheme,
			themeServiceAvailable: !!this.themeService,
			overlayVisible: !!this.overlayElement,
			debugMode: this.debugMode,
			logCount: this.debugLogs.length,
			timestamp: new Date().toISOString()
		};
	}

	public async debugThemeService(): Promise<any> {
		try {
			const themeService = await this.getThemeService();
			const currentTheme = themeService.getColorTheme();
			const availableThemes = await themeService.getColorThemes();

			return {
				currentTheme: {
					id: currentTheme.id,
					label: currentTheme.label,
					settingsId: currentTheme.settingsId,
					type: currentTheme.type
				},
				availableThemesCount: availableThemes.length,
				availableThemes: availableThemes.map(theme => ({
					id: theme.id,
					label: theme.label,
					settingsId: theme.settingsId,
					type: theme.type
				})),
				themeMapping: this.themeMapping
			};
		} catch (error) {
			this.debugError('Failed to get theme service debug info', error);
			return { error: error.message };
		}
	}

	constructor(@IInstantiationService private readonly instantiationService: IInstantiationService | null = null, @IStorageService storageService: IStorageService | null = null) {
		super();
		this.storageService = storageService;
	}

	private async getThemeService(): Promise<IWorkbenchThemeService> {
		this.debugLog('Getting theme service');
		if (!this.themeService) {
			if (!this.instantiationService) {
				this.debugError('InstantiationService not available');
				throw new Error('InstantiationService not available');
			}
			this.debugLog('Creating theme service via instantiation service');
			this.themeService = this.instantiationService.invokeFunction(accessor => accessor.get(IWorkbenchThemeService));
			this.debugLog('Theme service created successfully');
		}
		return this.themeService;
	}

	private async getFileDialogService(): Promise<IFileDialogService> {
		this.debugLog('Getting file dialog service');
		if (!this.fileDialogService) {
			if (!this.instantiationService) {
				this.debugError('InstantiationService not available');
				throw new Error('InstantiationService not available');
			}
			this.debugLog('Creating file dialog service via instantiation service');
			try {
				// Attempt to retrieve the service via dependency injection
				this.fileDialogService = this.instantiationService.invokeFunction(accessor => {
					this.debugLog('Inside invokeFunction, getting IFileDialogService');
					try {
						const service = accessor.get(IFileDialogService);
						this.debugLog('IFileDialogService retrieved', { serviceAvailable: !!service });
						if (!service) {
							throw new Error('IFileDialogService is null or undefined');
						}
						return service;
					} catch (accessorError) {
						this.debugError('Failed to get IFileDialogService from accessor', accessorError);
						throw accessorError;
					}
				});
				this.debugLog('File dialog service created successfully via invokeFunction');
			} catch (error) {
				this.debugError('Failed to create file dialog service via invokeFunction', error);
				// Fallback: try to access Electron dialog directly (cross-platform)
				try {
					this.debugLog('Trying direct Electron dialog access as fallback');
					const electron = require('electron');
					// Support both remote and direct dialog (Electron 14+)
					const dialog = (electron.remote && electron.remote.dialog) ? electron.remote.dialog : (electron.dialog ? electron.dialog : null);
					if (dialog) {
						this.fileDialogService = {
							showOpenDialog: async (options: any) => {
								this.debugLog('Using Electron dialog directly');
								const properties = ['openDirectory'];
								if (isMacintosh) {
									properties.push('treatPackageAsDirectory');
								}
								const result = await dialog.showOpenDialog({
									properties,
									title: options.title,
									buttonLabel: options.openLabel
								});
								if (!result.canceled && result.filePaths && result.filePaths.length > 0) {
									// Convert file paths to URIs
									return result.filePaths.map((path: string) => URI.file(path));
								}
								return undefined;
							}
						} as any as IFileDialogService;
						this.debugLog('Created mock file dialog service using Electron directly');
					} else {
						throw new Error('Electron dialog not available');
					}
				} catch (electronError) {
					this.debugError('Failed to create mock file dialog service using Electron', electronError);
					throw new Error('Failed to access file dialog service through all methods');
				}
			}
		}
		return this.fileDialogService!;
	}

	private async getHostService(): Promise<IHostService> {
		this.debugLog('Getting host service');
		if (!this.hostService) {
			if (!this.instantiationService) {
				this.debugError('InstantiationService not available');
				throw new Error('InstantiationService not available');
			}
			this.debugLog('Creating host service via instantiation service');
			this.hostService = this.instantiationService.invokeFunction(accessor => accessor.get(IHostService));
			this.debugLog('Host service created successfully');
		}
		return this.hostService;
	}

	private async applySelectedTheme(): Promise<void> {
		this.debugLog('Applying selected theme', { selectedTheme: this.selectedTheme });
		if (!this.selectedTheme) {
			this.debugWarn('No theme selected, skipping application');
			return;
		}

		try {
			const themeService = await this.getThemeService();
			const availableThemes = await themeService.getColorThemes();
			this.debugLog('Retrieved available themes', { count: availableThemes.length });

			// Find a theme that matches our selection
			const themeToApply = availableThemes.find(theme => {
				const themeName = theme.label.toLowerCase();
				const selectedThemeName = this.selectedTheme!.toLowerCase();

				// Try to match by name
				if (themeName.includes(selectedThemeName) || selectedThemeName.includes(themeName)) {
					this.debugLog('Found theme by name match', { themeName, selectedThemeName });
					return true;
				}

				// For specific theme names, try to find exact matches
				switch (this.selectedTheme) {
					case 'Dark':
						return themeName.includes('dark') && !themeName.includes('light') && !themeName.includes('solarized') && !themeName.includes('tokyo');
					case 'Light':
						return themeName.includes('light') && !themeName.includes('dark') && !themeName.includes('solarized') && !themeName.includes('tokyo');
					case 'Solarized Dark':
						return themeName.includes('solarized') && themeName.includes('dark');
					case 'Solarized Light':
						return themeName.includes('solarized') && themeName.includes('light');
					case 'Tokyo Night':
						return themeName.includes('tokyo') && themeName.includes('night') && !themeName.includes('light');
					case 'Tokyo Night Light':
						return themeName.includes('tokyo') && themeName.includes('night') && themeName.includes('light');
					case 'Synth Wave \'84':
						return themeName.includes('synth') || themeName.includes('wave');
					case 'Quiet Light':
						return themeName.includes('quiet') && themeName.includes('light');
				}

				return false;
			});

			if (themeToApply) {
				this.debugLog('Applying matched theme', {
					themeId: themeToApply.id,
					themeLabel: themeToApply.label,
					themeSettingsId: themeToApply.settingsId
				});
				await themeService.setColorTheme(themeToApply, 'auto');
				this.debugLog('Theme applied successfully', { themeLabel: themeToApply.label });
			} else {
				this.debugWarn('No exact theme match found, trying fallback');
				// Fallback to default themes based on the mapping
				const themeType = this.themeMapping[this.selectedTheme];
				if (themeType) {
					this.debugLog('Using fallback theme type', { themeType, selectedTheme: this.selectedTheme });
					const defaultTheme = availableThemes.find(theme =>
						theme.id.includes(themeType) || theme.settingsId.includes(themeType)
					);
					if (defaultTheme) {
						this.debugLog('Applying fallback theme', {
							themeId: defaultTheme.id,
							themeLabel: defaultTheme.label
						});
						await themeService.setColorTheme(defaultTheme, 'auto');
						this.debugLog('Fallback theme applied successfully', { themeLabel: defaultTheme.label });
					} else {
						this.debugError('No fallback theme found', { themeType, availableThemes: availableThemes.map(t => t.label) });
					}
				} else {
					this.debugError('No theme mapping found for selected theme', { selectedTheme: this.selectedTheme });
				}
			}
		} catch (error) {
			this.debugError('Failed to apply theme', error);
		}
	}



	private setOnboardingCompleted() {
		if (this.storageService) {
			this.storageService.store('assista.onboardingCompleted', 'true', StorageScope.APPLICATION, StorageTarget.USER);
			if (this.selectedTheme) {
				this.storageService.store('assista.selectedTheme', this.selectedTheme, StorageScope.APPLICATION, StorageTarget.USER);
			}
			this.debugLog('Onboarding marked as completed');
			console.log('[Assista] Onboarding marked as completed');
		}
	}

	private async openExistingProject(modal: HTMLElement): Promise<void> {
		this.debugLog('Opening existing project');
		try {
			const fileDialogService = await this.getFileDialogService();
			const result = await fileDialogService.showOpenDialog({
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false,
				openLabel: 'Select Project Directory',
				title: 'Select Project Directory'
			});

			if (result && result.length > 0) {
				this.pendingFolderUri = result[0]; // Store the selected URI
				this.debugLog('Selected folder stored for later open', { path: this.pendingFolderUri.fsPath });
				this.step = 2;
				this.renderContent(modal);
			} else {
				this.debugLog('No folder selected');
			}
		} catch (error) {
			this.debugError('Failed to open existing project', error);
		}
	}

	async renderContent(modal: HTMLElement) {
		modal.classList.add('assista-welcome-step');
		// Remove logic that removes the class for other steps
		// Remove theme selection logic
		this.debugLog('Rendering modal content', { step: this.step });
		while (modal.firstChild) {
			modal.removeChild(modal.firstChild);
		}
		if (this.step === 0) {
			// Step 1: Welcome + Get Started

			// --- Insert Logo SVG above the title (no innerHTML, use DOM nodes) ---
			const logoContainer = document.createElement('div');
			logoContainer.style.display = 'flex';
			logoContainer.style.justifyContent = 'center';
			logoContainer.style.alignItems = 'center';
			logoContainer.style.marginBottom = '1.7rem';
			logoContainer.style.marginTop = '1rem';

			const svg = AssistaSvgUtils.getAssistaLogoSvgElement();

			logoContainer.appendChild(svg);
			modal.appendChild(logoContainer);

			const titleRow = document.createElement('div');
			titleRow.style.display = 'flex';
			titleRow.style.justifyContent = 'center';
			titleRow.style.alignItems = 'center';
			titleRow.style.gap = '0.5rem';
			titleRow.style.marginBottom = '1.1rem';
			titleRow.style.marginTop = '0.3rem';
			titleRow.style.fontSize = '1.6rem';
			titleRow.style.fontWeight = '600';
			titleRow.style.color = '#fff';
			modal.appendChild(titleRow);

			const welcomeSpan = document.createElement('span');
			welcomeSpan.textContent = 'Welcome to';
			welcomeSpan.style.color = '#b7b7b7';
			welcomeSpan.style.fontWeight = '400';
			welcomeSpan.style.fontSize = '1.15rem';
			welcomeSpan.style.letterSpacing = '0.01em';
			welcomeSpan.style.fontFamily = 'inherit';

			const assistaSpan = AssistaComponents.createAssistaSpan()

			// Optionally, for a more blocky look, use a custom font or SVG, but here we use monospace and spacing.
			titleRow.appendChild(welcomeSpan);
			titleRow.appendChild(assistaSpan);
			modal.appendChild(titleRow);

			// Add subtitle below the title with dynamic typing animation and blinking cursor
			const subtitle = AssistaComponents.createTypingSubtitle('Your new command center for Odoo development');
			subtitle.style.color = '#b7b7b7';
			subtitle.style.fontSize = '1.02rem';
			subtitle.style.fontWeight = '400';
			subtitle.style.textAlign = 'center';
			subtitle.style.marginBottom = '0.7rem';
			subtitle.style.marginTop = '0.2rem';
			modal.appendChild(subtitle);

			const btnGroup = document.createElement('div');
			btnGroup.className = 'assista-btn-group';
			btnGroup.style.setProperty('margin-top', '0.7rem', 'important');
			btnGroup.style.setProperty('margin-bottom', '2.0rem', 'important');

			const getStartedBtn = document.createElement('button');
			getStartedBtn.className = 'assista-text-arrow-btn';
			getStartedBtn.style.marginTop = '2rem';
			getStartedBtn.onclick = (e) => {
				e.stopPropagation();
				this.setOnboardingCompleted();
				this.step = 1;
				this.renderContent(modal);
			};

			const btnText = document.createElement('span');
			btnText.textContent = 'Get Started';
			btnText.style.marginLeft = '28px';
			getStartedBtn.appendChild(btnText);

			const btnIcon = document.createElement('span');
			btnIcon.className = 'codicon codicon-chevron-right';
			getStartedBtn.appendChild(btnIcon);


			btnGroup.appendChild(getStartedBtn);
			modal.appendChild(btnGroup);

			const dots = this.createProgressDots(0, 2);
			modal.appendChild(dots);
		} else if (this.step === 1) {
			// Step 2: Open Existing Project or Download Odoo Source Code

			// --- Move Back button to top left ---
			const backBtn = AssistaComponents.createBackButton((e) => {
				e.stopPropagation();
				this.step = 0;
				this.renderContent(modal);
			});
			modal.appendChild(backBtn);

			// --- Add Back button to bottom right ---
			const backBtnBottom = AssistaComponents.createSkipButton((e) => {
				e.stopPropagation();
				this.hide();
			}, 'Skip');
			modal.appendChild(backBtnBottom);

			// Add SVG container above the title
			const svgContainer = AssistaComponents.createSvgContainer(this.themeImages.projectIcon, 'Project Icon');
			modal.appendChild(svgContainer);

			const title = document.createElement('span');
			title.className = 'assista-title';
			title.textContent = 'Time to link your Odoo project';
			modal.appendChild(title);

			const subtitle = AssistaComponents.createTypingSubtitle('Or start something fresh');
			modal.appendChild(subtitle);

			const btnGroup = document.createElement('div');
			btnGroup.className = 'assista-btn-group';
			btnGroup.style.display = 'flex';
			btnGroup.style.flexDirection = 'column'; // Arrange buttons in a column
			btnGroup.style.gap = '1.1rem';
			btnGroup.style.alignItems = 'center';
			btnGroup.style.justifyContent = 'center';
			btnGroup.style.width = '100%';

			// --- Remove Back button from btnGroup ---
			// (No longer add backBtn to btnGroup)

			// Open Existing Project button second
			const existingBtn = document.createElement('button');
			existingBtn.className = 'assista-btn get-started-btn';
			existingBtn.textContent = 'Open Existing Project';
			existingBtn.style.width = '300px'; // Set width
			existingBtn.style.setProperty('padding', '10px 0', 'important'); // Add vertical padding with !important
			existingBtn.style.setProperty('border', '1px solid #E3B2B3', 'important');
			existingBtn.style.setProperty('border-radius', '0.75rem', 'important'); // Set border radius
			existingBtn.style.setProperty('font-family', "'Ubuntu Sans', sans-serif", 'important');
			existingBtn.style.setProperty('font-weight', '600', 'important');
			existingBtn.onclick = async (e) => {
				e.stopPropagation();
				await this.openExistingProject(modal);
			};

			// Download Odoo Source Code button last
			const downloadBtn = document.createElement('button');
			downloadBtn.className = 'assista-secondary-btn assista-btn-same-size';
			const btnText = document.createElement('span');
			btnText.className = 'btn-text';
			btnText.textContent = 'Download Odoo';
			downloadBtn.appendChild(btnText);
			downloadBtn.style.width = '300px'; // Set width
			downloadBtn.style.setProperty('padding', '10px 0', 'important'); // Add vertical padding with !important
			downloadBtn.style.setProperty('border', '1px solid #E3B2B3', 'important');
			downloadBtn.style.setProperty('height', 'auto', 'important'); // Override fixed height to allow padding to work (matches Open Existing Project)
			downloadBtn.style.setProperty('font-family', "'Ubuntu Sans', sans-serif", 'important');
			btnText.style.setProperty('font-family', "'Ubuntu Sans', sans-serif", 'important');
			downloadBtn.onclick = async (e) => {
				e.stopPropagation();
				// Hide both buttons
				downloadBtn.style.display = 'none';
				existingBtn.style.display = 'none';
				backBtnBottom.style.display = 'none'; // Hide the Skip button when download fields are shown
				svgContainer.style.display = 'none'; // Hide the SVG container

				// --- Insert SVG above the title ---
				const newSvgContainer = AssistaComponents.createSvgContainer(this.themeImages.downloadOdooIcon, 'Download Odoo Icon');
				newSvgContainer.className = 'assista-download-svg-container';

				// Insert the SVG above the title
				if (title.parentNode) {
					title.parentNode.insertBefore(newSvgContainer, title);
				}

				// Change the title to 'Start something fresh' and hide the subtitle
				title.textContent = 'Download Odoo Source Code';
				subtitle.style.display = 'none';

				// Remove any previous error message

				// Create the main inputRow (vertical flex)
				const inputRow = document.createElement('div');
				inputRow.style.display = 'flex';
				inputRow.style.flexDirection = 'column';
				inputRow.style.gap = '0.6rem';
				inputRow.style.alignItems = 'center';
				inputRow.style.width = '100%';

				// Create the version select with floating label
				const odooVersions = {
					'Odoo 18': '18.0',
					'Odoo 17': '17.0',
					'Odoo 16': '16.0',
					'Odoo 15': '15.0',
					'Odoo 14': '14.0',
					'Odoo 13': '13.0',
					'Odoo 12': '12.0',
					'Odoo 11': '11.0',
					'Odoo 10': '10.0',
					'Odoo 9': '9.0',
					'Odoo 8': '8.0'
				};

				const versionFloatingLabelDiv = AssistaComponents.createFloatingLabelField({
					type: 'select',
					id: 'assista-odoo-version-select',
					label: 'Odoo Version',
					options: odooVersions,
					required: true
				});
				const versionSelect = versionFloatingLabelDiv.querySelector('select')!;

				// For the pathInput:
				const floatingLabelDiv = AssistaComponents.createFloatingLabelField({
					type: 'input',
					id: 'assista-odoo-path-input',
					label: 'Destination Folder',
					inputType: 'text',
					required: true
				});
				const pathInput = floatingLabelDiv.querySelector('input')!;
				pathInput.style.width = '87%';
				// Ensure no placeholder is set to avoid duplicate label
				pathInput.removeAttribute('placeholder');
				addTooltipOnOverflow(pathInput);

				pathInput.addEventListener('blur', () => {
					if (pathInput.value) {
						floatingLabelDiv.classList.add('has-value');
					} else {
						floatingLabelDiv.classList.remove('has-value');
					}
				});

				// Also listen for input events to update the floating label
				pathInput.addEventListener('input', () => {
					if (pathInput.value) {
						floatingLabelDiv.classList.add('has-value');
					} else {
						floatingLabelDiv.classList.remove('has-value');
					}
				});

				// For the selectBtn (Browse...):
				const selectBtn = AssistaComponents.createBrowseButton(async (ev) => {
					ev.stopPropagation();
					// Use file dialog service to select folder
					try {
						const fileDialogService = await this.getFileDialogService();
						const result = await fileDialogService.showOpenDialog({
							canSelectFiles: false,
							canSelectFolders: true,
							canSelectMany: false,
							title: 'Select Destination Folder',
							openLabel: 'Select Folder'
						});
						if (result && result.length > 0) {
							pathInput.value = result[0].fsPath || result[0].path || '';
							// Update the floating label immediately
							if (pathInput.value) {
								floatingLabelDiv.classList.add('has-value');
							} else {
								floatingLabelDiv.classList.remove('has-value');
							}
							pathInput.dispatchEvent(new Event('input', { bubbles: true }));
						}
					} catch (err) {
						console.error('Failed to open folder dialog:', err);
					}
				});

				// Create the inputAdornmentRow (relative, contains input and button)
				const inputAdornmentRow = AssistaComponents.createInputAdornmentRow([floatingLabelDiv, selectBtn]);

				// Append versionSelect, inputAdornmentRow, and actionRow to inputRow

				inputRow.appendChild(versionFloatingLabelDiv);
				inputRow.appendChild(inputAdornmentRow);

				// Action buttons row
				const actionRow = document.createElement('div');
				actionRow.style.display = 'flex';
				actionRow.style.justifyContent = 'space-between';
				actionRow.style.marginTop = '30px';
				actionRow.style.width = '350px'; // Match input width
				actionRow.style.gap = '0.7rem'; // Optional, for spacing between buttons
				actionRow.style.alignItems = 'flex-start'; // Prevent buttons from stretching to match each other's height

				const cancelBtn = AssistaComponents.createSecondaryButton((ev) => {
					ev.stopPropagation();
					// Remove the SVG logo if present (handle both old and new SVG containers)
					const svgLogo = modal.querySelector('svg[viewBox="0 0 62 62"]');
					if (svgLogo && svgLogo.parentElement) {
						const svgContainer = svgLogo.parentElement;
						if (svgContainer.parentElement) {
							svgContainer.parentElement.removeChild(svgContainer);
						}
					}
					// Also remove the new SVG container created by AssistaComponents
					const newSvgContainer = modal.querySelector('.assista-download-svg-container');
					if (newSvgContainer && newSvgContainer.parentElement) {
						newSvgContainer.parentElement.removeChild(newSvgContainer);
					}
					// Remove the input UI and show both buttons again
					inputRow.remove();
					downloadBtn.style.display = '';
					existingBtn.style.display = '';
					backBtnBottom.style.display = ''; // Show the Skip button again
					// Restore the title and subtitle
					title.textContent = 'Time to link your Odoo project ';
					title.style.display = '';
					subtitle.style.display = '';
					svgContainer.style.display = '';
					// Remove error message if present
				}, 'Cancel');

				const confirmBtn = AssistaComponents.createPrimaryButton(async (ev) => {
					ev.stopPropagation();
					// Remove any previous error message (already removed)

					// Remove any existing progress bar before creating a new one
					const oldProgressContainer = inputRow.querySelector('.assista-progress-container');
					if (oldProgressContainer) {
						oldProgressContainer.remove();
					}

					// Remove any previous progress listener before adding a new one
					if (window.assistaDownloadProgressListener) {
						window.vscode?.ipcRenderer?.removeListener?.('vscode:assistaDownloadProgress', window.assistaDownloadProgressListener);
						window.assistaDownloadProgressListener = null;
					}

					// Error highlighting for empty fields
					let allFilled = true;
					if (!versionSelect.value) {
						versionFloatingLabelDiv.classList.add('assista-input-underline-error');
						allFilled = false;
					} else {
						versionFloatingLabelDiv.classList.remove('assista-input-underline-error');
					}
					if (!pathInput.value) {
						floatingLabelDiv.classList.add('assista-input-underline-error');
						allFilled = false;
					} else {
						floatingLabelDiv.classList.remove('assista-input-underline-error');
					}
					// If not all filled, do not proceed
					if (!allFilled) {
						return;
					}

					// Remove error class on user input/select
					versionSelect.addEventListener('change', () => {
						if (versionSelect.value) versionFloatingLabelDiv.classList.remove('assista-input-underline-error');
					});
					pathInput.addEventListener('input', () => {
						if (pathInput.value) floatingLabelDiv.classList.remove('assista-input-underline-error');
					});

					// Show a simple progress indicator (optional: you can enhance this)
					confirmBtn.disabled = true;
					cancelBtn.disabled = true;
					backBtn.disabled = true;
					existingBtn.disabled = true;
					confirmBtn.textContent = 'Downloading';
					const version = versionSelect.value;
					const targetPath = pathInput.value;

					console.log(`[Assista Frontend] Starting download for version: ${version}`);
					console.log(`[Assista Frontend] Target path: ${targetPath}`);

					// Create progress display container
					const progressContainer = document.createElement('div');
					progressContainer.className = 'assista-progress-container';
					progressContainer.style.marginTop = '0.7rem';
					progressContainer.style.padding = '0.7rem';
					// progressContainer.style.backgroundColor = 'var(--vscode-editorWidget-background)';
					// progressContainer.style.border = '1px solid var(--vscode-editorWidget-border)';
					progressContainer.style.borderRadius = '4px';
					progressContainer.style.textAlign = 'center';
					progressContainer.style.width = '350px';
					progressContainer.style.margin = '0 auto';
					progressContainer.style.overflow = 'hidden';

					// Progress bar container
					const progressBarContainer = document.createElement('div');
					progressBarContainer.style.width = '350px';
					progressBarContainer.style.height = '8px';
					progressBarContainer.style.backgroundColor = 'black';
					progressBarContainer.style.borderRadius = '4px';
					progressBarContainer.style.overflow = 'hidden';
					progressBarContainer.style.marginBottom = '0.5rem';

					// Progress bar
					const progressBar = document.createElement('div');
					progressBar.style.width = '0%';
					progressBar.style.height = '100%';
					progressBar.style.backgroundColor = '#d09c9e'; // Standard VS Code blue
					progressBar.style.transition = 'width 0.3s ease';
					progressBar.style.borderRadius = '0'; // Remove rounded corners on the progress bar itself
					progressBarContainer.appendChild(progressBar);

					// Progress text
					const progressText = document.createElement('div');
					progressText.style.fontSize = '0.9rem';
					progressText.style.color = 'var(--vscode-editor-foreground)';
					progressText.style.marginBottom = '0.3rem';
					progressText.textContent = 'Starting download...';

					// Status text
					const statusText = document.createElement('div');
					statusText.style.fontSize = '0.8rem';
					statusText.style.color = 'var(--vscode-descriptionForeground)';
					statusText.textContent = 'Initializing...';

					progressContainer.appendChild(progressText);
					progressContainer.appendChild(progressBarContainer);
					progressContainer.appendChild(statusText);
					inputRow.insertBefore(progressContainer, actionRow);

					// Test if progress bar can be updated
					console.log(`[Assista Frontend] Initial progress bar width: ${progressBar.style.width}`);
					setTimeout(() => {
						progressBar.style.width = '25%';
						console.log(`[Assista Frontend] Test progress bar width after 1s: ${progressBar.style.width}`);
					}, 1000);

					// Set up progress listener for live updates
					const progressListener = (event: any, data: any) => {
						console.log(`[Assista Frontend] Progress listener called with:`, data);
						if (data.type === 'progress') {
							console.log(`[Assista Frontend] Git ${data.stream}: ${data.data.trim()}`);

							const output = data.data;
							console.log(`[Assista Frontend] Raw output: "${output}"`);

							// Parse git clone output for progress
							if (output.includes('Cloning into')) {
								console.log(`[Assista Frontend] Detected: Cloning into`);
								progressText.textContent = 'Cloning repository...';
								statusText.textContent = 'Initializing clone...';
								progressBar.style.width = '5%';
							} else if (output.includes('remote: Enumerating objects')) {
								console.log(`[Assista Frontend] Detected: Enumerating objects`);
								progressText.textContent = 'Enumerating objects...';
								statusText.textContent = 'Counting repository objects...';
								progressBar.style.width = '15%';
							} else if (output.includes('remote: Counting objects')) {
								console.log(`[Assista Frontend] Detected: Counting objects`);
								// Extract percentage from "remote: Counting objects: 100% (12345/12345), done."
								const match = output.match(/remote: Counting objects: (\d+)%/);
								if (match) {
									const percent = parseInt(match[1]);
									console.log(`[Assista Frontend] Counting objects percent: ${percent}`);
									progressText.textContent = `Counting objects... ${percent}%`;
									statusText.textContent = 'Analyzing repository structure...';
									progressBar.style.width = `${15 + (percent * 0.15)}%`;
								}
							} else if (output.includes('remote: Compressing objects')) {
								console.log(`[Assista Frontend] Detected: Compressing objects`);
								// Extract percentage from "remote: Compressing objects: 100% (9876/9876), done."
								const match = output.match(/remote: Compressing objects: (\d+)%/);
								if (match) {
									const percent = parseInt(match[1]);
									console.log(`[Assista Frontend] Compressing objects percent: ${percent}`);
									progressText.textContent = `Compressing objects... ${percent}%`;
									statusText.textContent = 'Optimizing download size...';
									progressBar.style.width = `${30 + (percent * 0.2)}%`;
								}
							} else if (output.includes('Updating files')) {
								console.log(`[Assista Frontend] Detected: Updating files`);
								// Extract percentage from "Updating files: 50% (14249/28497)"
								const match = output.match(/Updating files:\s*(\d+)%/);
								if (match) {
									const percent = parseInt(match[1]);
									console.log(`[Assista Frontend] Updating files percent: ${percent}`);
									progressText.textContent = `Downloading files... ${percent}%`;
									statusText.textContent = 'Transferring repository data...';
									progressBar.style.width = `${50 + (percent * 0.4)}%`;
								}
							} else if (output.includes('Receiving objects')) {
								console.log(`[Assista Frontend] Detected: Receiving objects`);
								// Extract percentage from "Receiving objects: 100% (12345/12345), done."
								const match = output.match(/Receiving objects: (\d+)%/);
								if (match) {
									const percent = parseInt(match[1]);
									console.log(`[Assista Frontend] Receiving objects percent: ${percent}`);
									progressText.textContent = `Downloading files... ${percent}%`;
									statusText.textContent = 'Transferring repository data...';
									progressBar.style.width = `${50 + (percent * 0.4)}%`;
								}
							} else if (output.includes('Resolving deltas')) {
								console.log(`[Assista Frontend] Detected: Resolving deltas`);
								// Extract percentage from "Resolving deltas: 100% (8765/8765), done."
								const match = output.match(/Resolving deltas: (\d+)%/);
								if (match) {
									const percent = parseInt(match[1]);
									console.log(`[Assista Frontend] Resolving deltas percent: ${percent}`);
									progressText.textContent = `Resolving deltas... ${percent}%`;
									statusText.textContent = 'Finalizing repository...';
									progressBar.style.width = `${90 + (percent * 0.1)}%`;
								}
							} else if (output.includes('done.')) {
								console.log(`[Assista Frontend] Detected: done`);
								progressText.textContent = 'Finalizing...';
								statusText.textContent = 'Completing download...';
								progressBar.style.width = '95%';
							} else {
								console.log(`[Assista Frontend] No pattern matched for: "${output.trim()}"`);
							}

							console.log(`[Assista Frontend] Progress bar width: ${progressBar.style.width}`);
						}
					};

					// Listen for progress updates from main process
					console.log(`[Assista Frontend] Setting up progress listener...`);
					console.log(`[Assista Frontend] window.vscode:`, window.vscode);
					console.log(`[Assista Frontend] window.vscode?.ipcRenderer:`, window.vscode?.ipcRenderer);
					window.assistaDownloadProgressListener = progressListener;
					window.vscode?.ipcRenderer?.on?.('vscode:assistaDownloadProgress', progressListener);
					console.log(`[Assista Frontend] Progress listener setup complete`);

					try {
						// Use the Electron IPC bridge exposed as window.vscode.ipcRenderer
						const result = await (window.vscode?.ipcRenderer?.invoke?.('vscode:assistaDownloadOdooSource', { version, targetPath }));
						if (result && result.success) {
							console.log(`[Assista Frontend] Download completed successfully!`);
							console.log(`[Assista Frontend] Folder path: ${result.path}`);
							// Show completion in progress display
							progressText.textContent = 'Download completed successfully!';
							statusText.textContent = 'Ready to proceed';
							progressBar.style.width = '100%';
							progressBar.style.backgroundColor = '#52c41a'; // Green for success

							const folderPath = result.path;
							this.pendingFolderUri = URI.file(folderPath);

							// Add a delay to show completion message before moving to next step
							setTimeout(() => {
								this.step = 2;
								this.renderContent(modal);
							}, 2000); // Show completion message for 2 seconds
							// Do not open workspace or hide modal here
						} else {
							// Show error in progress display
							progressText.textContent = 'Download failed';
							statusText.textContent = result?.error || 'Unknown error';
							progressBar.style.backgroundColor = '#ff4d4f'; // Red for error
						}
					} catch (error) {
						// Show error in progress display
						progressText.textContent = 'Download failed';
						statusText.textContent = `Error: ${error}`;
						progressBar.style.backgroundColor = '#ff4d4f'; // Red for error
					} finally {
						// Remove progress listener
						window.vscode?.ipcRenderer?.removeListener?.('vscode:assistaDownloadProgress', progressListener);
						window.assistaDownloadProgressListener = null;
						console.log(`[Assista Frontend] Download operation finished, listener removed`);

						confirmBtn.disabled = false;
						cancelBtn.disabled = false;
						backBtn.disabled = false;
						existingBtn.disabled = false;
						confirmBtn.textContent = 'Download';
					}
				}, 'Download');

				actionRow.appendChild(cancelBtn);
				actionRow.appendChild(confirmBtn);
				inputRow.appendChild(actionRow);

				btnGroup.appendChild(inputRow);
			};

			btnGroup.appendChild(existingBtn);
			btnGroup.appendChild(downloadBtn);
			modal.appendChild(btnGroup);

			const dots = this.createProgressDots(1, 2);
			modal.appendChild(dots);
		} else if (this.step === 2) {

			const stepHandlers: { [key: number]: (modal: HTMLElement) => void } = {
				0: (modal) => this.renderOdooConfStep(modal),
				1: (modal) => this.renderVenvInstallStep(modal),
				2: (modal) => this.renderDebuggerStep(modal),
				3: (modal) => this.renderThemeStep(modal),
				4: (modal) => this.renderConfigurationStep(modal),
			};

			const handler = stepHandlers[this.step3Substep];
			if (handler) {
				handler(modal);
			}
		}

		// Add substep progression bar only for step 2 (configuration step)
		if (this.step === 2 && this.step3Substep < 4) {
			const substepDots = this.createSubstepProgressDots(this.step3Substep, this.totalSubsteps);
			modal.appendChild(substepDots);
		}

		// At the end of each substep (1, 2, 3) except 0 and final, add Skip Odoo button
		if (this.step3Substep > 0 && this.step3Substep < this.totalSubsteps - 1) {
			const skipOdooBtn = AssistaComponents.createSkipButton((e) => {
				e.preventDefault();
				this.step3Substep = this.totalSubsteps - 1;
				this.renderContent(modal);
			}, 'Skip All');
			modal.appendChild(skipOdooBtn);
		}
	}

	private createProgressDots(active: number, total: number): HTMLElement {
		const dots = document.createElement('div');
		dots.className = 'assista-progress-bar-dots';
		for (let i = 0; i < total; i++) {
			const dot = document.createElement('span');
			dot.className = 'assista-progress-dot' + (i === active ? ' active' : '');
			dots.appendChild(dot);
		}
		return dots;
	}

	private createSubstepProgressDots(active: number, total: number): HTMLElement {
		const dots = document.createElement('div');
		dots.className = 'assista-substep-progress-bar-dots';
		for (let i = 0; i < total; i++) {
			const dot = document.createElement('span');
			dot.className = 'assista-substep-progress-dot' + (i === active ? ' active' : '');
			dots.appendChild(dot);
		}
		return dots;
	}

	async show() {
		this.debugLog('Assista modal show() called');
		console.log('[Assista DEBUG] show() called');
		if (this.overlayElement) {
			this.debugWarn('Modal already visible, ignoring show() call');
			console.log('[Assista DEBUG] Modal already visible, ignoring show() call');
			return;
		}

		// Restore selected theme from storage if available
		if (this.storageService) {
			const storedTheme = this.storageService.get('assista.selectedTheme', StorageScope.APPLICATION);
			if (storedTheme) {
				this.selectedTheme = storedTheme;
				this.debugLog('Restored selected theme from storage', { selectedTheme: storedTheme });
				console.log('[Assista DEBUG] Restored selected theme from storage:', storedTheme);
			}
		}

		// Add Google Font link to head
		if (!document.getElementById('ubuntu-sans-font')) {
			const fontLink = document.createElement('link');
			fontLink.id = 'ubuntu-sans-font';
			fontLink.rel = 'stylesheet';
			fontLink.href = 'https://fonts.googleapis.com/css2?family=Ubuntu+Sans:ital,wght@0,100..800;1,100..800&display=swap';
			document.head.appendChild(fontLink);
		}

		AssistaModalStyles.injectStyle('assista-modal-style', 'assistaModalStyles');
		AssistaModalStyles.injectStyle('assista-assista-gradient-style', 'assistaGradientStyles');
		AssistaModalStyles.injectStyle('assista-secondary-button-style', 'assistaSecondaryButtonStyles');
		AssistaModalStyles.injectStyle('assista-floating-label-style', 'assistaFloatingLabelStyles');
		AssistaModalStyles.injectStyle('assista-underline-error-style', 'assistaUnderlineErrorStyles');
		AssistaModalStyles.injectStyle('assista-font-style', 'assistaFontStyles');
		AssistaModalStyles.injectStyle('assista-title-gradient-style', 'assistaTitleGradientStyles');
		AssistaModalStyles.injectStyle('assista-logo-float-style', 'assistaLogoFloatStyles');

		this.overlayElement = document.createElement('div');
		this.overlayElement.className = 'assista-modal-overlay';
		this.overlayElement.addEventListener('click', (e) => {
			if (e.target === this.overlayElement) {
				this.hide();
			}
		});

		const modal = document.createElement('div');
		modal.className = 'assista-modal assista-welcome-step';
		this.renderContent(modal);

		this.overlayElement.appendChild(modal);

		const tryAttach = () => {
			const workbench = document.querySelector('.monaco-workbench');
			if (workbench) {
				workbench.appendChild(this.overlayElement!);
				console.log('[Assista DEBUG] Modal attached to .monaco-workbench');
				// Remove immediate loading modal after successful attachment
				this.removePreWorkbenchModal();
			} else {
				console.log('[Assista DEBUG] .monaco-workbench not found, retrying in 50ms...');
				setTimeout(tryAttach, 50);
			}
		};

		tryAttach();
	}

	hide() {
		this.debugLog('Assista modal hide() called');
		if (this.overlayElement) {
			// Remove from the correct parent
			if (this.overlayElement.parentElement) {
				this.overlayElement.parentElement.removeChild(this.overlayElement);
			}
			this.overlayElement = null;
			this.debugLog('Modal hidden successfully');
		} else {
			this.debugWarn('Modal not visible, ignoring hide() call');
		}
	}

	private removePreWorkbenchModal(): void {
		const immediateModal = document.getElementById('assista-immediate-loading-modal');
		if (immediateModal) {
			immediateModal.remove();
		}
	}

	public checkAndShowModal(): void {
		const workbench = document.querySelector('.monaco-workbench');
		if (workbench) {
			// Workbench is ready, show the actual modal (immediate loading modal will be removed after attachment)
			this.show();
		} else {
			// Workbench not ready yet, check again in 50ms
			setTimeout(() => this.checkAndShowModal(), 50);
		}
	}

	toggle() {
		this.debugLog('Assista modal toggle() called');
		if (this.overlayElement) {
			this.hide();
		} else {
			this.show();
		}
	}

	// Place this new method inside the AssistaSettingsOverlayService class, near other render helpers
	private renderOdooConfStep(modal: HTMLElement): void {
		// Place SVG above the title
		const svgContainer = AssistaComponents.createSvgContainer(this.themeImages.odooConf, 'Odoo Conf');
		modal.appendChild(svgContainer);

		const title = document.createElement('span');
		title.className = 'assista-title';
		title.textContent = 'Create Odoo Configuration File';
		modal.appendChild(title);

		const subtitle = AssistaComponents.createSubtitle(`Step ${this.step3Substep + 1} of ${this.totalSubsteps}`);
		modal.appendChild(subtitle);

		// Check if odoo.conf already exists and show warning
		if (this.pendingFolderUri) {
			const fileService = this.instantiationService?.invokeFunction(accessor => accessor.get(IFileService));
			if (fileService) {
				const confUri = URI.joinPath(this.pendingFolderUri, 'odoo.conf');
				fileService.exists(confUri).then(exists => {
					if (exists) {
						const warningDiv = AssistaComponents.createWarningDiv(
							'An ',
							'odoo.conf',
							' file already exists in this project. It will be replaced with the new configuration.'
						);
						modal.insertBefore(warningDiv, subtitle.nextSibling);
					}
				}).catch(err => {
					this.debugError('Failed to check for existing odoo.conf', err);
				});
			}
		}

		const form = document.createElement('form');
		form.style.display = 'flex';
		form.style.flexDirection = 'column';
		form.style.gap = '1.2rem';
		form.style.alignItems = 'center';
		form.style.margin = '1.2rem 0';
		form.onsubmit = (e) => { e.preventDefault(); };

		const fields = [
			{ key: 'db_user', label: 'Database User', type: 'text', placeholder: 'Database User' },
			{ key: 'db_password', label: 'Database Password', type: 'text', placeholder: 'Database Password' },
			{ key: 'xmlrpc_port', label: 'XMLRPC Port', type: 'text', placeholder: 'XMLRPC Port' },
			{ key: 'addons_path', label: 'Addons Path (Optional)', type: 'text', placeholder: 'Addons Path (Optional)' }
		];

		const inputs: { [k: string]: HTMLInputElement } = {};
		fields.forEach(field => {
			const row = document.createElement('div');
			row.style.display = 'flex';
			row.style.flexDirection = 'column';
			row.style.width = '350px';

			if (field.key === 'addons_path') {
				// Use reusable floating label + browse button
				const floatingLabelDiv = AssistaComponents.createFloatingLabelField({
					type: 'input',
					id: 'assista-conf-addons-path',
					label: field.label,
					inputType: 'text',
					required: false,
					value: (this.confData[field.key as keyof typeof this.confData] as string) || ''
				});
				const input = floatingLabelDiv.querySelector('input')!;
				input.style.width = '87%';
				inputs[field.key] = input;
				addTooltipOnOverflow(input);

				const browseBtn = AssistaComponents.createBrowseButton(async (ev) => {
					ev.stopPropagation();
					try {
						const fileDialogService = await this.getFileDialogService();
						const result = await fileDialogService.showOpenDialog({
							canSelectFiles: false,
							canSelectFolders: true,
							canSelectMany: false,
							title: 'Select Addons Folder',
							openLabel: 'Select Folder'
						});
						if (result && result.length > 0) {
							input.value = result[0].fsPath || result[0].path || '';
							input.dispatchEvent(new Event('input', { bubbles: true }));
						} else {
							input.value = '';
							input.dispatchEvent(new Event('input', { bubbles: true }));
						}
					} catch (err) {
						input.value = '';
						input.dispatchEvent(new Event('input', { bubbles: true }));
						console.error('Failed to open folder dialog:', err);
					}
				});
				browseBtn.style.position = 'absolute';
				browseBtn.style.top = '50%';
				browseBtn.style.right = '5px';
				browseBtn.style.transform = 'translateY(-50%)';
				floatingLabelDiv.appendChild(browseBtn);
				row.appendChild(floatingLabelDiv);
			} else {
				const floatingLabelDiv = AssistaComponents.createFloatingLabelField({
					type: 'input',
					id: `assista-conf-${field.key}`,
					label: field.label,
					inputType: 'text',
					required: field.key !== 'addons_path',
					value: (this.confData[field.key as keyof typeof this.confData] as string) || ''
				});
				const input = floatingLabelDiv.querySelector('input')!;
				input.value = (this.confData[field.key as keyof typeof this.confData] as string) || '';
				inputs[field.key] = input;
				addTooltipOnOverflow(input);
				row.appendChild(floatingLabelDiv);
			}
			form.appendChild(row);
		});

		let errorMsg: HTMLDivElement | null = null;
		const showError = (msg: string) => {
			if (!errorMsg) {
				errorMsg = document.createElement('div');
				errorMsg.style.color = '#ff4d4f';
				errorMsg.style.fontSize = '0.95rem';
				errorMsg.style.marginTop = '0.5rem';
				errorMsg.style.textAlign = 'center';
				form.appendChild(errorMsg);
			}
			errorMsg.textContent = msg;
		};
		const clearError = () => { if (errorMsg) errorMsg.textContent = ''; };

		const skipBtn = AssistaComponents.createSecondaryButton((e) => {
			e.preventDefault();
			clearError();
			// Clear confData values and set conf_required to false
			this.confData.db_user = '';
			this.confData.db_password = '';
			this.confData.xmlrpc_port = '';
			this.confData.addons_path = '';
			this.confData.conf_required = false;
			this.step3Substep++;
			this.renderContent(modal);
		});

		const createBtn = AssistaComponents.createPrimaryButton((e) => {
			e.preventDefault();
			clearError();
			let valid = true;
			console.error("Asssista inputs", inputs)
			fields.forEach(field => {
				const input = inputs[field.key];
				console.log("Asssista", input)
				console.error("Asssista", input.parentElement)
				if (!input.parentElement) return;
				const floatingLabelDiv = input.parentElement;
				if (field.key === 'addons_path') {
					// Skip validation for optional addons_path
					floatingLabelDiv?.classList.remove('assista-input-underline-error');
				} else if (!input.value.trim()) {
					floatingLabelDiv?.classList.add('assista-input-underline-error');
					valid = false;
				} else {
					floatingLabelDiv?.classList.remove('assista-input-underline-error');
				}
				input.addEventListener('input', () => {
					if (field.key === 'addons_path' || input.value.trim()) {
						floatingLabelDiv?.classList.remove('assista-input-underline-error');
					}
				});
			});
			if (!valid) {
				showError('Please fill in all fields.');
				return;
			}
			// Save confData
			fields.forEach(field => {
				if (field.key in this.confData) {
					(this.confData as any)[field.key] = inputs[field.key].value.trim();
				}
			});
			this.confData.conf_required = true;
			// Also save conf path to debugger dictionary for prefill
			if (this.pendingFolderUri) {
				const projectPath = this.pendingFolderUri.fsPath || this.pendingFolderUri.path || '';
				this.debuggerConfig.confPath = projectPath + '/odoo.conf';
			}
			// Show success and advance
			createBtn.disabled = true;
			this.step3Substep++;
			this.renderContent(modal);
		});

		const btnRow = AssistaComponents.createButtonRow([skipBtn, createBtn]);
		form.appendChild(btnRow);
		modal.appendChild(form);

		// Add Skip Odoo button to bottom right
		const skipOdooBtn = AssistaComponents.createSkipButton((e) => {
			e.preventDefault();
			this.step3Substep = this.totalSubsteps - 1;
			this.renderContent(modal);
		}, 'Skip All');
		modal.appendChild(skipOdooBtn);
	}

	// Place this new method inside the AssistaSettingsOverlayService class, near other render helpers
	private renderVenvInstallStep(modal: HTMLElement): void {
		// Add back button to top left
		const backBtn = AssistaComponents.createBackButton((e) => {
			e.stopPropagation();
			this.step3Substep--;
			this.renderContent(modal);
		}, 'top-left');
		modal.appendChild(backBtn);

		// Insert custom SVG above the title
		const svgContainer = AssistaComponents.createSvgContainer(this.themeImages.venvSetup, 'Python venv');
		modal.appendChild(svgContainer);

		const title = document.createElement('span');
		title.className = 'assista-title';
		title.textContent = 'Install Python venv';
		modal.appendChild(title);

		const subtitle = AssistaComponents.createSubtitle(`Step ${this.step3Substep + 1} of ${this.totalSubsteps}`);
		modal.appendChild(subtitle);

		// Check and display Python versions
		const pythonVersionsDiv = AssistaComponents.createWarningDiv(
			'Checking Python versions...',
			'',
			''
		);

		// Function to check Python versions
		const checkPythonVersions = async () => {
			try {
				// Use the Electron IPC bridge to check Python versions
				const result = await (window.vscode?.ipcRenderer?.invoke?.('vscode:checkPythonVersions'));
				if (result && result.success) {
					const pythonInfo = result.versions;
					let pythonText = 'Default Python versions: ';

					// Collect all versions and display them cleanly
					const versions = [];
					if (pythonInfo.python) {
						versions.push(`Python ${pythonInfo.python}`);
					}
					if (pythonInfo.python3) {
						versions.push(`Python ${pythonInfo.python3}`);
					}

					if (versions.length > 0) {
						pythonText += versions.join(', ');
					} else {
						pythonText = 'No Python versions found. Please install Python 3.10 or 3.12.';
					}

					// Update the warning div content
					while (pythonVersionsDiv.firstChild) {
						pythonVersionsDiv.removeChild(pythonVersionsDiv.firstChild);
					}
					const warningIcon = document.createElement('span');
					warningIcon.textContent = 'Info:';
					warningIcon.style.fontWeight = '600';
					const warningTextSpan = document.createElement('span');
					warningTextSpan.textContent = ` ${pythonText}`;
					pythonVersionsDiv.appendChild(warningIcon);
					pythonVersionsDiv.appendChild(warningTextSpan);
				} else {
					// Update the warning div content
					while (pythonVersionsDiv.firstChild) {
						pythonVersionsDiv.removeChild(pythonVersionsDiv.firstChild);
					}
					const warningIcon = document.createElement('span');
					warningIcon.textContent = 'Warning:';
					warningIcon.style.fontWeight = '600';
					const warningTextSpan = document.createElement('span');
					warningTextSpan.textContent = ' Unable to detect Python versions. Please ensure Python is installed.';
					pythonVersionsDiv.appendChild(warningIcon);
					pythonVersionsDiv.appendChild(warningTextSpan);
				}
			} catch (error) {
				// Update the warning div content
				while (pythonVersionsDiv.firstChild) {
					pythonVersionsDiv.removeChild(pythonVersionsDiv.firstChild);
				}
				const warningIcon = document.createElement('span');
				warningIcon.textContent = 'Error:';
				warningIcon.style.fontWeight = '600';
				const warningTextSpan = document.createElement('span');
				warningTextSpan.textContent = ' Error checking Python versions. Please ensure Python is installed.';
				pythonVersionsDiv.appendChild(warningIcon);
				pythonVersionsDiv.appendChild(warningTextSpan);
				this.debugError('Failed to check Python versions', error);
			}
		};

		// Check Python versions and display
		checkPythonVersions();
		modal.appendChild(pythonVersionsDiv);

		const form = document.createElement('form');
		form.style.display = 'flex';
		form.style.flexDirection = 'column';
		form.style.gap = '1.2rem';
		form.style.alignItems = 'center';
		form.style.margin = '1.2rem 0';
		form.onsubmit = (e) => { e.preventDefault(); };

		// Odoo version select (18.0 to 14.0 only)
		const odooVersionRow = document.createElement('div');
		odooVersionRow.style.width = '350px';
		const odooVersions = {
			'Odoo 18': '18.0',
			'Odoo 17': '17.0',
			'Odoo 16': '16.0',
			'Odoo 15': '15.0',
			'Odoo 14': '14.0',
		};
		const versionFloatingLabelDiv = AssistaComponents.createFloatingLabelField({
			type: 'select',
			id: 'assista-odoo-version-select',
			label: 'Odoo Version',
			options: odooVersions,
			required: true,
			value: this.venvInstallData.odoo_version || ''
		});
		const odooVersionSelect = versionFloatingLabelDiv.querySelector('select')!;
		odooVersionRow.appendChild(versionFloatingLabelDiv);
		form.appendChild(odooVersionRow);

		// Python version select (only for 17.0 or 18.0)
		const pythonVersionRow = document.createElement('div');
		pythonVersionRow.style.width = '350px';
		const pythonOptions = {
			'Python 3.10': '3.10',
			'Python 3.12': '3.12'
		};
		const pythonFloatingLabelDiv = AssistaComponents.createFloatingLabelField({
			type: 'select',
			id: 'assista-python-version-select',
			label: 'Python Version',
			options: pythonOptions,
			required: true,
			value: this.venvInstallData.python_version ? this.venvInstallData.python_version : ''
		});
		const pythonVersionSelect = pythonFloatingLabelDiv.querySelector('select')!;
		pythonVersionRow.appendChild(pythonFloatingLabelDiv);
		form.appendChild(pythonVersionRow);

		// Only show if Odoo version is 17.0 or 18.0
		if (this.venvInstallData.odoo_version === '17.0' || this.venvInstallData.odoo_version === '18.0') {
			pythonVersionRow.style.display = '';
		} else {
			pythonVersionRow.style.display = 'none';
		}
		form.appendChild(pythonVersionRow);

		// Update python version select visibility on Odoo version change
		odooVersionSelect.addEventListener('change', () => {
			if (odooVersionSelect.value === '17.0' || odooVersionSelect.value === '18.0') {
				pythonVersionRow.style.display = '';
			} else {
				pythonVersionRow.style.display = 'none';
			}
		});

		// Error message
		let errorMsg: HTMLDivElement | null = null;
		const showError = (msg: string) => {
			if (!errorMsg) {
				errorMsg = document.createElement('div');
				errorMsg.style.color = '#ff4d4f';
				errorMsg.style.fontSize = '0.95rem';
				errorMsg.style.marginTop = '0.5rem';
				errorMsg.style.textAlign = 'center';
				form.appendChild(errorMsg);
			}
			errorMsg.textContent = msg;
		};
		const clearError = () => { if (errorMsg) errorMsg.textContent = ''; };

		const skipBtn = AssistaComponents.createSecondaryButton((e) => {
			e.preventDefault();
			clearError();
			// Clear venvInstallData values and set venv_required to false
			this.venvInstallData.odoo_version = '';
			this.venvInstallData.python_version = '';
			this.venvInstallData.project_path = '';
			this.venvInstallData.venv_required = false;
			this.step3Substep++;
			this.renderContent(modal);
		});

		const installBtn = AssistaComponents.createPrimaryButton((e) => {
			e.preventDefault();
			clearError();
			let valid = true;
			if (!odooVersionSelect.value) {
				versionFloatingLabelDiv.classList.add('assista-input-underline-error');
				valid = false;
			} else {
				versionFloatingLabelDiv.classList.remove('assista-input-underline-error');
			}
			if ((odooVersionSelect.value === '17.0' || odooVersionSelect.value === '18.0') && !pythonVersionSelect.value) {
				pythonFloatingLabelDiv.classList.add('assista-input-underline-error');
				valid = false;
			} else {
				pythonFloatingLabelDiv.classList.remove('assista-input-underline-error');
			}
			if (!valid) {
				showError('Please fill in all required fields.');
				return;
			}
			// Save venvInstallData dictionary
			this.venvInstallData = {
				odoo_version: odooVersionSelect.value,
				python_version: (odooVersionSelect.value === '17.0' || odooVersionSelect.value === '18.0') ? pythonVersionSelect.value : '',
				project_path: '', // Not used anymore
				venv_required: true
			};
			this.step3Substep++;
			this.renderContent(modal);
		});

		const btnRow = AssistaComponents.createButtonRow([skipBtn, installBtn]);
		form.appendChild(btnRow);
		modal.appendChild(form);

		// Add Skip Odoo button to bottom right
		const skipOdooBtn = AssistaComponents.createSkipButton((e) => {
			e.preventDefault();
			this.step3Substep = this.totalSubsteps - 1;
			this.renderContent(modal);
		}, 'Skip All');
		modal.appendChild(skipOdooBtn);
	}
	private renderDebuggerStep(modal: HTMLElement): void {
		// Add back button to top left
		const backBtn = AssistaComponents.createBackButton((e) => {
			e.stopPropagation();
			this.step3Substep--;
			this.renderContent(modal);
		});
		modal.appendChild(backBtn);

		// Insert new SVG above the title (from user)
		const svgContainer = AssistaComponents.createSvgContainer(this.themeImages.setupDebugger, 'Setup Debugger');
		modal.appendChild(svgContainer);

		const title = document.createElement('span');
		title.className = 'assista-title';
		title.textContent = 'Setup Debugger';
		modal.appendChild(title);

		const subtitle = AssistaComponents.createSubtitle(`Step ${this.step3Substep + 1} of ${this.totalSubsteps}`);
		modal.appendChild(subtitle);

		const form = document.createElement('form');
		form.style.display = 'flex';
		form.style.flexDirection = 'column';
		form.style.gap = '1.2rem';
		form.style.alignItems = 'center';
		form.style.margin = '2rem 0';
		form.onsubmit = (e) => { e.preventDefault(); };

		const fields = [
			{ key: 'pythonPath', label: 'Python Executable Path', type: 'text', placeholder: 'e.g. /usr/bin/python3' },
			{ key: 'odooBinPath', label: 'Odoo Bin Path', type: 'text', placeholder: 'e.g. /path/to/odoo-bin' },
			{ key: 'confPath', label: 'Odoo Config Path', type: 'text', placeholder: 'e.g. /path/to/odoo.conf' }
		];

		const inputs: { [k: string]: HTMLInputElement } = {};
		fields.forEach(field => {
			const row = document.createElement('div');
			row.style.display = 'flex';
			row.style.flexDirection = 'column';
			row.style.width = '350px';

			let value = ''
			if (field.key === 'pythonPath' && !this.debuggerConfig.pythonPath && this.venvInstallData.venv_required && this.pendingFolderUri) {
				const projectPath = this.pendingFolderUri.fsPath || this.pendingFolderUri.path || '';
				if (this.venvInstallData.odoo_version === '17.0' || this.venvInstallData.odoo_version === '18.0') {
					const pyVer = this.venvInstallData.python_version || '3.10';
					value = `${projectPath}/venv/bin/python${pyVer}`;
				} else {
					value = `${projectPath}/venv/bin/python3.8`;
				}
			} else if (field.key === 'odooBinPath' && !this.debuggerConfig.odooBinPath && this.pendingFolderUri) {
				const projectPath = this.pendingFolderUri.fsPath || this.pendingFolderUri.path || '';
				const odooBinFullPath = projectPath + '/odoo-bin';
				// Set a default value first
				value = this.debuggerConfig[field.key as keyof typeof this.debuggerConfig] || '';

				// Then check if the file exists asynchronously
				const fileService = this.instantiationService?.invokeFunction(accessor => accessor.get(IFileService));
				if (fileService) {
					fileService.exists(URI.file(odooBinFullPath)).then(exists => {
						if (exists) {
							// Update the input value if the file exists
							const input = inputs[field.key];
							if (input) {
								input.value = odooBinFullPath;
								// Update the floating label
								input.parentElement?.classList.add('has-value');
							}
						}
					}).catch(error => {
						console.error('[Assista] Error checking odoo-bin existence:', error);
					});
				}
			} else {
				value = this.debuggerConfig[field.key as keyof typeof this.debuggerConfig] || '';
			}

			const floatingLabelDiv = AssistaComponents.createFloatingLabelField({
				type: 'input',
				id: 'assista-' + field.key + '-input',
				label: field.label,
				inputType: field.type,
				required: true,
				value: value
			});
			const input = floatingLabelDiv.querySelector('input')!;
			input.style.width = '87%';
			addTooltipOnOverflow(input);

			inputs[field.key] = input;

			const browseBtn = AssistaComponents.createBrowseButton(async (ev) => {
				ev.stopPropagation();
				try {
					const fileDialogService = await this.getFileDialogService();
					const result = await fileDialogService.showOpenDialog({
						canSelectFiles: true,
						canSelectFolders: false,
						canSelectMany: false,
						title: `Select ${field.label}`,
						openLabel: 'Select File'
					});
					if (result && result.length > 0) {
						input.value = result[0].fsPath || result[0].path || '';
					}
				} catch (err) {
					console.error('Failed to open file dialog:', err);
				}
			});
			browseBtn.style.position = 'absolute';
			browseBtn.style.top = '5px';
			browseBtn.style.right = '5px';
			const inputAdornmentRow = AssistaComponents.createInputAdornmentRow([floatingLabelDiv, browseBtn]);
			row.appendChild(inputAdornmentRow);
			form.appendChild(row);
		});

		let errorMsg: HTMLDivElement | null = null;
		const showError = (msg: string) => {
			if (!errorMsg) {
				errorMsg = document.createElement('div');
				errorMsg.style.color = '#ff4d4f';
				errorMsg.style.fontSize = '0.95rem';
				errorMsg.style.marginTop = '0.5rem';
				errorMsg.style.textAlign = 'center';
				form.appendChild(errorMsg);
			}
			errorMsg.textContent = msg;
		};
		const clearError = () => { if (errorMsg) errorMsg.textContent = ''; };

		const skipBtn = AssistaComponents.createSecondaryButton((e) => {
			e.preventDefault();
			clearError();
			this.debuggerConfig.pythonPath = '';
			this.debuggerConfig.odooBinPath = '';
			this.debuggerConfig.confPath = '';
			this.debugger_required = false;
			this.step3Substep++;
			this.renderContent(modal);
		});

		const confirmBtn = AssistaComponents.createPrimaryButton((e) => {
			e.preventDefault();
			clearError();
			let valid = true;
			fields.forEach(field => {
				const input = inputs[field.key];
				if (!input.value.trim()) {
					input.parentElement?.classList.add('assista-input-underline-error');
					valid = false;
				} else {
					input.parentElement?.classList.remove('assista-input-underline-error');
				}
				input.addEventListener('input', () => {
					if (input.value.trim()) {
						input.parentElement?.classList.remove('assista-input-underline-error');
					}
				});
			});
			if (!valid) {
				showError('Please fill in all fields.');
				return;
			}
			// Save debuggerConfig
			fields.forEach(field => {
				this.debuggerConfig[field.key as keyof typeof this.debuggerConfig] = inputs[field.key].value.trim();
			});
			this.debugger_required = true;
			this.step3Substep++;
			this.renderContent(modal);
		});
		const btnRow = AssistaComponents.createButtonRow([skipBtn, confirmBtn]);
		form.appendChild(btnRow);
		modal.appendChild(form);
	}

	private renderThemeStep(modal: HTMLElement): void {
		// Insert custom SVG above the title
		const svgContainer = AssistaComponents.createSvgContainer(this.themeImages.themeSelector, 'Theme Selector');
		modal.appendChild(svgContainer);

		const title = document.createElement('span');
		title.className = 'assista-title';
		title.textContent = 'Pick your vibe';
		modal.appendChild(title);
		const subheading = document.createElement('div');
		subheading.textContent = 'Light for clarity, Dark for focus';
		subheading.style.color = '#b7adc6';
		subheading.style.fontSize = '0.93rem';
		subheading.style.fontWeight = '300';
		subheading.style.letterSpacing = '0.01em';
		subheading.style.fontFamily = 'inherit';
		subheading.style.textAlign = 'center';
		subheading.style.marginBottom = '2.2rem';
		subheading.style.marginTop = '0.2rem';
		modal.appendChild(subheading);

		// Use global theme images
		const assistaLightSVG = this.themeImages.assistaLight;
		const assistaDarkSVG = this.themeImages.assistaDark;
		const assistaMidnightSVG = this.themeImages.assistaMidnight;
		const themes = [
			{ name: 'Assista Midnight', realName: 'Assista Midnight', img: assistaMidnightSVG },
			{ name: 'Assista Light', realName: 'Assista Light', img: assistaLightSVG },
			{ name: 'Assista Dark', realName: 'Assista Dark', img: assistaDarkSVG },
		];

		// Set Assista Midnight as default selected theme
		if (!this.selectedTheme) {
			this.selectedTheme = 'Assista Midnight';
		}
		const themeGrid = document.createElement('div');
		themeGrid.className = 'assista-theme-grid';
		themeGrid.style.display = 'flex';
		themeGrid.style.flexDirection = 'row';
		themeGrid.style.justifyContent = 'center';
		themeGrid.style.alignItems = 'center';
		themeGrid.style.gap = '1.5rem';
		themeGrid.style.flexWrap = 'nowrap';
		const cardElements: HTMLDivElement[] = [];
		themes.forEach(theme => {
			const card = document.createElement('div');
			card.className = 'assista-theme-card';
			card.style.flex = '1';
			card.style.maxWidth = '180px';
			card.style.minWidth = '150px';
			const img = document.createElement('div');
			img.className = 'assista-theme-img';
			img.style.backgroundColor = '#fff';
			if (theme.img) {
				img.style.backgroundImage = `url('${theme.img}')`;
				img.style.backgroundSize = 'cover';
				img.style.backgroundPosition = 'center';
				img.style.backgroundRepeat = 'no-repeat';
			}
			card.appendChild(img);
			const name = document.createElement('div');
			name.className = 'assista-theme-name';
			name.textContent = theme.name;
			card.appendChild(name);
			card.onclick = () => {
				this.selectedTheme = theme.realName;
				cardElements.forEach(c => c.classList.remove('selected'));
				card.classList.add('selected');
				// Only save the selection, do not apply the theme yet
			};
			// Mark as selected if matches current
			if (this.selectedTheme === theme.realName) {
				card.classList.add('selected');
			}
			cardElements.push(card);
			themeGrid.appendChild(card);
		});
		modal.appendChild(themeGrid);

		// Add a Back button to the top left corner
		const backBtnTopLeft = AssistaComponents.createBackButton((e) => {
			e.stopPropagation();
			this.step3Substep--;
			this.renderContent(modal);
		}, 'top-left');
		modal.appendChild(backBtnTopLeft);
		// Only the Finish button at the bottom
		const nextBtn3 = AssistaComponents.createPrimaryButton((e) => {
			this.step3Substep = 4;
			this.renderContent(modal);
		}, 'Finish');
		modal.appendChild(nextBtn3);

		const quoteBox = document.createElement('div');
		quoteBox.style.textAlign = 'center';
		quoteBox.style.color = '#b7adc6';
		quoteBox.style.fontSize = '0.90rem';
		quoteBox.style.marginTop = '0.7rem';
		quoteBox.style.marginBottom = '0.2rem';
		quoteBox.style.opacity = '0.85';
		quoteBox.style.fontStyle = 'italic';
		quoteBox.style.maxWidth = '420px';
		quoteBox.style.marginLeft = 'auto';
		quoteBox.style.marginRight = 'auto';
		quoteBox.style.transition = 'opacity 0.2s';
		quoteBox.classList.add('assista-final-quote');
		modal.appendChild(quoteBox);
	}

	private async renderConfigurationStep(modal: HTMLElement): Promise<void> {
		// Set modal to relative for absolute positioning
		modal.style.position = 'relative';

		// Insert Logo SVG above the message (reuse from step 0)
		const logoContainer = document.createElement('div');
		logoContainer.style.display = 'flex';
		logoContainer.style.justifyContent = 'center';
		logoContainer.style.alignItems = 'center';
		logoContainer.style.marginBottom = '1.7rem';
		logoContainer.style.marginTop = '1rem';
		logoContainer.classList.add('assista-logo-float');

		const svg = AssistaSvgUtils.getAssistaLogoSvgElement();

		logoContainer.appendChild(svg);
		modal.appendChild(logoContainer);

		// --- Add prominent title below the logo, above the quote ---
		const finalStepTitle = document.createElement('div');
		finalStepTitle.className = 'assista-title assista-title-gradient';
		finalStepTitle.textContent = 'Setting up your Odoo development environment';
		finalStepTitle.style.fontSize = '1.4rem';
		finalStepTitle.style.textAlign = 'center';
		finalStepTitle.style.marginBottom = '0.7rem';
		finalStepTitle.style.marginTop = '0.2rem';
		modal.appendChild(finalStepTitle);

		// Inject gradient style for the title if not present


		// Add a tiny quote text below the logo
		const quotes = [
			"Assista IDE — built to simplify every step of Odoo development.",
			"With Assista, scaffolding an Odoo module is just one click away.",
			"No more boilerplate — Assista writes it for you.",
			"Assista IDE is not just an editor, it's your Odoo wingman.",
			"Spend less time setting up, more time building — thanks to Assista.",
			"Odoo dev made smarter, cleaner, faster — that's the Assista way.",
			"Assista gives you superpowers for Odoo models, views, and controllers.",
			"Wherever Odoo takes you, Assista IDE leads the way.",
			"Assista understands Odoo so you can focus on writing business logic.",
			"From init to deploy — Assista is your Odoo development flow.",
			"Assista turns complexity into clarity — especially in Odoo projects.",
			"Why configure alone? Assista guides every step of the way.",
			"Assista IDE: designed by Odoo devs, for Odoo devs.",
			"Assista turns XML pain into productivity gain.",
			"Odoo decorators, snippets, and completions — auto-handled by Assista.",
			"With Assista, Odoo configs aren't confusing — they're guided.",
			"Write code like a pro — Assista takes care of the rest.",
			"Assista doesn't just support Odoo — it empowers it.",
			"Every module you build is faster with Assista at your side.",
			"Assista: built for full-stack Odoo excellence.",
			"Great systems aren't built in a rush — they're configured with care.",
			"You're not just writing code, you're crafting business logic.",
			"Tools set the stage, but it's the developer who brings the magic.",
			"A good environment is the first step toward great software.",
			"Think less about the setup. Think more about the possibilities.",
			"Behind every smart ERP is a smarter developer.",
			"Even the best ideas need a solid setup to thrive.",
			"The environment you're setting up is your playground of ideas.",
			"Odoo loves developers who plan ahead.",
			"Every line of config saves you 10 lines of debugging.",
			"Coding is art. Setup is the canvas.",
			"Building business, one module at a time.",
			"What you're doing now? Future-proofing.",
			"Let the code flow — you're almost there.",
			"From config to clarity — you're almost live.",
			"Every system starts as an idea — you're building yours.",
			"Silence now. Impact later.",
			"You're defining the rules of your digital game.",
			"The sooner you setup, the sooner you scale.",
			"Less time fixing, more time building.",
			"You're not just writing code — you're solving real-world problems.",
			"No code yet — just calm before creation.",
			"You're the architect of automation.",
			"Think of this as stretching before a marathon.",
			"From blank slate to business-ready — all starts here.",
			"This isn't waiting. This is investing in velocity.",
			"Almost there... just a few lines of YAML away from greatness.",
			"Good things take time — especially dependencies.",
			"Take a breath. Soon, you'll be writing the next big Odoo module.",
			"Loading... because even genius takes a moment to initialize.",
			"This setup might take a moment — brilliance always does.",
			"Patience is a developer's best tool during setup.",
			"Even Rome had a configuration phase.",
			"You're about to turn imagination into implementation.",
			"What feels like waiting is actually progress.",
			"This is the silent hour before the symphony.",
			"You're not wasting time — you're preparing to save it.",
			"You're not just installing tools — you're enabling dreams.",
			"Keep calm and let the configs load.",
			"No bugs. No chaos. Just clean setup.",
			"You're tuning the engine before the race.",
			"One config to rule them all.",
			"Setup isn't just a step. It's the launchpad.",
			"You bring logic. Odoo brings leverage.",
			"Setup today. Scale tomorrow.",
			"You're not stuck — you're loading greatness.",
			"Every great feature starts with environment readiness.",
			"Odoo: where Python meets process.",
			"Open source, open dreams.",
			"Environment matters — even for geniuses.",
			"Prepare the base. Then push the boundaries.",
			"It's not just setup. It's pre-innovation mode.",
			"Creating logic. Enabling automation.",
			"Innovation doesn't wait. Neither should your tools.",
			"Make it run. Make it right. Make it fast.",
			"The less you fight your setup, the more you can build.",
			"Behind each smooth UI is a perfectly tuned backend.",
			"You're closer to code nirvana than you think.",
			"Setup is silent progress. Soon it will speak volumes.",
			"This is the calm before the coding storm.",
			"Every config file tells a story — yours starts here.",
			"Soon, you'll be dancing with models and fields.",
			"Minimal config, maximal control.",
			"Focus sharpens with the right environment.",
			"Make it beautiful. Make it Odoo.",
			"Clean configurations mean clean minds.",
			"The smarter the start, the smoother the journey.",
			"What you're setting up now powers what's next.",
			"This isn't loading. This is initializing creativity.",
			"You're not just setting up code. You're enabling enterprise magic.",
			"Precision starts here.",
			"You're not stuck — you're synchronizing success.",
			"Clean configs now = fewer bugs later.",
			"Setup done right is setup done once.",
			"The fastest way to finish is to start strong.",
			"Let your IDE carry the weight — you're here to create.",
			"Today's config is tomorrow's productivity.",
			"You're aligning your tools with your goals.",
			"Build environments like you build code — smart and solid.",
			"Before modules, there must be mechanics.",
			"No rush. Just readiness."
		];
		const quoteBox = document.createElement('div');
		quoteBox.style.textAlign = 'center';
		quoteBox.style.color = '#b7adc6';
		quoteBox.style.fontSize = '0.90rem';
		quoteBox.style.marginTop = '0.7rem';
		quoteBox.style.marginBottom = '0.2rem';
		quoteBox.style.opacity = '0.85';
		quoteBox.style.fontStyle = 'italic';
		quoteBox.style.maxWidth = '420px';
		quoteBox.style.marginLeft = 'auto';
		quoteBox.style.marginRight = 'auto';
		quoteBox.style.transition = 'opacity 0.2s';
		quoteBox.classList.add('assista-final-quote');
		modal.appendChild(quoteBox);

		// Remove continuous float animation from logoContainer
		logoContainer.classList.remove('assista-logo-float');

		// Quote cycling logic
		let quoteIdx = Math.floor(Math.random() * quotes.length);
		quoteBox.textContent = quotes[quoteIdx];
		let quoteTimerActive = true;
		quoteBox.style.transition = 'opacity 0.5s';

		// Make quoteTimerActive accessible in error handling scope
		let quoteTimeouts: ReturnType<typeof setTimeout>[] = [];
		const stopQuoteCycling = () => {
			quoteTimerActive = false;
			// Clear all quote-related timeouts
			quoteTimeouts.forEach(timeout => clearTimeout(timeout));
			quoteTimeouts = [];
		};
		function cycleQuote() {
			if (!quoteTimerActive) return;
			// Trigger float animation
			logoContainer.classList.add('assista-logo-float');
			const floatTimeout = setTimeout(() => {
				logoContainer.classList.remove('assista-logo-float');
				// Fade out quote
				quoteBox.style.opacity = '0';
				const fadeTimeout = setTimeout(() => {
					let nextIdx = quoteIdx;
					while (nextIdx === quoteIdx) {
						nextIdx = Math.floor(Math.random() * quotes.length);
					}
					quoteIdx = nextIdx;
					quoteBox.textContent = quotes[quoteIdx];
					// Fade in
					quoteBox.style.opacity = '0';
					const fadeInTimeout = setTimeout(() => {
						quoteBox.style.opacity = '0.85';
					}, 10);
					quoteTimeouts.push(fadeInTimeout);
					const delay = quotes[quoteIdx].length > 70 ? 7000 : 5000;
					const cycleTimeout = setTimeout(cycleQuote, delay);
					quoteTimeouts.push(cycleTimeout);
				}, 500); // match fade out duration
				quoteTimeouts.push(fadeTimeout);
			}, 1200); // float animation duration
			quoteTimeouts.push(floatTimeout);
		}
		const initialTimeout = setTimeout(() => {
			quoteBox.style.opacity = '0.85';
			const delay = quotes[quoteIdx].length > 70 ? 7000 : 5000;
			const cycleTimeout = setTimeout(cycleQuote, delay);
			quoteTimeouts.push(cycleTimeout);
		}, 10);
		quoteTimeouts.push(initialTimeout);

		// Remove all status/progress UI. Run setup in background.
		// --- PROGRESS PERCENTAGE PATCH START ---
		// Determine which steps are required
		const steps = [];
		const hasVenv = this.venvInstallData.venv_required;
		if (hasVenv) steps.push('venv');
		if (this.confData.conf_required && this.pendingFolderUri) steps.push('conf');
		if (this.debugger_required) steps.push('debugger');
		if (this.selectedTheme) steps.push('theme');

		// Check if only theme selection is available
		const onlyThemeAvailable = steps.length === 1 && steps.includes('theme');

		if (onlyThemeAvailable) {
			// Only theme is available - apply theme directly and show IDE ready
			try {
				await this.applySelectedTheme();
				finalStepTitle.textContent = 'Assista IDE is ready. Your Odoo workspace is all set';
				finalStepTitle.style.color = '#52c41a'; // Green for success
				quoteBox.textContent = 'Please wait a moment while we launch your workspace';
				setTimeout(async () => {
					if (this.pendingFolderUri) {
						let hostService = this.hostService;
						if (!hostService) {
							hostService = await this.getHostService();
						}
						await hostService.openWindow([{ folderUri: this.pendingFolderUri }], { forceNewWindow: false });
					}
					this.hide();
				}, 1500);
				return; // Exit early, no progress bar needed
			} catch (error) {
				console.error('[Assista] Error applying theme:', error);
				finalStepTitle.textContent = 'An error occurred during theme application';
				finalStepTitle.style.color = '#ff4d4f'; // Red for error
				return;
			}
		}

		const PRE_STEP = 'pre';
		const allSteps = [PRE_STEP, ...steps];
		const stepCount = allSteps.length;
		const stepRanges = [];

		if (hasVenv) {
			// venv gets 80%, rest share 20%
			const restSteps = steps.length - 1;
			// Pre-step (0%)
			stepRanges.push([0, 0]);
			// venv (0-80%)
			stepRanges.push([0, 80]);
			// rest steps (conf, debugger, theme)
			for (let i = 1; i < steps.length; i++) {
				const start = 80 + Math.round(((i - 1) / restSteps) * 20);
				const end = 80 + Math.round((i / restSteps) * 20);
				stepRanges.push([start, end]);
			}
		} else {
			// No venv, all steps share 100% equally
			for (let i = 0; i < stepCount; i++) {
				const start = Math.round((i / stepCount) * 100);
				const end = Math.round(((i + 1) / stepCount) * 100);
				stepRanges.push([start, end]);
			}
		}
		const setProgress = (percent: number) => {
			finalStepTitle.textContent = `Setting up your Odoo development environment (${Math.round(percent)}%)`;
		};

		async function animateStepRange(start: number, end: number, stepPromise?: Promise<any>) {
			let current = start;
			let done = false;
			if (stepPromise) stepPromise.then(() => { done = true; });
			else done = true; // For pre-step
			while (current < end) {
				setProgress(current);
				if (done) {
					await new Promise(res => setTimeout(res, 50));
				} else {
					await new Promise(res => setTimeout(res, 1000));
				}
				current++;
			}
			setProgress(end);
		}

		(async () => {
			let errorOccurred = false;
			try {
				// Pre-step animation
				await animateStepRange(stepRanges[0][0], stepRanges[0][1], undefined);
				let stepIdx = 1;
				// Step 1: venv
				if (steps.includes('venv')) {
					let stepPromise: Promise<any>;
					let venvProgress = 0;
					let venvProgressListener = (event: any, data: any) => {
						if (data && typeof data.data === 'string') {
							// Handle error messages
							if (data.type === 'error') {
								console.error('[Assista] Venv install error received:', data.data);
								// Don't throw here, let the main promise handle the error
								return;
							}

							// Handle progress messages
							const match = data.data.match(/Downloading Odoo venv: (\d+)%/);
							if (match) {
								venvProgress = parseInt(match[1], 10);
								// Map 0-100% to 0-80%
								const mapped = Math.round((venvProgress / 100) * 80);
								setProgress(mapped);
							}
						}
					};
					window.vscode?.ipcRenderer?.on?.('vscode:assistaVenvInstallProgress', venvProgressListener);
					stepPromise = (async () => {
						try {
							const result = await window.vscode?.ipcRenderer?.invoke?.('vscode:assistaInstallVenv', {
								odooVersion: this.venvInstallData.odoo_version,
								pythonVersion: this.venvInstallData.python_version,
								projectPath: this.pendingFolderUri?.fsPath || this.pendingFolderUri?.path || ''
							});

							// Check if the operation was successful
							if (result && result.success === false) {
								throw new Error(result.error || 'Unknown error occurred during venv installation');
							}

							setProgress(80); // Snap to 80% at the end
							console.log('[Assista] Python venv installed successfully');
						} catch (err) {
							this.debugError('Venv install failed', err);
							finalStepTitle.textContent = 'An error occurred during venv installation';
							const quoteBox = modal.querySelector('.assista-final-quote') as HTMLDivElement;
							if (quoteBox) {
								// Stop quote cycling when error occurs
								stopQuoteCycling();
								quoteBox.textContent = getMinimalErrorMessage(err);
								// Remove any existing error action buttons
								let errorActions = modal.querySelector('.assista-error-actions') as HTMLDivElement;
								if (errorActions) errorActions.remove();
								// Add error action buttons
								errorActions = document.createElement('div') as HTMLDivElement;
								errorActions.className = 'assista-error-actions';
								errorActions.style.display = 'flex';
								errorActions.style.justifyContent = 'center';
								errorActions.style.gap = '1.2rem';
								errorActions.style.marginTop = '2rem';
								errorActions.style.marginBottom = '0.5rem';
								errorActions.style.alignItems = 'flex-start';
								// Skip Step button
								const skipBtn = AssistaComponents.createSecondaryButton(async (e) => {
									e.preventDefault();
									// Open workspace and hide modal
									if (this.pendingFolderUri) {
										let hostService = this.hostService;
										if (!hostService) {
											hostService = await this.getHostService();
										}
										await hostService.openWindow([{ folderUri: this.pendingFolderUri }], { forceNewWindow: false });
									}
									this.hide();
								}, 'Skip Step');
								// Start Over button
								const startOverBtn = AssistaComponents.createPrimaryButton((e) => {
									e.preventDefault();
									this.step = 2;
									this.step3Substep = 4;
									this.renderContent(modal);
								}, 'Start Over');
								errorActions.appendChild(skipBtn);
								errorActions.appendChild(startOverBtn);
								quoteBox.insertAdjacentElement('afterend', errorActions);
							}
							errorOccurred = true;
							throw err;
						}
						await new Promise(resolve => setTimeout(resolve, 1200));
						window.vscode?.ipcRenderer?.removeListener?.('vscode:assistaVenvInstallProgress', venvProgressListener);
					})();
					await stepPromise;
					this.venvInstallData.venv_required = false;
					stepIdx++;
				}
				// Step 2: conf
				if (steps.includes('conf')) {
					let stepPromise = (async () => {
						try {
							const fileService = this.instantiationService?.invokeFunction(accessor => accessor.get(IFileService));
							if (!fileService) throw new Error('FileService not available');
							const projectPath = this.pendingFolderUri.fsPath || this.pendingFolderUri.path || '';
							const userAddonsPath = this.confData.addons_path;
							let addonsPathLine = `${projectPath}/addons`;
							if (userAddonsPath && userAddonsPath.trim() !== '') {
								addonsPathLine += `,${userAddonsPath}`;
							}
							const confContent = `[options]\nadmin_passwd = admin\ndb_host = localhost\ndb_port = 5432\ndb_user = ${this.confData.db_user}\ndb_password = ${this.confData.db_password}\naddons_path = ${addonsPathLine}\nxmlrpc_port = ${this.confData.xmlrpc_port}\n`;
							const confUri = URI.joinPath(this.pendingFolderUri, 'odoo.conf');
							await fileService.createFile(confUri, VSBuffer.fromString(confContent), { overwrite: true } as ICreateFileOptions);
							this.debugLog('odoo.conf created', { path: confUri.toString() });
							console.log('[Assista] odoo.conf created successfully:', confUri.toString());
							await new Promise(resolve => setTimeout(resolve, 3000));
						} catch (err) {
							this.debugError('Conf creation failed', err);
							finalStepTitle.textContent = 'An error occurred during configuration';
							const quoteBox = modal.querySelector('.assista-final-quote') as HTMLDivElement;
							if (quoteBox) {
								quoteBox.textContent = getMinimalErrorMessage(err);
								let errorActions = modal.querySelector('.assista-error-actions') as HTMLDivElement;
								if (errorActions) errorActions.remove();
								errorActions = document.createElement('div') as HTMLDivElement;
								errorActions.className = 'assista-error-actions';
								errorActions.style.display = 'flex';
								errorActions.style.justifyContent = 'center';
								errorActions.style.gap = '1.2rem';
								errorActions.style.marginTop = '1.2rem';
								errorActions.style.marginBottom = '0.5rem';
								const skipBtn = AssistaComponents.createSecondaryButton(async (e) => {
									e.preventDefault();
									// Open workspace and hide modal
									if (this.pendingFolderUri) {
										let hostService = this.hostService;
										if (!hostService) {
											hostService = await this.getHostService();
										}
										await hostService.openWindow([{ folderUri: this.pendingFolderUri }], { forceNewWindow: false });
									}
									this.hide();
								}, 'Skip Step');
								// Start Over button
								const startOverBtn = AssistaComponents.createPrimaryButton((e) => {
									e.preventDefault();
									this.step = 2;
									this.step3Substep = 4;
									this.renderContent(modal);
								}, 'Start Over');
								errorActions.appendChild(skipBtn);
								errorActions.appendChild(startOverBtn);
								quoteBox.insertAdjacentElement('afterend', errorActions);
							}
							errorOccurred = true;
							throw err;
						}
					})();
					await animateStepRange(stepRanges[stepIdx][0], stepRanges[stepIdx][1], stepPromise);
					this.confData.conf_required = false;
					stepIdx++;
				}
				// Step 3: Debugger
				if (steps.includes('debugger')) {
					let stepPromise = (async () => {
						try {
							const fileService = this.instantiationService?.invokeFunction(accessor => accessor.get(IFileService));
							if (!fileService) throw new Error('FileService not available');
							const vscodeDirUri = URI.joinPath(this.pendingFolderUri, '.vscode');
							try { await fileService.createFolder(vscodeDirUri); } catch { }
							const launchJsonUri = URI.joinPath(vscodeDirUri, 'launch.json');
							const launchJson = {
				                                version: '0.2.0',
				                                configurations: [
				                                    {
				                                        name: 'Odoo Debug',
				                                        type: 'python',
														noDebug: true,
				                                        request: 'launch',
				                                        program: this.debuggerConfig.odooBinPath,
				                                        args: [
				                                            '-c',
				                                            this.debuggerConfig.confPath
				                                        ],
				                                        python: this.debuggerConfig.pythonPath,
				                                        console: 'internalConsole',
				                                        justMyCode: false
				                                    }
				                                ]
				                            };
							await fileService.createFile(launchJsonUri, VSBuffer.fromString(JSON.stringify(launchJson, null, 2)), { overwrite: true });
							if (this.selectedTheme) {
								await this.applySelectedTheme();
							}
							console.log('[Assista] Debugger setup (launch.json) created successfully:', launchJsonUri.toString());
							await new Promise(resolve => setTimeout(resolve, 1200));
						} catch (err) {
							this.debugError('Debugger setup failed', err);
							finalStepTitle.textContent = 'An error occurred during debugger setup';
							const quoteBox = modal.querySelector('.assista-final-quote') as HTMLDivElement;
							if (quoteBox) {
								quoteBox.textContent = getMinimalErrorMessage(err);
								let errorActions = modal.querySelector('.assista-error-actions') as HTMLDivElement;
								if (errorActions) errorActions.remove();
								errorActions = document.createElement('div') as HTMLDivElement;
								errorActions.className = 'assista-error-actions';
								errorActions.style.display = 'flex';
								errorActions.style.justifyContent = 'center';
								errorActions.style.gap = '1.2rem';
								errorActions.style.marginTop = '1.2rem';
								errorActions.style.marginBottom = '0.5rem';
								const skipBtn = AssistaComponents.createSecondaryButton(async (e) => {
									e.preventDefault();
									// Open workspace and hide modal
									if (this.pendingFolderUri) {
										let hostService = this.hostService;
										if (!hostService) {
											hostService = await this.getHostService();
										}
										await hostService.openWindow([{ folderUri: this.pendingFolderUri }], { forceNewWindow: false });
									}
									this.hide();
								}, 'Skip Step');
								// Start Over button
								const startOverBtn = AssistaComponents.createPrimaryButton((e) => {
									e.preventDefault();
									this.step = 2;
									this.step3Substep = 4;
									this.renderContent(modal);
								}, 'Start Over');
								errorActions.appendChild(skipBtn);
								errorActions.appendChild(startOverBtn);
								quoteBox.insertAdjacentElement('afterend', errorActions);
							}
							errorOccurred = true;
							throw err;
						}
					})();
					await animateStepRange(stepRanges[stepIdx][0], stepRanges[stepIdx][1], stepPromise);
					this.debugger_required = false;
					stepIdx++;
				}
				// Step 4: Theme
				if (steps.includes('theme')) {
					let stepPromise = (async () => {
						try {
							await this.applySelectedTheme();
							console.log('[Assista] Theme applied successfully:', this.selectedTheme);
							await new Promise(resolve => setTimeout(resolve, 800));
						} catch (err) {
							this.debugError('Theme apply failed', err);
							finalStepTitle.textContent = 'An error occurred during theme application';
							const quoteBox = modal.querySelector('.assista-final-quote') as HTMLDivElement;
							if (quoteBox) {
								quoteBox.textContent = getMinimalErrorMessage(err);
								let errorActions = modal.querySelector('.assista-error-actions') as HTMLDivElement;
								if (errorActions) errorActions.remove();
								errorActions = document.createElement('div') as HTMLDivElement;
								errorActions.className = 'assista-error-actions';
								errorActions.style.display = 'flex';
								errorActions.style.justifyContent = 'center';
								errorActions.style.gap = '1.2rem';
								errorActions.style.marginTop = '1.2rem';
								errorActions.style.marginBottom = '0.5rem';
								const skipBtn = AssistaComponents.createSecondaryButton(async (e) => {
									e.preventDefault();
									// Open workspace and hide modal
									if (this.pendingFolderUri) {
										let hostService = this.hostService;
										if (!hostService) {
											hostService = await this.getHostService();
										}
										await hostService.openWindow([{ folderUri: this.pendingFolderUri }], { forceNewWindow: false });
									}
									this.hide();
								}, 'Skip Step');
								// Start Over button
								const startOverBtn = AssistaComponents.createPrimaryButton((e) => {
									e.preventDefault();
									this.step = 2;
									this.step3Substep = 4;
									this.renderContent(modal);
								}, 'Start Over');
								errorActions.appendChild(skipBtn);
								errorActions.appendChild(startOverBtn);
								quoteBox.insertAdjacentElement('afterend', errorActions);
							}
							errorOccurred = true;
							throw err;
						}
					})();
					await animateStepRange(stepRanges[stepIdx][0], stepRanges[stepIdx][1], stepPromise);
					this.selectedTheme = null;
					stepIdx++;
				}
				// Snap to 100% at the end
				setProgress(100);
				finalStepTitle.textContent = 'Assista IDE is ready. Your Odoo workspace is all set';
				const currentQuoteBox = modal.querySelector('.assista-final-quote');
				if (currentQuoteBox) {
					currentQuoteBox.textContent = 'Please wait a moment while we launch your workspace';
				}
				await new Promise(resolve => setTimeout(resolve, 4000));
				if (this.pendingFolderUri) {
					let hostService = this.hostService;
					if (!hostService) {
						hostService = await this.getHostService();
					}
					await hostService.openWindow([{ folderUri: this.pendingFolderUri }], { forceNewWindow: false });
					this.hide();
				}
			} catch (err) {
				this.debugError('Setup sequence failed', err);
				// Optionally, show a static error message here if desired
				errorOccurred = true;
			} finally {
				quoteTimerActive = false;
				// Only hide the modal if no error occurred
				if (!errorOccurred) {
					this.hide();
				}
			}
		})();
	}
}

export const assistaSettingsOverlayService = new AssistaSettingsOverlayService();

class AssistaSettingsStartupContribution implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.assistaSettingsStartup';

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IEditorService editorService: IEditorService,
		@IStorageService storageService: IStorageService
	) {
		// Update the overlay service with the instantiation and storage services
		(assistaSettingsOverlayService as any).instantiationService = instantiationService;
		(assistaSettingsOverlayService as any).storageService = storageService;

		const isEmptyWorkspace = contextService.getWorkbenchState() === WorkbenchState.EMPTY;
		const onboardingCompleted = storageService.get('assista.onboardingCompleted', StorageScope.APPLICATION) === 'true';

		console.log('[Assista DEBUG] onboardingCompleted:', onboardingCompleted);
		console.log('[Assista DEBUG] isEmptyWorkspace:', isEmptyWorkspace);

		assistaSettingsOverlayService.debugLog(`Onboarding completed: ${onboardingCompleted}, Workspace empty: ${isEmptyWorkspace}`);
		console.log(`[Assista] Onboarding completed: ${onboardingCompleted}, Workspace empty: ${isEmptyWorkspace}`);

		// Create immediate loading modal immediately
		this.createPreWorkbenchModal();

		if (!onboardingCompleted) {
			console.log('[Assista DEBUG] Will show modal at step 0 (onboarding not completed)');
			// Not completed: show modal from step 0
			assistaSettingsOverlayService.step = 0;
			// Start checking for workbench to show modal
			setTimeout(() => assistaSettingsOverlayService.checkAndShowModal(), 100);
		} else if (isEmptyWorkspace) {
			console.log('[Assista DEBUG] Will show modal at step 1 (onboarding completed, workspace empty)');
			// Onboarding completed, but no workspace: show modal at final step
			assistaSettingsOverlayService.step = 1;
			assistaSettingsOverlayService.debugLog('Onboarding completed and no workspace open: will show modal at step 1');
			console.log('[Assista] Onboarding completed and no workspace open: will show modal at step 1');
			// Start checking for workbench to show modal
			setTimeout(() => assistaSettingsOverlayService.checkAndShowModal(), 100);
		} else {
			console.log('[Assista DEBUG] Not showing modal (onboarding completed, workspace open)');
			assistaSettingsOverlayService.debugLog('Onboarding completed and workspace open: not showing modal');
			console.log('[Assista] Onboarding completed and workspace open: not showing modal');
			// Remove immediate loading modal if not needed
			this.removePreWorkbenchModal();
		}
	}

	private createPreWorkbenchModal(): void {
		// Create plain immediate loading modal with centered loading text
		const immediateModal = document.createElement('div');
		immediateModal.id = 'assista-immediate-loading-modal';
		immediateModal.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
			z-index: 9999;
			display: flex;
			align-items: center;
			justify-content: center;
		`;

		// Create loading text
		const loadingText = document.createElement('div');
		loadingText.style.cssText = `
			color: #d09c9e;
			font-size: 1.2rem;
			font-weight: 500;
		`;
		loadingText.textContent = 'Loading...';

		// Add loading text to modal
		immediateModal.appendChild(loadingText);

		// Add to body immediately
		document.body.appendChild(immediateModal);

		// Store reference for later removal
		(assistaSettingsOverlayService as any).immediateLoadingModal = immediateModal;
	}

	private removePreWorkbenchModal(): void {
		const immediateModal = document.getElementById('assista-immediate-loading-modal');
		if (immediateModal) {
			immediateModal.remove();
		}
	}
}

registerWorkbenchContribution2(
	AssistaSettingsStartupContribution.ID,
	AssistaSettingsStartupContribution,
	WorkbenchPhase.BlockStartup
);

