// 数据劫持

class Observer {
  constructor (data) {
    this.observe(data);
  }

  observe (data) {
    console.log(data);
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
    const _self = this;
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,

      get () {
        return value;
      },

      set (newValue) {
        if (newValue !== value) {
          value = newValue;
          // 当数据发生变化时，设置的getter 和 setter会丢失
          _self.observe(newValue);
        }
      }
    });
  }
}

export { Observer };