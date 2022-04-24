import { useLayoutEffect, useRef, useState } from "react";
import { setRequestAnimationFrame } from '../helpers/requestAnimationFrame';
import { useFirstState } from "./index";

export type TKeyVal = { [key: string]: any }
export type TReturn = [TKeyVal, Function, number];
export type TList = [number, TKeyVal];

const filterTransition = [
  'z-index',
  'transition',
  'display',
]

let canceller: Function;
const useTransition = function (styleList: TList[], animateEnd?: (_new: number, _old: number) => void): TReturn {
  const isFirst = useFirstState();
  const _refOldStep = useRef(-1);
  const [step, triggerStep] = useState<number>(0);
  const [style, triggerStyle] = useState<TKeyVal>(styleList[step][1]);

  useLayoutEffect(() => {
    if (isFirst) {
      return;
    }

    const style = initStyle();
    triggerStyle(style);

    initCallback();
  }, [step]);

  const initCallback = () => {
    if (animateEnd) {
      canceller && canceller();
      canceller = setRequestAnimationFrame(
        () => animateEnd(step, _refOldStep.current),
        styleList[step][0]
      );
    }
  }
  const initStyle = () => {
    const [time, newStyle] = styleList[step];
    const preStyle = styleList[_refOldStep.current][1];

    const transition = isFirst ? 'none' : initTransition(style, time);

    return {
      ...preStyle,
      ...newStyle,
      transition
    }
  }
  const initTransition = (style: TKeyVal, time: number) => {
    const styleKey = Object.keys(style)
      .map((item) => {
        item = item.replace(/[A-Z]/g, '-$&').toLowerCase();
        return item;
      })
      .filter((key) => {
        return !filterTransition.includes(key)
      });

    const transition = styleKey.map((item) => {
      return `${item} ${time}ms`;
    }).join(',');

    return transition;
  }

  const trigger = (pointer: number = step + 1) => {
    let newStep = pointer === styleList.length ? 0 : pointer;
    _refOldStep.current = step;
    triggerStep(newStep);
  }

  return [style, trigger, step]; // [style对象, 切换方法, 当前步伐];
}

export default useTransition;
