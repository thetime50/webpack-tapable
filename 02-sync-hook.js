/**
 * 02-同步钩子的使用
 * 
 * https://github.com/thetime50/note/blob/master/日志/2021/log-2021-06-06.md#02-同步钩子的使用
 * 
 */

const {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
} = require('tapable')

/**
 * plugin1 zack 28
 * plugin2 zack 28
 */
function baseTest() {
    console.log('baseTest')
    const syncHk = new SyncHook(['name','age']) // 构造函数字符串 传递参数用的 node_modules\tapable\lib\HookCodeFactory.js args()
    syncHk.tap('plugin1',(name,age)=>{
        console.log('plugin1',name,age)
    })
    syncHk.tap('plugin2',(name,age)=>{
        console.log('plugin2',name,age)
    })

    syncHk.call('zack',28)
}

/**
 * a: bail 20
 * b: bail 20
 */
function bailTest() {
    console.log('bailTest')
    const bailHook = new SyncBailHook(['name','age'])
    bailHook.tap('a',(name,age)=>{
        console.log(`a:`, name,age)
    })
    bailHook.tap('b',(name,age)=>{
        console.log(`b:`, name,age)
        return 'b'
    })
    bailHook.tap('c',(name,age)=>{
        console.log(`c:`, name,age)
    })

    bailHook.call('bail',20)
}
function waterfallTest() {
    console.log('waterfallTest')
    
    const waterfallHook = new SyncWaterfallHook(['arg']);

    waterfallHook.tap('a',(arg)=>{
        console.log('a:',arg);
        return 'a';
    })
    waterfallHook.tap('b',(arg)=>{
        console.log('b:',arg);
        return 'b'
    });
    waterfallHook.tap('c',(arg)=>{
        console.log('c:',arg);
        return 'c'
    });
    
    waterfallHook.call('lisi');
}
function loopTest() {
    console.log('loopTest')
    const hook = new SyncLoopHook(['a']);
    let count = 1;
    
    hook.tap('start', () => console.log('start'));
    hook.tap('sum', a => {
        console.log('count',count,'a',a);
        if (count>=3) {
            console.log('end');
            return;
        }
        count++;
        return true;
    });
    // 一旦返回值为true 就返回到第一个回调重新开始执行
    // hook.tap('test',(a)=>{
    //     console.log('test a:',a)
    //     count++
    //     if (count<=5) {
    //         return true
    //     }
    // })
    
    hook.call(1);
    console.log('**',count);
}

// baseTest()
// bailTest()
// waterfallTest()
loopTest()
