// 数据劫持

import { Dep } from './Dep'

class Observer {
  constructor (data, vm) {
    this.vm = vm;
    this.observe(data);
  }

  observe (data) {
    // console.log(data);
    if (!data || typeof data !== 'object') {
      return; // 递归的出口
    }

    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
      this.observe(data[key]); // 递归，深度劫持
    })
  }

  /**
   * 添加getter 和 setter
   * @param {*} data 
   * @param {*} key 
   * @param {*} value 
   */
  defineReactive (data, key, value) {
    const _self = this,
          dep = new Dep();
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,

      get () {
        // 订阅事件
        // 数据被提取的时候订阅事件
        Dep.target && dep.addSubscribe(Dep.target);
        return value;
      },

      set (newValue) {
        if (newValue !== value) {
          value = newValue;
          // 当数据发生变化时，设置的getter 和 setter会丢失
          _self.observe(newValue);

          // 触发updated钩子
          const updatedHook = _self.vm.$options.updated;
          updatedHook && updatedHook.call(vm);

          // 数据发生改变，发布事件
          dep.notify();
        }
      }
    });
  }
}

export { Observer };