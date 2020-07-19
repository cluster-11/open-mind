const path = require("path");
const common = require("./webpack.common");
const merge = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "main.[contentHash].js",
    path: path.resolve(__dirname, "docs"),
  },
  optimization: {
    minimizer: [new OptimizeCssAssetsPlugin(), new TerserPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].[contentHash].css" }),
    new CleanWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, //3. Extract css into files
          "css-loader", //2. Turns css into commonjs
        ],
      },
    ],
  },
});
