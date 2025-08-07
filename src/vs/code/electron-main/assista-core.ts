/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { validatedIpcMain } from '../../base/parts/ipc/electron-main/ipcMain.js';

// --- Assista: Utility for cloning with progress ---
async function cloneWithProgress(
	repoUrl: string,
	targetPath: string,
	branch: string,
	progress?: (message: string) => void,
	type: 'venv' | 'odoo' = 'venv',
	timeoutMs?: number
): Promise<void> {
	return new Promise((resolve, reject) => {
		const cloneArgs = [
			'clone',
			'--depth', '1',
			'--branch', branch,
			'--progress',
			repoUrl,
			targetPath
		];

		const typeLabel = type === 'venv' ? 'Odoo venv' : 'Odoo source code';
		const fullCommand = `git ${cloneArgs.join(' ')}`;

		console.log(`[${typeLabel}] Executing command:`, fullCommand);
		console.log(`[${typeLabel}] Target path:`, targetPath);
		console.log(`[${typeLabel}] Repository:`, repoUrl);
		console.log(`[${typeLabel}] Branch:`, branch);

		if (progress) progress(`Starting ${typeLabel} clone (branch: ${branch})...`);

		const gitProcess = spawn('git', cloneArgs);
		let errorOutput = '';
		let lastProgressTime = Date.now();
		let isResolved = false;

		// Set up timeout if specified
		let timeoutId: ReturnType<typeof setTimeout> | undefined;
		if (timeoutMs) {
			timeoutId = setTimeout(() => {
				if (!isResolved) {
					console.log(`[${typeLabel}] Timeout reached, killing git process`);
					isResolved = true;
					gitProcess.kill('SIGTERM');
					const timeoutError = `Installation timed out. Please check your internet connection and try again`;
					console.error(`[${typeLabel}] ${timeoutError}`);
					reject(new Error(timeoutError));
				}
			}, timeoutMs);
		}

		gitProcess.stderr.on('data', (data) => {
			const output = data.toString();
			errorOutput += output;

			// Git clone progress comes through stderr
			const lines = output.split('\n');
			for (const line of lines) {
				if (line.includes('Cloning into')) {
					if (progress) progress(`Initializing ${typeLabel} clone...`);
				} else if (line.includes('remote:')) {
					const match = line.match(/remote:\s*(.+)/);
					if (match && progress) {
						const now = Date.now();
						if (now - lastProgressTime > 500) { // Throttle progress updates
							progress(`${typeLabel}: ${match[1].trim()}`);
							lastProgressTime = now;
						}
					}
				} else if (line.includes('Receiving objects:')) {
					const match = line.match(/Receiving objects:\s*(\d+)%/);
					if (match && progress) {
						progress(`Downloading ${typeLabel}: ${match[1]}%`);
					}
				} else if (line.includes('Resolving deltas:')) {
					const match = line.match(/Resolving deltas:\s*(\d+)%/);
					if (match && progress) {
						progress(`Processing ${typeLabel}: ${match[1]}%`);
					}
				}
			}
		});

		gitProcess.on('close', (code) => {
			if (timeoutId) clearTimeout(timeoutId);

			if (isResolved) return; // Already handled by timeout

			if (code === 0) {
				console.log(`[${typeLabel}] Clone completed successfully`);
				if (progress) progress(`${typeLabel} clone completed successfully`);
				isResolved = true;
				resolve();
			} else {
				console.error(`[${typeLabel}] Clone failed with exit code:`, code);
				console.error(`[${typeLabel}] Error output:`, errorOutput);
				isResolved = true;
				reject(new Error(`Git clone failed with code ${code}: ${errorOutput}`));
			}
		});

		gitProcess.on('error', (error) => {
			if (timeoutId) clearTimeout(timeoutId);
			if (isResolved) return;

			console.error(`[${typeLabel}] Process error:`, error.message);
			isResolved = true;
			reject(new Error(`Git clone process error: ${error.message}`));
		});
	});
}

