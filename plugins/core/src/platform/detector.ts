/**
 * SMITE Platform Detection
 *
 * Runtime OS, shell, and environment detection for cross-platform compatibility.
 */

import * as os from 'os';
import * as process from 'process';

export type OSType = 'darwin' | 'linux' | 'win32' | 'unknown';
export type ShellType = 'powershell' | 'cmd' | 'bash' | 'zsh' | 'fish' | 'unknown';

export interface PlatformInfo {
  os: OSType;
  arch: string;
  shell: ShellType;
  nodeVersion: string;
  env: string | undefined;
  isWSL: boolean;
  isCI: boolean;
}

export type PlatformFeature =
  | 'symlinks'
  | 'executable-permissions'
  | 'case-sensitive'
  | 'native-async-local';

/**
 * Platform Detector for cross-platform compatibility
 */
export class PlatformDetector {
  private cache: PlatformInfo | null = null;

  /**
   * Detect current platform
   */
  detect(): PlatformInfo {
    if (this.cache) {
      return this.cache;
    }

    const platform: PlatformInfo = {
      os: this.detectOS(),
      arch: os.arch(),
      shell: this.detectShell(),
      nodeVersion: process.version,
      env: process.env.NODE_ENV,
      isWSL: this.detectWSL(),
      isCI: this.detectCI(),
    };

    this.cache = platform;
    return platform;
  }

  /**
   * Detect OS type
   */
  private detectOS(): OSType {
    const platform = process.platform;
    switch (platform) {
      case 'darwin':
      case 'linux':
      case 'win32':
        return platform;
      default:
        return 'unknown';
    }
  }

  /**
   * Detect default shell
   */
  private detectShell(): ShellType {
    const platform = process.platform;
    const env = process.env;

    if (platform === 'win32') {
      // Windows: check for PowerShell vs CMD
      if (env.PSModulePath) {
        return 'powershell';
      }
      return 'cmd';
    }

    // Unix-like: check shell env vars
    const shell = env.SHELL || '';
    if (shell.includes('zsh')) return 'zsh';
    if (shell.includes('fish')) return 'fish';
    if (shell.includes('bash')) return 'bash';

    // Default to bash for Unix-like systems
    return 'bash';
  }

  /**
   * Detect WSL (Windows Subsystem for Linux)
   */
  private detectWSL(): boolean {
    try {
      // Check Microsoft proc version
      return (
        process.platform === 'linux' &&
        require('fs').existsSync('/proc/version') &&
        require('fs')
          .readFileSync('/proc/version', 'utf-8')
          .toLowerCase()
          .includes('microsoft')
      );
    } catch {
      return false;
    }
  }

  /**
   * Detect CI environment
   */
  private detectCI(): boolean {
    const env = process.env;
    return !!(
      env.CI ||
      env.CONTINUOUS_INTEGRATION ||
      env.BUILD_NUMBER ||
      env.GITHUB_ACTIONS ||
      env.TRAVIS ||
      env.JENKINS_URL ||
      env.GITLAB_CI
    );
  }

  /**
   * Check if platform supports a feature
   */
  supports(feature: PlatformFeature): boolean {
    const platform = this.detect();

    switch (feature) {
      case 'symlinks':
        // Symlinks work on most Unix systems, require admin on Windows
        return platform.os !== 'win32' || process.platform === 'win32';

      case 'executable-permissions':
        // Only Unix-like systems have executable permissions
        return platform.os !== 'win32';

      case 'case-sensitive':
        // Most filesystems are case-sensitive except macOS (default)
        return platform.os !== 'darwin';

      case 'native-async-local':
        // Node.js 12+ supports async local storage
        const major = parseInt(process.version.slice(1).split('.')[0], 10);
        return major >= 12;

      default:
        return false;
    }
  }

  /**
   * Get platform-specific path separator
   */
  getPathSeparator(): string {
    return process.platform === 'win32' ? ';' : ':';
  }

  /**
   * Get platform-specific newlines
   */
  getNewline(): string {
    return process.platform === 'win32' ? '\r\n' : '\n';
  }

  /**
   * Convert Windows path to Git Bash path
   */
  windowsToGitBashPath(windowsPath: string): string {
    if (process.platform !== 'win32') {
      return windowsPath;
    }

    // Convert C:\path\to\file -> /c/path/to/file
    return windowsPath
      .replace(/^([A-Z]):\\/, (_, drive) => `/${drive.toLowerCase()}/`)
      .replace(/\\/g, '/');
  }

  /**
   * Clear cached platform info
   */
  clearCache(): void {
    this.cache = null;
  }
}

// Global platform detector instance
let globalDetector: PlatformDetector | undefined;

/**
 * Get or create global platform detector
 */
export function getGlobalPlatformDetector(): PlatformDetector {
  if (!globalDetector) {
    globalDetector = new PlatformDetector();
  }
  return globalDetector;
}

/**
 * Get current platform info (convenience function)
 */
export function getPlatformInfo(): PlatformInfo {
  return getGlobalPlatformDetector().detect();
}
