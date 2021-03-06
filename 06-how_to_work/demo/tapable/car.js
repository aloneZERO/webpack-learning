const {
    SyncHook,
    AsyncSeriesHook
} = require('tapable');

class Car {
    constructor() {
        this.hooks = {
            accelerate: new SyncHook(['newspeed']), // 加速
            brake: new SyncHook(), // 刹车
            calculateRoutes: new AsyncSeriesHook(["source", "target", "routesList"]) // 计算路径
        }
    }
}


const myCar = new Car();

// 绑定同步钩子
myCar.hooks.brake.tap("WarningLampPlugin", () => console.log('WarningLampPlugin'));

// 绑定同步钩子 并传参
myCar.hooks.accelerate.tap("LoggerPlugin", newSpeed => console.log(`Accelerating to ${newSpeed}`));

// 绑定一个异步Promise钩子
myCar.hooks.calculateRoutes.tapPromise("calculateRoutes tapPromise", (source, target, routesList, callback) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`CalculateRoute from ${source} to ${target} ${routesList}`)
            resolve();
        }, 1000)
    })
});


myCar.hooks.brake.call();
myCar.hooks.accelerate.call(10);

console.time('cost');

// 执行异步钩子
myCar.hooks.calculateRoutes.promise('home', 'company', 'demo')
    .then(() => {
        console.timeEnd('cost');
    })
    .catch(err => {
        console.error(err);
        console.timeEnd('cost');
    });