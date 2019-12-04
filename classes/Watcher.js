// 观察者

import { Dep } from './Dep';
import { getValue } from '../utils/valueTools';

class Watcher {
  constructor (vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;

    // 缓存当前value值
    this.value = this.get();
  }

  /**
   * 获取当前数据
   * 通过这里面给Dep.target赋值
   */
  get () {
    Dep.target = this;
    let value = getValue(this.vm, this.exp);
    Dep.target = null;
    return value;
  }

  /**
   * 更新数据，并执行设定的回调函数
   */
  update () {
    const vm = this.vm;
    let newValue = getValue(vm, this.exp),
        oldValue = this.value;
        
    if (newValue !== oldValue) {
      this.cb(newValue);
    }
  }
}

export { Watcher };