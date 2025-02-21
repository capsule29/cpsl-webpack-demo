// node.js环境
const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

function getStyleLoader(otherLoader) {
    return [
        MiniCssExtractPlugin.loader,
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [["postcss-preset-env"]],
                },
            },
        },
        otherLoader,
    ].filter(Boolean);
}

module.exports = {
    // 入口
    entry: "./src/main.js", // 相对路径
    // 相对于指令运行时的路径，因此不需要更改路径
    // 输出
    output: {
        // 所有文件的输出路径
        // 因为__dirname是nodejs提供的本文件的所在路径，所以需要更改路径
        // path: path.resolve(__dirname, "../dist"), // 绝对路径
        path: undefined, // 因为有了devServer，因此开发模式下不需要输出打包文件
        // 入口文件的输出名
        filename: "static/js/main.js", // 入口文件输出到static/js目录下的main.js文件中
    },
    // 加载器
    module: {
        rules: [
            // loader配置
            // // 因为有了MiniCssExtractPlugin插件
            // {
            //     test: /\.css$/i,
            //     use: [
            //         "style-loader", //将js中的css，通过创建style标签添加到html中
            //         "css-loader" /*将css资源打包成CommonJS模块到js文件中 */,
            //     ], // 执行顺序从右向左（下到上）
            // },
            {
                test: /\.(png|jpe?g|gif|webp|svg)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        // 小于10kb的文件会被base64转换成字符串
                        // 优点：减少网页请求，缺点略微加大体积
                        maxSize: 10 * 1024, // 10kb
                    },
                },
                generator: {},
            },
            {
                test: /\.css$/i,
                use: getStyleLoader(), // 代码复用
            },
        ],
    },
    optimization: {
        minimizer: [
            // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
            // `...`,
            new CssMinimizerPlugin(), // CSS压缩
        ],
        minimize: true, // 生产环境下也压缩CSS
    },
    // 插件
    plugins: [
        new ESLintPlugin({
            context: path.resolve(__dirname, "../src"), // 要检查格式的文件夹
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html"),
            // 依照public下的index.html添加DOM模板，没有这个就是空
            // 新生成的html结构和原来的一致，但是会引入打包输出的资源
        }), // html自动导入插件    ./dist/index.html
        new MiniCssExtractPlugin({
            filename: "./dist/static/main",
        }), // 将css从js中剥离，优化闪屏现象
    ],
    // 开发服务器 webpack-dev-server 在内存编译，不进行打包输出
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", // 启动服务器端口号
        open: true, // 是否自动打开浏览器
    },
    devTool: {},
    // 环境
    mode: "development",
    devtool: "cheap-module-source-map", // source-map
};
