/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *  
 *  VS Code Server Launcher - Last updated: 2025-10-30
 *  This script starts a VS Code server with configurable options
 *--------------------------------------------------------------------------------------------*/

// @ts-check

/**
 * @fileoverview VS Code server launcher script
 * Starts a local development server and optionally opens it in a browser
 */

const cp = require('child_process');
const path = require('path');
const open = require('open');
const minimist = require('minimist');

// Configuration constants
const DEFAULT_SERVER_PORT = '9888';
const SERVER_ENTRY_POINT = 'server-main.js';
const WEB_UI_REGEX = /Web UI available at (.*)/;
const SIGINT_EXIT_CODE = 128 + 2; // Standard UNIX signal exit code
const SIGTERM_EXIT_CODE = 128 + 15; // Standard UNIX signal exit code

/**
 * Main entry point - parses arguments and starts the server
 * @async
 * @returns {Promise<void>}
 */
async function main() {
	const args = minimist(process.argv.slice(2), {
		boolean: [
			'help',
			'launch'
		]
	});

	// Display help message if requested
	if (args.help) {
		console.log(
			'./scripts/code-server.sh|bat [options]\n' +
			' --launch              Opens a browser'
		);
		startServer(['--help']);
		return;
	}

	// Configure server port
	process.env['VSCODE_SERVER_PORT'] = DEFAULT_SERVER_PORT;

	// Filter out launcher-specific arguments
	const serverArgs = process.argv.slice(2).filter(v => v !== '--launch');

	// Start the server and get the address
	const addr = await startServer(serverArgs);

	// Auto-launch browser if requested
	if (args['launch']) {
		open(addr);
	}
}

/**
 * Starts the VS Code server process
 * @param {string[]} programArgs - Command line arguments to pass to the server
 * @returns {Promise<string>} Promise resolving to the server address
 */
function startServer(programArgs) {
	return new Promise((s, e) => {
		// Clone environment variables
		const env = { ...process.env };

		// Determine server entry point path
		const entryPoint = path.join(__dirname, '..', 'out', SERVER_ENTRY_POINT);

		console.log(`Starting server: ${entryPoint} ${programArgs.join(' ')}`);

		// Spawn the server process
		const proc = cp.spawn(process.execPath, [entryPoint, ...programArgs], {
			env,
			stdio: [process.stdin, null, process.stderr]
		});

		// Handle server stdout - capture the server address
		proc.stdout.on('data', e => {
			const data = e.toString();
			process.stdout.write(data);

			// Extract server address from output
			const m = data.match(WEB_UI_REGEX);
			if (m) {
				s(m[1]);
			}
		});

		// Forward process exit code
		proc.on('exit', (code) => process.exit(code));

		// Cleanup: Kill child process when parent exits
		process.on('exit', () => proc.kill());

		// Handle SIGINT (Ctrl+C)
		process.on('SIGINT', () => {
			proc.kill();
			process.exit(SIGINT_EXIT_CODE); // https://nodejs.org/docs/v14.16.0/api/process.html#process_signal_events
		});

		// Handle SIGTERM (termination signal)
		process.on('SIGTERM', () => {
			proc.kill();
			process.exit(SIGTERM_EXIT_CODE); // https://nodejs.org/docs/v14.16.0/api/process.html#process_signal_events
		});
	});
}

// Start the server
main();
