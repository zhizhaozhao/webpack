const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];

  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index\.js/);
    const pageName = match && match[1];
    entry[pageName] = entryFile;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`), // 模板位置
        filename: `${pageName}.html`, // 指定打包出的文件名称
        chunks: [pageName], // 生产的html要使用哪些chunk
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

module.exports = {
  // entry: { index: './src/index.js', search: './src/search.js' },
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name][chunkhash:8].js',
  },
  mode: 'development',
  module: {
    // test: 指定匹配规则 use:指定使用的loader名称
    rules: [
      { test: /.js$/, use: 'babel-loader' },
      { test: /.css$/, use: ['style-loader', 'css-loader'] }, //链式调用，从有往左执行
      { test: /.less$/, use: ['style-loader', 'css-loader', 'less-loader'] }, //链式调用，从有往左执行
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
            options: { name: 'img/[name][hash:8].[ext]' }, //ext文件后缀名
          },
        ],
      },

      { test: /.(woff|woff2|eot|ttf)$/, use: 'file-loader' },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
  ].concat(htmlWebpackPlugins),
  // plugins: [new MiniCssExtractPlugin({
  //   filename:`[name][contenthash:8].css`
  // })],

  devServer: {
    contentBase: './dist',
    hot: true,
  },

  // 默认false
  // watch: true,
  // watchOptions: {
  //   // 默认为空，设置不监听的文件或者文件夹
  //   ignored: /node_modules/,
  //   // 监听到变化发生后会等300ms再去执行，默认300ms
  //   aggregateTimeout: 300,
  //   // 判断文件是否发生变化事通过不停询问系统指定文件有没有变化实现的，默认每秒询问1000次
  //   poll: 1000,
  // },
};
