/**
 * @file extension.ts
 * @description Main extension file for Odoo Source Control - Sidebar only version
 * @copyright (c) 2024 Cybrosys Matrix
 * @license MIT
 */

import * as vscode from 'vscode';
import { handlePullSource, handleCreateConfig, handleConfigDebugger } from './handlers';
import * as fs from 'fs';
import * as path from 'path';

class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private _html: string;

  constructor(private readonly context: vscode.ExtensionContext) {
    // Read the HTML file at construction
    const htmlPath = path.join(context.extensionPath, 'webview.html');
    this._html = fs.readFileSync(htmlPath, 'utf8');
  }

  resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(this.context.extensionPath)]
    };
    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
    
    // Listen for messages from the webview
    webviewView.webview.onDidReceiveMessage(async (message) => {
      console.log(`[Extension Host] Received message from webview:`, message);
      switch (message.type) {
        case 'pullOdooSource':
          await handlePullSource(message);
          webviewView.webview.postMessage({ type: 'status', message: 'Odoo source code pulled (if no errors).' });
          break;
        case 'createOdooConf':
          await handleCreateConfig(this.context, message);
          webviewView.webview.postMessage({ type: 'status', message: 'Odoo config file created (if no errors).' });
          break;
        case 'configureDebugger':
          await handleConfigDebugger(message);
          webviewView.webview.postMessage({ type: 'status', message: 'Odoo debugger configured (if no errors).' });
          break;
        case 'testDebuggerConfig': {
          const { pythonPath, odooBinPath, confPath } = message;
          const results: any = {};
          const cp = require('child_process');
          // Check Python path
          if (pythonPath && fs.existsSync(pythonPath)) {
            try {
              const pyVersion = cp.execSync(`"${pythonPath}" --version`).toString().trim();
              results.python = { success: true, message: `Python found: ${pyVersion}` };
            } catch (e) {
              results.python = { success: false, message: `Python not executable: ${(e as Error).message}` };
            }
          } else {
            results.python = { success: false, message: 'Python path does not exist.' };
          }
          // Check Odoo-bin path
          if (odooBinPath && fs.existsSync(odooBinPath)) {
            try {
              const odooVersion = cp.execSync(`"${pythonPath}" "${odooBinPath}" --version`).toString().trim();
              results.odoo = { success: true, message: `Odoo-bin found: ${odooVersion}` };
            } catch (e) {
              results.odoo = { success: false, message: `Odoo-bin not executable: ${(e as Error).message}` };
            }
          } else {
            results.odoo = { success: false, message: 'Odoo-bin path does not exist.' };
          }
          // Check conf file
          if (confPath) {
            if (fs.existsSync(confPath)) {
              try {
                const content = fs.readFileSync(confPath, 'utf8');
                // Simple INI parser for Odoo conf files
                const data: any = {};
                content.split(/\r?\n/).forEach(line => {
                  line = line.trim();
                  if (!line || line.startsWith(';') || line.startsWith('#') || line.startsWith('[')) return;
                  const idx = line.indexOf('=');
                  if (idx > -1) {
                    const key = line.slice(0, idx).trim();
                    const value = line.slice(idx + 1).trim();
                    data[key] = value;
                  }
                });
                // Check for required fields
                const requiredFields = ['db_host', 'db_user', 'db_password', 'addons_path'];
                const missing = requiredFields.filter(f => !data[f]);
                if (missing.length === 0) {
                  results.conf = { success: true, message: 'Conf file valid and all required fields present.' };
                } else {
                  results.conf = { success: false, message: `Conf file missing fields: ${missing.join(', ')}` };
                }
              } catch (e) {
                results.conf = { success: false, message: `Conf file error: ${(e as Error).message}` };
              }
            } else {
              results.conf = { success: false, message: 'Conf file does not exist.' };
            }
          }
          webviewView.webview.postMessage({ type: 'testDebuggerConfigResult', results });
          break;
        }
        case 'getDebuggerConfig': {
          const workspaceFolders = vscode.workspace.workspaceFolders;
          if (workspaceFolders && workspaceFolders.length > 0) {
            const workspacePath = workspaceFolders[0].uri.fsPath;
            const launchJsonPath = path.join(workspacePath, '.vscode', 'launch.json');
            
            if (fs.existsSync(launchJsonPath)) {
              try {
                const launchConfigContent = fs.readFileSync(launchJsonPath, 'utf8');
                const launchConfig = JSON.parse(launchConfigContent);
                const odooDebugConfig = launchConfig.configurations?.find((c: any) => c.name === 'Odoo Debug');
                
                if (odooDebugConfig) {
                  const cIndex = odooDebugConfig.args.indexOf('-c');
                  const confPath = cIndex > -1 && odooDebugConfig.args.length > cIndex + 1 ? odooDebugConfig.args[cIndex + 1] : '';
                  const devReload = odooDebugConfig.args.includes('--dev=reload,qweb,xml,assets');
                  const message = {
                    type: 'debuggerConfig',
                    pythonPath: odooDebugConfig.python,
                    odooBinPath: odooDebugConfig.program,
                    confPath: confPath,
                    devReload: devReload
                  };
                  this._view?.webview.postMessage(message);
                } else {
                    const defaultConfig = this.detectProjectPaths(workspacePath);
                    const message = {
                        type: 'debuggerConfig',
                        ...defaultConfig
                    };
                    this._view?.webview.postMessage(message);
                }
              } catch (e) {
                const defaultConfig = this.detectProjectPaths(workspacePath);
                const message = {
                    type: 'debuggerConfig',
                    ...defaultConfig
                };
                this._view?.webview.postMessage(message);
              }
            } else {
                const defaultConfig = this.detectProjectPaths(workspacePath);
                const message = {
                    type: 'debuggerConfig',
                    ...defaultConfig
                };
                this._view?.webview.postMessage(message);
            }
          }
          break;
        }
        case 'listVenvs': {
          // Find all venvs in the workspace: look for */bin/python
          const workspaceFolders = vscode.workspace.workspaceFolders;
          if (workspaceFolders && workspaceFolders.length > 0) {
            const workspacePath = workspaceFolders[0].uri.fsPath;
            const fs = require('fs');
            const path = require('path');
            let venvs = [];
            try {
              const dirs = fs.readdirSync(workspacePath, { withFileTypes: true })
                .filter((d: any) => d.isDirectory());
              for (const dir of dirs) {
                const venvPython = path.join(workspacePath, dir.name, 'bin', 'python');
                if (fs.existsSync(venvPython)) {
                  venvs.push(venvPython);
                }
              }
            } catch (e) {
              // ignore
            }
            // Also check for .venv, .env, venv, env, etc.
            const venvNames = ['.venv', 'venv', '.env', 'env'];
            for (const venvName of venvNames) {
              const venvPython = path.join(workspacePath, venvName, 'bin', 'python');
              if (fs.existsSync(venvPython) && !venvs.includes(venvPython)) {
                venvs.push(venvPython);
              }
            }
            this._view?.webview.postMessage({ type: 'venvList', venvs });
          }
          break;
        }
        case 'listConfs': {
          // Find all .conf files in the workspace
          const workspaceFolders = vscode.workspace.workspaceFolders;
          let defaultConfPath = '';
          if (workspaceFolders && workspaceFolders.length > 0) {
            const workspacePath = workspaceFolders[0].uri.fsPath;
            const fs = require('fs');
            const path = require('path');
            let confFiles = [];
            try {
              // Search for .conf files in the workspace directory
              const files = fs.readdirSync(workspacePath, { withFileTypes: true });
              for (const file of files) {
                if (file.isFile() && file.name.endsWith('.conf')) {
                  confFiles.push(path.join(workspacePath, file.name));
                }
              }
              // Also search in subdirectories (one level deep)
              const dirs = files.filter((d: any) => d.isDirectory());
              for (const dir of dirs) {
                try {
                  const subDirPath = path.join(workspacePath, dir.name);
                  const subFiles = fs.readdirSync(subDirPath, { withFileTypes: true });
                  for (const subFile of subFiles) {
                    if (subFile.isFile() && subFile.name.endsWith('.conf')) {
                      confFiles.push(path.join(subDirPath, subFile.name));
                    }
                  }
                } catch (e) {
                  // ignore subdirectory read errors
                }
              }
              // Check launch.json for odoo.conf path
              const launchJsonPath = path.join(workspacePath, '.vscode', 'launch.json');
              if (fs.existsSync(launchJsonPath)) {
                try {
                  const launchConfigContent = fs.readFileSync(launchJsonPath, 'utf8');
                  const launchConfig = JSON.parse(launchConfigContent);
                  
                  // Find any configuration that looks like an Odoo debug config
                  const odooDebugConfig = launchConfig.configurations?.find((c: any) => {
                    // Check for common Odoo debug configuration names
                    const name = c.name?.toLowerCase() || '';
                    return name.includes('odoo') || 
                           name.includes('debug') || 
                           (c.program && c.program.includes('odoo-bin'));
                  });
                  
                  if (odooDebugConfig && odooDebugConfig.args) {
                    // Look for -c argument with improved handling
                    for (let i = 0; i < odooDebugConfig.args.length; i++) {
                      const arg = odooDebugConfig.args[i];
                      if (arg === '-c' && i + 1 < odooDebugConfig.args.length) {
                        let confPath = odooDebugConfig.args[i + 1];
                        
                        // Handle quoted paths (both single and double quotes)
                        if (typeof confPath === 'string') {
                          // Remove surrounding quotes if present
                          confPath = confPath.replace(/^["']|["']$/g, '');
                          
                          // If it's a relative path, make it absolute
                          if (!path.isAbsolute(confPath)) {
                            confPath = path.resolve(workspacePath, confPath);
                          }
                          
                          if (confPath && fs.existsSync(confPath)) {
                            defaultConfPath = confPath;
                            break;
                          }
                        }
                      }
                    }
                  }
                } catch (e) { 
                  console.error('Error reading launch.json:', e);
                }
              }
            } catch (e) {
              // ignore
            }
            this._view?.webview.postMessage({ type: 'confList', confFiles, defaultConfPath });
          }
          break;
        }
        case 'browseDirectory': {
          const result = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select Target Directory'
          });
          
          if (result && result.length > 0) {
            this._view?.webview.postMessage({ 
              type: 'directorySelected', 
              path: result[0].fsPath 
            });
          }
          break;
        }
        case 'readConfFile': {
          // message.path should be the absolute path to the .conf file
          try {
            const confPath = message.path;
            if (confPath && fs.existsSync(confPath)) {
              const content = fs.readFileSync(confPath, 'utf8');
              // Simple INI parser for Odoo conf files
              const data: any = {};
              content.split(/\r?\n/).forEach(line => {
                line = line.trim();
                if (!line || line.startsWith(';') || line.startsWith('#') || line.startsWith('[')) return;
                const idx = line.indexOf('=');
                if (idx > -1) {
                  const key = line.slice(0, idx).trim();
                  const value = line.slice(idx + 1).trim();
                  data[key] = value;
                }
              });
              this._view?.webview.postMessage({ type: 'confFileData', data });
            } else {
              this._view?.webview.postMessage({ type: 'confFileData', data: null, error: 'File not found' });
            }
          } catch (e) {
            this._view?.webview.postMessage({ type: 'confFileData', data: null, error: String(e) });
          }
          break;
        }
      }
    });
  }

  getHtmlForWebview(webview: vscode.Webview): string {
    return this._html;
  }

  postMessageToWebview(message: any) {
    this._view?.webview.postMessage(message);
  }

  focus() {
    if (this._view) {
      this._view.show?.(true);
    }
  }

  private detectProjectPaths(workspacePath: string) {
    const pythonPath = this.detectPythonPath(workspacePath);
    const odooBinPath = this.detectOdooBinPath(workspacePath);
    const confPath = this.detectConfPath(workspacePath);
    
    return {
      pythonPath,
      odooBinPath,
      confPath
    };
  }

  private detectPythonPath(workspacePath: string): string {
    // Priority order for virtual environment Python detection
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

    // First, try to find virtual environment Python
    for (const venvPath of venvPaths) {
      if (fs.existsSync(venvPath)) {
        return venvPath;
      }
    }

    // If no virtual environment found, suggest creating one
    return path.join(workspacePath, 'venv', 'bin', 'python');
  }

  private detectOdooBinPath(workspacePath: string): string {
    // Look for odoo-bin in the project directory
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

    return path.join(workspacePath, 'odoo-bin');
  }

  private detectConfPath(workspacePath: string): string {
    try {
      // Read all files in the workspace directory
      const files = fs.readdirSync(workspacePath);
      
      // Filter .conf files
      const confFiles = files.filter(file => file.endsWith('.conf'));
      
      if (confFiles.length > 0) {
        // Prefer odoo.conf if exists, otherwise use the first .conf file
        const preferredConf = confFiles.find(file => file === 'odoo.conf') || confFiles[0];
        const confPath = path.join(workspacePath, preferredConf);
        console.log(`Found config file at: ${confPath}`);
        return confPath;
      }
    } catch (error) {
      console.error('Error reading directory for .conf files:', error);
    }

    console.log('No .conf file found, using default');
    return path.join(workspacePath, 'odoo.conf');
  }
}

