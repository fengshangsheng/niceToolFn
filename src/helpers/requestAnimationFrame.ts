
export default class RequestAnimationFrame {
  private canceller: number = 0;
  private startTime: number = 0;

  constructor(
    public loopFn: Function,
    public pace: number = 1000 // 执行间隔, 默认1000ms
  ) {
    this.play();
  }

  public play() {
    this.stop();
    this.startTime = performance.now();
    this.startRequestAnimationFrame();
  }

  public stop() {
    cancelAnimationFrame(this.canceller);
  }

  private startRequestAnimationFrame() {
    this.canceller = requestAnimationFrame(() => {
      if (performance.now() - this.startTime  >= this.pace) {
        this.loopFn && this.loopFn();
        this.startTime = performance.now();
      }
      this.startRequestAnimationFrame();
    })
  }
}
