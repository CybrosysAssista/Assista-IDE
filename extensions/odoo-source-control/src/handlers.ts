import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { setupVirtualEnvironment } from './venv-manager';

// Simple helper functions for finding project paths
async function findPythonInterpreter(workspacePath: string): Promise<string | undefined> {
    const venvPaths = [
        path.join(workspacePath, 'venv', 'bin', 'python'),
        path.join(workspacePath, '.venv', 'bin', 'python'),
        path.join(workspacePath, 'env', 'bin', 'python'),
        path.join(workspacePath, '.env', 'bin', 'python'),
        path.join(workspacePath, 'venv', 'bin', 'python3'),
        path.join(workspacePath, '.venv', 'bin', 'python3'),
        path.join(workspacePath, 'env', 'bin', 'python3'),
        path.join(workspacePath, '.env', 'bin', 'python3')
    ];
    
    for (const venvPath of venvPaths) {
        if (fs.existsSync(venvPath)) {
            return venvPath;
        }
    }
    
    return await vscode.window.showInputBox({
        prompt: 'Enter path to Python interpreter',
        placeHolder: '/usr/bin/python3'
    });
}

async function findOdooBin(workspacePath: string): Promise<string | undefined> {
    const possiblePaths = [
        path.join(workspacePath, 'odoo-bin'),
        path.join(workspacePath, 'odoo', 'odoo-bin'),
        path.join(workspacePath, 'src', 'odoo-bin'),
        path.join(workspacePath, 'odoo-bin.py')
    ];
    
    for (const binPath of possiblePaths) {
        if (fs.existsSync(binPath)) {
            return binPath;
        }
    }
    
    return await vscode.window.showInputBox({
        prompt: 'Enter path to odoo-bin',
        placeHolder: '/path/to/odoo-bin'
    });
}

async function findOdooConf(workspacePath: string): Promise<string | undefined> {
    const confPath = path.join(workspacePath, 'odoo.conf');
    if (fs.existsSync(confPath)) {
        return confPath;
    }
    
    return await vscode.window.showInputBox({
        prompt: 'Enter path to odoo.conf',
        placeHolder: '/path/to/odoo.conf'
    });
}

const execAsync = promisify(exec);

/**
 * Execute git clone with progress reporting for Odoo
 */
async function cloneWithProgress(
    repoUrl: string, 
    targetPath: string, 
    branch: string, 
    progress?: (message: string) => void
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

        const fullCommand = `git ${cloneArgs.join(' ')}`;
        
        console.log(`[Odoo Source Code] Executing command:`, fullCommand);
        console.log(`[Odoo Source Code] Target path:`, targetPath);
        console.log(`[Odoo Source Code] Repository:`, repoUrl);
        console.log(`[Odoo Source Code] Branch:`, branch);
        
        if (progress) progress(`Starting Odoo source code clone (branch: ${branch})...`);

        const gitProcess = spawn('git', cloneArgs);
        let errorOutput = '';
        let lastProgressTime = Date.now();

        gitProcess.stderr.on('data', (data) => {
            const output = data.toString();
            errorOutput += output;
            
            // Git clone progress comes through stderr
            const lines = output.split('\n');
            for (const line of lines) {
                if (line.includes('Cloning into')) {
                    if (progress) progress('Initializing Odoo source code clone...');
                } else if (line.includes('remote:')) {
                    const match = line.match(/remote:\s*(.+)/);
                    if (match && progress) {
                        const now = Date.now();
                        if (now - lastProgressTime > 500) { // Throttle progress updates
                            progress(`Odoo source code: ${match[1].trim()}`);
                            lastProgressTime = now;
                        }
                    }
                } else if (line.includes('Receiving objects:')) {
                    const match = line.match(/Receiving objects:\s*(\d+)%/);
                    if (match && progress) {
                        progress(`Downloading Odoo source code: ${match[1]}%`);
                    }
                } else if (line.includes('Resolving deltas:')) {
                    const match = line.match(/Resolving deltas:\s*(\d+)%/);
                    if (match && progress) {
                        progress(`Processing Odoo source code: ${match[1]}%`);
                    }
                }
            }
        });

        gitProcess.on('close', (code) => {
            if (code === 0) {
                console.log(`[Odoo Source Code] Clone completed successfully`);
                if (progress) progress('Odoo source code clone completed successfully');
                resolve();
            } else {
                console.error(`[Odoo Source Code] Clone failed with exit code:`, code);
                console.error(`[Odoo Source Code] Error output:`, errorOutput);
                reject(new Error(`Git clone failed with code ${code}: ${errorOutput}`));
            }
        });

        gitProcess.on('error', (error) => {
            console.error(`[Odoo Source Code] Process error:`, error.message);
            reject(new Error(`Git clone process error: ${error.message}`));
        });
    });
}

