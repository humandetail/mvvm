import { Compile } from './Compile';


class Mvvm {

  constructor (options) {
    this.$el = options.el;
    this.$data = options.data;

    if (this.$el) {
      new Compile(this.$el, this);
    }
  }

}

export { Mvvm };