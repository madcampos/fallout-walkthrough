/* eslint-disable camelcase, @typescript-eslint/no-magic-numbers */
// eslint-env node
import { readFileSync } from 'fs';

import { resolve } from 'path';
import { defineConfig, type UserConfig } from 'vite';

export default defineConfig(({ mode }) => {
	let baseUrl = 'https://fallout2.madcampos.dev/';
	let sslOptions = undefined;

	if (mode !== 'production') {
		baseUrl = 'https://localhost:3000/';

		sslOptions = {
			cert: readFileSync('./certs/server.crt', 'utf-8'),
			key: readFileSync('./certs/server.key', 'utf-8')
		};
	}

	const config: UserConfig = {
		base: baseUrl,
		envPrefix: 'APP_',
		envDir: '../',
		root: 'src',
		publicDir: '../public',
		clearScreen: false,
		server: {
			host: '0.0.0.0',
			https: sslOptions,
			open: false,
			cors: true,
			port: 3000
		},
		build: {
			target: 'esnext',
			emptyOutDir: true,
			outDir: '../dist',
			rollupOptions: {
				input: {
					main: resolve('src/index.html')
				},
				output: {
					generatedCode: 'es2015',
					inlineDynamicImports: false
				}
			}
		},
		preview: {
			https: sslOptions,
			open: true
		}
	};

	return config;
});