export async function handlePullSource(params?: any) {
    console.log(`[Handle Pull Source] Starting with parameters:`, params);
    
    try {
        // Use params from sidebar if provided, otherwise prompt
        let odooVersion = params?.odooVersion;
        if (!odooVersion) {
            odooVersion = await vscode.window.showInputBox({
                prompt: 'Enter Odoo version (e.g., 17.0, 16.0, 15.0)',
                placeHolder: '17.0',
                validateInput: value => {
                    return /^\d+\.\d+$/.test(value) ? null : 'Please enter a valid version number (e.g., 17.0)';
                }
            });
        }
        if (!odooVersion) {
            return;
        }
        
        let targetPath = params?.targetDir;
        if (!targetPath) {
            const targetDir = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: 'Select Target Directory'
            });
            if (!targetDir || targetDir.length === 0) {
                return;
            }
            targetPath = targetDir[0].fsPath;
        }
        
        const versionPath = path.join(targetPath, odooVersion);
        const createVenv = params?.createVenv !== false; // Default to true
        const pythonVersion = params?.pythonVersion; // Get Python version for Odoo 17/18
        const openInVscode = params?.openInVscode === true || params?.openInVscode === 'true';
        
        console.log(`[Handle Pull Source] Configuration:`);
        console.log(`  - Odoo Version: ${odooVersion}`);
        console.log(`  - Target Path: ${targetPath}`);
        console.log(`  - Version Path: ${versionPath}`);
        console.log(`  - Create Venv: ${createVenv}`);
        console.log(`  - Python Version: ${pythonVersion || 'not specified'}`);
        
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
        
        let pullSuccess = false;
        let versionPathResult = '';
        let venvPath = '';
        
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Setting up Odoo ${odooVersion}`,
            cancellable: true
        }, async (progress, token) => {
            // Step 1: Clone Odoo repository with progress
            try {
                progress.report({ message: 'Cloning Odoo repository...' });
                const repoUrl = 'https://github.com/odoo/odoo.git';
                await cloneWithProgress(repoUrl, versionPath, odooVersion, (message) => progress.report({ message }));
                progress.report({ increment: 50, message: 'Odoo repository cloned successfully' });
                pullSuccess = true;
                versionPathResult = versionPath;
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to clone Odoo repository: ${error}`);
                return;
            }

            // Step 2: Setup virtual environment if requested
            if (createVenv && pullSuccess) {
                try {
                    progress.report({ increment: 50, message: 'Setting up virtual environment...' });
                    venvPath = await setupVirtualEnvironment(
                        odooVersion, 
                        versionPath, 
                        (message) => progress.report({ message }),
                        pythonVersion
                    );
                    progress.report({ increment: 100, message: 'Setup completed successfully' });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    vscode.window.showErrorMessage(`Failed to setup virtual environment: ${errorMessage}`);
                    console.error('Virtual environment setup error:', error);
                    // Continue without virtual environment - don't fail the entire process
                }
            }
        });
        
        if (pullSuccess) {
            let message = `Successfully set up Odoo ${odooVersion} at ${versionPathResult}`;
            if (venvPath) {
                message += `\nVirtual environment: ${venvPath}`;
            }
            if (openInVscode) {
                // Open the folder in the current window (replace current workspace)
                await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(versionPathResult), false);
            } else {
                const action = await vscode.window.showInformationMessage(
                    message,
                    'Open in Workspace Folder'
                );
                if (action === 'Open in Workspace Folder') {
                    await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(versionPathResult), false);
                }
            }
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error}`);
    }
}

export async function handleCreateConfig(context: vscode.ExtensionContext, params?: any) {
    try {
        let configPath;
        if (params?.updateConfPath) {
            // Overwrite the selected conf file
            configPath = params.updateConfPath;
        } else {
            let targetPath = params?.targetDir;
            if (!targetPath) {
                const targetDir = await vscode.window.showOpenDialog({
                    canSelectFiles: false,
                    canSelectFolders: true,
                    canSelectMany: false,
                    openLabel: 'Select Config File Location'
                });
                if (!targetDir || targetDir.length === 0) {
                    return;
                }
                targetPath = targetDir[0].fsPath;
            }
            const confFileName = params?.confFileName || 'odoo.conf';
            configPath = path.join(targetPath, confFileName);
        }
        // Use params or prompt for config values
        const port = params?.port || await vscode.window.showInputBox({
            prompt: 'Enter port number (default: 8069)',
            placeHolder: '8069',
            value: '8069',
            validateInput: value => {
                return /^\d+$/.test(value) ? null : 'Please enter a valid port number';
            }
        });
        if (!port) return;
        const dbName = params?.dbName || '';
        const dbHost = params?.dbHost || '';
        const dbUser = params?.dbUser || '';
        const dbPassword = params?.dbPassword || '';
        const addons = params?.addons || '';
        const logfile = params?.logfile || '';
        const proxyMode = params?.proxyMode || '';
        const maxCronThreads = params?.maxCronThreads || '';
        const workers = params?.workers || '';
        const limitMemorySoft = params?.limitMemorySoft || '';
        const limitMemoryHard = params?.limitMemoryHard || '';
        const logLevel = params?.logLevel ? 'debug' : '';
        // Build config lines, only add if value is not blank
        let configLines = [];
        configLines.push('[options]');
        configLines.push('; This is the password that allows database operations:');
        configLines.push('admin_passwd = admin');
        configLines.push('');
        configLines.push('; Database settings');
        if (dbHost) configLines.push(`db_host = ${dbHost}`);
        configLines.push('db_port = 5432');
        if (dbUser) configLines.push(`db_user = ${dbUser}`);
        if (dbPassword) configLines.push(`db_password = ${dbPassword}`);
        if (dbName && dbName.trim()) configLines.push(`db_name = ${dbName}`);
        configLines.push('');
        configLines.push('; Server settings');
        if (port) configLines.push(`xmlrpc_port = ${port}`);
        if (addons) configLines.push(`addons_path = ${addons}`);
        configLines.push('');
        configLines.push('; Additional options');
        configLines.push('list_db = True');
        if (proxyMode) configLines.push(`proxy_mode = ${proxyMode}`);
        if (workers) configLines.push(`workers = ${workers}`);
        if (maxCronThreads) configLines.push(`max_cron_threads = ${maxCronThreads}`);
        if (limitMemorySoft) configLines.push(`limit_memory_soft = ${limitMemorySoft}`);
        if (limitMemoryHard) configLines.push(`limit_memory_hard = ${limitMemoryHard}`);
        if (logLevel) configLines.push(`log_level = ${logLevel}`);
        if (logfile) configLines.push(`logfile = ${logfile}`);
        configLines.push('');
        const configContent = configLines.join('\n');
        await fs.promises.writeFile(configPath, configContent);
        await context.globalState.update('odooSourceControl.configComplete', true);
        await context.globalState.update('odooSourceControl.hasConfig', true);
        // Always open the config file in the editor after creation
        const document = await vscode.workspace.openTextDocument(configPath);
        await vscode.window.showTextDocument(document);
    } catch (error) {
        vscode.window.showErrorMessage(`Error creating config file: ${error}`);
    }
}


export async function handleConfigDebugger(params?: any) {
    try {
        // For now, just call the original logic (can be extended to use params if needed)
        // Get workspace folder
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found. Please open a folder first.');
        }
        const workspacePath = workspaceFolder.uri.fsPath;
        // Create .vscode directory if it doesn't exist
        const vscodePath = path.join(workspacePath, '.vscode');
        if (!fs.existsSync(vscodePath)) {
            await fs.promises.mkdir(vscodePath);
        }
        // Prompt for Python interpreter, odoo-bin, and odoo.conf
        const pythonPath = params?.pythonPath || await findPythonInterpreter(workspacePath);
        if (!pythonPath) {
            throw new Error('Could not find Python interpreter');
        }
        const odooBinPath = params?.odooBinPath || await findOdooBin(workspacePath);
        if (!odooBinPath) {
            throw new Error('Could not find odoo-bin');
        }
        const confPath = params?.confPath || await findOdooConf(workspacePath);
        if (!confPath) {
            throw new Error('Could not find odoo.conf');
        }
        // Create launch.json
        const args = ['-c', confPath];
        if (params?.devReload) {
            args.push('--dev=reload,qweb,xml,assets');
        }
        const launchConfig = {
            version: '0.2.0',
            configurations: [
                {
                    name: 'Odoo Debug',
                    type: 'python',
                    "noDebug": true,
                    request: 'launch',
                    program: odooBinPath,
                    args: args,
                    python: pythonPath,
                    console: 'internalConsole',
                    justMyCode: false
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
