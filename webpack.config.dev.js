const path = require('path');

module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
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
    devtool: 'eval-source-map',
    devServer: {
        static: './dev',
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dev'),
        libraryTarget: 'commonjs2'
    },
};
