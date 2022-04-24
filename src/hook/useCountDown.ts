import { useLayoutEffect, useRef, useState } from "react";
import { setRequestAnimationFrame } from "../helpers/requestAnimationFrame";

const computedTime = (diffMs: number): [number, number, number, number] => {
  const _times: [number, number, number, number] = [0, 0, 0, 0];
  let _diffMs = diffMs;

  _times[0] = parseInt(_diffMs / (24 * 60 * 60 * 1000) + '');
  _diffMs = _diffMs % (24 * 60 * 60 * 1000);

  _times[1] = parseInt(_diffMs / (60 * 60 * 1000) + '');
  _diffMs = _diffMs % (60 * 60 * 1000);

  _times[2] = parseInt(_diffMs / (60 * 1000) + '');
  _diffMs = _diffMs % (60 * 1000);

  _times[3] = _diffMs <= 0 ? 0 : parseInt(_diffMs / 1000 + '');

  return _times;
}

let canceller: () => void;
const useCountDown = function (targetMs: number) {
  const _refTargetMs = useRef(targetMs);
  const [diffMs, triggerDiffMs] = useState(targetMs - Date.now());
  const [times, triggerTimes] = useState<[number, number, number, number]>([0, 0, 0, 0]);

  const init = () => {
    if (diffMs <= 0) {
      triggerTimes([0, 0, 0, 0]);
      return;
    }

    const times = computedTime(diffMs);
    triggerTimes(times);

    setLoopCountDown();
  }

  const setLoopCountDown = () => {
    canceller && canceller();
    canceller = setRequestAnimationFrame(() => {
      triggerDiffMs(_refTargetMs.current - Date.now());
    }, 1000);
  }

  const _triggerTargetMs = (targetMs: number) => {
    _refTargetMs.current = targetMs;
    triggerDiffMs(_refTargetMs.current - Date.now());
  }

  useLayoutEffect(() => {
    init();
  }, [diffMs])

  return [times, _triggerTargetMs];
}

export default useCountDown;

