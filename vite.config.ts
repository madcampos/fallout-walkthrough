/* eslint-disable camelcase */
// eslint-env node
import { readFileSync } from 'fs';

import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA as vitePWA } from 'vite-plugin-pwa';

const sslOptions = {
	cert: readFileSync('./certs/server.crt'),
	key: readFileSync('./certs/server.key')
};

const packageJson: PackageJsonVariables = JSON.parse(readFileSync('./package.json', { encoding: 'utf8' }));

export default defineConfig(({ mode }) => {
	const env = {
		APP_PUBLIC_URL: packageJson.homepage,

		APP_NAME: packageJson.displayName,
		APP_SHORT_NAME: packageJson.shortName,
		APP_DESCRIPTION: packageJson.description,
		APP_KEYWORDS: packageJson.keywords.join(', '),
		APP_AUTHOR: packageJson.author.name,
		APP_VERSION: packageJson.version,

		APP_THEME_COLOR: '#ffd700',
		APP_BACKGROUND_COLOR: '#0f56b3',

		APP_APPLE_ICON: 'icons/maskable/apple-icon-180.png',
		APP_SMALL_ICON: 'icons/transparent/manifest-icon-192.png',
		APP_SMALL_ICON_BG: 'icons/maskable/manifest-icon-192.png',
		APP_LARGE_ICON: 'icons/transparent/manifest-icon-512.png',
		APP_LARGE_ICON_BG: 'icons/maskable/manifest-icon-512.png',
		...loadEnv(mode, process.cwd(), 'APP_')
	};

	return {
		plugins: [
			chunkSplitPlugin({ strategy: 'unbundle' }),
			createHtmlPlugin({
				minify: true,
				inject: {
					data: env
				}
			}),
			vitePWA({
				registerType: 'prompt',
				minify: true,
				injectRegister: null,
				includeAssets: ['/icons/favicon.svg'],
				manifest: {
					id: '6508c44f-06e6-4471-be84-b70031f9f69d',
					name: env.APP_NAME,
					short_name: env.APP_SHORT_NAME,
					lang: 'en-US',
					description: env.APP_DESCRIPTION,
					categories: env.APP_KEYWORDS.split(', '),
					display: 'standalone',
					orientation: 'portrait',
					background_color: env.APP_BACKGROUND_COLOR,
					theme_color: env.APP_THEME_COLOR,
					icons: [
						{
							src: env.APP_SMALL_ICON,
							sizes: '192x192',
							type: 'image/png',
							purpose: 'any'
						},
						{
							src: env.APP_SMALL_ICON_BG,
							sizes: '192x192',
							type: 'image/png',
							purpose: 'maskable'
						},
						{
							src: env.APP_LARGE_ICON,
							sizes: '512x512',
							type: 'image/png',
							purpose: 'any'
						},
						{
							src: env.APP_LARGE_ICON_BG,
							sizes: '512x512',
							type: 'image/png',
							purpose: 'maskable'
						}
					]
				},
				workbox: {
					cleanupOutdatedCaches: true,
					clientsClaim: true,
					navigationPreload: false
				},
				devOptions: {
					enabled: true
				}
			})
		],
		envPrefix: 'APP_',
		envDir: '../',
		root: 'src',
		publicDir: '../public',
		assetsInclude: ['locales/*.json'],
		clearScreen: false,
		server: {
			https: sslOptions,
			open: false,
			cors: true,
			port: 5000
		},
		build: {
			minify: true,
			target: 'esnext',
			assetsInlineLimit: 0,
			emptyOutDir: true,
			outDir: '../dist',
			// TODO: check for support on removing preload as well
			polyfillModulePreload: true,
			rollupOptions: {
				output: {
					generatedCode: 'es5',
					inlineDynamicImports: false
				}
			}
		},
		preview: {
			https: sslOptions,
			open: true
		},
		test: {
			include: ['**/*.test.ts'],
			minThreads: 1,
			maxThreads: 4,
			passWithNoTests: true,
			maxConcurrency: 4,
			coverage: {
				functions: 75,
				branches: 75,
				lines: 75,
				statements: 75
			}
		}
	};
});
