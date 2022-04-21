import { useLayoutEffect, useState } from "react";
import { setRequestAnimationFrame } from './../helpers/requestAnimationFrame';

export type TKeyVal = { [key: string]: any }
export type TReturn = [TKeyVal, Function, number];
export type TList = [number, TKeyVal];

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

    if (typeof pointer === 'undefined') {
      if (_step === -1) {
        newStep = 0
      } else {
        newStep = _step === list.length - 1 ? 0 : _step + 1;
      }
    } else {
      if (pointer > list.length || pointer < 0) {
        throw new Error('nicetoolfn => Tooltip => pointer:阙值错误,pointer不可超过数组length');
      }
      newStep = pointer;
    }
    console.log('newStep', newStep);
    updateStep(newStep);
  }
  useLayoutEffect(() => {
    if (_step === -1) {
      return;
    }

    const [time, style] = list[_step];
    const [, preStyle] = list[_step - 1] ? list[_step - 1] : list[list.length - 1]
    const newStyle = {
      ...preStyle,
      ...style
    }

    const transition = Object.keys(newStyle).map((item) => {
      if (item == 'transition') {
        throw new Error('nicetoolfn => useTransitions => 不可输入:transition');
      }

      item = item.replace(/[A-Z]/g, '-$&').toLowerCase();

      return `${item} ${time}ms`
    }).join(',');
    console.log('style', _step, style);
    updateItem({ transition, ...style });

    initCallback(_step);
  }, [_step]);

  return [item, trigger, _step]; // [style对象, 切换方法, 当前步伐];
}

export default useTransition;
