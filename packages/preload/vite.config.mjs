import {join} from 'node:path';
import {preload} from 'unplugin-auto-expose';
import {chrome} from '../../.electron-vendors.cache.json';
import {injectAppVersion} from '../../version/inject-app-version-plugin.mjs';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  // Sandboxed preload scripts may only require Electron and a small set of
  // Node built-ins. Bundle all application dependencies into this one file.
  ssr: {
    noExternal: true,
    target: 'webworker',
  },
  build: {
    ssr: true,
    sourcemap: 'inline',
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['electron'],
      output: {
        entryFileNames: '[name].cjs',
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  plugins: [preload.vite(), injectAppVersion()],
};

export default config;
