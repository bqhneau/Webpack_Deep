## 概述
```
    1、模块化演变过程
    2、模块化规划
    3、常用的模块化打包工具
    4、基于模块化工具构建现代Web应用
    5、打包工具的优化技巧
```

## 模块化演变过程
- stage1:文件划分方式
  - 污染全局作用域
  - 命名冲突
  - 无法管理依赖关系
- stage2:命名空间方式
    包裹为全局对象，为模块添加「匿名空间」
  - 减少命名冲突
  - 没有私有空间
  - 无法管理依赖关系
- stage3:立即执行函数
  - 可以解决私有空间
  - 能够管理依赖关系


## 模块化规范
### CommonJS 
- 一个文件就是一个模块
- 每个模块都有单独的作用域
- `moudle.exports` 导出
- `require` 导入

> 存在的问题：
> **同步加载模块** 在浏览器中存在问题 => AMD


### AMD(Asynchronous Module Definition) -- 中间的一步
// require.js 这个库
```js
// 定义一个模块
// 参数：模块名 依赖项 函数（参数与依赖项一一对应）
define('modules',['jquery','./module2'],function($,module2)){
    return {
        start:function(){
            $('body').animate({marigin:'200px'})
            module2()
        }
    }
}
```

> 缺点：
> - 使用复杂
> - js请求次数多，浪费性能

### 最佳实践
```
    1、浏览器 => ES Moudle
    2、node环境 => CommonJS
```

## ES module 特性
```js
    <script type='module'>
        console.log('this is ES module')
    </script>
```

- 1、自动采用严格模式 'use strict'
```js
<script type='module'>
    console.log(this)   // undefined
</script>
```

- 2、每个 ES module 都是运行在单独的「私有作用域」
```js
<script type='module'>
    const a = 100;
    console.log(a)  // 100
</script>
<script type='module'>
    console.log(a)  // 报错
</script>
```

- 3、ESM 通过 `CORS` 请求外部 `JS` 模块
```js
<script type='module' src='https://jquery@3.4.1/dist/jquery.min.js'>
</script>
```

- 4、ESM 的 script **会延迟执行脚本**  => defer


## ES module 的导入和导出
- 单独暴露和导入
```js
// 导出
export var name = 'zhangsan'
export function hello(){
    console.log('hello')
}
// 导出方式2（重命名）
export {
    name as foo, 
    hello
    } 

// 导入
import {name, hello} from './wenjian'
```

- 默认暴露和导入
```js
// 导出
export default name = 'zhangsan'

// 导入
import xxx from './wenjian'  //名字随便起
```

## ES module 导入导出注意事项
— 1、导入和导出为固定用法，而非对象字面量的简写
```js
var name = 'zhangsan'
var age = 18

export {name, age}   // 固定语法 非导出对象
export default {name, age}  // 这种写法为「导出对象」


import {name, age} from './wenjian' //固定语法 非解构（对应128）
```

- 2、导出时，导出的为「引用值」，而非「复制」
```js
// a.js
var name = 'jack'
var age = 18
export {name, age}
setTimeout(()=>{
    name = 'ben'
},1000)

// b.js
import {name, age} from './a.js'
console.log(name,age);  // jack 18
setTimeout(()=>{
    console.log(name,age);  // ben 18
},1000)
```

- 3、暴露的引用值「只可读」
```js
var name = 'jack'
var age = 18
export {name, age}

// b.js
import {name, age} from './a.js'
name = 'ben' // Uncaugt TypeError:Assignment to constant
```


## import 用法详细
- 1、导入时，要引入「完整路径」
- 2、只加载不提取模块
```js
    import { } from  './a.js'
    import './a.js'
```
- 3、导出模块的全部成员
```js
    import * as mod from './a.js'
    console.log(mod)
```
- 4、动态导入模块
    - import() 括号的形式导入
    - 返回一个 promise 对象
```js
    import ('./webpack-demo').then((module)=>{console.log(module)})
```

## 模块打包工具由来
- 1、浏览器兼容性问题
- 2、模块文件多，网络请求频繁
- 3、处理非 JavaScript 资源的能力有限

> 设想：
> 1、能够编译代码 => 解决兼容性问题
> 2、将散落的文件打包到一起 => 解决网络请求频繁
> 3、多类型模块支持 => 解决处理非 JavaScript 资源的能力有限


## 模块打包工具-概要
    对整个前端的模块化
- 1、模块打包器
- 2、模块加载器
- 3、代码拆分（Code Spliting）
- 4、资源模块（支持多类型文件）


