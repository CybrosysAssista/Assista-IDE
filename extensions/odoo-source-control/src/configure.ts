/**
 * @file configure.ts
 * @description Configuration screen for Odoo workspace setup
 * @copyright (c) 2024 Cybrosys Matrix
 * @license MIT
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface OdooConfig {
    db_host: string;
    db_port: string;
    db_user: string;
    db_password: string;
    addons_path: string;
    xmlrpc_port: string;
    admin_passwd: string;
}

const DEFAULT_CONFIG: OdooConfig = {
    db_host: 'localhost',
    db_port: '5432',
    db_user: 'odoo',
    db_password: 'odoo',
    addons_path: '',  // Will be set based on workspace
    xmlrpc_port: '8069',
    admin_passwd: 'admin'
};

export function showConfigureScreen(workspacePath: string) {
    const panel = vscode.window.createWebviewPanel(
        'configure',
        'Configure Workspace',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    const configurePath = path.join(__dirname, '..', 'src', 'configure.html');
    panel.webview.html = fs.readFileSync(configurePath, 'utf8');

    // Check for configuration file immediately when the screen loads
    setTimeout(() => {
        checkExistingConfiguration(workspacePath, panel);
    }, 500);

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(async message => {
        console.log('Received message in TypeScript:', message);
        switch (message.command) {
            case 'createOdooConf':
                await handleOdooConfCreation(workspacePath, panel);
                break;
            case 'checkVenv':
                // Will be implemented later
                break;
            case 'createDebugConfig':
                console.log('Handling debug config creation');
                await handleDebugConfigCreation(workspacePath, panel);
                break;
        }
    });

    return panel;
}

function checkExistingConfiguration(workspacePath: string, panel: vscode.WebviewPanel) {
    try {
        // Check for any .conf file in the workspace
        const files = fs.readdirSync(workspacePath);
        const confFiles = files.filter(file => file.endsWith('.conf'));

        if (confFiles.length > 0) {
            panel.webview.postMessage({
                command: 'configStatus',
                status: 'exists',
                message: `Odoo configuration file found: ${confFiles[0]}`
            });
        }
    } catch (error) {
        console.error('Error checking configuration:', error);
    }
}

async function handleOdooConfCreation(workspacePath: string, panel: vscode.WebviewPanel) {
    // Check for any .conf file in the workspace
    const files = fs.readdirSync(workspacePath);
    const confFiles = files.filter(file => file.endsWith('.conf'));

    if (confFiles.length > 0) {
        panel.webview.postMessage({
            command: 'configStatus',
            status: 'exists',
            message: `Odoo configuration file found: ${confFiles[0]}`
        });
        return;
    }

    // Collect configuration parameters
    const config = { ...DEFAULT_CONFIG };
    config.addons_path = path.join(workspacePath, '/addons');

    try {
        // Ask about custom modules
        const hasCustomModules = await vscode.window.showQuickPick(
            ['Yes', 'No'],
            { placeHolder: 'Do you have custom modules?' }
        );

        if (hasCustomModules === 'Yes') {
            const customModulesPath = await vscode.window.showInputBox({
                prompt: 'Enter path to your custom modules',
                placeHolder: '/path/to/custom/modules'
            });
            if (customModulesPath) {
                // Combine default addons path with custom modules path
                config.addons_path = `${config.addons_path},${customModulesPath}`;
            }
        }

        // Database host
        const dbHost = await vscode.window.showInputBox({
            prompt: 'Enter database host',
            value: config.db_host,
            placeHolder: 'localhost'
        });
        if (dbHost === undefined) return; // User cancelled
        config.db_host = dbHost;

        // Database port
        const dbPort = await vscode.window.showInputBox({
            prompt: 'Enter database port',
            value: config.db_port,
            placeHolder: '5432'
        });
        if (dbPort === undefined) return;
        config.db_port = dbPort;

        // Database user
        const dbUser = await vscode.window.showInputBox({
            prompt: 'Enter database user',
            value: config.db_user,
            placeHolder: 'odoo'
        });
        if (dbUser === undefined) return;
        config.db_user = dbUser;

        // Database password
        const dbPassword = await vscode.window.showInputBox({
            prompt: 'Enter database password',
            value: config.db_password,
            placeHolder: 'odoo',
            password: true
        });
        if (dbPassword === undefined) return;
        config.db_password = dbPassword;

        // XML-RPC port
        const xmlrpcPort = await vscode.window.showInputBox({
            prompt: 'Enter XML-RPC port',
            value: config.xmlrpc_port,
            placeHolder: '8069'
        });
        if (xmlrpcPort === undefined) return;
        config.xmlrpc_port = xmlrpcPort;

        // Admin password
        const adminPasswd = await vscode.window.showInputBox({
            prompt: 'Enter admin password',
            value: config.admin_passwd,
            placeHolder: 'admin',
            password: true
        });
        if (adminPasswd === undefined) return;
        config.admin_passwd = adminPasswd;

        // Create the configuration file
        const configContent = generateOdooConfig(config);
        const confPath = path.join(workspacePath, 'odoo.conf');
        fs.writeFileSync(confPath, configContent);

        // Notify success
        panel.webview.postMessage({
            command: 'configStatus',
            status: 'created',
            message: 'Odoo configuration file created successfully!'
        });
        vscode.window.showInformationMessage('Odoo configuration file created successfully!');

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create configuration: ${error}`);
        panel.webview.postMessage({
            command: 'configStatus',
            status: 'error',
            message: `Failed to create configuration: ${error}`
        });
    }
}

function generateOdooConfig(config: OdooConfig): string {
    return `[options]
db_host = ${config.db_host}
db_port = ${config.db_port}
db_user = ${config.db_user}
db_password = ${config.db_password}
addons_path = ${config.addons_path}
xmlrpc_port = ${config.xmlrpc_port}
admin_passwd = ${config.admin_passwd}
`;
}

async function handleDebugConfigCreation(workspacePath: string, panel: vscode.WebviewPanel) {
    try {
        // Check if .vscode directory exists
        const vscodeDir = path.join(workspacePath, '.vscode');
        if (!fs.existsSync(vscodeDir)) {
            fs.mkdirSync(vscodeDir);
        }

        // Check if launch.json already exists
        const launchJsonPath = path.join(vscodeDir, 'launch.json');
        if (fs.existsSync(launchJsonPath)) {
            const overwrite = await vscode.window.showQuickPick(
                ['Yes', 'No'],
                { placeHolder: 'Debug configuration already exists. Would you like to overwrite it?' }
            );
            if (overwrite !== 'Yes') {
                panel.webview.postMessage({
                    command: 'debugStatus',
                    status: 'exists',
                    message: 'Debug configuration already exists'
                });
                return;
            }
        }

        // Find Python interpreter
        const pythonPath = await findPythonInterpreter(workspacePath);
        if (!pythonPath) {
            throw new Error('Could not find Python interpreter');
        }

        // Find odoo-bin
        const odooBinPath = await findOdooBin(workspacePath);
        if (!odooBinPath) {
            throw new Error('Could not find odoo-bin');
        }

        // Find odoo.conf
        const confPath = await findOdooConf(workspacePath);
        if (!confPath) {
            throw new Error('Could not find odoo.conf');
        }

        // Create launch.json configuration
        const launchConfig = {
            version: '0.2.0',
            configurations: [
                {
                    name: 'Odoo Debug',
                    type: 'python',
                    request: 'launch',
                    program: odooBinPath,
                    args: ['-c', confPath, '--dev=xml'],
                    python: pythonPath,
                    console: 'integratedTerminal',
                    justMyCode: false
                }
            ]
        };

        // Write launch.json
        fs.writeFileSync(launchJsonPath, JSON.stringify(launchConfig, null, 4));

        // Show success message with instructions
        const successMessage = `<div class="debug-instructions">
            <div class="section">
                <div class="section-title">✨ Debug Configuration Created Successfully! ✨</div>
            </div>

            <div class="section">
                <div class="section-title">📌 To run Odoo with debugger:</div>
                <div>1. Press F5 or click the "Run and Debug" button in VS Code</div>
                <div>2. Select "Odoo Debug" configuration</div>
            </div>

            <div class="section">
                <div class="section-title">📌 To run Odoo without debugger:</div>
                <div class="command">${pythonPath} ${odooBinPath} -c ${confPath} --dev=xml</div>
            </div>

            <div class="welcome">🎉 Welcome to Odoo development! 🎉</div>
        </div>`;

        panel.webview.postMessage({
            command: 'debugStatus',
            status: 'created',
            message: successMessage
        });

        vscode.window.showInformationMessage('Odoo debug configuration created successfully!');

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create debug configuration: ${error}`);
        panel.webview.postMessage({
            command: 'debugStatus',
            status: 'error',
            message: `Failed to create debug configuration: ${error}`
        });
    }
}

export async function findPythonInterpreter(workspacePath: string): Promise<string | undefined> {
    try {
        // Get all Python interpreters from VS Code
        const interpreters = await vscode.commands.executeCommand('python.interpreterPath');
        const pythonInterpreters = await vscode.commands.executeCommand('python.getInterpreterPaths');

        // First check for virtual environment
        const venvPath = path.join(workspacePath, '.venv', 'bin', 'python');
        if (fs.existsSync(venvPath)) {
            const useVenv = await vscode.window.showQuickPick(
                ['Yes', 'No'],
                { placeHolder: 'Found virtual environment. Would you like to use it?' }
            );
            if (useVenv === 'Yes') {
                return venvPath;
            }
        }

        // Show available interpreters
        const interpreterOptions = [
            ...(Array.isArray(pythonInterpreters) ? pythonInterpreters : []),
            'Enter custom path...'
        ];

        const selectedInterpreter = await vscode.window.showQuickPick(
            interpreterOptions,
            { placeHolder: 'Select Python interpreter' }
        );

        if (selectedInterpreter === 'Enter custom path...') {
            return await vscode.window.showInputBox({
                prompt: 'Enter path to Python interpreter',
                placeHolder: '/usr/bin/python3'
            });
        }

        return selectedInterpreter;
    } catch (error) {
        console.error('Error finding Python interpreter:', error);
        return await vscode.window.showInputBox({
            prompt: 'Enter path to Python interpreter',
            placeHolder: '/usr/bin/python3'
        });
    }
}

export async function findOdooBin(workspacePath: string): Promise<string | undefined> {
    // First try to find odoo-bin in the workspace
    const odooBinPath = path.join(workspacePath, 'odoo-bin');
    if (fs.existsSync(odooBinPath)) {
        const useDefault = await vscode.window.showQuickPick(
            ['Yes', 'No'],
            { placeHolder: `Found odoo-bin at ${odooBinPath}. Would you like to use it?` }
        );
        if (useDefault === 'Yes') {
            return odooBinPath;
        }
    }

    // If not found or user declined, ask for path
    return await vscode.window.showInputBox({
        prompt: 'Enter path to odoo-bin',
        placeHolder: '/path/to/odoo-bin'
    });
}

export async function findOdooConf(workspacePath: string): Promise<string | undefined> {
    // First try to find odoo.conf in the workspace
    const confPath = path.join(workspacePath, 'odoo.conf');
    if (fs.existsSync(confPath)) {
        const useDefault = await vscode.window.showQuickPick(
            ['Yes', 'No'],
            { placeHolder: `Found odoo.conf at ${confPath}. Would you like to use it?` }
        );
        if (useDefault === 'Yes') {
            return confPath;
        }
    }

    // If not found or user declined, ask for path
    return await vscode.window.showInputBox({
        prompt: 'Enter path to odoo.conf',
        placeHolder: '/path/to/odoo.conf'
    });
}
