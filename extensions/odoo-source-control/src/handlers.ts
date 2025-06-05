import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function handlePullSource() {
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
        }, async (progress, token) => {
            progress.report({ message: 'Cloning Odoo repository...' });

            // Clone Odoo repository
            const repoUrl = 'https://github.com/odoo/odoo.git';
            const cloneCmd = `git clone --depth 1 --branch ${odooVersion} ${repoUrl} "${versionPath}"`;

            try {
                await execAsync(cloneCmd);
                progress.report({ increment: 100, message: 'Clone completed' });

                // Show success message
                vscode.window.showInformationMessage(
                    `Successfully pulled Odoo ${odooVersion} to ${versionPath}`
                );

                // Update the workspace path in the welcome screen
                const extension = vscode.extensions.getExtension('odoo-source-control');
                if (extension) {
                    await extension.exports.context.globalState.update('odooSourceControl.workspacePath', versionPath);
                    await extension.exports.context.globalState.update('odooSourceControl.workspaceSelected', true);

                    // Find and update the welcome screen panel
                    const panels = vscode.window.visibleTextEditors
                        .filter(editor => editor.document.uri.scheme === 'odoo-welcome');

                    if (panels.length > 0) {
                        // Get the WebviewPanel instance
                        const panel = vscode.window.activeTextEditor?.viewColumn === vscode.ViewColumn.One
                            ? vscode.window.activeTextEditor
                            : panels[0];

                        if (panel) {
                            // Send message to update the welcome screen
                            await vscode.commands.executeCommand('odoo-source-control.updateWelcomeScreen', {
                                command: 'updateStep1',
                                status: 'complete',
                                text: 'Odoo workspace selected',
                                complete: true
                            });
                        }
                    }
                }
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to clone Odoo repository: ${error}`);
                return;
            }
        });

    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error}`);
    }
}

export async function handleCreateConfig(context: vscode.ExtensionContext) {
    try {
        // Ask for config file location
        const targetDir = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select Config File Location'
        });

        if (!targetDir || targetDir.length === 0) {
            return;
        }

        // Get configuration values from user
        const dbName = await vscode.window.showInputBox({
            prompt: 'Enter database name',
            placeHolder: 'odoo_db',
            validateInput: value => {
                return value ? null : 'Database name is required';
            }
        });

        if (!dbName) {
            return;
        }

        const port = await vscode.window.showInputBox({
            prompt: 'Enter port number (default: 8069)',
            placeHolder: '8069',
            value: '8069',
            validateInput: value => {
                return /^\d+$/.test(value) ? null : 'Please enter a valid port number';
            }
        });

        if (!port) {
            return;
        }

        const addons = await vscode.window.showInputBox({
            prompt: 'Enter additional addons paths (comma-separated)',
            placeHolder: './custom_addons,../enterprise',
            value: './custom_addons'
        });

        // Create the config file content
        const configContent = `[options]
; This is the password that allows database operations:
admin_passwd = admin

; Database settings
db_host = localhost
db_port = 5432
db_user = odoo
db_password = odoo
db_name = ${dbName}

; Server settings
xmlrpc_port = ${port}
addons_path = ./addons${addons ? ',' + addons : ''}

; Additional options
list_db = True
proxy_mode = False
workers = 0
max_cron_threads = 1
limit_time_cpu = 600
limit_time_real = 1200
log_level = info
logfile = ./odoo.log
`;

        const configPath = path.join(targetDir[0].fsPath, 'odoo.conf');

        // Write the config file
        await fs.promises.writeFile(configPath, configContent);

        // Store the configuration state in the extension context
        await context.globalState.update('odooSourceControl.configComplete', true);
        await context.globalState.update('odooSourceControl.hasConfig', true);

        // Update the welcome screen
        await vscode.commands.executeCommand('odoo-source-control.updateWelcomeScreen', {
            command: 'updateStep2',
            status: 'complete',
            text: 'Configuration completed',
            complete: true
        });

        // Show success message
        const action = await vscode.window.showInformationMessage(
            `Successfully created Odoo config file at ${configPath}`,
            'Open File',
            'Show Welcome Screen'
        );

        if (action === 'Open File') {
            const document = await vscode.workspace.openTextDocument(configPath);
            await vscode.window.showTextDocument(document);
        } else if (action === 'Show Welcome Screen') {
            // Just show the welcome screen; it will update itself based on global state
            await vscode.commands.executeCommand('odoo-source-control.showWelcome');
        }

    } catch (error) {
        vscode.window.showErrorMessage(`Error creating config file: ${error}`);
    }
}

export async function handleConfigDebugger() {
    try {
        // Get workspace folder
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found. Please open a folder first.');
        }

        // Create .vscode directory if it doesn't exist
        const vscodePath = path.join(workspaceFolder.uri.fsPath, '.vscode');
        if (!fs.existsSync(vscodePath)) {
            await fs.promises.mkdir(vscodePath);
        }

        // Create launch.json
        const launchConfig = {
            version: '0.2.0',
            configurations: [
                {
                    name: 'Odoo',
                    type: 'python',
                    request: 'launch',
                    program: '${workspaceFolder}/odoo-bin',
                    args: [
                        '-c',
                        '${workspaceFolder}/odoo.conf'
                    ],
                    console: 'integratedTerminal'
                }
            ]
        };

        const launchPath = path.join(vscodePath, 'launch.json');
        await fs.promises.writeFile(launchPath, JSON.stringify(launchConfig, null, 4));

        const action = await vscode.window.showInformationMessage(
            'Successfully configured debugger for Odoo',
            'Open launch.json'
        );

        if (action === 'Open launch.json') {
            const document = await vscode.workspace.openTextDocument(launchPath);
            await vscode.window.showTextDocument(document);
        }

    } catch (error) {
        vscode.window.showErrorMessage(`Error configuring debugger: ${error}`);
    }
}