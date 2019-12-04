import { Compile } from './Compile';
import { Observer } from './Observer';
import { Computed } from './Computed';

const proxy = Symbol('proxy');

class Mvvm {

  constructor (opt) {
    // 触发beforeCreate钩子
    opt.beforeCreate && opt.beforeCreate.call(this);

    this.$options = opt;
    this._data = opt.data;

    this._isMounted = false;

    this.init();
  }

  init () {
    const options = this.$options;
      
    // 数据代理
    // this.a -> this._data.a;
    this[proxy](this._data);

    // 添加计算属性
    let computed = options.computed;
    if (computed) {
      if (computed + '' !== '[object Object]') {
        throw new TypeError('computed属性必须是一个对象');
      }
      new Computed(computed, this);
    }

    // 对数据进行劫持
    new Observer(this._data, this);

    // 触发created钩子
    options.created && options.created.call(this);

    this.$el = options.el;

    // 模板编译
    new Compile(this.$el, this);
  }

  /**
   * 对数据进行代理
   * 使用this.a 可以访问到 this.$data.a
   * @param { Object } data  需要代理的数据
   */
  [proxy] (data) {
    if (!data || typeof data !== 'object') {
      return;
    }
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get () {
          return this._data[key];
        },

        set (newValue) {
          if (this._data[key] !== newValue) {
            this._data[key] = newValue;
          }
        }
      })
    });

    Object.defineProperty(this, '$data', {
      get () {
        return this._data;
      }
    })
  }
}

export { Mvvm };