export function activate(context: vscode.ExtensionContext) {
	// Register a command to pull Odoo source code
	let pullSourceCommand = vscode.commands.registerCommand('odoo-source-control.pullSource', () => {
		handlePullSource();
	});

	context.subscriptions.push(pullSourceCommand);

	// Register a command to create config
	let createConfigCommand = vscode.commands.registerCommand('odoo-source-control.createConfig', () => {
		handleCreateConfig(context);
	});

	context.subscriptions.push(createConfigCommand);

	// Register a command to configure debugger
	let configDebuggerCommand = vscode.commands.registerCommand('odoo-source-control.configDebugger', () => {
		handleConfigDebugger();
	});

	context.subscriptions.push(configDebuggerCommand);

	let sidebarProviderInstance: SidebarProvider | undefined;

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'odoo-source-control.SidebarProvider',
			sidebarProviderInstance = new SidebarProvider(context)
		)
	);

  // Add command to show debugger sidebar and focus debugger section
  let showDebuggerSidebarCommand = vscode.commands.registerCommand('odoo-source-control.showDebuggerSidebar', async () => {
    // Focus the sidebar
    await vscode.commands.executeCommand('workbench.view.extension.odoo-source-control-activitybar');
    // Show the webview if not already visible
    sidebarProviderInstance?.focus();
    // Send message to webview to show debugger section
    sidebarProviderInstance?.postMessageToWebview({ type: 'showDebugger' });
  });
  context.subscriptions.push(showDebuggerSidebarCommand);

  // Automatically open the sidebar when the extension is activated
  // if (vscode.workspace.workspaceFolders) {
  //   vscode.commands.executeCommand('odoo-source-control.SidebarProvider.focus');
  // }
}

export function deactivate() { }
