import React, { useEffect, useRef } from 'react';
import ReactDOM from "react-dom";
import useTransition from "../../hook/useTransition";
import { setRequestAnimationFrame } from "../../helpers/requestAnimationFrame";

type EPlacement = 'left' | 'top' | 'right' | 'bottom' | 'center';
type EEventType = 'click' | 'mouse'
type IOffset = {
  left: number
  top: number
  width: number
  height: number
}
type IProps = {
  trigger: EEventType // 事件触发类型
  popup: React.ReactNode // 提示组件
  placement?: EPlacement[] // 提示方位
  gap?: number // 间隔
  [key: string]: any
}

let timeout: NodeJS.Timeout;
const Tooltip = function (props: IProps) {
  const _refTarget = useRef<HTMLElement>();
  const _refPopup = useRef<HTMLElement>();
  const [style, triggerStyle] = useTransition({
    opacity: 0,
    transform: 'scale(0)'
  }, [
    [100, {
      transform: 'scale(1)',
      opacity: 1
    }],
    [100, {
      transform: 'scale(0.8)',
      opacity: 0
    }]
  ], (step: number) => {
    step === 1 && (_refPopup.current!.style.transform = 'scale(0)')
  });

  useEffect(() => {
    initStyle();

    window.addEventListener('scroll', () => {
      setRequestAnimationFrame(initStyle, 300);
    })
    return window.removeEventListener('scroll', () => {});
  }, [JSON.stringify(style)]);

  const initStyle = () => {
    const { gap } = props;
    const [{ left, top }, origin] = computedOffset(
      props.placement,
      _refTarget!.current as HTMLElement,
      _refPopup!.current as HTMLElement,
      gap
    );

    _refPopup.current!.style.position = 'absolute';
    _refPopup.current!.style.left = left + 'px';
    _refPopup.current!.style.top = top + 'px';
    _refPopup.current!.style.transformOrigin = origin;
  };

  const { children, popup, trigger } = props;

  const popupEvent = {
    click: {},
    mouse: {
      onMouseOver: () => {
        timeout && clearTimeout(timeout);
        triggerStyle(0);
      },
      onMouseLeave: () => {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(() => {
          triggerStyle(1);
        }, 1000)
      }
    }
  }[trigger];
  const targetEvent = {
    click: {
      onClick: () => {
        const { onClick } = props.children.props;
        onClick && onClick();
        triggerStyle();
      }
    },
    mouse: {
      onMouseOver: () => {
        timeout && clearTimeout(timeout);
        triggerStyle(0);
      },
      onMouseLeave: () => {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(() => {
          triggerStyle(1);
        }, 1000)
      }
    }
  }[trigger];

  return <>
    <Root ref={_refTarget} component={children}
          event={targetEvent}
    />
    <Popup ref={_refPopup} component={popup}
           event={popupEvent}
           style={style}
    />
  </>
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

// 当未配置[placement]时,根据当前屏幕相对位置,进行默认定位
function autoDirection(rootOffset: IOffset): EPlacement[] {
  let direction: EPlacement[] = [];
  const origin = {
    left: rootOffset.left + (rootOffset.width / 2),
    top: rootOffset.top + (rootOffset.height / 2)
  }
  const docOrigin = {
    left: document.body.clientWidth / 2,
    top: document.body.clientHeight / 2,
  }
  // 1向限
  if (origin.left < docOrigin.left && origin.top < docOrigin.top) {
    direction = ['right', 'top'];
  }
  // 2向限
  if (origin.left > docOrigin.left && origin.top < docOrigin.top) {
    direction = ['left', 'top'];
  }
  // 3向限
  if (origin.left > docOrigin.left && origin.top > docOrigin.top) {
    direction = ['left', 'bottom'];
  }
  // 4向限
  if (origin.left < docOrigin.left && origin.top > docOrigin.top) {
    direction = ['right', 'bottom'];
  }
  // 中心点
  if (origin.left === docOrigin.left && origin.top === docOrigin.top) {
    direction = ['bottom'];
  }
  return direction;
}

function getPlacement(placement: EPlacement[] | undefined, root: HTMLElement) {
  if (typeof placement === 'undefined' || placement.length === 0) {
    const offset = root.getBoundingClientRect();
    placement = autoDirection(offset);
  }
  return placement;
}

// 根据定位,计算相对偏移量
function computedOffset(placement: EPlacement[] | undefined, root: HTMLElement, popup: HTMLElement, gap: number = 10): [IOffset, string] {
  let direction = getPlacement(placement, root);
  const rootOffset: IOffset = {
    left: root.offsetLeft,
    top: root.offsetTop,
    width: root.offsetWidth,
    height: root.offsetHeight
  };
  const popupOffset: IOffset = {
    left: popup.offsetLeft,
    top: popup.offsetTop,
    width: popup.offsetWidth,
    height: popup.offsetHeight
  };

  if (direction.length === 0) {
    direction = autoDirection(rootOffset);
  }
  if (direction[0] === direction[1]) {
    throw new Error('nicetoolfn => Tooltip => placement:位置不允许重复')
  }
  if (direction[0] === 'center') {
    throw new Error('nicetoolfn => Tooltip => placement:["center"]不可为数组索引0的值')
  }
  if (direction[0] !== undefined && [1] === undefined) {
    direction[1] = 'center'
  }

  let origin: string;

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

  return [
    Object.entries(JSON.parse(JSON.stringify(popupOffset))).reduce<IOffset>((pre, [key, val]) => {
      // @ts-ignore
      pre[key] = parseInt(val);
      return pre
    }, {} as IOffset),
    origin
  ];
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

export default Tooltip;
