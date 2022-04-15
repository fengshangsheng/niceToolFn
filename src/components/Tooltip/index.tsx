import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from "react-dom";
import Animate from './../../helpers/requestAnimationFrame';
import './style.less';

type EPlacement = 'left' | 'top' | 'right' | 'bottom' | 'center';
type EEventType = 'click' | 'mouse'
type IOffset = {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}
type IProps = {
  children: React.ReactChild[]
  trigger: EEventType
  placement?: EPlacement[]
  className?: string
  [key: string]: any
}

let mouseCanceller: NodeJS.Timeout;

// 当未配置[placement]时,根据当前屏幕相对位置,进行默认定位
function autoDirection(targetOffset: IOffset): EPlacement[] {
  let direction: EPlacement[] = [];
  const origin = {
    x: targetOffset.left + (targetOffset.width / 2),
    y: targetOffset.top + (targetOffset.top / 2)
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

// 根据定位,计算相对偏移量
function computeOffset(direction: EPlacement[], targetOffset: IOffset, floatOffset: IOffset): IOffset {
  floatOffset.left = targetOffset.left;
  floatOffset.top = targetOffset.top;

  if (direction.length !== 0 && direction[0] === direction[1]) {
    throw new Error('nicetoolfn=>Tooltip=>placement:位置不允许重复')
  }
  if (direction[0] === 'center') {
    throw new Error('nicetoolfn=>Tooltip=>placement:["center"]不可为数组索引0的值')
  }
  if (direction[0] !== undefined && [1] === undefined) {
    direction[1] = 'center'
  }
  if (direction.length === 0) {
    direction = autoDirection(targetOffset);
  }

  for (let i = 0; i < direction.length; i++) {
    const key = direction[i];
    switch (key) {
      case "left":
        floatOffset.left = [
          floatOffset.left - floatOffset.width,
          floatOffset.left
        ][i];
        break;
      case 'right':
        floatOffset.left = [
          floatOffset.left + targetOffset.width,
          floatOffset.left - (floatOffset.width - targetOffset.width)
        ][i];
        break
      case 'top':
        floatOffset.top = [
          floatOffset.top - floatOffset.height,
          floatOffset.top
        ][i];
        break
      case 'bottom':
        floatOffset.top = [
          floatOffset.top + targetOffset.height,
          floatOffset.top - floatOffset.height + targetOffset.height
        ][i];
        break
      case 'center':
        if (['left', 'right'].includes(direction[0])) {
          floatOffset.top = floatOffset.top - (floatOffset.height / 2) + (targetOffset.height / 2)
        }
        if (["top", "bottom"].includes(direction[0])) {
          floatOffset.left = floatOffset.left - (floatOffset.width / 2) + (targetOffset.width / 2)
        }
        break
    }
  }
  return floatOffset
}

export default function (props: IProps) {
  const [target, float] = React.Children.toArray(props.children);
  const [show, updateShow] = useState<boolean>(false);
  const _refShow = useRef(show);
  const _refTargetDiv = useRef<HTMLElement>();
  const _refFloatDiv = useRef<HTMLElement>();
  const root = useMemo(() => {
    return document.getElementById('nicetoolfn-tooltip') || (() => {
      const div = document.createElement('div')
      div.setAttribute('id', 'nicetoolfn-tooltip');
      document.body.appendChild(div);
      return div
    })();
  }, []);

  const TargetDiv = useMemo(() => React.forwardRef((_props, ref) => {
    // @ts-ignore
    const { onClick } = React.Children.toArray(props.children[0])[0].props;
    const { children, placement, trigger, ...otherProps } = props;
    const event = {
      click: {
        onClick: () => {
          updateShow(!show)
          onClick && onClick();
        }
      },
      mouse: {
        onMouseOver: () => {
          clearTimeout(mouseCanceller)
          updateShow(true);
        },
        onMouseLeave: () => {
          mouseCanceller = setTimeout(() => {
            updateShow(false);
          }, 1000)
        }
      }
    }[trigger] || {}
    return React.cloneElement(target as React.ReactElement, {
      ...otherProps,
      ..._props,
      ...event,
      ref
    });
  }), [target])
  const FloatDiv = useMemo(() => React.forwardRef((_props: any, ref) => {
    // @ts-ignore
    const { style } = React.Children.toArray(props.children[1])[0].props;
    const { trigger } = props;
    const event = {
      click: {},
      mouse: {
        onMouseOver: () => {
          clearTimeout(mouseCanceller);
          updateShow(true)
        },
        onMouseLeave: () => {
          mouseCanceller = setTimeout(() => {
            updateShow(false)
          }, 1000);
        }
      }
    }[trigger] || {}
    const newStyle = { ...style, ..._props.style }
    return React.cloneElement(float as React.ReactElement, { ..._props, ...event, ref, style: newStyle })
  }), [float]);

  const scrollAnimate = useMemo<Animate>(() => {
    return new Animate(function () {
      if (!_refTargetDiv.current || !_refFloatDiv.current) {
        return;
      }
      const targetOffset = JSON.parse(JSON.stringify(_refTargetDiv.current!.getBoundingClientRect()));
      const floatOffset = JSON.parse(JSON.stringify(_refFloatDiv.current!.getBoundingClientRect()));
      const offset = computeOffset(props.placement || [], targetOffset, floatOffset);
      _refFloatDiv.current!.style.left = offset.left + 'px';
      _refFloatDiv.current!.style.top = offset.top + 'px';
    }, 0);
  }, [props.placement]);

  useEffect(() => {
    _refShow.current = show;
    show && scrollAnimate.play();
  }, [show])
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (_refShow.current) {
        scrollAnimate.play()
      } else {
        scrollAnimate?.stop();
      }
    });
    return () => window.removeEventListener('scroll', () => {});
  }, [])

  return <>
    {<TargetDiv ref={_refTargetDiv}/>}
    {String(show)}
    {show && ReactDOM.createPortal(<FloatDiv
      ref={_refFloatDiv}
      style={({
        position: 'fixed',
        transition: 'all 0.3s'
      })}
    />, root)}
  </>
}
