const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin"); //壓縮css
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); //清除檔案資料
module.exports = {
  /*build: {
    assetsPublicPath: "/dist/",
    assetsSubDirectory: "/dist/",
  },*/
  resolve: {
    //擴展路徑別名
    alias: {
      "@fonts": path.resolve(__dirname, "./src/fonts/"),
      "@img": path.resolve(__dirname, "./src/img/"),
      "@css": path.resolve(__dirname, "./src/css/"),
      "@js": path.resolve(__dirname, "./src/js/"),
      "@src": path.resolve(__dirname, "./src/"),
      "@vue": path.resolve(__dirname, "./src/vue/"),
      //vue: "vue/dist/vue.esm.js",
    },
    //擴展副檔名
    extensions: [".js", ".json", ".vue"],
  },
  entry: {
    //main: "./src/js/index.js",
    "./1.flowGraph/js/main": "./src/1.flowGraph/index.js",
    "./2.litegraph/js/main": "./src/2.litegraph/index.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist/"),
    //publicPath: "/assets/",
    filename: "[name].[hash].js",
  },
  devServer: {
    contentBase: path.join(__dirname, "/"),
    compress: true,
    port: 9001,
    inline: true,
  },
  module: {
    rules: [
      //glsl
      {
        test: /\.(glsl|vs|fs)$/,
        loader: "webpack-glsl-loader",
      },
      //vue元件載入器
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      //css提取
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          "css-loader",
        ],
      },
      //sass scss
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      //圖檔載入器
      {
        test: /\.(png|jpg|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
              outputPath: "img/",
              publicPath: "../img",
            },
          },
        ],
      },
      //聲音載入器
      {
        test: /\.(mp3|wav|mpe?g|ogg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
              outputPath: "audios/",
              publicPath: "../audios",
            },
          },
        ],
      },
      /*{
        test: /\.(woff|woff2|eot|ttf|otf|png|svg|jpg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 1000, //bytes
            name: "[hash:7].[ext]",
            outputPath: "assets",
          },
        },
      },*/
      //字型載入器
      {
        test: /\.(woff|woff2|eot|ttf|otf|ttc)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
              outputPath: "fonts/",
              publicPath: "../fonts",
            },
          },
        ],
      },
      //html
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      //js轉舊
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [["@babel/plugin-transform-runtime"]],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      //cleanOnceBeforeBuildPatterns: ["./js/*", "./css/*", "./fonts/*", "./index,html"],
      cleanOnceBeforeBuildPatterns: ["./*"],
    }),
    new MiniCssExtractPlugin({ filename: "css/[name].[hash].css" }),
    new HtmlWebpackPlugin({
      title: "視覺語言系統",
      template: "./src/index.html",
      filename: "index.html",
      hash: true,
      chunks: [],
    }),
    new HtmlWebpackPlugin({
      title: "1.flowGraph",
      template: "./src/1.flowGraph/index.html",
      filename: "1.flowGraph/index.html",
      hash: true,
      chunks: ["./1.flowGraph/js/main"],
    }),
    new HtmlWebpackPlugin({
      title: "2.litegraph",
      template: "./src/2.litegraph/index.html",
      filename: "2.litegraph/index.html",
      hash: true,
      chunks: ["./2.litegraph/js/main"],
    }),
    new OptimizeCssAssetsWebpackPlugin(),
  ],
};