// --- Assista: Odoo Source Code Download Handler ---
validatedIpcMain.handle('vscode:assistaDownloadOdooSource', async (event, { version, targetPath }) => {
	if (!version || !targetPath) {
		return { success: false, error: 'Odoo version and path are required.' };
	}

	// Check if the user-selected path exists (not joined with version yet)
	console.log(`[Assista] Checking if user-selected path exists: ${targetPath}`);
	if (!fs.existsSync(targetPath)) {
		console.log(`[Assista] User-selected path does not exist: ${targetPath}`);
		return { success: false, error: `Target path does not exist: ${targetPath}` };
	} else {
		console.log(`[Assista] User-selected path exists: ${targetPath}`);
	}

	// Now join with version to form the final clone path
	const versionPath = path.join(targetPath, version);
	if (fs.existsSync(versionPath)) {
		console.log(`[Assista] Version path exists (will overwrite): ${versionPath}`);
		// For now, always overwrite. You can add prompt logic if needed.
		await fs.promises.rm(versionPath, { recursive: true, force: true });
	} else {
		console.log(`[Assista] Version path does not exist: ${versionPath}`);
	}

	const repoUrl = 'https://github.com/odoo/odoo.git';

	console.log(`[Assista] Starting git clone for Odoo version: ${version}`);
	console.log(`[Assista] Target path: ${versionPath}`);
	console.log(`[Assista] Repository URL: ${repoUrl}`);

	try {
		// Set up timeout for 2 minutes (120000 milliseconds)
		const timeoutDuration = 120000; // 2 minutes
		const timeoutPromise = new Promise<never>((_, reject) => {
			setTimeout(() => {
				reject(new Error('Download timed out. Please check your internet connection and try again'));
			}, timeoutDuration);
		});

		await Promise.race([
			new Promise((resolve, reject) => {
				// Use spawn instead of exec for live output
				const gitProcess = spawn('git', [
					'clone',
					'--depth', '1',
					'--branch', version,
					repoUrl,
					versionPath
				], {
					stdio: ['ignore', 'pipe', 'pipe']
				});

				console.log(`[Assista] Git process started with PID: ${gitProcess.pid}`);

				// Capture live stdout output
				gitProcess.stdout.on('data', (data) => {
					const output = data.toString();
					console.log(`[Assista] Git stdout: ${output.trim()}`);
					// Send live output to frontend
					event.sender.send('vscode:assistaDownloadProgress', {
						type: 'progress',
						data: output,
						stream: 'stdout'
					});
				});

				// Capture live stderr output
				gitProcess.stderr.on('data', (data) => {
					const output = data.toString();
					console.log(`[Assista] Git stderr: ${output.trim()}`);
					// Send live output to frontend
					event.sender.send('vscode:assistaDownloadProgress', {
						type: 'progress',
						data: output,
						stream: 'stderr'
					});
				});

				// Handle process completion
				gitProcess.on('close', (code) => {
					console.log(`[Assista] Git process completed with exit code: ${code}`);
					if (code === 0) {
						console.log(`[Assista] Git clone successful for version: ${version}`);
						resolve('Git clone completed successfully');
					} else {
						console.log(`[Assista] Git clone failed with exit code: ${code}`);
						reject(new Error(`Git clone failed with code ${code}`));
					}
				});

				// Handle process errors
				gitProcess.on('error', (error) => {
					console.log(`[Assista] Git process error: ${error.message}`);
					reject(error);
				});

				// Store gitProcess reference for timeout handling
				(globalThis as any).currentGitProcess = gitProcess;
			}),
			timeoutPromise.then(() => {
				// Kill the git process when timeout occurs
				const gitProcess = (globalThis as any).currentGitProcess;
				if (gitProcess) {
					console.log(`[Assista] Timeout reached, killing git process with PID: ${gitProcess.pid}`);
					gitProcess.kill('SIGTERM');
					(globalThis as any).currentGitProcess = null;
				}
				throw new Error('Download timeout: The Odoo source code download took more than 2 minutes. Please check your internet connection and try again.');
			})
		]);

		console.log(`[Assista] Git clone operation completed successfully`);
		return { success: true, path: versionPath };
	} catch (error) {
		console.log(`[Assista] Git clone operation failed: ${error.toString()}`);
		return { success: false, error: error.toString() };
	}
});

