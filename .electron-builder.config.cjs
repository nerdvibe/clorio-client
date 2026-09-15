/**
 * TODO: Rewrite this config to ESM
 * But currently electron-builder doesn't support ESM configs
 * @see https://github.com/develar/read-config-file/issues/10
 */

/**
 * @type {() => import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = async function () {
  const {
    getVersion
  } = await import('./version/getVersion.mjs');

  return {
    appId: 'io.clor',
    protocols: {
      name: "Clorio Wallet",
      schemes: ["mina"]
    },
    directories: {
      output: 'dist',
      buildResources: 'buildResources',
    },
    files: ['packages/**/dist/**'],
    extraMetadata: {
      version: getVersion(),
    },
    productName: "Clorio Wallet",
    mac: {
      icon: 'buildResources/icon.icns',
      category: 'public.app-category.utilities',
      artifactName: '${productName}-${version}-mac-${arch}.${ext}',
      target: ['dmg'],
    },
    linux: {
      executableName: 'clorio-wallet',
      category: 'Utility',
      artifactName: '${productName}-${version}-linux-${arch}.${ext}',
      target: [
        { target: "deb" },
        { target: "AppImage" },
      ]
    },
    deb: {
      afterInstall: 'buildResources/linux/after-install.tpl',
      afterRemove: 'buildResources/linux/after-remove.tpl',
    },
    dmg: {
      contents: [
        { x: 340, y: 270, type: 'file' },
        { x: 560, y: 270, type: 'link', path: '/Applications' },
      ],
    },
  };
};