## webpack 快速上手
- 1、下载依赖 
```bash
    npm install -g serve
    npm install webpack webpack-cli
```
- 2、配置打包脚本
```bash
"scripts": {
    "build": "webpack"
}
```
- 3、使用命令行打包
```bash
    npm run build
```


## webpack 入口和出口
```js
module.exports = {
  // 指定入口
  entry: './src/main.js',

  // 指定出口
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'output')
  }
}
```

## webpack 工作模式
    不配置默认为「生产模式；通过 mode 配置
- mode：production  => 生产模式
- mode：development => 开发模式
- mode：none => 原始模式


## webpack 打包结果运行原理

## 处理 CSS
    webpack只能处理js文件，需要专门的加载器（loader）处理 CSS
- css-loader 只负责将css解析
- style-loader 将解析后的结果通过 `style` 放到页面上
- 多个 loader 执行顺序 => 由后向前
```js
    module: {
        rules: [
        {
            test: /.css$/,
            use: [
                // 多个 loader 执行顺序 => 由后向前
                'style-loader',
                'css-loader'
            ]
        }
        ]
    }
```

## 为什么 webpack 在js中引入其他资源
- 逻辑合理 js确实需要这些资源文件
- 确保上线资源不缺失 都是必要的

## 常用 loader 分类
- 编译转换类（css-loader..）
- 文件操作类（file-loader..）
    将文件拷贝 并导出文件访问路径
- 代码检查类（eslint-loader..）
    统一代码风格，提高代码质量

## 其他加载器（loader）
> 1、在本质上，loader 就是一个导出为函数的 JavaScript 模块。这个函数接受源代码作为输入，经过处理后返回新的代码或转换结果。WebPack 通过这些 loader 执行不同的资源处理。

> 2、可以说 Webpack 的 loader 就像是一个管道（pipeline）。每个 loader 都是这个管道中的一个环节，文件经过一系列 loader 的处理后，最终被转换为 Webpack 能理解和打包的模块。
### 1、文件资源加载器_file-loader
    合理处理「图片/字体」等文件
```js
output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    // 【注意】搭配 file-loader使用
    publicPath: 'dist/'
  },
module：{
    rules:[
        {
            test: /.png$/,
            use: 'file-loader'
        }
    ]
}
```

### 2、文件资源加载器_url-loader
    同样用来处理 图片/字体等文件
    「区别在于」：导出时会转换成 date：url形式（base64编码），而不是单独的物理文件
```js
output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    // 【注意】搭配 url-loader使用
    publicPath: 'dist/'
  },
module：{
    rules:[
        {
            test: /.png$/,
            use: {
                loader: 'url-loader',
                options: {
                    // 这里文件大小超限后 会默认找「file-loader」
                    limit: 10 * 1024 // 限制文件大小 10kb
                }
            }
      }
    ]
}
```

> 最佳实践
> - 小文件使用 Data URls，减少请求次数（url-loader）
> - 大文件单独提取存放 提高加载速度（file-loader）


### 3、baber-loader
    将 ES6 代码转化为 浏览器所识别的代码（兼容性）
```js
module: {
    rules: [
      {
        test: /.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            // 搭配 插件使用
            presets: ['@babel/preset-env']
          }
        }
      },
    ]
}
```

### 4、html-loader
    将 html 转化为 js模块，以便 webpack 识别
```js
module: {
    rules: [
      {
        test: /.html$/,
        use: {
          loader: 'html-loader',
          options: {
            // 默认仅支持‘img：src’，可配置其他支持项
            attrs：['img:src','a:href']
          }
        }
      },
    ]
}
```


## webpack 加载资源的方式
    兼容多种模块化标准
- ES Moudles 标准的 import
- CommonJS 标准的 require
- AMD 标准的 define 和 require

- 样式代码中的 @import 和 url函数
- HTML 代码中图片标签的src属性，href需要单独配置

> 选用一个标准使用 不要混用


## webpack 核心工作原理
- 1、找到打包入口
- 2、根据入口文件中的import等语句，寻找依赖，形成每一模块的依赖树
- 3、递归依赖树 找到每个节点所需的资源文件 按照加载器对应加载
- 4、将加载结果放到 bundle


## 手写一个 marked-loader
    核心思路：明确输入和输出
- 输入：加载到的资源内容
- 输出：转化后的结果

