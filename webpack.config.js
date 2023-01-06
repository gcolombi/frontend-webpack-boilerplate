/**
 * Webpack main configuration file
 * https://webpack.js.org/
 */
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const environment = require('./configuration/webpack.environment');

const templateFiles = fs.readdirSync(path.resolve(__dirname, environment.paths.source, 'templates'));
const htmlPluginEntries = templateFiles.map((template) => new HTMLWebpackPlugin({
    filename: template,
	template: path.resolve(environment.paths.source, 'templates', template),
	inject: false,
	hash: false
}));

const modules = glob.sync(path.resolve(environment.paths.source, 'assets/scripts/modules', '**/*.js')).reduce((prev, curr) => Object.assign(prev, {
    [path.basename(curr, '.js')]: curr
}), {});

module.exports = {
    entry: {
        app: [path.resolve(environment.paths.source, 'assets/scripts', 'app.js'), path.resolve(environment.paths.source, 'assets/styles', 'style.scss')],
        ...modules
    },
    output: {
        path: environment.paths.output,
        filename: 'assets/[name].js'
    },
    module: {
        rules: [{
                test: /\.((c|sa|sc)ss)$/i,
                use: [
                    MiniCssExtractPlugin.loader, 
                    'css-loader', 
                    'postcss-loader', 
                    'sass-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: environment.limits.images
                    },
                },
                generator: {
                    filename: 'assets/images/[name].[hash:6][ext]'
                }
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: environment.limits.fonts,
                    },
                },
                generator: {
                    filename: 'assets/fonts/[name].[hash:6][ext]'
                }
            },
        ],
    },
    optimization: {
        minimizer: [
            '...',
            new ImageMinimizerPlugin({
                deleteOriginalAssets: false,
                exclude: /\/favicons|svg/,
                generator: [
                    {
                        type:'asset',
                        implementation: ImageMinimizerPlugin.imageminGenerate,
                        options: {
                            plugins: ['imagemin-webp'],
                        },
                        filename: 'assets/images/webp/[name][ext]'
                        /* If you just want to make webp of some images, you can use a filter */
                        /*
                            filter: (source, sourcePath) => {
                                return true;
                            },
                        */
                    }
                ],
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        /* Lossless optimization with custom option */
                        /* Feel free to experiment with options for better result for you */
                        plugins: [
                            ['gifsicle', { interlaced: true }],
                            ['jpegtran', { progressive: true }],
                            ['optipng', { optimizationLevel: 5 }],
                            /* Svgo configuration */
                            /* https://github.com/svg/svgo#configuration */
                            [
                                'svgo',
                                {
                                    plugins: [
                                        {
                                            name: 'removeViewBox',
                                            active: false,
                                        }, 
                                    ],
                                },
                            ],
                        ],
                    },
                },
            })
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'assets/[name].css',
        }),
        new CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json']
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(environment.paths.source, 'assets', 'images'),
					to: path.resolve(environment.paths.output, 'assets', 'images'),
                    toType: 'dir',
                    globOptions: {
                        ignore: ['*.DS_Store', 'Thumbs.db']
                    }
                }
            ],
        }),
    ].concat(htmlPluginEntries),
    target: 'web'
};