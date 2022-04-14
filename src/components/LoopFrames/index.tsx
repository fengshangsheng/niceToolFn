import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Animate from './../../helpers/requestAnimationFrame';
import './style.less';

type IProps = {
  frames: string[]
  className?: string
  pace?: number
}

export default function (props: IProps) {
  // 已加载的帧数量
  const [loadCount, updateLoadCount] = useState<number[]>([]);
  // 当前显示的关键帧
  const [frame, updateFrame] = useState(0);
  const _refFrame = useRef(frame);

  const hasLoadEnd = useMemo<boolean>(() => {
    return loadCount.length === props.frames.length
  }, [loadCount.length]);

  const updateLoaded = (index: number) => {
    const flag = loadCount.includes(index)
    if (!flag) {
      updateLoadCount([...loadCount, index]);
    }
  }

  useLayoutEffect(() => {
    let target: any;
    if (hasLoadEnd) {
      target = new Animate(() => {
        const newFrame = _refFrame.current + 1;
        updateFrame(newFrame > props.frames.length - 1 ? 0 : newFrame)
      }, props.pace);
    }
    return () => target && target.stop()
  }, [hasLoadEnd]);

  useEffect(() => {
    _refFrame.current = frame;
  }, [frame]);

  return <ul className={`loopFrames ${props.className}`}>
    {props.frames.map((item, index) => (
      <li className={frame === index ? '' : 'disNone'} key={index}>
        <img src={item} alt=""
             onLoad={() => updateLoaded(index)}
             onError={() => {updateLoaded(index)}}
        />
      </li>
    ))}
  </ul>
}
