import React, { useLayoutEffect, useRef } from 'react';
import ReactDOM from "react-dom";
import useFirstState from '../../hook/useFirstState'
import useTransition from "../../hook/useTransition";
// import useFirstState from '../../hook/useFirstState';
// import { setRequestAnimationFrame } from "../../helpers/requestAnimationFrame";
import getOffset from "../../helpers/getEleToBodyOffset";

type EPlacement = 'left' | 'top' | 'right' | 'bottom' | 'center';
type EEventType = 'click' | 'mouse'
type IOffset = {
  left: number
  top: number
  width: number
  height: number
}

let timeout: NodeJS.Timeout;
(window as any).nicetoolfn_tooltip_zIndex = 10;

function parentIsFixed(el: HTMLElement): boolean {
  if (getComputedStyle(el).position === 'fixed') {
    return true
  }
  if (el.offsetParent && el.offsetParent.tagName !== 'BODY') {
    return parentIsFixed(el.offsetParent as HTMLElement)
  }
  return false;
}

// 当未配置[placement]时,根据当前屏幕相对位置,进行默认定位
function autoDirection(root: HTMLElement): EPlacement[] {
  let direction: EPlacement[] = [];
  const offset = root.getBoundingClientRect();
  const origin = {
    left: offset.left + (offset.width / 2),
    top: offset.top + (offset.height / 2)
  }
  const docOrigin = {
    left: document.body.clientWidth / 2,
    top: document.body.clientHeight / 2,
  }
  // 1向限
  if (origin.left <= docOrigin.left && origin.top <= docOrigin.top) {
    direction = ['right', 'top'];
  }
  // 2向限
  if (origin.left >= docOrigin.left && origin.top <= docOrigin.top) {
    direction = ['left', 'top'];
  }
  // 3向限
  if (origin.left >= docOrigin.left && origin.top >= docOrigin.top) {
    direction = ['left', 'bottom'];
  }
  // 4向限
  if (origin.left <= docOrigin.left && origin.top >= docOrigin.top) {
    direction = ['right', 'bottom'];
  }

  return direction;
}

function getPlacement(placement: EPlacement[] | undefined, root: HTMLElement): EPlacement[] {
  if (typeof placement === 'undefined' || placement.length === 0) {
    placement = autoDirection(root);
  }
  return placement;
}

function computedPopupOffset(direction: EPlacement[], popupOffset: IOffset, rootOffset: IOffset, gap: number): IOffset {
  popupOffset.left = rootOffset.left;
  popupOffset.top = rootOffset.top;

  for (let i = 0; i < direction.length; i++) {
    const key = direction[i];
    switch (key) {
      case "left":
        popupOffset.left = [
          popupOffset.left - popupOffset.width - gap,
          popupOffset.left
        ][i];
        break;
      case 'right':
        popupOffset.left = [
          popupOffset.left + rootOffset.width + gap,
          popupOffset.left - (popupOffset.width - rootOffset.width)
        ][i];
        break
      case 'top':
        popupOffset.top = [
          popupOffset.top - popupOffset.height - gap,
          popupOffset.top
        ][i];
        break
      case 'bottom':
        popupOffset.top = [
          popupOffset.top + rootOffset.height + gap,
          popupOffset.top - popupOffset.height + rootOffset.height
        ][i];
        break
      case 'center':
        if (['left', 'right'].includes(direction[0])) {
          popupOffset.top = popupOffset.top - (popupOffset.height / 2) + (rootOffset.height / 2);
        }
        if (["top", "bottom"].includes(direction[0])) {
          popupOffset.left = popupOffset.left - ((popupOffset.width - rootOffset.width) / 2)
        }
        break
    }
  }

  return popupOffset
}

function computedPopupOrigin(direction: EPlacement[]) {
  let origin: string;
  switch (direction[0]) {
    case 'left':
      origin = {
        top: '100% 0',
        bottom: '100% 100%',
        center: '100% 50%',
      }[direction[1] as 'top' | 'bottom' | 'center'];
      break;
    case 'right':
      origin = {
        top: '0 0',
        bottom: '0 100%',
        center: '0 50%',
      }[direction[1] as 'top' | 'bottom' | 'center'];
      break;
    case 'top':
      origin = {
        left: '0 100%',
        right: '100% 100%',
        center: '50% 100%'
      }[direction[1] as 'left' | 'right' | 'center'];
      break;
    case 'bottom':
      origin = {
        left: '0 0',
        right: '100% 0%',
        center: '50% 0%'
      }[direction[1] as 'left' | 'right' | 'center'];
      break;
    default:
      origin = '';
  }
  return origin;
}

function computedOffsetInt(offset: IOffset): IOffset {
  return Object.entries({ ...offset }).reduce<IOffset>((pre, [key, val]) => {
    pre[key as keyof IOffset] = parseInt(String(val));
    return pre
  }, {} as IOffset);
}

