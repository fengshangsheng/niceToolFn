let canceller: number = 0;

const clearAnimationFrame = () => {
  canceller && cancelAnimationFrame(canceller);
}
export function setRequestAnimationFrame(
  fn: Function,
  pace: number = 0,
  startMs = performance.now()
): Function {
  const init = () => {
    clearAnimationFrame();
    canceller = requestAnimationFrame(() => {
      const curMs = performance.now();
      const diff = curMs - startMs;
      if (diff >= pace) {
        fn();
      } else {
        init();
      }
    });
  }
  init();
  return () => clearAnimationFrame();
}

export function setLoopRequestAnimationFrame(fn: Function, pace: number = 0): Function {
  let isStop = false;
  const clear = () => {
    clearAnimationFrame();
    isStop = true;
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

// 帧动画 || 模拟定时器
// export default class RequestAnimationFrame {
//   private canceller: number = 0;
//   private startTime: number = 0;
//   private flag: boolean = false; // 循环执行标识
//
//   constructor(
//     public loopFn: Function,
//     public pace: number = 1000, // 执行间隔, 默认1000ms
//   ) {}
//
//   public playLoop(loopFn?: Function) {
//     this.flag = true;
//     this.play(loopFn);
//   }
//
//   public play(loopFn?: Function) {
//     this.startTime = performance.now();
//     this.startRequestAnimationFrame(loopFn);
//   }
//
//   private startRequestAnimationFrame(loopFn?: Function) {
//     const callback = loopFn || this.loopFn;
//     cancelAnimationFrame(this.canceller);
//     this.canceller = requestAnimationFrame(() => {
//       const curTime = performance.now();
//       const diff = curTime - this.startTime;
//       if (diff >= this.pace) {
//         callback();
//         this.startTime = performance.now();
//       }
//       this.flag && this.startRequestAnimationFrame(loopFn)
//     })
//   }
//
//   public stop() {
//     this.flag = false;
//     this.canceller && cancelAnimationFrame(this.canceller);
//   }
// }
