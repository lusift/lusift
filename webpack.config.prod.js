const path = require('path');

module.exports = {
    entry: './src/index.ts',
    mode: 'production',
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
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        libraryTarget: 'commonjs2'
    },
};
