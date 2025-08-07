import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Virtual environment repository and branch mapping for different Odoo versions
const VENV_REPO = 'https://github.com/CybrosysAssista/Odoo-venv.git';

/**
 * Get the appropriate venv branch based on Odoo version and Python version
 */
function getVenvBranch(odooVersion: string, pythonVersion?: string): string {
    // For Odoo 17.0 and 18.0, use Python version specific branches
    if (odooVersion === '17.0' && pythonVersion) {
        return `17.0-py${pythonVersion}`;
    }
    if (odooVersion === '18.0' && pythonVersion) {
        return `18.0-py${pythonVersion}`;
    }
    
    // For older versions (14.0, 15.0, 16.0), use the combined branch
    if (['14.0', '15.0', '16.0'].includes(odooVersion)) {
        return '14-16';
    }
    
    // Fallback (shouldn't happen with current UI, but good to have)
    throw new Error(`No virtual environment branch available for Odoo version ${odooVersion}`);
}

/**
 * Execute git clone with progress reporting
 */
async function cloneWithProgress(
    repoUrl: string, 
    targetPath: string, 
    branch: string, 
    progress?: (message: string) => void,
    type: 'venv' | 'odoo' = 'venv'
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
            if (code === 0) {
                console.log(`[${typeLabel}] Clone completed successfully`);
                if (progress) progress(`${typeLabel} clone completed successfully`);
                resolve();
            } else {
                console.error(`[${typeLabel}] Clone failed with exit code:`, code);
                console.error(`[${typeLabel}] Error output:`, errorOutput);
                reject(new Error(`Git clone failed with code ${code}: ${errorOutput}`));
            }
        });

        gitProcess.on('error', (error) => {
            console.error(`[${typeLabel}] Process error:`, error.message);
            reject(new Error(`Git clone process error: ${error.message}`));
        });
    });
}

/**
 * Validate virtual environment structure and set permissions
 */
async function validateAndSetupVenv(venvPath: string, progress?: (message: string) => void): Promise<void> {
    if (progress) progress('Validating virtual environment structure...');
    
    // Check if venv directory exists
    if (!fs.existsSync(venvPath)) {
        throw new Error('Virtual environment directory not found');
    }
    
    // Check for essential venv files
    const binPath = path.join(venvPath, 'bin');
    const pythonBin = path.join(binPath, 'python');
    const pythonBin3 = path.join(binPath, 'python3');
    const activateScript = path.join(binPath, 'activate');
    const pipBin = path.join(binPath, 'pip');
    
    if (!fs.existsSync(binPath)) {
        throw new Error('Virtual environment bin directory not found');
    }
    
    if (!fs.existsSync(pythonBin) && !fs.existsSync(pythonBin3)) {
        throw new Error('Python executable not found in virtual environment');
    }
    
    if (!fs.existsSync(activateScript)) {
        throw new Error('Activate script not found in virtual environment');
    }
    
    if (progress) progress('Setting executable permissions...');
    
    // Make all files in bin directory executable
    try {
        const binFiles = await fs.promises.readdir(binPath);
        for (const file of binFiles) {
            const filePath = path.join(binPath, file);
            const stats = await fs.promises.stat(filePath);
            if (stats.isFile()) {
                await fs.promises.chmod(filePath, 0o755);
            }
        }
    } catch (chmodError) {
        // Don't fail on chmod errors, just warn
        if (progress) progress('Warning: Could not set execute permissions on some scripts');
    }
    
    if (progress) progress('Virtual environment validated and configured successfully');
}

/**
 * Setup virtual environment for Odoo version using Git clone
 */
export async function setupVirtualEnvironment(
    odooVersion: string, 
    targetPath: string, 
    progress?: (message: string) => void,
    pythonVersion?: string
): Promise<string> {
    console.log(`[Setup Virtual Environment] Starting setup for Odoo ${odooVersion}${pythonVersion ? ` with Python ${pythonVersion}` : ''}`);
    console.log(`[Setup Virtual Environment] Target path:`, targetPath);
    
    let branch: string;
    
    try {
        branch = getVenvBranch(odooVersion, pythonVersion);
        console.log(`[Setup Virtual Environment] Selected branch:`, branch);
    } catch (error) {
        console.error(`[Setup Virtual Environment] Branch selection failed:`, error);
        throw new Error(`Virtual environment not available for Odoo version ${odooVersion}${pythonVersion ? ` with Python ${pythonVersion}` : ''}. Available: 14.0-16.0, 17.0 (py3.10/3.12), 18.0 (py3.10/3.12)`);
    }

    const tempVenvPath = path.join(targetPath, 'temp-venv-clone');
    const finalVenvPath = path.join(targetPath, 'venv');

    try {
        // Create target directory if it doesn't exist
        if (!fs.existsSync(targetPath)) {
            await fs.promises.mkdir(targetPath, { recursive: true });
        }

        // Remove existing directories if they exist
        if (fs.existsSync(finalVenvPath)) {
            if (progress) progress('Removing existing virtual environment...');
            await fs.promises.rm(finalVenvPath, { recursive: true, force: true });
        }
        
        if (fs.existsSync(tempVenvPath)) {
            await fs.promises.rm(tempVenvPath, { recursive: true, force: true });
        }

        // Clone the virtual environment repository
        const venvMessage = pythonVersion ? 
            `Cloning virtual environment for Odoo ${odooVersion} (Python ${pythonVersion})...` :
            `Cloning virtual environment for Odoo ${odooVersion}...`;
        if (progress) progress(venvMessage);
        await cloneWithProgress(VENV_REPO, tempVenvPath, branch, progress, 'venv');

        // Move the venv folder from the cloned repository to the target location
        const clonedVenvPath = path.join(tempVenvPath, 'venv');
        
        if (!fs.existsSync(clonedVenvPath)) {
            throw new Error('Virtual environment folder not found in the cloned repository');
        }
        
        if (progress) progress('Moving virtual environment to target location...');
        await fs.promises.rename(clonedVenvPath, finalVenvPath);
        
        // Clean up the temporary clone directory
        await fs.promises.rm(tempVenvPath, { recursive: true, force: true });

        // Validate and setup the virtual environment
        await validateAndSetupVenv(finalVenvPath, progress);

        if (progress) progress(`Virtual environment setup completed at ${finalVenvPath}`);
        return finalVenvPath;
    } catch (error) {
        // Clean up on error
        if (fs.existsSync(tempVenvPath)) {
            await fs.promises.rm(tempVenvPath, { recursive: true, force: true }).catch(() => {});
        }
        if (fs.existsSync(finalVenvPath)) {
            await fs.promises.rm(finalVenvPath, { recursive: true, force: true }).catch(() => {});
        }
        throw error;
    }
}
