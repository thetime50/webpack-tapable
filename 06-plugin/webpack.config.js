const HtmlWebpackPlugin = require('html-webpack-plugin')
const MyPlugin = require('./src/plugin')
const path = require('path')

module.exports = {
    entry:'./src/index.js',
    output:{
        path:path.join(__dirname,'./dist'),
        filename:'bundle.js'
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            filename:'index.html',
            minify:false,
        }),
        new MyPlugin()
    ]
}
