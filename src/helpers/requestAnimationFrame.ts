export function setRequestAnimationFrame(
  fn: Function,
  timeout: number = 0,
) {
  let canceller: number = 0;
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
