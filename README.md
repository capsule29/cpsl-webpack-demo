# 基本

下载

```sh
npm install webpack webpack-cli --save-devpack
```

开发环境打包

```sh
npx webpack ./src/main.js --mode=development
```

生产环境打包，会把代码进行压缩

```sh
npx webpack ./src/main.js --mode=production
```

添加`webpack.config.js`后，使用`npx webpack`即可打包



# 通用？

## HTML自动导入插件

[`HtmlWebpackPlugin`](https://www.webpackjs.com/plugins/html-webpack-plugin/)



## 把CSS从JS中分离，优化闪屏现象

[`MiniCssExtractPlugin`](https://www.webpackjs.com/plugins/mini-css-extract-plugin)



##　`babel`：JS兼容性问题

ES6+ 编译成向下兼容的`js`



## CSS兼容性问题

[`postcss-loader`](https://www.webpackjs.com/loaders/postcss-loader/)



在`package.json`中可以设置需要兼容的浏览器版本

> ```json
> {
> 	"browserslist": [
>         "last 2 version",
>         "> 1%",
>         "not dead"
>     ]
> }
> ```



## 可以定义函数返回配置，以实现代码的复用

```js
function getCSSLoader(otherLoader){
    return [
        // 配置
    ,otherLoader].filter(Boolean)
}
```



## CSS压缩

[`css-minimizer-webpack-plugin`](https://www.webpackjs.com/plugins/css-minimizer-webpack-plugin/)



# 开发模式

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







## `eslint`

下载包

```sh
npm i eslint-webpack-plugin eslint -D
```

定义配置文件

`.eslintrc.js`或者其他后缀格式的

> `eslint`配置略



## 开发服务器自动化

`webpack-dev-server`

文件发生变化，自动变化

* 运行

  ```sh
  npx webpack serve
  ```

  

* 指定配置文件运行

  ```sh
  npx webpack --config <相对路径>
  ```

  



[文档](https://www.webpackjs.com/configuration/dev-server/)

> **注意运行指令发生了变化**
>
> 并且当你使用开发服务器时，**所有代码都会在内存中编译打包，并不会输出到 `dist` 目录下。**
>
> 开发时我们只关心代码能运行，有效果即可，至于代码被编译成什么样子，我们并不需要知道。



# 生产模式

## 打包前清空打包目录

```
output:{
    path: xxx,
    clean: true, // 在打包前将path的路径全部清空
}
```



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





