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
        filename: 'lusift.js',
        library: {
            name: 'lusift',
            type: 'umd'
        },
        path: path.resolve(__dirname, 'dev'),
        globalObject: 'this'
    },
};
