let canceller: number = 0;

export function setRequestAnimationFrame(
  fn: Function,
  timeout: number = 0,
) {
  const startMs = performance.now()
  const init = () => {
    canceller = requestAnimationFrame(() => {
      const curMs = performance.now();
      const diff = curMs - startMs;
      if (diff >= timeout) {
        fn();
      } else {
        init();
      }
    });
  }
  init();
  return () => {
    cancelAnimationFrame(canceller)
  }
}

export function setLoopRequestAnimationFrame(fn: Function, pace: number = 0): () => void {
  let isStop = false;
  const clear = () => {
    isStop = true;
    cancelAnimationFrame(canceller);
  }
  const init = () => {
    setRequestAnimationFrame(() => {
      fn();
      !isStop && init();
    }, pace)
  }
  init();
  return () => clear()
}
