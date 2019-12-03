import { Mvvm } from './classes/Mvvm';

const vm = new Mvvm({
  el: '#app',
  data: {
    message: 'Hello world',
    count: 0,
    products: {
      title: '这是一个产品的标题',
      content: '这是一个产品的内容'
    }
  }
});

window.vm = vm;