function getOffset(ele: HTMLElement) {
  let parentEle = ele;
  let left = 0;
  let top = 0;

  init();

  function init() {
    left += parentEle.offsetLeft;
    top += parentEle.offsetTop;

    if (parentEle.offsetParent && parentEle.offsetParent.tagName !== 'BODY') {
      parentEle = parentEle.offsetParent as HTMLElement;
      init();
    }
  }

  return { left, top }
}

export default getOffset
