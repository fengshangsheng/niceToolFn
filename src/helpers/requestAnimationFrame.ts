// 帧动画 || 模拟定时器
export default class RequestAnimationFrame {
  private canceller: number = 0;
  private startTime: number = 0;
  private flag: boolean = false; // 循环执行标识

  constructor(
    public loopFn: Function,
    public pace: number = 1000, // 执行间隔, 默认1000ms
  ) {}

  public playLoop(loopFn?: Function) {
    this.flag = true;
    this.play(loopFn);
  }

  public play(loopFn?: Function) {
    this.startTime = performance.now();
    this.startRequestAnimationFrame(loopFn);
  }

  private startRequestAnimationFrame(loopFn?: Function) {
    const callback = loopFn || this.loopFn;
    cancelAnimationFrame(this.canceller);
    this.canceller = requestAnimationFrame(() => {
      const curTime = performance.now();
      const diff = curTime - this.startTime;
      if (diff >= this.pace) {
        callback();
        this.startTime = performance.now();
      }
      this.flag && this.startRequestAnimationFrame(loopFn)
    })
  }

  public stop() {
    this.flag = false;
    this.canceller && cancelAnimationFrame(this.canceller);
  }
}
