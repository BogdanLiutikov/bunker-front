const Path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    devtool: 'source-map',
    entry: './src/index.tsx',
    output: {
        publicPath: '/',
        path: Path.resolve(__dirname, 'build'),
        filename: 'scripts/[name].js',
        assetModuleFilename: 'assets/[hash][ext][query]',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.[tj]sx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|webp|svg)$/i,
                type: 'asset/resource',
            },
        ],
    },
};