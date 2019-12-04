/**
 * 根据指定的表达式，从vm实例中获取相应的值
 * @param { object } vm VM实例
 * @param { string } exp 指定的表达式，如：message、message.a
 * @returns vm实例中指定的值
 */
export const getValue = (vm, exp) => {
  exp = exp.split('.');
  return exp.reduce((prev, next) => {
    return prev[next];
  }, vm);
}

/**
 * 更新vm实例中的值
 * @param { object } vm VM实例
 * @param { string } exp 指定的表达式，如：message、message.a
 * @param { any } 指定的值
 * @returns newValue 
 */
export const setValue = (vm, exp, newValue) => {
  exp = exp.split('.');
  return exp.reduce((prev, next, currentIndex) => {
    if (currentIndex === exp.length - 1) {
      return prev[next] = newValue;
    }
    return prev[next];
  }, vm);
}