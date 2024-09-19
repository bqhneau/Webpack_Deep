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

 
