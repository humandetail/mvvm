class Computed {
  constructor (computed, vm) {
    this.vm = vm;
    this.initComputed(computed, vm);
  }

  /**
   * 将commputed里面的数据挂载到vm上面，并设置相应的getter和setter
   * @param { Object } computed
   * @param { Object } vm 
   */
  initComputed (computed, vm) {
    Object.entries(computed).forEach(([key, value]) => {
      Object.defineProperty(vm, key, {
        enumerable: true,
        configurable: true,
        get () {
          if (typeof value === 'function') {
            return value.call(vm);
          } else {
            if (value.get && typeof value.get === 'function') {
              return value.get.call(vm);
            }
          }
          return '';
        },
        set (newValue) {
          if (value.set && typeof value.set === 'function') {
            value.set.call(vm, newValue);
          }
        }
      });
    });
  }
}

export { Computed };