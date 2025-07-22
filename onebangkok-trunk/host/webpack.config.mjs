import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import * as Repack from '@callstack/repack';

export default env => {
  const {
    mode = 'development',
    context = Repack.getDirname(import.meta.url),
    entry = './index.js',
    platform = process.env.PLATFORM,
    minimize = mode === 'production',
    devServer = undefined,
    bundleFilename = undefined,
    sourceMapFilename = undefined,
    assetsPath = undefined,
    reactNativePath = new URL('./node_modules/react-native', import.meta.url)
      .pathname,
  } = env;
  const dirname = Repack.getDirname(import.meta.url);

  if (!platform) {
    throw new Error('Missing platform');
  }

  process.env.BABEL_ENV = mode;

  return {
    mode,
    devtool: false,
    context,
    entry: [
      ...Repack.getInitializationEntries(reactNativePath, {
        hmr: devServer && devServer.hmr,
      }),
      entry,
    ],
    resolve: {
      ...Repack.getResolveOptions(platform),
      alias: {
        // '@sentry/react-native': path.resolve(
        //   dirname,
        //   'node_modules/@sentry/react-native',
        // ),
        // '@sentry/integrations': path.resolve(
        //   dirname,
        //   'node_modules/@sentry/integrations',
        // ),
        // localforage: path.resolve(dirname, 'node_modules/localforage'),
        //   'ob-iam-sdk': path.join(dirname, 'node_modules/ob-iam-sdk'),
        //   'ob-bus-sdk': path.join(dirname, 'node_modules/ob-bus-sdk'),
        //   'ob-document-sdk': path.join(dirname, 'node_modules/ob-document-sdk'),
        //   'ob-notification-sdk': path.join(
        //     dirname,
        //     'node_modules/ob-notification-sdk',
        //   ),
        //   'ob-bms-sdk': path.join(dirname, 'node_modules/ob-bms-sdk'),
        // 'react-native': reactNativePath,
        //   'expo-constants': path.join(dirname, 'mock/expo-constants.json'),
        //   nativewind: path.join(dirname, 'node_modules/nativewind'),
        //   axios: path.join(dirname, 'node_modules/axios'),
        //   semver: path.join(dirname, 'node_modules/semver'),
        //   nanoid: path.join(dirname, 'node_modules/nanoid'),
        //   superstruct: path.join(dirname, 'node_modules/superstruct'),
        //   'lottie-react-native': path.join(
        //     dirname,
        //     'node_modules/lottie-react-native',
        //   ),
        'react-native-reanimated': path.resolve(
          dirname,
          'node_modules/react-native-reanimated',
        ),
        //   'react-native-quick-actions': path.join(
        //     dirname,
        //     'node_modules/react-native-quick-actions',
        //   ),
      },
    },
    // ignoreWarnings: [
    //   {
    //     module: /localforage/,
    //     message: /Cannot statically analyse 'require\(.*\)/,
    //   },
    // ],
    // externals: {
    //   localforage: 'localforage',
    // },
    output: {
      clean: true,
      hashFunction: 'xxhash64',
      path: path.join(dirname, 'build/generated', platform),
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
      publicPath: Repack.getPublicPath({platform, devServer}),
    },
    optimization: {
      minimize,
      minimizer: [
        new TerserPlugin({
          test: /\.(js)?bundle(\?.*)?$/i,
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
      chunkIds: 'named',
    },
    module: {
      rules: [
        {
          test: /\.[cm]?[jt]sx?$/,
          include: [
            // Include all node_modules except localforage
            /node_modules(?!\/localforage)/,
          ],
          use: 'babel-loader',
          type: 'javascript/dynamic',
        },
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins:
                devServer && devServer.hmr
                  ? ['module:react-refresh/babel']
                  : undefined,
            },
          },
        },
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
          type: 'javascript/dynamic',
        },
        {
          test: /\.(js|jsx)$/, // Matches .js and .jsx files
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['@babel/plugin-transform-runtime'],
            },
          },
        },
        {
          test: /\.lottie$/,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'react-native-svg-loader',
            },
          ],
        },
        {
          test: Repack.getAssetExtensionsRegExp(
            Repack.ASSET_EXTENSIONS.filter(ext => ext !== 'svg'),
          ),
          use: {
            loader: '@callstack/repack/assets-loader',
            options: {
              platform,
              devServerEnabled: Boolean(devServer),
              scalableAssetExtensions: Repack.SCALABLE_ASSETS,
            },
          },
        },
      ],
    },
    plugins: [
      new Repack.RepackPlugin({
        context,
        mode,
        platform,
        devServer,
        output: {
          bundleFilename,
          sourceMapFilename,
          assetsPath,
        },
      }),

      new Repack.plugins.ModuleFederationPlugin({
        name: 'host',
        exposes: {
          './Text': './src/components/atoms/Text.tsx',
        },
        shared: {
          react: {
            ...Repack.Federated.SHARED_REACT,
            requiredVersion: '18.2.0',
          },
          'react-native': {
            ...Repack.Federated.SHARED_REACT_NATIVE,
            requiredVersion: '0.72.4',
          },
        },
      }),
    ],
  };
};
