const webpack = require('webpack')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const modoDev = process.env.NODE_ENV !== 'production'
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizedCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: modoDev ? 'development' : 'production',
    entry: './src/js/principal.js',
    output: {
        filename: 'main.js',
        path: __dirname + '/public'
    },
    devServer: { 
        contentBase: './public',
        port: 9000

    },    
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true
            }),
            new OptimizedCssAssetsPlugin({})
        ]
    },
    plugins: [
        new MiniCSSExtractPlugin({
            filename: 'estilo.css'
        }),
        new Dotenv()

    ],
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                MiniCSSExtractPlugin.loader,
                'css-loader'
            ]
        },{
            test: /\.(ico|svg|jpg|png|gif)$/,
            use: ['file-loader']


        }]
    }
}