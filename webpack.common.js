const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

 module.exports = {
    entry: "./src/app.ts",
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
    },
  
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({ title: "Ryuzeke", template: "src/index.html" }),
      new CopyPlugin({
        patterns: [
          {
            from: "./assets",
            to: "./assets",
          },
        ],
      }),
      new webpack.ProgressPlugin(),
    ],
  
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf|otf|mp3|ogg|mp4)$/,
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]",
            context: "public",
          },
        },
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.js$/,
          include: [path.resolve(__dirname, "src")],
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  modules: false,
                },
              ],
            ],
          },
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
 };