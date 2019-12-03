import { Compile } from './Compile';
import { Observer } from './Observer';


class Mvvm {

  constructor (options) {
    this.$el = options.el;
    this.$data = options.data;

    if (this.$el) {
      // 对数据进行劫持
      new Observer(this.$data);
      // 模板编译
      new Compile(this.$el, this);
    }
  }

}

export { Mvvm };