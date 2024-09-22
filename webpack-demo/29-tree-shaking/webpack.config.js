module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },

  // optimization 添加优化相关的字段
  // 添加 optimization 中 usedExports 开启树摇
  optimization: {
    // 模块只导出被使用的成员
    usedExports: true,
    // 压缩输出结果
    minimize: true,
    //「继续优化」尽可能合并每一个模块到一个函数中
    concatenateModules: true
  }
}
