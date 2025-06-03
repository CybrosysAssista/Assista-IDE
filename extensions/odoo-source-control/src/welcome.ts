/**
 * @file welcome.ts
 * @description Simple welcome screen for Odoo Source Control extension
 * @copyright (c) 2024 Cybrosys Matrix
 * @license MIT
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { showConfigureScreen } from './configure';

const execAsync = promisify(exec);

// Store the workspace path that's being opened
let pendingWorkspacePath: string | undefined;

export function showWelcomeScreen() {
    const panel = vscode.window.createWebviewPanel(
        'welcome',
        'Welcome',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    const welcomePath = path.join(__dirname, '..', 'src', 'welcome.html');
    panel.webview.html = fs.readFileSync(welcomePath, 'utf8');

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(async message => {
        switch (message.command) {
            case 'selectExistingProject':
                const result = await vscode.window.showOpenDialog({
                    canSelectFiles: false,
                    canSelectFolders: true,
                    canSelectMany: false,
                    openLabel: 'Select Odoo Project Directory'
                });

                if (result && result[0]) {
                    const selectedPath = result[0].fsPath;
                    const isValidOdoo = fs.existsSync(path.join(selectedPath, 'odoo'));

                    // Send result back to webview
                    panel.webview.postMessage({
                        command: 'projectValidation',
                        isValid: isValidOdoo,
                        path: selectedPath
                    });
                }
                break;

            case 'pullFromGithub':
                try {
                    // Ask for Odoo version
                    const odooVersion = await vscode.window.showInputBox({
                        prompt: 'Enter Odoo version (e.g., 17.0, 16.0, 15.0)',
                        placeHolder: '17.0',
                        validateInput: value => {
                            return /^\d+\.\d+$/.test(value) ? null : 'Please enter a valid version number (e.g., 17.0)';
                        }
                    });

                    if (!odooVersion) {
                        return;
                    }

                    // Ask for target directory
                    const targetDir = await vscode.window.showOpenDialog({
                        canSelectFiles: false,
                        canSelectFolders: true,
                        canSelectMany: false,
                        openLabel: 'Select Target Directory'
                    });

                    if (!targetDir || targetDir.length === 0) {
                        return;
                    }

                    const targetPath = targetDir[0].fsPath;
                    const versionPath = path.join(targetPath, odooVersion);

                    // Check if directory exists and is not empty
                    if (fs.existsSync(versionPath)) {
                        const overwrite = await vscode.window.showWarningMessage(
                            `Odoo ${odooVersion} directory already exists. Do you want to delete it and clone again?`,
                            'Yes', 'No'
                        );

                        if (overwrite !== 'Yes') {
                            return;
                        }

                        await fs.promises.rm(versionPath, { recursive: true, force: true });
                    }

                    // Show progress
                    await vscode.window.withProgress({
                        location: vscode.ProgressLocation.Notification,
                        title: `Pulling Odoo ${odooVersion}`,
                        cancellable: true
                    }, async (progress) => {
                        progress.report({ message: 'Cloning Odoo repository...' });

                        // Clone Odoo repository
                        const repoUrl = 'https://github.com/odoo/odoo.git';
                        const cloneCmd = `git clone --depth 1 --branch ${odooVersion} ${repoUrl} "${versionPath}"`;

                        try {
                            await execAsync(cloneCmd);
                            progress.report({ increment: 100, message: 'Clone completed' });

                            // Show success message and update webview
                            vscode.window.showInformationMessage(
                                `Successfully pulled Odoo ${odooVersion}`
                            );

                            panel.webview.postMessage({
                                command: 'cloneCompleted',
                                path: versionPath
                            });

                        } catch (error) {
                            vscode.window.showErrorMessage(`Failed to clone Odoo repository: ${error}`);
                        }
                    });

                } catch (error) {
                    vscode.window.showErrorMessage(`Error: ${error}`);
                }
                break;

            case 'openWorkspace':
                const workspacePath = message.path;
                // First dispose the welcome panel
                panel.dispose();

                // Create a workspace configuration file
                const workspaceConfigPath = path.join(workspacePath, '.vscode', 'settings.json');
                const configDir = path.dirname(workspaceConfigPath);

                if (!fs.existsSync(configDir)) {
                    fs.mkdirSync(configDir, { recursive: true });
                }

                // Add a setting that will trigger our configuration screen
                const settings = {
                    "odoo-source-control.needsConfiguration": true
                };

                fs.writeFileSync(workspaceConfigPath, JSON.stringify(settings, null, 4));

                // Open the workspace in a new window and close the current one
                await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(workspacePath), { forceNewWindow: true });
                await vscode.commands.executeCommand('workbench.action.closeWindow');
                break;
        }
    });
}

// Function to check if we should show configuration
export function checkAndShowConfiguration() {
    // Get the current workspace configuration
    const config = vscode.workspace.getConfiguration('odoo-source-control');
    const needsConfiguration = config.get('needsConfiguration');

    if (needsConfiguration) {
        // Clear the flag
        config.update('needsConfiguration', false, vscode.ConfigurationTarget.Workspace).then(() => {
            // Show the configuration screen
            const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
            if (workspacePath) {
                showConfigureScreen(workspacePath);
            }
        });
    }
}