// --- Assista: Python Version Detection Handler ---
validatedIpcMain.handle('vscode:checkPythonVersions', async (event) => {
	console.log(`[Assista] Checking Python versions...`);

	try {
		const versions: { python?: string; python3?: string } = {};

		// Check for 'python' command
		try {
			const pythonResult = await new Promise<string>((resolve, reject) => {
				const pythonProcess = spawn('python', ['--version'], {
					stdio: ['ignore', 'pipe', 'pipe']
				});

				let stdout = '';
				let stderr = '';

				pythonProcess.stdout.on('data', (data) => {
					stdout += data.toString();
				});

				pythonProcess.stderr.on('data', (data) => {
					stderr += data.toString();
				});

				pythonProcess.on('close', (code) => {
					if (code === 0) {
						// Python version is usually output to stderr
						const output = stderr.trim() || stdout.trim();
						const versionMatch = output.match(/Python (\d+\.\d+\.\d+)/);
						if (versionMatch) {
							resolve(versionMatch[1]);
						} else {
							reject(new Error('Could not parse Python version'));
						}
					} else {
						reject(new Error(`Python command failed with code ${code}`));
					}
				});

				pythonProcess.on('error', (error) => {
					reject(error);
				});
			});

			versions.python = pythonResult;
			console.log(`[Assista] Found Python version: ${pythonResult}`);
		} catch (error) {
			console.log(`[Assista] Python command not found or failed: ${error}`);
		}

		// Check for 'python3' command
		try {
			const python3Result = await new Promise<string>((resolve, reject) => {
				const python3Process = spawn('python3', ['--version'], {
					stdio: ['ignore', 'pipe', 'pipe']
				});

				let stdout = '';
				let stderr = '';

				python3Process.stdout.on('data', (data) => {
					stdout += data.toString();
				});

				python3Process.stderr.on('data', (data) => {
					stderr += data.toString();
				});

				python3Process.on('close', (code) => {
					if (code === 0) {
						// Python version is usually output to stderr
						const output = stderr.trim() || stdout.trim();
						const versionMatch = output.match(/Python (\d+\.\d+\.\d+)/);
						if (versionMatch) {
							resolve(versionMatch[1]);
						} else {
							reject(new Error('Could not parse Python3 version'));
						}
					} else {
						reject(new Error(`Python3 command failed with code ${code}`));
					}
				});

				python3Process.on('error', (error) => {
					reject(error);
				});
			});

			versions.python3 = python3Result;
			console.log(`[Assista] Found Python3 version: ${python3Result}`);
		} catch (error) {
			console.log(`[Assista] Python3 command not found or failed: ${error}`);
		}

		console.log(`[Assista] Python versions check completed:`, versions);
		return { success: true, versions };

	} catch (error) {
		console.log(`[Assista] Error checking Python versions: ${error}`);
		return { success: false, error: error.toString() };
	}
});

// --- Assista: Venv Installation Handler ---
validatedIpcMain.handle('vscode:assistaInstallVenv', async (event, { odooVersion, pythonVersion, projectPath }) => {
	console.log(`[Assista] Install venv IPC call received`);
	console.log(`[Assista] Odoo version: ${odooVersion}`);
	console.log(`[Assista] Python version: ${pythonVersion}`);
	console.log(`[Assista] Project path: ${projectPath}`);

	let branch = '';
	if (odooVersion && pythonVersion) {
		branch = `${odooVersion}-py${pythonVersion}`;
	} else if (odooVersion) {
		branch = '14-16';
	}

	const repoUrl = 'https://github.com/CybrosysAssista/Odoo-venv.git';
	const tempDir = path.join(projectPath, '.venv-tmp');

	// Clean up tempDir if it exists
	if (fs.existsSync(tempDir)) {
		console.log(`[Assista] Removing existing temp directory: ${tempDir}`);
		await fs.promises.rm(tempDir, { recursive: true, force: true });
	}

	console.log(`[Assista] Cloning branch ${branch} into temp directory: ${tempDir}`);
	const gitCloneCmd = `git clone --branch ${branch} ${repoUrl} "${tempDir}"`;
	console.log(`[Assista] Git clone command for venv: ${gitCloneCmd}`);

	try {
		// Use the new utility for progress with built-in timeout (2 minutes)
		await cloneWithProgress(
			repoUrl,
			tempDir,
			branch,
			(message) => {
				console.log(`[Venv Installer Progress] ${message}`);
				event.sender.send('vscode:assistaVenvInstallProgress', {
					type: 'progress',
					data: message,
					stream: 'progress'
				});
			},
			'venv',
			120000 // 2 minutes timeout
		);

		event.sender.send('vscode:assistaVenvInstallProgress', {
			type: 'progress',
			data: 'Moving venv files...',
			stream: 'info'
		});

		try {
			const files = await fs.promises.readdir(tempDir);
			for (const file of files) {
				if (file === '.git') continue;
				const src = path.join(tempDir, file);
				const dest = path.join(projectPath, file);
				await fs.promises.rm(dest, { recursive: true, force: true }).catch(() => { });
				await fs.promises.rename(src, dest);
				// Emit progress for each file moved
				event.sender.send('vscode:assistaVenvInstallProgress', {
					type: 'progress',
					data: `Moved ${file}`,
					stream: 'info'
				});
			}
			await fs.promises.rm(tempDir, { recursive: true, force: true });
			event.sender.send('vscode:assistaVenvInstallProgress', {
				type: 'progress',
				data: 'Venv install complete!',
				stream: 'info'
			});
			return { success: true, path: projectPath };
		} catch (moveErr) {
			console.log(`[Assista] Error moving venv files: ${moveErr}`);
			throw new Error(moveErr.toString());
		}
	} catch (error) {
		console.log(`[Assista] Git clone operation failed: ${error.toString()}`);
		// Send error message to frontend before throwing
		event.sender.send('vscode:assistaVenvInstallProgress', {
			type: 'error',
			data: error.toString(),
			stream: 'error'
		});
		return { success: false, error: error.toString() };
	}
});
