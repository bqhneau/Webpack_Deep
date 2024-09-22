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

### 3、copy-webpack-plugin
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