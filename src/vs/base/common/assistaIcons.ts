/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ThemeIcon } from './themables.js';
import { register } from './codiconsUtil.js';

/**
 * Assista Icons - Custom icons for Assista IDE
 * These icons use the assistaicon font family
 */
export const AssistaIcons = {
	togglePanelOff: register('assista-toggle-panel-off', 0xe800),
	togglePanelOn: register('assista-toggle-panel-on', 0xe80e),
	debugger: register('assista-debugger', 0xe80f),
	extensions: register('assista-extensions', 0xe810),
	folder: register('assista-folder', 0xe811),
	toggleSecondarySidebarOff: register('assista-toggle-secondary-sidebar-off', 0xe805),
	toggleSecondarySidebarOn: register('assista-toggle-secondary-sidebar-on', 0xe806),
	customiseLayout: register('assista-customise-layout', 0xe803),
	accounts: register('assista-accounts', 0xe802),
	restart: register('assista-restart', 0xe804),
	togglePrimarySidebarOff: register('assista-toggle-primary-sidebar-off', 0xe813),
	togglePrimarySidebarOn: register('assista-toggle-primary-sidebar-on', 0xe801),
	runAndDebug: register('assista-run-and-debug', 0xe808),
	search: register('assista-search', 0xe809),
	settings: register('assista-settings', 0xe80a),
	sourceControl: register('assista-source-control', 0xe80b),
	stopDebugging: register('assista-stop-debugging', 0xe80c),
	run: register('assista-run', 0xe807),
	hamburger: register('assista-hamburger', 0xe812),
} as const;

/**
 * Get all Assista icons
 */
export function getAllAssistaIcons(): ThemeIcon[] {
	return Object.values(AssistaIcons);
}

// Export individual icons for easy access
export const AssistaIcon = {
	togglePanelOff: { id: 'assista-toggle-panel-off' },
	togglePanelOn: { id: 'assista-toggle-panel-on' },
	debugger: { id: 'assista-debugger' },
	extensions: { id: 'assista-extensions' },
	folder: { id: 'assista-folder' },
	toggleSecondarySidebarOff: { id: 'assista-toggle-secondary-sidebar-off' },
	toggleSecondarySidebarOn: { id: 'assista-toggle-secondary-sidebar-on' },
	customiseLayout: { id: 'assista-customise-layout' },
	accounts: { id: 'assista-accounts' },
	restart: { id: 'assista-restart' },
	togglePrimarySidebarOff: { id: 'assista-toggle-primary-sidebar-off' },
	togglePrimarySidebarOn: { id: 'assista-toggle-primary-sidebar-on' },
	runAndDebug: { id: 'assista-run-and-debug' },
	search: { id: 'assista-search' },
	settings: { id: 'assista-settings' },
	sourceControl: { id: 'assista-source-control' },
	stopDebugging: { id: 'assista-stop-debugging' },
	run: { id: 'assista-run' },
	hamburger: { id: 'assista-hamburger' },
} as const;
