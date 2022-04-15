export type IOffset = {
  top: number
  left: number
}
export default function (target: HTMLElement):IOffset {
  let top = target.offsetTop; //获取该元素对应父容器的上边距
  let left = target.offsetLeft; //对应父容器的上边距
  // 判断是否有父容器，如果存在则累加其边距
  // @ts-ignore
  while (target = target.offsetParent) {//等效 obj = obj.offsetParent;while (obj != undefined)
    top += target.offsetTop; //叠加父容器的上边距
    left += target.offsetLeft; //叠加父容器的左边距
  }
  return { top, left };
}
