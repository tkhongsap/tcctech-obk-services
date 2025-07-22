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
    'react-native-reanimated/plugin',
  ],
  env: {
    test: {
      plugins: [
        // Apply this plugin only when running tests
        ['@babel/plugin-transform-private-methods', { loose: true }],
        ['@babel/plugin-transform-class-properties', { loose: true }],
        ['@babel/plugin-transform-private-property-in-object', { loose: true }],
      ],
    },
  }
};
