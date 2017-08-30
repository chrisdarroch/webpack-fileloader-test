const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const InspectorPlugin = require('./inspector-plugin');

const FRONTEND_SRC_DIR = path.join(__dirname, 'src');
const OUTPUT_DIR = path.join(__dirname, 'dist');

module.exports = {
    entry: {
        'feature-one': path.join(FRONTEND_SRC_DIR, 'feature-one.js'),
        'feature-two': path.join(FRONTEND_SRC_DIR, 'feature-two.js')
    },
    module: {
        rules: [
            {
                test: /\.(css)$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }
                }),
            },
            {
                test: /\.(png|svg)$/,
                loader: "file-loader",
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin("[name].css"),
        new InspectorPlugin(),
    ],
    output: {
        filename: '[name].js',
        path: OUTPUT_DIR
    }
};
