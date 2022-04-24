import React, { useEffect, useMemo, useRef, useState } from 'react';
import { setLoopRequestAnimationFrame } from '../../helpers/requestAnimationFrame';

type IProps = {
  frames: string[]
  className?: string
  pace?: number
}

const _styleUl: { [key: string]: any } = {
  display: 'inline-block',
  position: 'relative'
}
const _styleLi: { [key: string]: any } = {
  position: 'absolute',
  userSelect: 'none',
  left: 0,
  top: 0
}

let clearFn: Function;
export default function (props: IProps) {
  // 已加载的帧数量
  const [loadFrame, triggerLoadFrame] = useState<string[]>([]);
  // 当前显示的关键帧
  const [frame, updateFrame] = useState(0);
  const _refFrame = useRef(frame);

  const updateLoaded = (frame: string) => {
    const flag = loadFrame.includes(frame)
    if (!flag) {
      triggerLoadFrame([...loadFrame, frame]);
    }
  }

  const hasLoadEnd = useMemo<boolean>(() => {
    return loadFrame.length === props.frames.length
  }, [loadFrame.length]);

  useEffect(() => {
    if (hasLoadEnd) {
      clearFn = setLoopRequestAnimationFrame(() => {
        let newFrame = _refFrame.current + 1;
        newFrame = newFrame > props.frames.length - 1 ? 0 : newFrame;
        _refFrame.current = newFrame;
        updateFrame(newFrame);
      }, props.pace || 60);
    }
    return () => clearFn && clearFn();
  }, [hasLoadEnd]);

  return <ul className={props.className || ''} style={_styleUl}>
    {props.frames.map((item, index) => (
      <li key={index} style={({ ..._styleLi, opacity: frame === index ? 1 : 0 })}>
        <img src={item} alt=""
             onLoad={() => updateLoaded(item)}
             onError={() => {updateLoaded(item)}}
        />
      </li>
    ))}
  </ul>
}
