const {getDefaultConfig} = require('@react-native/metro-config');

// Get the default Metro configuration
const defaultConfig = getDefaultConfig(__dirname);

// Configure SVG handling
defaultConfig.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer',
);
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
  ext => ext !== 'svg',
);
defaultConfig.resolver.sourceExts.push('svg');

// Apply Sentry configuration
module.exports = defaultConfig;

// Configure the JavaScript minifier to preserve class and function names
module.exports.transformer = {
  ...defaultConfig.transformer,
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
};
