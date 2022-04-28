import React, { useEffect, useMemo, useRef, useState } from 'react';
import { setRequestAnimationFrame } from '../../helpers/requestAnimationFrame';
import useFirstState from '../../hook/useFirstState';


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

type IProps = {
  frames: string[] // 帧图片
  className?: string // 类名
  pace?: number // 步伐
  pause?: boolean // 是否暂停动画
}

const LoopFrames = (props: IProps) => {
  const isFirst = useFirstState();
  const _refClearFn = useRef<undefined | (() => void)>();
  // 已加载的帧数量
  const [loadFrame, triggerLoadFrame] = useState<string[]>([]);
  // 当前显示的关键帧
  const [frame, updateFrame] = useState(0);

  const updateLoaded = (frame: string) => {
    const flag = loadFrame.includes(frame)
    if (!flag) {
      triggerLoadFrame([...loadFrame, frame]);
    }
  }

  const hasLoadEnd = useMemo<boolean>(() => {
    return loadFrame.length === props.frames.length
  }, [loadFrame.length]);

  const play = () => {
    stop();
    changeNextFrames();
  }
  const stop = () => {
    _refClearFn.current && _refClearFn.current()
  }
  const changeNextFrames = () => {
    _refClearFn.current = setRequestAnimationFrame(() => {
      let newFrame = frame + 1;
      newFrame = newFrame > props.frames.length - 1 ? 0 : newFrame;
      updateFrame(newFrame);
    }, props.pace || 60);
  }

  useEffect(() => {
    console.log(props.pause);
    if (hasLoadEnd && [undefined, false].includes(props.pause)) {
      console.log('useEffect');
      play()
    }
    return () => stop();
  }, [hasLoadEnd]);
  useEffect(() => {
    if (isFirst) {
      return;
    }
    // 暂停状态，激活帧数非首张
    if (props.pause === true && frame !== 0) {
      play();
      return;
    }
    if (props.pause === false) {
      play();
      return;
    }
  }, [props.pause])
  useEffect(() => {
    if (isFirst) {
      return;
    }
    // 暂停状态，且激活帧数为第首张
    if (props.pause === true && frame === 0) {
      return;
    }
    changeNextFrames();
  }, [frame]);

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
export default LoopFrames;
