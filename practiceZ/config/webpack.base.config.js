const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, '..', './index.js'),
    output: {
        path: path.join(__dirname, '..', 'dist'),
        filename: 'webpack.bundle.js'
    },
    resolve: {
        alias: {
            '@': path.join(__dirname, '..')
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/transform-runtime']
                }
            }
        }]
    },
    devServer: {
        hot: true,
        inline: true,
        host: '0.0.0.0',
        port: '3500'
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({ template: path.join(__dirname, '..', 'index.html') })
    ]
}