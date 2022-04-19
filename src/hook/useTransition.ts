import { useLayoutEffect, useState } from "react";

type TKeyVal = { [key: string]: any }
type TReturn = [TKeyVal, number, Function, number];
type TList = [number, TKeyVal]
const useTransition = function (list: TList[], active: number): TReturn {
  const [step, updateStep] = useState<number>(active);
  const [item, updateItem] = useState<TKeyVal>(list[active][1]);

  const trigger = (pointer: number) => {
    let newStep: number;
    if (typeof pointer === 'undefined') {
      newStep = step === list.length - 1 ? 0 : step + 1;
    } else {
      if (pointer > list.length || pointer < 0) {
        throw new Error('nicetoolfn => Tooltip => pointer:阙值错误,pointer不可超过数组length');
      }
      newStep = pointer;
    }
    updateStep(newStep);
  }

  useLayoutEffect(() => {
    const [time, style] = list[step];

    const transition = Object.keys(style).map((item) => {
      if (item == 'transition') {
        throw new Error('nicetoolfn => useTransitions => 不可输入:transition');
      }
      return `${item} ${time}ms`
    }).join(',');

    updateItem({
      transition,
      ...style
    });
  }, [step]);

  return [item, list[step][0], trigger, step];
}

export default useTransition;
