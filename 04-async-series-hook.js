/**
 * 4-异步串行钩子的使用
 * 
 * https://github.com/thetime50/note/blob/master/日志/2021/log-2021-06-06.md#4-异步串行钩子的使用
 * 
 */

const {
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook,
} = require('tapable')


function seriesTest() {
    console.log('seriesTest')

    let queue1 = new AsyncSeriesHook(['name']);
    console.time('cost1');
    queue1.tapAsync('1', function (name, cb) {
        setTimeout(() => {
            console.log(name, 1);
            cb(null, '1');
        }, 3000);
    });
    queue1.tapAsync('2', function (name, cb) {
        setTimeout(() => {
            console.log(name, 2);
            cb();
            //cb("error",'2');
        }, 2000);
    });
    queue1.tapAsync('3', function (name, cb) {
        setTimeout(() => {
            console.log(name, 3);
            cb();
        }, 1000);
    });
    queue1.callAsync('series cb', (res) => {
        console.log('over', res);
        console.timeEnd('cost1');
    });
}
function seriesPromiseTest() {
    console.log('seriesPromiseTest')

    let queue2 = new AsyncSeriesHook(['name']);
    console.time('cost2');
    queue2.tapPromise('1', function (name) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                console.log(name, 1);
                resolve('1');
            }, 1000)
        });
    });
    queue2.tapPromise('2', function (name, callback) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                console.log(name, 2);
                resolve('2');
                // reject('error');
            }, 2000)
        });
    });
    queue2.tapPromise('3', function (name, callback) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                console.log(name, 3);
                // resolve('3'); // 拿不到返回值的
                resolve();
            }, 3000)
        });
    });
    queue2.promise('series promise').then(res => {
        console.log(res);
        console.timeEnd('cost2');
    }).catch((err) => {
        console.log('error', err);
        console.timeEnd('cost2');
    });
}
function seriesBailTest() {
    console.log('seriesBailTest')

    let queue3 = new AsyncSeriesBailHook(['name']);
    console.time('cost3');
    queue3.tapAsync('1', function (name, cb) {
        setTimeout(() => {
            console.log(name, 1);
            cb();
        }, 3000);
    });
    queue3.tapAsync('2', function (name, cb) {
        setTimeout(() => {
            console.log(name, 2);
            // cb();
            cb(null, 1); // 返回数据结束流程
        }, 2000);
    });
    queue3.tapAsync('3', function (name, cb) {
        setTimeout(() => {
            console.log(name, 3);
            cb();
        }, 1000);
    });
    // 拿不到返回值
    queue3.callAsync('series bail', (res) => {
        console.log('over', res);
        console.timeEnd('cost3');
    });
    // 能拿到返回值 
    // queue3.promise('series bail').then(res=>{
    //     console.log('over',res);
    //     console.timeEnd('cost3');
    // }).catch((err)=>{
    //     console.log('error',err);
    //     console.timeEnd('cost3');
    // });
}
function seriesBailPromiseTest() {
    console.log('seriesBailPromiseTest')

    let queue4 = new AsyncSeriesBailHook(['name']);
    console.time('cost4');
    queue4.tapPromise('1', function (name) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                console.log(name, 1);
                resolve();
            }, 1000)
        });
    });
    queue4.tapPromise('2', function (name, callback) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                console.log(name, 2);
                resolve('2') // 返回数据结束流程
            }, 2000)
        });
    });
    queue4.tapPromise('3', function (name, callback) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                console.log(name, 3);
                resolve()
            }, 3000)
        });
    });
    queue4.promise('series promise').then(res => {
        console.log('over', res);
        console.timeEnd('cost4');
    }).catch((err) => {
        console.log('error', err);
        console.timeEnd('cost4');
    });
}
function seriesWaterfallTest() {
    console.log('seriesWaterfallTest')

    let queue5 = new AsyncSeriesWaterfallHook(['name']);
    console.time('cost5');
    queue5.tapAsync('1', function (arg, cb) {
        setTimeout(() => {
            console.log('1:', arg);
            cb(null, 1);
        }, 3000);
    });
    queue5.tapAsync('2', function (arg, cb) {
        setTimeout(() => {
            console.log('this is 2 , get data from 1:', arg);
            cb(null, 2);
        }, 2000);
    });
    queue5.tapAsync('3', function (arg, cb) {
        setTimeout(() => {
            console.log('this is 3, get data from 2:', arg);
            cb(null, 3)
        }, 1000);
    });
    queue5.callAsync('series bail', (res) => {
        console.log('over', res);
        console.timeEnd('cost5');
    });
}
function seriesWaterfallPromiseTest() {
    console.log('seriesWaterfallPromiseTest')

    let queue6 = new AsyncSeriesWaterfallHook(['name']);
    console.time('cost6');
    queue6.tapPromise('1', function (name) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                console.log(name, 1);
                resolve('1');
            }, 1000)
        });
    });
    queue6.tapPromise('2', function (data) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                console.log('this is 2 , get data form 1:', data);
                resolve('2')
            }, 2000)
        });
    });
    queue6.tapPromise('3', function (data) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                console.log('this is 3 , get data from 2:', data);
                // resolve() // 如果这里没传值 那么them里面拿到的是上一个hook的结果
                resolve('3')
            }, 3000)
        });
    });
    queue6.promise('series promise').then(res => {
        console.log('over', res);
        console.timeEnd('cost6');
    }).catch((err) => {
        console.log('error', err);
        console.timeEnd('cost4');
    });
}

// seriesTest() // 没有返回值
seriesPromiseTest() // 有返回值
// seriesBailTest() // 没有返回值
// seriesBailPromiseTest() // 有返回值
// seriesWaterfallTest() // 没有返回值
// seriesWaterfallPromiseTest() // 有返回值

