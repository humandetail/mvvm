export default (target) => {
  target.CompileUtils = {
    /**
     * v-model处理
     * @param node 
     * @param { Object } vm 
     * @param { String } exp 
     */
    model (node, vm, exp) {
      let updaterFn = this.updater.modelUpdater;

      updaterFn && updaterFn(node, this.getValue(vm, exp));
    },

    /**
     * 文本{{}}处理
     * @param {*} node 
     * @param {*} vm 
     * @param {*} exp
     */
    text (node, vm, exp) {
      // console.log(node, exps);
      let updaterFn = this.updater.textUpdater;
      
      let value = exp.replace(target.tplReg, (node, key) => {
        // console.log(key.trim());
        return this.getValue(vm, key.trim());
        // console.log(value);
      });
      // console.log(value);
      updaterFn && updaterFn(node, value);
    },

    /**
     * 获取vm.$data对应的值
     * @param {*} vm 
     * @param {*} exp 
     */
    getValue (vm, exp) {
      // exp有可能是a.b.c这样的值
      exp = exp.split('.');
      return exp.reduce((prev, next) => {
        return prev[next];
      }, vm.$data);
    },

    updater: {
      // model替换器
      modelUpdater (node, value) {
        node.value = value;
      },
      // text替换器
      textUpdater (node, value) {
        node.textContent = value;
      }
    }
    
  }

  target.tplReg = /{{(.*?)}}/g;
}