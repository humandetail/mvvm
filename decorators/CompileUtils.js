import { Watcher } from '../classes/Watcher';

export default (target) => {

  /**
   * 编译元素节点上的指令
   * @param { String } dir 指令: model、text、html
   * @param node 元素节点
   * @param { Object } vm VM实例
   * @param { String } exp 表达式 - 指令对应的值
   */
  target.CompileElementDirective = (dir, node, vm, exp) => {
    let updaterFn;
    switch (dir) {
      case 'model':
        updaterFn = target.updater.valueUpdater;

        // 监听input事件
        node.addEventListener('input', (e) => {
          let newValue = e.target.value;
          target.setValue(vm, exp, newValue);
        });
        break;
      case 'html':
        updaterFn = target.updater.htmlUpdater;
        break;
      case 'text':
        updaterFn = target.updater.textUpdater;
        break;
      default:
        break;
    }

    // 添加watcher
    new Watcher(vm, exp, (value) => {
      updaterFn && updaterFn(node, value);
    });

    updaterFn && updaterFn(node, target.getValue(vm, exp));
  }

  /**
   * 编译含有 {{}} 的文本节点
   * @param node 文本节点
   * @param { Object } vm VM实例
   * @param { String } exp 表达式 - 文本节点的内容
   */
  target.CompileTextNode = (node, vm, exp) => {
    let updaterFn = target.updater.textUpdater;

    function updateValue (val) {

      let value = exp.replace(target.tplReg, ($, key) => {
        
        // 多次回调会创造多个watcher引起浏览器崩溃
        // wathcer的回调里面会传递相应的参数
        // 可以巧妙通过判断该值来确定是否要添加watcher
        if (typeof val === 'undefined') {
          new Watcher(vm, key.trim(), updateValue);
        }

        return target.getValue(vm, key.trim());
      });

      updaterFn && updaterFn(node, value);

    }

    updateValue();
  }

  /**
   * 模板替换处理器集合
   */
  target.updater = {
    valueUpdater (node, value) {
      node.value = value;
    },
    htmlUpdater (node, value) {
      node.innerHTML = value;
    },
    textUpdater (node, value) {
      node.textContent = value;
    }
  }

  /**
   * 根据指定的表达式，从vm实例中获取相应的值
   * @param { object } vm VM实例
   * @param { string } exp 指定的表达式，如：message、message.a
   * @returns vm实例中指定的值
   */
  target.getValue = (vm, exp) => {
    // exp有可能是a.b.c这样的值
    exp = exp.split('.');
    return exp.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);
  }

  /**
   * 更新vm实例中的值
   * @param { object } vm VM实例
   * @param { string } exp 指定的表达式，如：message、message.a
   * @param { any } 指定的值
   * @returns newValue 
   */
  target.setValue = (vm, exp, newValue) => {
    exp = exp.split('.');
    return exp.reduce((prev, next, currentIndex) => {
      if (currentIndex === exp.length - 1) {
        return prev[next] = newValue;
      }
      return prev[next];
    }, vm.$data);
  }

  // 查找{{xxxx}}的正则
  target.tplReg = /{{(.*?)}}/g;
}