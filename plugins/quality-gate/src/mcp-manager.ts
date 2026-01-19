/**
 * MCP Manager - Cross-platform MCP server lifecycle management
 *
 * Handles automatic startup, health checking, and graceful shutdown
 * of the docs-editor-mcp server with retry logic and backoff.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { spawn, ChildProcess } from 'child_process';

// ============================================================================
// Type Definitions
// ============================================================================

export interface MCPManagerConfig {
  enabled: boolean;
  autoStart: boolean;
  serverPath: string;
  projectRoot: string;
  healthCheck?: {
    enabled: boolean;
    intervalMs: number;
    timeoutMs: number;
    maxRetries: number;
  };
  retry?: {
    maxAttempts: number;
    initialDelayMs: number;
    maxDelayMs: number;
    backoffMultiplier: number;
  };
}

export interface MCPHealthStatus {
  running: boolean;
  pid?: number;
  uptime?: number;
  responsive?: boolean;
  lastCheck?: Date;
}

export interface MCPStartResult {
  success: boolean;
  pid?: number;
  attempt: number;
  durationMs: number;
  error?: string;
}

// ============================================================================
// MCP Manager Class
// ============================================================================

export class MCPManager {
  private config: MCPManagerConfig;
  private process: ChildProcess | null = null;
  private pidFile: string;
  private logFile: string;
  private healthCheckTimer: NodeJS.Timeout | null = null;
  private startTime: number = 0;

  constructor(config: MCPManagerConfig) {
    this.config = config;
    this.pidFile = path.join(config.projectRoot, '.smite', '.mcp-server.pid');
    this.logFile = path.join(config.projectRoot, '.smite', 'mcp-server.log');
  }

  /**
   * Ensure MCP server is running (lazy start)
   */
  async ensureRunning(): Promise<MCPStartResult> {
    const startTime = Date.now();

    // Check if already running
    const existingStatus = await this.getStatus();
    if (existingStatus.running && existingStatus.responsive) {
      return {
        success: true,
        pid: existingStatus.pid,
        attempt: 0,
        durationMs: Date.now() - startTime,
      };
    }

    // Not running or not responsive - start with retry
    return this.startWithRetry();
  }

  /**
   * Start MCP server with retry and exponential backoff
   */
  private async startWithRetry(): Promise<MCPStartResult> {
    const retryConfig = this.config.retry || {
      maxAttempts: 3,
      initialDelayMs: 1000,
      maxDelayMs: 10000,
      backoffMultiplier: 2,
    };

    let lastError: string | undefined;
    let delay = retryConfig.initialDelayMs;

    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      try {
        const result = await this.startServer(attempt);
        if (result.success) {
          // Start health check if enabled
          if (this.config.healthCheck?.enabled) {
            this.startHealthCheck();
          }
          return result;
        }
        lastError = result.error;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
      }

      // Don't wait after last attempt
      if (attempt < retryConfig.maxAttempts) {
        await this.sleep(delay);
        delay = Math.min(delay * retryConfig.backoffMultiplier, retryConfig.maxDelayMs);
      }
    }

    return {
      success: false,
      attempt: retryConfig.maxAttempts,
      durationMs: 0,
      error: lastError || 'Failed to start MCP server after all retries',
    };
  }

  /**
   * Start the MCP server process
   */
  private async startServer(attempt: number): Promise<MCPStartResult> {
    const startTime = Date.now();

    try {
      // Resolve server path
      const serverPath = this.resolveServerPath();
      if (!fs.existsSync(serverPath)) {
        return {
          success: false,
          attempt,
          durationMs: Date.now() - startTime,
          error: `MCP server not found at: ${serverPath}`,
        };
      }

      // Ensure log directory exists
      const logDir = path.dirname(this.logFile);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      // Cross-platform spawn options
      const spawnOptions: any = {
        cwd: this.config.projectRoot,
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      };

      // Windows-specific options
      if (os.platform() === 'win32') {
        spawnOptions.windowsHide = true;
        spawnOptions.shell = false;
      }

      // Spawn the process
      const nodeExecutable = process.execPath; // Use same Node.js as parent
      this.process = spawn(nodeExecutable, [serverPath], spawnOptions);

      // Unref to allow parent to exit independently
      this.process.unref();

      // Wait a bit for process to initialize
      await this.sleep(500);

      // Check if process is still running
      if (!this.process.pid || this.process.killed) {
        return {
          success: false,
          attempt,
          durationMs: Date.now() - startTime,
          error: 'MCP server process terminated immediately',
        };
      }

      // Write PID file
      this.writePid(this.process.pid);

      // Redirect output to log file
      if (this.process.stdout) {
        this.pipeToLog(this.process.stdout, 'STDOUT');
      }
      if (this.process.stderr) {
        this.pipeToLog(this.process.stderr, 'STDERR');
      }

      this.startTime = Date.now();

      // Log startup
      this.appendLog(`[MCP Manager] Server started (attempt ${attempt}), PID: ${this.process.pid}`);

      return {
        success: true,
        pid: this.process.pid,
        attempt,
        durationMs: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        attempt,
        durationMs: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Get current status of MCP server
   */
  async getStatus(): Promise<MCPHealthStatus> {
    // Check PID file first
    if (fs.existsSync(this.pidFile)) {
      try {
        const pid = parseInt(fs.readFileSync(this.pidFile, 'utf-8').trim(), 10);
        const running = this.isProcessRunning(pid);

        return {
          running,
          pid,
          uptime: running && this.startTime > 0 ? Date.now() - this.startTime : 0,
          responsive: running, // TODO: Add actual health check via MCP protocol
          lastCheck: new Date(),
        };
      } catch (error) {
        // PID file invalid - remove it
        this.cleanupPidFile();
      }
    }

    return {
      running: false,
      lastCheck: new Date(),
    };
  }

  /**
   * Stop the MCP server gracefully
   */
  async stop(): Promise<boolean> {
    // Stop health check
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }

    // Read PID file and kill process
    if (fs.existsSync(this.pidFile)) {
      try {
        const pid = parseInt(fs.readFileSync(this.pidFile, 'utf-8').trim(), 10);
        this.killProcess(pid);
        this.cleanupPidFile();
        this.appendLog(`[MCP Manager] Server stopped, PID: ${pid}`);
        return true;
      } catch (error) {
        this.appendLog(`[MCP Manager] Error stopping server: ${error}`);
        return false;
      }
    }

    return false;
  }

  /**
   * Restart the MCP server
   */
  async restart(): Promise<MCPStartResult> {
    await this.stop();
    await this.sleep(1000); // Wait for graceful shutdown
    return this.ensureRunning();
  }

  // ========================================================================
  // Private Helper Methods
  // ========================================================================

  /**
   * Resolve server path relative to project root or global .claude plugins
   * Priority:
   * 1. Absolute path (return as-is)
   * 2. Relative to project root
   * 3. Relative to global .claude/plugins directory
   */
  private resolveServerPath(): string {
    const serverPath = this.config.serverPath;

    // If absolute, return as-is
    if (path.isAbsolute(serverPath)) {
      return serverPath;
    }

    // Try resolving relative to project root
    const projectRelativePath = path.resolve(this.config.projectRoot, serverPath);
    if (fs.existsSync(projectRelativePath)) {
      return projectRelativePath;
    }

    // Try resolving relative to global .claude/plugins directory
    const globalPluginsPath = path.join(os.homedir(), '.claude', 'plugins', serverPath);
    if (fs.existsSync(globalPluginsPath)) {
      return globalPluginsPath;
    }

    // Fallback: return project relative path (will error later if not found)
    return projectRelativePath;
  }

  /**
   * Write PID to file
   */
  private writePid(pid: number): void {
    const pidDir = path.dirname(this.pidFile);
    if (!fs.existsSync(pidDir)) {
      fs.mkdirSync(pidDir, { recursive: true });
    }
    fs.writeFileSync(this.pidFile, String(pid), 'utf-8');
  }

  /**
   * Clean up PID file
   */
  private cleanupPidFile(): void {
    try {
      if (fs.existsSync(this.pidFile)) {
        fs.unlinkSync(this.pidFile);
      }
    } catch (error) {
      // Ignore errors
    }
  }

  /**
   * Append to log file
   */
  private appendLog(message: string): void {
    try {
      const timestamp = new Date().toISOString();
      fs.appendFileSync(this.logFile, `${timestamp} ${message}\n`, 'utf-8');
    } catch (error) {
      // Ignore logging errors
    }
  }

  /**
   * Pipe process output to log file
   */
  private pipeToLog(stream: NodeJS.ReadableStream, prefix: string): void {
    stream.on('data', (data: Buffer) => {
      const message = data.toString().trim();
      if (message) {
        this.appendLog(`[${prefix}] ${message}`);
      }
    });

    stream.on('error', (error) => {
      this.appendLog(`[${prefix} ERROR] ${error}`);
    });
  }

  /**
   * Start periodic health check
   */
  private startHealthCheck(): void {
    const interval = this.config.healthCheck?.intervalMs || 5000;

    this.healthCheckTimer = setInterval(async () => {
      const status = await this.getStatus();
      if (!status.running) {
        this.appendLog('[MCP Manager] Health check failed - server not running');
        // Attempt restart
        if (this.config.autoStart) {
          this.appendLog('[MCP Manager] Attempting restart...');
          await this.ensureRunning();
        }
      }
    }, interval);
  }

  /**
   * Check if process is running by PID
   */
  private isProcessRunning(pid: number): boolean {
    try {
      // Cross-platform process check
      if (os.platform() === 'win32') {
        // Windows: use tasklist command
        const { execSync } = require('child_process');
        const result = execSync(`tasklist /FI "PID eq ${pid}"`, { encoding: 'utf-8' });
        return result.includes(String(pid));
      } else {
        // Unix/Linux/Mac: use process.kill(0, pid)
        process.kill(pid, 0); // Signal 0 checks if process exists
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Kill process by PID
   */
  private killProcess(pid: number): void {
    try {
      if (os.platform() === 'win32') {
        // Windows: use taskkill command
        const { execSync } = require('child_process');
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
      } else {
        // Unix/Linux/Mac: use SIGTERM
        process.kill(pid, 'SIGTERM');

        // Wait a bit and force kill if still running
        setTimeout(() => {
          if (this.isProcessRunning(pid)) {
            process.kill(pid, 'SIGKILL');
          }
        }, 2000);
      }
    } catch (error) {
      // Process already dead
    }
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Clean up stale PID files on startup
 */
export function cleanupStalePids(projectRoot: string): void {
  const pidDir = path.join(projectRoot, '.smite');
  const pidFile = path.join(pidDir, '.mcp-server.pid');

  if (fs.existsSync(pidFile)) {
    try {
      const pid = parseInt(fs.readFileSync(pidFile, 'utf-8').trim(), 10);
      const manager = new MCPManager({
        enabled: true,
        autoStart: false,
        serverPath: '',
        projectRoot,
      });

      if (!manager['isProcessRunning'](pid)) {
        fs.unlinkSync(pidFile);
      }
    } catch (error) {
      // Ignore errors
    }
  }
}
