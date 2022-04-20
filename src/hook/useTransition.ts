import { useLayoutEffect, useState } from "react";
import { setRequestAnimationFrame } from './../helpers/requestAnimationFrame';

type TKeyVal = { [key: string]: any }
type TReturn = [TKeyVal, Function, number];
type TList = [number, TKeyVal]

let canceller: Function;
const useTransition = function (_default: TKeyVal, list: TList[], animateEnd?: Function): TReturn {
  const [_step, updateStep] = useState<number>(-1);
  const [item, updateItem] = useState<TKeyVal>(_default);
  const initCallback = (newStep: number) => {
    if (animateEnd) {
      canceller && canceller();
      canceller = setRequestAnimationFrame(() => animateEnd(newStep), list[newStep][0]);
    }
  }

  const trigger = (pointer?: number) => {
    let newStep: number;

    if (_step === -1) {
      newStep = 0;
    } else if (typeof pointer === 'undefined') {
      newStep = _step === list.length - 1 ? 0 : _step + 1;
    } else {
      if (pointer > list.length || pointer < 0) {
        throw new Error('nicetoolfn => Tooltip => pointer:阙值错误,pointer不可超过数组length');
      }
      newStep = pointer;
    }

    updateStep(newStep);
  }
  useLayoutEffect(() => {
    if (_step === -1) {
      return;
    }

    const [time, style] = list[_step];
    const [, preStyle] = list[_step - 1] ? list[_step - 1] : list[list.length - 1]

    const transition = Object.keys({ ...style, ...preStyle }).map((item) => {
      if (item == 'transition') {
        throw new Error('nicetoolfn => useTransitions => 不可输入:transition');
      }

      item = item.replace(/[A-Z]/g, '-$&').toLowerCase();

      return `${item} ${time}ms`
    }).join(',');

    updateItem({ transition, ...style });

    initCallback(_step);
  }, [_step]);

  return [item, trigger, _step]; // [style对象, 切换方法, 当前步伐];
}

export default useTransition;
