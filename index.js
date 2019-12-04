import { Mvvm } from './classes/Mvvm';

const vm = new Mvvm({
  el: '#app',
  data: {
    message: 'Hello world',
    count: 0,
    products: {
      title: '这是一个产品的标题',
      content: '这是一个产品的内容'
    },
    a: 10,
    b: 20,
    firstName: '三',
    lastName: '张'
  },
  computed: {
    sum () {
      return this.a + this.b;
    },
    fullName: {
      get () {
        return this.firstName + ' ' + this.lastName;
      },
      set (fullName) {
        const [first, last] = fullName.split(' ');
        this.firstName = first;
        this.lastName = last;
      }
    }
  }
});

window.vm = vm;