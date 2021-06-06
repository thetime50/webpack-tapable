/**
 * 1. js 类或命名函数
 * 2. 包含spply方法
 * 3. 挂载webpack的勾子
 * 4. 处理webpack实例里的数据
 * 5. 功能完成调用webpack回调(tapable回调)
 * 
 */

const HtmlWebpackPlugin = require('html-webpack-plugin')

const pluginName = 'MyPlugin'

class MyPlugin{
    apply(compiler){ // 整个编译流程的实例
        compiler.hooks.compilation.tap(pluginName,(compilation)=>{ // 一次编译过程的实例
            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync( // todo html-webpack-plugin是怎么实现的
                pluginName,
                (data,cb)=>{ // 触发 HtmlWebpackPlugin 勾子的时候会触发这里
                    data.html += '=_+'
                    cb(null,data)
                }
            )
        })
    }
}

module.exports = MyPlugin
