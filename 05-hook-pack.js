/**
 * 5-钩子的封装
 * 
 * https://github.com/thetime50/note/blob/master/日志/2021/log-2021-06-06.md#5-钩子的封装
 * 
 */

const {
    AsyncParallelHook,
    AsyncSeriesWaterfallHook,
} = require('tapable')


class Model{
    constructor(){
        this.hooks={
            asyncHook: new AsyncParallelHook(['name']),
            promiseHook:new AsyncSeriesWaterfallHook(['name'])
        }
    }
    // 触发
    callAsyncHook(name,callback){
        this.hooks.asyncHook.callAsync(name,(res)=>{
            if(res) return callback(res);
            callback(null)
        })
    }

    callPromise(name){
        return this.hooks.promiseHook.promise(name)//.then()
    }
}

// node
// module.exports = Model

// ES6
// export default Model

let model = new Model()

// 注册goods?
model.hooks.asyncHook.tapAsync('plugin1',(name,done)=>{
    setTimeout(() => {
        console.log(`task1`)
        done()
    }, 3000);
})
model.hooks.asyncHook.tapAsync('plugin2',(name,done)=>{
    setTimeout(() => {
        console.log(`task2`)
        done()
    }, 2000);
})
model.hooks.asyncHook.tapAsync('plugin3',(name,done)=>{
    setTimeout(() => {
        console.log(`task3`)
        done()
    }, 3000);
})

// console.time('cont')
// model.callAsyncHook('zank',res=>{
//     console.log(`cb call end`)
//     console.timeEnd('cont')
// })

model.hooks.promiseHook.tapPromise('promise-1',(arg)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log('promise-1',arg)
            resolve('p1')
        },2000)
    })
})

model.hooks.promiseHook.tapPromise('promise-2',(arg)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log('promise-2',arg)
            resolve('p2')
        },2000)
    })
})

model.hooks.promiseHook.tapPromise('promise-3',(arg)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log('promise-3',arg)
            resolve('p3')
        },2000)
    })
});

(async ()=>{
    console.log('*****',await model.callPromise('aaa'))
})()
// model.callPromise('aaa').then(res=>{
//     console.log('*****',res)
// })


