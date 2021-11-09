const path = require('path');
const CracoLessPlugin = require('craco-less');
const WebpackBar = require('webpackbar');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const {
  when,
  whenDev,
  whenProd,
  whenTest,
  ESLINT_MODES,
  POSTCSS_MODES,
} = require('@craco/craco');

const rewireEntries = [
  {
    name: 'share',
    entry: path.resolve(__dirname, './src/share.tsx'),
    // template: path.resolve(__dirname, './src/app/share.html'),
    outPath: 'share.html',
  },
];

const defaultEntryName = 'main';

const appIndexes = ['js', 'tsx', 'ts', 'jsx'].map(ext =>
  path.resolve(__dirname, `src/index.${ext}`),
);

module.exports = {
  babel: {
    plugins: ['babel-plugin-styled-components'],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#1B9AEE',
              '@success-color': '#15AD31',
              '@processing-color': '#1B9AEE',
              '@error-color': '#E62412',
              '@highlight-color': '#E62412',
              '@warning-color': '#FA8C15',
              '@text-color': '#212529',
              '@text-color-secondary': '#495057',
              '@heading-color': '#212529',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    alias: {},
    plugins: [new WebpackBar(), new MonacoWebpackPlugin({ languages: [''] })],
    configure: (webpackConfig, { env, paths }) => {
      // paths.appPath='public'
      // paths.appBuild = 'dist'; // 配合输出打包修改文件目录
      // webpackConfig中可以解构出你想要的参数比如mode、devtool、entry等等，更多信息请查看webpackConfig.json文件
      /**
       * 修改 output
       */
      webpackConfig.output = {
        ...webpackConfig.output,
        ...{
          filename: whenDev(() => 'static/js/bundle.js', 'static/js/[name].js'),
          chunkFilename: 'static/js/[name].[contenthash:8].js',
        },
        // path: path.resolve(__dirname, 'dist'), // 修改输出文件目录
        publicPath: '/',
      };
      /**
       * webpack split chunks
       */
      webpackConfig.optimization.splitChunks = {
        ...webpackConfig.optimization.splitChunks,
        ...{
          chunks: 'all',
          name: true,
        },
      };

      const defaultEntryHTMLPlugin = webpackConfig.plugins.filter(plugin => {
        return plugin.constructor.name === 'HtmlWebpackPlugin';
      })[0];
      defaultEntryHTMLPlugin.options.chunks = [defaultEntryName];

      // config.entry is not an array in Create React App 4
      if (!Array.isArray(webpackConfig.entry)) {
        webpackConfig.entry = [webpackConfig.entry];
      }

      // If there is only one entry file then it should not be necessary for the rest of the entries
      const necessaryEntry =
        webpackConfig.entry.length === 1
          ? []
          : webpackConfig.entry.filter(file => !appIndexes.includes(file));
      const multipleEntry = {};
      multipleEntry[defaultEntryName] = webpackConfig.entry;

      rewireEntries.forEach(entry => {
        multipleEntry[entry.name] = necessaryEntry.concat(entry.entry);
        // Multiple Entry HTML Plugin
        webpackConfig.plugins.unshift(
          new defaultEntryHTMLPlugin.constructor(
            Object.assign({}, defaultEntryHTMLPlugin.options, {
              filename: entry.outPath,
              // template: entry.template,
              chunks: [entry.name],
            }),
          ),
        );
      });
      webpackConfig.entry = multipleEntry;

      // Multiple Entry Output File
      let names = webpackConfig.output.filename.split('/').reverse();

      if (names[0].indexOf('[name]') === -1) {
        names[0] = '[name].' + names[0];
        webpackConfig.output.filename = names.reverse().join('/');
      }
      // 返回重写后的新配置
      return webpackConfig;
    },
  },

  devServer: {
    hot: true,
    proxy: {
      '/api/v1': {
        target: 'http://172.16.1.152:8080/',
      },
      '/resources': {
        target: 'http://172.16.1.152:8080/',
      },
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/index.html' },
        { from: /^\/share/, to: '/share.html' },
      ],
    },
  },
};
