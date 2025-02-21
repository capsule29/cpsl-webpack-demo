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



##　[`babel`](https://www.webpackjs.com/loaders/babel-loader/):JS兼容性问题

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





# 高级

## 提升代码体验

### [`sourceMap`](https://www.webpackjs.com/configuration/devtool/)

开发时（内存中编译）的报错提示错误位置

实际开发时我们只需要关注两种情况即可：

- 开发模式：`cheap-module-source-map`
  - 优点：打包编译速度快，只包含行映射
  - 缺点：没有列映射

```javascript
module.exports = {
  // 其他省略
  mode: "development",
  devtool: "cheap-module-source-map",
};
```

- 生产模式：`source-map`
  - 优点：包含行/列映射
  - 缺点：打包编译速度更慢

```javascript
module.exports = {
  // 其他省略
  mode: "production",
  devtool: "source-map",
};
```



## 提升打包速度

### [`OneOf`](https://www.webpackjs.com/configuration/module/#ruleoneof)

> 当规则匹配时，只使用第一个匹配规则。

处理每一个类型的文件时会遍历所有loader看是不是和自己的类型匹配，但很多情况下只有一个loader匹配，这样效率就会很低。

因此被`oneof`包裹的loader，文件类型匹配到了就不再匹配，（相当于break）



### `include`,`exclude`

