import React, { useCallback, useEffect, useRef, useState } from 'react';
import { setRequestAnimationFrame } from '../../helpers/requestAnimationFrame';

type IProps = {
  frames: string[] // 帧图片
  className?: string // 类名
  pace?: number // 步伐
  pause?: boolean // 是否暂停动画
}

const LoopFrames = (props: IProps) => {
  const _refClearFn = useRef<undefined | (() => void)>();
  const [frames] = useState<string[]>(props.frames);
  const [loadEnd, triggerLoadEnd] = useState<boolean>(false);
  // 当前显示的关键帧
  const [frameIdx, triggerFrameIdx] = useState(0);

  const windowOnLoad = useCallback(() => {
    triggerLoadEnd(true);
  }, []);

  const play = () => {
    stop();
    changeNextFrames();
  }
  const stop = () => {
    _refClearFn.current && _refClearFn.current()
  }
  const changeNextFrames = () => {
    _refClearFn.current = setRequestAnimationFrame(() => {
      let newFrame = frameIdx + 1;
      newFrame = newFrame > frames.length - 1 ? 0 : newFrame;
      triggerFrameIdx(newFrame);
    }, props.pace);
  }

  useEffect(() => {
    window.addEventListener('load', windowOnLoad)
    return () => window.removeEventListener('load', windowOnLoad);
  }, []);

  useEffect(() => {
    if (!loadEnd) {
      return;
    }
    if (props.pause === undefined || !props.pause) {
      play();
      return;
    }
  }, [loadEnd]);
  useEffect(() => {
    if (!loadEnd) {
      return;
    }
    if (props.pause && frameIdx === 0) {
      return;
    }
    play();
  }, [frameIdx]);
  useEffect(() => {
    if (!loadEnd) {
      return;
    }
    if (props.pause) {
      frameIdx === 0 && stop()
      frameIdx !== 0 && play();
    }
    if (!props.pause) {
      play();
    }
  }, [props.pause]);

  return <img src={frames[frameIdx]} className={props.className} alt=''/>
}
export default LoopFrames;
