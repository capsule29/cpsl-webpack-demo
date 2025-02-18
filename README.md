# Webpack

下载

```sh
npm install webpack webpack-cli --save-devpack
```

生产环境打包

```sh
npx webpack ./src/main.js --mode=development
```

生产环境打包，会把代码进行压缩

```sh
npx webpack ./src/main.js --mode=production
```

添加`webpack.config.js`后，使用`npx webpack`即可打包

查看官网，安装 `style-loader`,`css loader`,`less`,`less-loader`

```sh
npm install --save-dev style-loader
npm install --save-dev css-loader
npm install less less-loader --save-dev
```

小图片（5kb）可以用 base64 编码转换成字符串，虽然体积会大一些，但是请求数量会少

> [通用资源类型](https://www.webpackjs.com/guides/asset-modules/#general-asset-type)
>
> ```
> module: {
>    rules: [
>         {
>            test: /\.(png|jpe?g|gif|webp|sbg)$/,
>            type: 'asset',
>           parser: {
>             dataUrlCondition: {
>               maxSize: 10 * 1024 // 10kb
>             }
>           }
>         }
>      ]
>   },
> ```

> `type: "asset/resource"`和`type: "asset"`的区别：
>
> 1. `type: "asset/resource"` 相当于`file-loader`, 将文件转化成 Webpack 能识别的资源，其他不做处理
> 2. `type: "asset"` 相当于`url-loader`, 将文件转化成 Webpack 能识别的资源，同时小于某个大小的资源会处理成 data URI 形式

## 修改输出路径

`js`

```
// 输出
    output: {
        // 所有文件的输出路径
        path: path.resolve(__dirname, "dist"), // 绝对路径
        // 入口文件的输出名
        filename: "static/js/main.js", // 入口文件输出到static/js目录下的main.js文件中
    },
```

图片

```
module: {
    rules: [
      {
        test: /\.png/,
        type: 'asset/resource'
     }
     },
     {
       test: /\.html/,
       type: 'asset/resource',
       generator: {
         filename: 'static/images/[hash][ext][query]'
        // hash 唯一id：[hash:10] 哈希值只取前十位
        // ext 后缀名
        // query 额外的请求参数
       }
     }
    ]
  },
```

## 打包前清空打包目录

```
output:{
    path: xxx,
    clean: true, // 在打包前将path的路径全部清空
}
```

## `eslint`

下载包

```sh
npm i eslint-webpack-plugin eslint -D
```

定义配置文件

`.eslintrc.js`或者其他后缀格式的
