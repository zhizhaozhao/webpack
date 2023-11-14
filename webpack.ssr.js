const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const glob = require('glob');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];

  const entryFiles = glob.sync(path.join(__dirname, './src/*/index-server.js'));
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index-server\.js/);
    const pageName = match && match[1];
    // if(pageName){

    // }
    entry[pageName] = entryFile;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`), // 模板位置
        filename: `${pageName}.html`, // 指定打包出的文件名称
        chunks: ['vendors', pageName], // 生产的html要使用哪些chunk
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        },
      })
    );
  });
  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();
console.log('entry, htmlWebpackPlugins ', entry, htmlWebpackPlugins);

module.exports = {
  // entry: { index: './src/index.js', search: './src/search.js' },
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-server.js',
    libraryTarget: 'umd',
  },
  mode: 'none',
  module: {
    // test: 指定匹配规则 use:指定使用的loader名称
    rules: [
      { test: /.js$/, use: 'babel-loader' },
      {
        test: /.css$/,
        use: ['style-loader', 'css-loader'],
      }, //链式调用，从有往左执行
      {
        test: /.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     plugins: () => [
          //       require('autoprefixer')({
          //         browsers: ['last 2 version', '>1%', 'ios7'],
          //       }),
          //     ],
          //   },
          // },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, //1rem是75px
              remPrecision: 8, //px转换成rem小数点的位数
            },
          },
        ],
      }, //链式调用，从有往左执行
      // { test: /.(png|jpg|gif|jpeg)$/, use: "file-loader" },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [{ loader: 'url-loader', options: { limit: 10240 } }],
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: { name: '[name][hash:8].[ext]' }, //ext文件后缀名
          },
        ],
      },

      { test: /.(woff|woff2|eot|ttf)$/, use: 'file-loader' },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name]_[contenthash:8].css`,
    }),
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
    }),
    //一个页面对应一个html-plugin
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, 'src/search.html'), // 模板位置
    //   filename: 'search.html', // 指定打包出的文件名称
    //   chunks: ['search'], // 生产的html要使用哪些chunk
    //   inject: true,
    //   minify: {
    //     html5: true,
    //     collapseWhitespace: true,
    //     preserveLineBreaks: false,
    //     minifyCSS: true,
    //     minifyJS: true,
    //     removeComments: false,
    //   },
    // }),
    new CleanWebpackPlugin(),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js',
    //       global: 'React',
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js',
    //       global: 'ReactDom',
    //     },
    //   ],
    // }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ].concat(htmlWebpackPlugins),
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'commons', //提取出文件的名字
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
  },
  devtool: 'inline-source-map',
};
