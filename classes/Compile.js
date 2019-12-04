// 模板编译

import CompileUtils from '../decorators/CompileUtils';

@CompileUtils
class Compile {
  constructor (el, vm) {
    // 检测el
    this.el = this.isElementNode(el)
             ? el
             : document.querySelector(el);

    this.vm = vm;

    if (this.el) {
      
      // 触发beforeMount钩子
      const beforeMount = vm.$options.beforeMount;
      (beforeMount && !vm._isMounted) && beforeMount.call(vm);

      // 把el下所有节点放入到文档碎片中
      const docFragment = this.nodeToFragment(this.el);

      this.compile(docFragment);
      this.el.appendChild(docFragment);

      // 触发mounted钩子
      const mounted = vm.$options.mounted;
      (mounted && !vm._isMounted) && mounted.call(vm);
    }

  }

  /**
   * 检测是否为元素节点
   * @param node 需要检测的节点或字符串
   */
  isElementNode (node) {
    return node.nodeType === 1;
  }

  /**
   * 检测字符串是否包含 'v-' 
   * @param { string } name 需要检测的字符串
   */
  isDirective (name) {
    return name.includes('v-')
  }

  /**
   * 把元素里面的节点全部放到文档碎片中
   * @param el 需要放入文档碎片的元素节点
   * @returns DocumentFragment
   */
  nodeToFragment (el) {
    const docFragment = document.createDocumentFragment();

    let firstChild;

    while (firstChild = el.firstChild) {
      docFragment.appendChild(firstChild);
    }

    return docFragment;
  }

  
  /**
   * 编译模板
   * @param 文档碎片
   */
  compile (docFragment) {
    const childNodes = Array.from(docFragment.childNodes);

    childNodes.forEach((node) => {
      if (this.isElementNode(node)) {
        // 元素节点
        this.compileElement(node);
        // 处理嵌套的节点
        this.compile(node);
      } else {
        // 非元素节点
        this.compileText(node);
      }
    })
  }

  /**
   * 处理元素节点的内容
   * @param {*} node 
   */
  compileElement (node) {
    let attrs = Array.from(node.attributes);
    attrs.forEach((attr) => {
      let attrName = attr.name;
      // 如果属性名为v-指令，则进行处理
      if (this.isDirective(attrName)) {
        // 取出属性值
        let exp = attr.value;

        // v-model -> model
        let dir = attrName.slice(2); // 取出属性名 'v-' 之后的内容
        Compile.CompileElementDirective(dir, node, this.vm, exp);
      }
    });
  }

  /**
   * 处理非元素节点的内容
   * @param {*} node 
   */
  compileText (node) {
    // 获取原本的文本内容
    let exp = node.textContent;
    // console.log(textContent);
    // 如果有{{}}则处理
    if (Compile.tplReg.test(exp)) {
      Compile.CompileTextNode(node, this.vm, exp);
    }
  }
}


export { Compile };