### marked-loader
```js
const marked = require('marked')

// 输入为资源
module.exports = source => {
  
  const html = marked(source)

  // 输出为转化后的结果
  // 返回 html 字符串交给下一个 loader 处理
  return html
}
```

### 使用loader
```js
module: {
    rules: [
      {
        test: /.md$/,
        use: [
          'html-loader',  // marked 返回的是html，需要 html-loader 
          './markdown-loader'
        ]
      }
    ]
  }
```


## 插件 Plugin 
    解决除了资源加载以外，其他的「自动化工作」
- 清除 dist 目录
- 拷贝静态文件到输出目录
- 压缩输出代码

### 1、clean-webpack-plugin
    每次打包前打包前「自动清除输出目录」 
```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

plugins: [
    new CleanWebpackPlugin()
  ]
```

### 2、html-webpack-plugin
    自动生成使用打包结果（bundle.js）的 html

> 问题背景
> 之前： 项目目录下新建一个 index.html
> 现在： 由 webpack 负责生成这个 html ，并将打包结果插入
> 好处： 不同担心「打包路径引用问题」

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  ...
  plugins: [
    // 用于生成 index.html
    new HtmlWebpackPlugin({
      title: 'Webpack Plugin Sample',
      meta: {
        viewport: 'width=device-width'
      },
      template: './src/index.html'
    }),
    // 用于生成 about.html - 多次创建页面
    new HtmlWebpackPlugin({
      filename: 'about.html'
    })
  ]
}
```

### 3、copy-webpack-plugin（开发阶段慎用 上线前使用）
    用于将不需要参与构建的 静态文件（public） ，复制到 dist 文件

```js
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  ...
  plugins: [
    ...
    // 将不需要参与构建的文件 复制到 dist
    new CopyWebpackPlugin([
      // 'public/**'
      'public'
    ])
  ]
}
```


## 手写 plugin
> 本质：通过「钩子机制」实现，即在生命周期钩子(compiler.hooks)注册相应的事件(钩子)实现扩展
> 官网：plugin 必须是一个函数或者是一个包含 apply 方法的对象

```js
class MyPlugin {
  apply (compiler) {
    console.log('MyPlugin 启动')

    // 1、在 emit 阶段挂载 tap 事件
    // 参数一：插件名 
    // 参数二：上下文
    compiler.hooks.emit.tap('MyPlugin', compilation => {
      // compilation => 可以理解为此次打包的上下文
      for (const name in compilation.assets) {
        // console.log(name)
        // 每个文件内容：compilation.assets[name].source()
        if (name.endsWith('.js')) {
          const contents = compilation.assets[name].source()
          // 2、用「正则」删掉多余注释
          const withoutComments = contents.replace(/\/\*\*+\*\//g, '')
          // 3、替换资源内容
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length
          }
        }
      }
    })
  }
}
```

## 理想的开发体验
- 1、HTTP-serve 运行
- 2、自动编译 + 及时更新
- 3、提供 source-map 支持

### watch 模式
    监听文件变化，自动更新打包
```bash
    webpack --watch
```

### BrowserSync
    自动刷新浏览器,监听浏览器变化
```bash
同时开启两个终端
    webpack --watch
    browser-sync dist --files "**/*"
```
> 缺点：效率低 2次磁盘读写 浪费性能


### devServer
- 1、自动打包 并刷新浏览器
- 2、静态资源访问 contentBase
- 3、配置代理服务器 proxy
```js
devServer: {
    // 指定静态资源路径 webpack5 改为 stasic
    contentBase: './public',
    proxy: {
      '/api': {
        // http://localhost:8080/api/users -> https://api.github.com/api/users
        target: 'https://api.github.com', // 目标地址
        // http://localhost:8080/api/users -> https://api.github.com/users
        pathRewrite: {
          '^/api': ''  // 重写路径
        },
        // 不能使用 localhost:8080 作为请求 GitHub 的主机名
        changeOrigin: true  // 更改 origin
      }
    }
  },
```

### Source Map
    源代码地图 => 开发环境定位错误
> 总结：解决编写代码与运行代码不一致的调试问题

- 配置 devtool 开启 Source Map
```bash
    devtool: 'sourse-map'
```

- devtool 不同模式下的对比

```
  eval模式：只能定位到某个文件，不能定位到具体的行列
  eval-source-map：能定位到某个文件和具体的行列
  cheap-eval-source-map：阉割版，只能定位到行，不能定位到列
  cheap-module-eval-source-map：未经过 loader 加工
  nosources-source-map:会给出具体的行，但点击后控制台不会暴露代码
