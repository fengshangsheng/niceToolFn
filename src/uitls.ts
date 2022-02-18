// 判断是否为原生DOM节点元素
function isDomEle(target: object | HTMLElement) {
  return (typeof HTMLElement === 'object') ?
    target instanceof HTMLElement
    : target && typeof target === 'object' && (target as HTMLElement).nodeType === 1 && typeof (target as HTMLElement).nodeName === 'string';
}

export { isDomEle }
export default { isDomEle };
