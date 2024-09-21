const marked = require('marked')


// 输入为资源
module.exports = source => {
  // console.log(source)
  // return 'console.log("hello ~")'
  const html = marked(source)
  // return html
  // return `module.exports = "${html}"`
  // return `export default ${JSON.stringify(html)}`

  // 输出为转化后的结果
  // 返回 html 字符串交给下一个 loader 处理
  return html
}
