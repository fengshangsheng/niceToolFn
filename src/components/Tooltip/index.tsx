import React, { useEffect, useMemo, useRef } from 'react';
import './style.less';
import ReactDOM from "react-dom";
import useTransition from "../../hook/useTransition";

type EPlacement = 'left' | 'top' | 'right' | 'bottom' | 'center';
type EEventType = 'click' | 'mouse'
type IOffset = {
  x: number
  y: number
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}
type IProps = {
  trigger: EEventType // 事件触发类型
  popup: React.ReactNode // 提示组件
  placement?: EPlacement[] // 提示方位
  [key: string]: any
}

// 当未配置[placement]时,根据当前屏幕相对位置,进行默认定位
function autoDirection(rootOffset: IOffset): EPlacement[] {
  let direction: EPlacement[] = [];
  const origin = {
    x: rootOffset.x + (rootOffset.width / 2),
    y: rootOffset.y + (rootOffset.height / 2)
  }
  const docOrigin = {
    x: document.body.clientWidth / 2,
    y: document.body.clientHeight / 2,
  }
  // 1向限
  if (origin.x < docOrigin.x && origin.y < docOrigin.y) {
    direction = ['right', 'top'];
  }
  // 2向限
  if (origin.x > docOrigin.x && origin.y < docOrigin.y) {
    direction = ['left', 'top'];
  }
  // 3向限
  if (origin.x > docOrigin.x && origin.y > docOrigin.y) {
    direction = ['left', 'bottom'];
  }
  // 4向限
  if (origin.x < docOrigin.x && origin.y > docOrigin.y) {
    direction = ['right', 'bottom'];
  }
  // 中心点
  if (origin.x === docOrigin.x && origin.y === docOrigin.y) {
    direction = ['bottom'];
  }
  return direction;
}

const getPlacement = (placement: EPlacement[] | undefined, root: HTMLElement) => {
  if (typeof placement === 'undefined' || placement.length === 0) {
    const offset = root.getBoundingClientRect();
    placement = autoDirection(offset);
  }
  return placement;
};

// 根据定位,计算相对偏移量
function computedOffset(placement: EPlacement[] | undefined, root: HTMLElement, popup: HTMLElement): [IOffset, string] {
  let direction = getPlacement(placement, root);
  let rootOffset: IOffset = root.getBoundingClientRect();
  let popupOffset: IOffset = popup.getBoundingClientRect();

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
  rootOffset = JSON.parse(JSON.stringify(rootOffset));
  popupOffset = JSON.parse(JSON.stringify(popupOffset));

  popupOffset.left = rootOffset.left;
  popupOffset.top = rootOffset.top;

  for (let i = 0; i < direction.length; i++) {
    const key = direction[i];
    switch (key) {
      case "left":
        popupOffset.left = [
          popupOffset.left - popupOffset.width,
          popupOffset.left
        ][i];
        break;
      case 'right':
        popupOffset.left = [
          popupOffset.left + rootOffset.width,
          popupOffset.left - (popupOffset.width - rootOffset.width)
        ][i];
        break
      case 'top':
        popupOffset.top = [
          popupOffset.top - popupOffset.height,
          popupOffset.top
        ][i];
        break
      case 'bottom':
        popupOffset.top = [
          popupOffset.top + rootOffset.height,
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

let timeout: NodeJS.Timeout;

export default function (props: IProps) {
  const PopupRoot = useMemo(() => {
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
  }, []);
  const refRoot = useRef<HTMLElement>();
  const refPopup = useRef<HTMLElement>();
  const [style, updateStyle] = useTransition({
    // display: 'none',
    opacity: 0.5
  }, [
    [1300, {
      transform: 'scale(1)',
      backgroundColor: '#0055ff',
      opacity: 1
    }]
  ]);
  const Popup = () => {
    let Component = props.popup;
    const { trigger } = props;
    const event = {
      click: {},
      mouse: {
        onMouseOver: () => {
          timeout && clearTimeout(timeout);
          updateStyle();
        },
        onMouseLeave: () => {
          timeout && clearTimeout(timeout);
          timeout = setTimeout(() => {
            updateStyle(0);
          }, 1000)
        }
      }
    }[trigger];
    Component = typeof Component === 'function' ? <Component/> : Component;
    Component = React.createElement('div', {
      ref: refPopup,
      ...event,
      style
    }, [Component]);
    return Component
  };

  const Root = () => {
    let Root = React.Children.only(props.children);
    const { trigger } = props;
    const event = {
      click: {
        onClick: () => {
          props.children.props.onClick();
          updateStyle();
        }
      },
      mouse: {
        onMouseOver: () => {
          timeout && clearTimeout(timeout);
          updateStyle(1);
        },
        onMouseLeave: () => {
          timeout && clearTimeout(timeout);
          timeout = setTimeout(() => {
            updateStyle(0);
          }, 1000)
        }
      }
    }[trigger];

    Root = React.cloneElement(Root, {
      ...Root.props,
      ...event,
      ref: refRoot
    }, [`123123123${Date.now()}`])

    return Root;
  }

  useEffect(() => {
    initStyle();
  }, [JSON.stringify(props.placement)])

  const initStyle = () => {
    setDefaultPosition();

    const [{ left, top }, origin] = computedOffset(
      props.placement,
      refRoot.current as HTMLElement,
      refPopup!.current as HTMLElement
    );

    refPopup.current!.style.left = left + 'px';
    refPopup.current!.style.top = top + 'px';
    refPopup.current!.style.transformOrigin = origin;
  };
  const setDefaultPosition = () => {
    refPopup.current!.style.position = 'absolute';
    refPopup.current!.style.left = refRoot.current!.style.left;
    refPopup.current!.style.top = refRoot.current!.style.top;
  }
  return <>
    {Root()}
    {ReactDOM.createPortal(Popup(), PopupRoot)}
  </>
}