// 根据定位,计算相对偏移量
function computed(placement: EPlacement[] | undefined, root: HTMLElement, popup: HTMLElement, gap: number = 10): [IOffset, string] {
  const _root = getOffset(root);
  const _popup = getOffset(popup);
  const rootOffset: IOffset = {
    left: _root.left,
    top: _root.top,
    width: root.offsetWidth,
    height: root.offsetHeight
  };
  let popupOffset: IOffset = {
    left: _popup.left,
    top: _popup.top,
    width: parseInt(window.getComputedStyle(popup.children[0]).width),
    height: parseInt(window.getComputedStyle(popup.children[0]).height)
  };

  let direction = getPlacement(placement, root);

  if (direction[0] === direction[1]) {
    throw new Error('nicetoolfn => Tooltip => placement:位置不允许重复' + direction[0] + direction[1])
  }
  if (direction[0] === 'center') {
    throw new Error('nicetoolfn => Tooltip => placement:["center"]不可为数组索引0的值')
  }
  if (direction[0] !== undefined && direction[1] === undefined) {
    direction[1] = 'center'
  }

  popupOffset = computedPopupOffset(direction, popupOffset, rootOffset, gap);

  const origin = computedPopupOrigin(direction);
  const intOffset = computedOffsetInt(popupOffset);

  return [intOffset, origin];
}

function rootEle() {
  return document.getElementById('nicetoolfn-tooltip') || (() => {
    const div = document.createElement('div')
    div.setAttribute('id', 'nicetoolfn-tooltip');
    div.style.position = 'absolute';
    div.style.left = '0';
    div.style.top = '0';
    div.style.width = '0';
    div.style.height = '0';
    document.body.appendChild(div);
    return div
  })();
}

const Root = React.forwardRef((props: any, ref: any) => {
  const { component, event } = props;
  const ele = React.Children.only(component);

  return React.cloneElement(ele, {
    ...ele.props,
    ...event,
    ref
  })
})
const Popup = React.forwardRef((props: any, ref: any) => {
  let { component: Component, style, event } = props;
  const _Component = () => {
    return typeof Component === 'function' ? <Component key={performance.now()}/>
      : React.cloneElement(Component, { key: performance.now() });
  }
  return <>{
    ReactDOM.createPortal(
      React.createElement('div', {
        ref,
        style,
        ...event
      }, [_Component()]),
      rootEle()
    )
  }</>
})

type IProps = {
  popup: React.ReactNode // 提示组件
  placement?: EPlacement[] // 提示方位
  trigger?: EEventType// 事件触发类型, 控制方式[trigger,show]二选一
  gap?: number // 间隔
  show?: boolean // 手动开启/关闭控制
  [key: string]: any
}
const Tooltip = function (props: IProps) {
  const isFirst = useFirstState();
  const { onClick, onMouseOver, onMouseLeave } = props.children.props;

  const _refTarget = useRef<HTMLElement>();
  const _refPopup = useRef<HTMLElement>();
  const [style, triggerStyle, step] = useTransition([
    [300, {
      transform: 'scale(0.9)',
      opacity: 0
    }],
    [300, {
      transform: 'scale(1)',
      opacity: 1
    }]
  ], (step: number) => {
    step === 0 && (_refPopup.current!.style.left = '-9999px');
  });
  const { children, popup, trigger } = props;

  const popupEvent = trigger ? {
    click: {},
    mouse: {
      onMouseOver: () => {
        timeout && clearTimeout(timeout);
        handleStyle('mouse', 1);
      },
      onMouseLeave: () => {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(() => {
          handleStyle('mouse', 0);
        }, 1000)
      }
    }
  }[trigger] : {};
  const targetEvent = trigger ? {
    click: {
      onClick: () => {
        handleStyle('click', step ? 0 : 1);
      }
    },
    mouse: {
      onMouseOver: () => {
        timeout && clearTimeout(timeout);
        handleStyle('mouse', 1);
      },
      onMouseLeave: () => {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(() => {
          handleStyle('mouse', 0);
        }, 1000)
      }
    }
  }[trigger] : {};

  const initChange = (step: number) => {
    initStyle();
    triggerStyle(step);
  }

  const handleStyle = (type: EEventType, step: number) => {
    if (type === 'click') {
      onClick && onClick()
    }
    if (type === 'mouse') {
      const ev = [onMouseLeave, onMouseOver][step];
      ev && ev();
    }
    initChange(step);
  }

  const initStyle = () => {
    const { gap } = props;
    const [{ left, top }, origin] = computed(
      props.placement,
      _refTarget!.current as HTMLElement,
      _refPopup!.current as HTMLElement,
      gap
    );
    const position = parentIsFixed(_refTarget!.current as HTMLElement) ? 'fixed' : 'absolute';

    _refPopup.current!.style.zIndex = '9';
    _refPopup.current!.style.position = position;
    _refPopup.current!.style.left = left + 'px';
    _refPopup.current!.style.top = top + 'px';
    _refPopup.current!.style.transformOrigin = origin;
  };

  const initDefaultStyle = () => {
    initStyle();
    setTimeout(() => {
      _refPopup.current!.style.left = '-9999px';
    });
  }

  useLayoutEffect(() => {
    if (props.show === undefined) {
      initDefaultStyle();
    }
    if (props.show === true) {
      initChange(1)
    }
    if (props.show === false) {
      isFirst && initDefaultStyle()
      !isFirst && initChange(0);
    }
  }, [props.show])

  return <>
    <Root ref={_refTarget} component={children} event={targetEvent}/>
    <Popup ref={_refPopup} component={popup} event={popupEvent} style={style}/>
  </>
}

export default Tooltip;
