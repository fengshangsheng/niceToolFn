import { useLayoutEffect, useRef, useState } from "react";
import { setLoopRequestAnimationFrame } from "../helpers/requestAnimationFrame";

const useCountDown = function (timeMs: number) {
  const [diffMs, triggerDiffMs] = useState(Date.now() - timeMs);
  const _refDiffMs = useRef(triggerDiffMs);
  const [times, triggerTimes] = useState<[number, number, number, number]>([0, 0, 0, 0]);

  useLayoutEffect(() => {
    const _times = computedTime();
    triggerTimes([..._times]);
    _refDiffMs.current = triggerDiffMs;

    let clearFn: Function;
    if (!_times.every(item => item === 0)) {
      clearFn = setLoopRequestAnimationFrame(() => {
        console.log('setLoopRequestAnimationFrame',Date.now());
        _refDiffMs.current(Date.now() - timeMs);
      }, 1000)
    }
    return () => clearFn && clearFn();
  }, [diffMs]);

  const computedTime = () => {
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

  return times;
}

export default useCountDown;

