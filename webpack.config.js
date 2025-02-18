// node.js环境
const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
    // 入口
    entry: "./src/main.js", // 相对路径
    // 输出
    output: {
        // 所有文件的输出路径
        path: path.resolve(__dirname, "dist"), // 绝对路径
        // 入口文件的输出名
        filename: "static/js/main.js", // 入口文件输出到static/js目录下的main.js文件中
    },
    // 加载器
    module: {
        rules: [
            // loader配置
            {
                test: /\.css$/i,
                use: [
                    "style-loader", //将js中的css，通过创建style标签添加到html中
                    "css-loader" /*将css资源打包成CommonJS模块到js文件中 */,
                ], // 执行顺序从右向左（下到上）
            },
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
        ],
    },
    // 插件
    plugins: [
        new ESLintPlugin({
            context: path.resolve(__dirname, "src"),
        }),
    ],
    // 环境
    mode: "development",
};
