module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'babel-plugin-root-import',
      {
        rootPathPrefix: '~',
        rootPathSuffix: 'src',
      },
    ],
    'nativewind/babel',
    [
      '@babel/plugin-transform-class-properties',
      {loose: true}, // Ensure loose mode is set to true
    ],
    [
      '@babel/plugin-transform-private-methods',
      {loose: true}, // Ensure loose mode is set to true
    ],
    [
      '@babel/plugin-transform-private-property-in-object',
      {loose: true}, // Ensure loose mode is set to true
    ],
    'react-native-reanimated/plugin',
  ],
};
