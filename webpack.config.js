// dev mode watches and compiles on the fly
// production mode compiles once and then serves the files
//
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";
const path = require('path');

// TODO npm run start or build doesn't pass if there's a type error
// TODO split into base, development, and production

let config = {
    entry: './src/index.ts',
    mode: devMode ? 'development' : 'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    // devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.ts$/,
                use: ['ts-loader'],
                exclude: /node_modules/
            },
        ],
    },
    resolve: {
        extensions: ['', '.ts', '.js', '.css']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        libraryTarget: 'commonjs2'
    },
};

if (devMode) {
    console.log('****************dev mode****************');
    console.log(process.env.NODE_ENV);
    config = {
        ...config,
        devtool: 'eval-source-map',
        devServer: {
            static: './build',
        },
        optimization: {
            /* removeAvailableModules: false,
            removeEmptyChunks: false,
            splitChunks: false,
            runtimeChunk: true */
        },
    }
}

module.exports = config;
