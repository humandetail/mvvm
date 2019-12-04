// 发布-订阅
class Dep {
  constructor () {
    this.subs = [];
  }

  // 添加订阅者
  addSubscribe (watcher) {
    this.subs.push(watcher);
  }

  // 发布
  notify () {
    this.subs.forEach((watcher) => {
      // 目的是调用watcher的update方法
      watcher.update();
    })
  }
}

export { Dep };