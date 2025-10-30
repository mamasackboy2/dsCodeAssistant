/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *  
 *  Enhanced ESLint Configuration - Last updated: 2025-10-30
 *  This configuration provides comprehensive linting rules for TypeScript and JavaScript files
 *--------------------------------------------------------------------------------------------*/

// @ts-check
import fs from 'fs';
import path from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import pluginLocal from 'eslint-plugin-local';
import pluginJsdoc from 'eslint-plugin-jsdoc';
import pluginHeader from 'eslint-plugin-header';

// Configure header plugin schema
pluginHeader.rules.header.meta.schema = false;

/**
 * Get the current directory path
 * @returns {string} The directory name
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Load and parse the .eslint-ignore file
 * @returns {string[]} Array of ignore patterns
 */
const ignores = fs.readFileSync(path.join(__dirname, '.eslint-ignore'), 'utf8')
	.toString()
	.split(/\r\n|\n/)
	.filter(line => line && !line.startsWith('#'));

/**
 * ESLint configuration for dsCodeAssistant project
 * Includes rules for TypeScript, JavaScript, and various extensions
 */
export default tseslint.config(
	// Global ignores
	{
		ignores: [
			...ignores,
			'!**/.eslint-plugin-local/**/*'
		],
	},

	// All files (JS and TS) - Base configuration
	{
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
			'@stylistic/ts': stylisticTs,
			'local': pluginLocal,
			'jsdoc': pluginJsdoc,
			'header': pluginHeader
		},
		rules: {
			// Enhanced code quality rules
			'no-console': 'warn',
			'no-unused-vars': 'off', // TypeScript handles this
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'prefer-const': 'warn',
			'no-var': 'error'
		}
	},

	// Markdown language features - Specific configuration
	{
		files: [
			'extensions/markdown-language-features/**/*.ts',
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			'@typescript-eslint/naming-convention': [
				'warn',
				{
					'selector': 'default',
					'modifiers': ['private'],
					'format': null,
					'leadingUnderscore': 'require'
				},
				{
					'selector': 'default',
					'modifiers': ['public'],
					'format': null,
					'leadingUnderscore': 'forbid'
				}
			]
		}
	},

	// TypeScript language features - Specific configuration
	{
		files: [
			'extensions/typescript-language-features/**/*.ts',
		],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: [
					'extensions/typescript-language-features/tsconfig.json',
					'extensions/typescript-language-features/web/tsconfig.json'
				],
			}
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			'@typescript-eslint/prefer-optional-chain': 'warn',
			'@typescript-eslint/prefer-readonly': 'warn',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/await-thenable': 'warn'
		}
	}
);
