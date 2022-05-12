const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'app.js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /\/node_modules\//,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.(scss|css)$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
        }, ]
    }
}