```

- 选择合适的 Source Map
```
  开发模式：cheap-module-eval-source-map
    1、每行代码不会超过 80 字符
    2、使用框架经过 loader 转换后的代码差异较大

  生产模式：none
    1、Source Map 会暴漏源代码
    2、调试是开发阶段的问题
    3、折中考虑使用 nosources-source-map 
```

### HMR 热更新
> 问题背景：想要在不刷新页面的前提下，更新页面（区别于devServer）
> 问题解决：开启热更新

```
  devServer 和 HMR 对比
    1、devServer
      devServer 的核心作用是提供一个轻量的开发服务器，让开发者能够快速看到项目的修改效果，并自动刷新页面。
    2、HMR
      HMR 是 Webpack 的一种增强功能，允许在「不刷新」整个页面的情况下，替换、添加或删除模块。这在开发过程中极大提升了效率，尤其是在调试和调整 UI 的时候。
```

- webpack 开启 HMR
```js
  const webpack = require('webpack')

  // 开启 HMR
  devServer: {
    hot: true
    // hotOnly: true // 只使用 HMR，不会 fallback 到 live reloading
  },

  ...

  plugins: [
    ...
    // 使用 插件
    new webpack.HotModuleReplacementPlugin()
  ]
```

> 存在的问题
>   1、样式文件可以热替换
>   2、脚本文件不可以 需要自己手动处理
>   3、框架开发脚本/样式均可以热替换，因为脚本「有规律可循」


- 使用 HMR API
```js
  // 注册某个模块热更新的处理模块
  module.hot.accept('文件路径', () => {
    console.log('editor 模块更新了，需要这里手动处理热替换逻辑')
  })
```

- JS 模块 热替换
```js
if (module.hot) {
  let lastEditor = editor
  module.hot.accept('./editor', () => {

    // 去除之前的内容
    const value = lastEditor.innerHTML
    document.body.removeChild(lastEditor)
    // 替换新的内容
    const newEditor = createEditor()
    newEditor.innerHTML = value
    document.body.appendChild(newEditor)
    lastEditor = newEditor
  })
}
```

- 图片 热替换
```js
if (module.hot) {

  module.hot.accept('./better.png', () => {
    // 替换图片的 src
    img.src = background
  })
}
```

- HMR 注意事项
```
  1、使用 hotOnly => 解决报错被自动刷新
  2、HMR 要搭配插件使用
```

## 生产环境优化

### 不同环境下的配置
- 1、配置文件根据环境不同导出不同配置(env)
  - 适用于 小型项目
```js
module.exports = (env, argv) => {
  // env 环境名参数
  // argv 运行 cli 产生的所有参数
  const config = {
    mode: 'development',
    entry: './src/main.js',
    output: {
      filename: 'js/bundle.js'
    },
    devtool: 'cheap-eval-module-source-map',
    devServer: {
      hot: true,
      contentBase: 'public'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              outputPath: 'img',
              name: '[name].[ext]'
            }
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack Tutorial',
        template: './src/index.html'
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  }

  // 根据环境变量 => 判断环境 => 进行相应配置
  if (env === 'production') {
    config.mode = 'production'
    config.devtool = false
    config.plugins = [
      ...config.plugins,
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin(['public'])
    ]
  }

  return config
}
```

- 2、一个环境对应一个配置文件
    使用 `merge` 方法, 命令行：webpack --config 文件名
  - 开发配置(webpack.dev.js) 
  - 生产配置(webpack.prod.js) 
  - 公共配置（webpack.common.js）
```js
// webpack.common.js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'js/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'img',
            name: '[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack Tutorial',
      template: './src/index.html'
    })
  ]
}


// webpack.dev.js
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-eval-module-source-map',
  devServer: {
    hot: true,
    contentBase: 'public'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})

// webpack.prod.js
const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(['public'])
  ]
})

```


## webpack 与 性能优化

### definePlugin
    webpack 内置插件，为代码注入全局成员（例如：API_BASE_URL）
```js
plugins: [
    new webpack.DefinePlugin({
      // 值要求的是一个代码片段
      API_BASE_URL: JSON.stringify('https://api.example.com')
    })
  ]
```

### Tree Shaking(树摇)
- 自动检测并将「未引用代码」去除，减少打包体积
- 在 生产环境 自动开启

> 注意：
- `Tree Shaking` 并不是 某个配置选项
- 而是一组功能搭配使用后的效果
- 在 production 模式下自动开启

#### 具体使用
- useExports 负责标记「枯树叶」
- minimize 负责「摇掉」它们
```js
  optimization: {
    // 模块只导出被使用的成员
    usedExports: true,
    // 压缩输出结果
    minimize: true
  }