[文档](https://www.webpackjs.com/configuration/module/#ruleexclude)

排除例如`node_module`已经编译好的代码，防止重复编译

```
// exclude: /node_modules/, // 排除node_modules代码不编译
include: path.resolve(__dirname, "../src"), // 也可以用包含
```



###　`Eslint`和`babel`缓存cache

* `babel`

  [文档](https://www.webpackjs.com/loaders/babel-loader/#options)

  ```json
  module: {
      rules: [ 
  		{
              test: /\.js$/,
              include: path.resolve(__dirname, "../src"),
              loader: "babel-loader",
              // here
              options: {
                cacheDirectory: true, // 开启babel编译缓存
                cacheCompression: false, // 缓存文件不要压缩
              },
          },
      ]
  }
  ```

  

* `Eslint`

  [`ESlint`相关文档](https://eslint.org/docs/latest/integrate/nodejs-api#-new-eslintoptions)

  ```json
  plugins: [
      new ESLintWebpackPlugin({
        context: path.resolve(__dirname, "../src"),
        //here
        cache: true, // 开启缓存
        // 缓存目录
        cacheLocation: path.resolve(
          __dirname,
          "../node_modules/.cache/.eslintcache"
        ),
      })
  ]
  ```



### 多进程打包

[尚硅谷相关内容](https://yk2012.github.io/sgg_webpack5/senior/liftingSpeed.html#thead)



## 减少代码体积

### Tree shaking

webpack自带

> Tree shaking 通常用于描述移除 JavaScript 中的没有使用上的代码。

> 必须依赖`ESModule`



### 减少`Babel`生成的文件体积

`@babel/plugin-transform-runtime`

* 为什么

> Babel 为编译的每个文件都插入了辅助代码，使代码体积过大！
>
> Babel 对一些公共方法使用了非常小的辅助代码，比如 `_extend`。默认情况下会被添加到每一个需要它的文件中。
>
> 你可以将这些辅助代码作为一个独立模块，来避免重复引入。

* 是什么

> `@babel/plugin-transform-runtime`: 禁用了 Babel 自动对每个文件的 runtime 注入，
>
> 而是引入 `@babel/plugin-transform-runtime` 并且使所有辅助代码从这里引用。



### `image minimizer`

`image-minimizer-webpack-plugin`

* 为什么

  > 开发如果项目中引用了较多图片，那么图片体积会比较大，将来请求速度比较慢。
  >
  > 我们可以对图片进行压缩，减少图片体积。
  >
  > **注意：如果项目中图片都是在线链接，那么就不需要了。本地项目静态图片才需要进行压缩。**

* 是什么

  `image-minimizer-webpack-plugin`压缩图片的插件



## 优化代码运行性能

### Code Split

按需加载`Js`文件

[尚硅谷](https://yk2012.github.io/sgg_webpack5/senior/optimizePerformance.html#code-split)

1. 
2. 2
3. 3
4. 4
5. 5



### Preload / Prefetch

* 为什么

  > 我们前面已经做了代码分割，同时会使用 import 动态导入语法来进行代码按需加载（我们也叫懒加载，比如路由懒加载就是这样实现的）。
  >
  > 但是加载速度还不够好，比如：是用户点击按钮时才加载这个资源的，如果资源体积很大，那么用户会感觉到明显卡顿效果。
  >
  > 我们想在浏览器空闲时间，加载后续需要使用的资源。我们就需要用上 `Preload` 或 `Prefetch` 技术。

* 是什么

  > - `Preload`：告诉浏览器立即加载资源。
  > - `Prefetch`：告诉浏览器在空闲时才开始加载资源。
  >
  > 它们共同点：
  >
  > - 都只会加载资源，并不执行。
  > - 都有缓存。
  >
  > 它们区别：
  >
  > - `Preload`加载优先级高，`Prefetch`加载优先级低。
  > - `Preload`只能加载当前页面需要使用的资源，`Prefetch`可以加载当前页面资源，也可以加载下一个页面需要使用的资源。
  >
  > 总结：
  >
  > - 当前页面优先级高的资源用 `Preload` 加载。
  > - 下一个页面需要使用的资源用 `Prefetch` 加载。
  >
  > 它们的问题：兼容性较差。
  >
  > - 我们可以去 [Can I Use open in new window](https://caniuse.com/) 网站查询 API 的兼容性问题。
  > - `Preload` 相对于 `Prefetch` 兼容性好一点。



### Network Cache

* 为什么

  > 将来开发时我们对静态资源会使用缓存来优化，这样浏览器第二次请求资源就能读取缓存了，速度很快。
  >
  > 但是这样的话就会有一个问题, 因为前后输出的文件名是一样的，都叫 main.js，一旦将来发布新版本，因为文件名没有变化导致浏览器会直接读取缓存，不会加载新资源，项目也就没法更新了。
  >
  > 所以我们从文件名入手，确保更新前后文件名不一样，这样就可以做缓存了。

* 是什么

  > 它们都会生成一个唯一的 hash 值。
  >
  > - `fullhash`（webpack4 是 hash）
  >
  > 每次修改任何一个文件，所有文件名的 hash 至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效。
  >
  > - `chunkhash`
  >
  > 根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。我们 js 和 css 是同一个引入，会共享一个 hash 值。
  >
  > - `contenthash`
  >
  > 根据文件内容生成 hash 值，只有文件内容变化了，hash 值才会变化。所有文件 hash 值是独享且不同的。



### `Core-js`

* 为什么

  >过去我们使用 babel 对 `js` 代码进行了兼容性处理，其中使用@babel/preset-env 智能预设来处理兼容性问题。
  >
  >它能将 ES6 的一些语法进行编译转换，比如箭头函数、点点点运算符等。但是如果是 async 函数、promise 对象、数组的一些方法（includes）等，它没办法处理。
  >
  >所以此时我们 `js` 代码仍然存在兼容性问题，一旦遇到低版本浏览器会直接报错。所以我们想要将 js 兼容性问题彻底解决

* 是什么

  > `core-js` 是专门用来做 ES6 以及以上 API 的 `polyfill`。
  >
  > `polyfill`翻译过来叫做垫片/补丁。就是用社区上提供的一段代码，让我们在不兼容某些新特性的浏览器上，使用该新特性。



### WPA

* 为什么

  > 开发 Web App 项目，项目一旦处于网络离线情况，就没法访问了。
  >
  > 我们希望给项目提供离线体验。

* 是什么

  > 渐进式网络应用程序(progressive web application - PWA)：是一种可以提供类似于 native app(原生应用程序) 体验的 Web App 的技术。
  >
  > 其中最重要的是，在 **离线(offline)** 时应用程序能够继续运行功能。
  >
  > 内部通过 Service Workers 技术实现的。
