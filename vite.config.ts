/* eslint-disable camelcase, @typescript-eslint/no-magic-numbers */
// eslint-env node
import { readFileSync } from 'fs';

import { resolve } from 'path';
import { defineConfig, type UserConfig } from 'vite';
import { type ManifestOptions, VitePWA as vitePWA } from 'vite-plugin-pwa';
import { assetsCache, externalResourcesCache, pagesCache, scriptsCache } from './src/sw-caching';

const manifest: Partial<ManifestOptions> = JSON.parse(readFileSync('./src/manifest.json', { encoding: 'utf8' }));

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
		plugins: [
			vitePWA({
				registerType: 'prompt',
				minify: true,
				showMaximumFileSizeToCacheInBytesWarning: true,
				includeAssets: ['/icons/favicon.svg'],
				manifest,
				workbox: {
					// eslint-disable-next-line @typescript-eslint/no-magic-numbers
					maximumFileSizeToCacheInBytes: 1024 * 128,
					cleanupOutdatedCaches: true,
					clientsClaim: true,
					skipWaiting: true,
					navigationPreload: false,
					directoryIndex: 'index.html',
					runtimeCaching: [
						pagesCache,
						assetsCache,
						scriptsCache,
						externalResourcesCache
					]
				},
				devOptions: {
					enabled: false
				}
			})
		],
		base: baseUrl,
		envPrefix: 'APP_',
		envDir: '../',
		root: 'src',
		publicDir: '../public',
		clearScreen: false,
		server: {
			host: 'localhost',
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
