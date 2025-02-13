const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/js/main.js',
        home: './src/js/home.js',
        leadership: './src/js/leadership.js',
        "elementor-widgets-styles": "./src/scss/elementor-widgets-styles.scss",
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js',
        publicPath: "auto",
    },
    resolve: {
        alias: {
            // General Paths
            "@src": path.resolve(__dirname, "src"),

            // SCSS Aliases
            "@scss": path.resolve(__dirname, "src/scss"),
            "@abstracts": path.resolve(__dirname, "src/scss/abstracts"),
            "@base": path.resolve(__dirname, "src/scss/base"),
            "@utilities": path.resolve(__dirname, "src/scss/utilities"),
            "@widgets": path.resolve(__dirname, "src/scss/elementor-widgets"),

            // JavaScript Aliases
            "@js": path.resolve(__dirname, "src/js"),
            "@components": path.resolve(__dirname, "src/components"),
        },
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: { sourceMap: true }, // ✅ Enables source maps for debugging
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true, // ✅ Enables source maps
                            sassOptions: {
                                includePaths: [
                                    path.resolve(__dirname, "src/scss"),
                                    path.resolve(__dirname, 'src/scss/abstracts'),
                                    path.resolve(__dirname, 'src/scss/utilities'),
                                ], // ✅ Works with @use "@abstracts/variables";
                            },
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    optimization: {
        minimize: false, // Disable minification in development
        minimizer: [new TerserPlugin({
            terserOptions: {
                compress: false, // Disable compression in development
                mangle: false, // Disable mangling in development
            },
            parallel: true, // Enable parallel processing
            cache: true, // Enable caching
        })],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'css/[name].min.css' }),
        new webpack.HotModuleReplacementPlugin(), // Enable HMR
        new FriendlyErrorsWebpackPlugin(), // Friendly error messages
    ],
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        hot: true,
        port: 3000,
        open: true, // Automatically open the browser
        quiet: true, // Reduce the amount of output
    },
    devtool: 'eval-source-map', // Faster source maps for development
};