```

#### concatenateModules 继续优化
- 尽可能将所有模块输出到一个函数
```js
optimization: {
    // 模块只导出被使用的成员
    usedExports: true,
    // 压缩输出结果
    minimize: true,
    //「继续优化」尽可能合并每一个模块到一个函数中
    concatenateModules: true
  }
```

#### Tree Shaking 与 babel
- 树摇的前提：必须使用 ESM 模块化
- 解决：如果使用 babel-loader，则需做相关配置({ modules: false })

```js
module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              // 如果 Babel 加载模块时已经转换了 ESM，则会导致 Tree Shaking 失效
              // ['@babel/preset-env', { modules: 'commonjs' }]
              // ['@babel/preset-env', { modules: false }]
              // 也可以使用默认配置，也就是 auto，这样 babel-loader 会自动关闭 ESM 转换
              ['@babel/preset-env', { modules: 'auto' }]
            ]
          }
        }
      }
    ]
  },
```

#### Tree Shaking 与 sideEffects
> Webpack在进行树摇时，会查看每个模块的package.json中的sideEffects属性，以确保未使用的代码是无副作用的。如果设置为false，则表示模块没有副作用，Webpack可以安全地删除未被使用的导出。
- sideEffects 一般用于 npm包 标记是否有副作用
- 在 生产模式 默认开启，其他模式 通过如下代码开启
```js
  optimization: {
      sideEffects: true,  // 开启 sideEffects
  }
```

> 使用： 在 package.json 包下面配置
```js
// package.json
{
    "name": "your-package",
    "sideEffects": false  // 标识无副作用
}
```

> 确实有副作用：
- 在sideEffects属性中明确指出哪些文件有副作用，例如：
```js
// package.json
{
    "sideEffects": [
        "./src/some-side-effectful-file.js"
    ]
}
```


### 代码分割(Code Splitting)
- 存在的问题：bundle 体积过大，首次加载并不需要所有模块
- 解决：分成多个 bundle， 根据实际情况去加载 bundle
- 平衡：分块太多，又会增加请求数量，物极必反，寻找平衡

#### 多入口打包
- 适用于「多页面应用」
- 1、一个页面 => 一个 entry
```js
// 一个页面 一个入口
  entry: {
    index: './src/index.js',
    album: './src/album.js'
  },

  plugins: [
    new CleanWebpackPlugin(),
    // 搭配 HtmlWebpackPlugin 使用
    // 通过 chunks 在生成的html中 注入指定的 bundle
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/album.html',
      filename: 'album.html',
      chunks: ['album']
    })
  ]
```
- 2、不同页面公共部分 => 单独提取(splitChunks)
```js
optimization: {
    splitChunks: {
      // 自动提取所有公共模块到单独 bundle
      chunks: 'all'
    }
}
```

#### 动态导入
- 实现按需加载
- 动态导入的模块会被「自动分包」
- 而且会自动提取公共模块
```js
  if (hash === '#posts') {
    // mainElement.appendChild(posts())
    import(/* webpackChunkName: 'components' */'./posts/posts').then(({ default: posts }) => {
      mainElement.appendChild(posts())
    })
  } else if (hash === '#album') {
    // mainElement.appendChild(album())
    import(/* webpackChunkName: 'components' */'./album/album').then(({ default: album }) => {
      mainElement.appendChild(album())
    })
  }
```

### CSS 优化
#### MiniCssExtractPlugin 
- 作用：提取 CSS 到一个单独的文件中
- 实现 CSS 文件的按需加载

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 取代'style-loader', 
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Dynamic import',
      template: './src/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin()
  ]
}
```

#### OptimizeCssAssetsWebpackPlugin
- 作用：压缩 CSS 文件
```js
optimization: {
    minimizer: [
      new TerserWebpackPlugin(), // 保证 js 压缩器 正常
      new OptimizeCssAssetsWebpackPlugin()
    ]
},
```

### 输出文件名hash 与 HTTP缓存
- 作用：对静态资源强制缓存，只有文件名改变才重新获取
- 如何使用：生产模式下，文件名使用 Hash
```js
output: {
    // [contenthash]：与文件内容相关的哈希
    filename: '[name]-[contenthash:8].bundle.js'
},
```