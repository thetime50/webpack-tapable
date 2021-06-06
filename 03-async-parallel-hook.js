/**
 * 03-异步并行钩子的使用
 * 
 * https://github.com/thetime50/note/blob/master/日志/2021/log-2021-06-06.md#03-异步并行钩子的使用
 * 
 */

const {
    AsyncParallelHook,
    AsyncParallelBailHook,
} = require('tapable')

function parallelTest() {
    console.log(`parallelTest`)
    let queue1 = new AsyncParallelHook(['name']);
    console.time('cost1');
    queue1.tapAsync('1', function (name, cb) { // 注册回调勾子
        setTimeout(() => {
            console.log('1:',name);
            cb(null,'1');
        }, 2000);
    });
    queue1.tapAsync('2', function (name, cb) {
        setTimeout(() => {
            console.log('2:',name);
            cb(null,'2');
            // cb('errpr','2'); // 出错结束执行
        }, 1000);
    });
    
    //输入一个name然后回调可以展开
    // todo 基础异步并行事件好像就是没有onResult 回调的
    queue1.callAsync('tapAsync', (err,res) => { // 执行完成回调
        console.log('res',res);
        console.log('err',err);
        console.timeEnd('cost1');
    });
    // onError
    // onResult
    // onDone
}

function parallelPromiseTest() {
    console.log('parallelPromiseTest')

    let queue2 = new AsyncParallelHook(['name']);
    console.time('cost2');
    queue2.tapPromise('1', function (name) {
       return new Promise(function (resolve, reject) {
           setTimeout(() => {
               console.log(name, 1);
               resolve('1');
           }, 2000);
       });
    });
    
    queue2.tapPromise('2', function (name) {
       return new Promise(function (resolve, reject) {
           setTimeout(() => {
               console.log(name, 2);
               resolve('2');
            //    reject('error')
           }, 1000);
       });
    });
    // //同样可以被触发
    // queue2.tapAsync('3', function (name, cb) { 
    //     setTimeout(() => {
    //         console.log('3:',name);
    //         cb(null,'3');
    //         // cb('errpr','2'); // 出错结束执行
    //     }, 3000);
    // });
    
    
    queue2.promise('tapPromise')
    .then((al) => {
        console.log('over',al);
        console.timeEnd('cost2');
    }, (err) => {
        console.log('error',err);
        console.timeEnd('cost2');
    });
}

function parallelBailTest() {
    console.log(`parallelBailTest`)

    let queue3 = new AsyncParallelBailHook(['name']);
    console.time('cost3');
    
    queue3.tapAsync('1',(name,cb)=>{
        setTimeout(() => {
            console.log(name, 1);
            cb()
        }, 1000); 
    })
    queue3.tapAsync('2',(name,cb)=>{
        setTimeout(() => {
            console.log(name, 2);
            cb(null,'2');
        }, 2000); 
    });
    
    queue3.tapAsync('3',(name,cb)=>{
        setTimeout(() => {
            console.log(name, 3);
            cb();
        }, 3500); 
    });

    queue3.callAsync('bail tapAsync',(err,res)=>{
        console.log('over' + res);
        console.timeEnd('cost3');
    })
}

function parallelBailPromiseTest() {
    console.log(`parallelBailPromiseTest`)
    //带唯一参数name
    let queue4 = new AsyncParallelBailHook(['name']);
    
    console.time('cost4');
    queue4.tapPromise('1', function (name) {
        return new Promise(function (resolve, reject) {
            setTimeout(() => {
                console.log(name, 1);
                //done
                resolve('1');
            }, 1000);
        });
    });
    
    
    queue4.tapPromise('2', function (name) {
        return new Promise(function (resolve, reject) {
            setTimeout(() => {
                console.log(name, 2);
                resolve()
                resolve('1')//有返回值会直接结束过程进入then
                // reject('error')
            }, 2000);
        });
    });
    
    queue4.tapPromise('3', function (name) {
        return new Promise(function (resolve, reject) {
            setTimeout(() => {
                console.log(name, 3);
                resolve();
            }, 3000);
        });
    });
    
    
    
    //调用
    queue4.promise('bail tapPromise')
    .then((res) => {
        console.log('over',res);
        console.timeEnd('cost4');
    }, (error) => {
        console.log('error',error);
        console.timeEnd('cost4');
    });
}

// parallelTest()
// parallelPromiseTest()
// parallelBailTest()
parallelBailPromiseTest()