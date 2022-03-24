interface IOption {
  callback: (res: IReturn) => any;
  day?: boolean;
  hour?: boolean;
  minute?: boolean;
  milli?: boolean;
}

interface IReturn {
  day?: string
  hour?: string
  minute?: string
  milli?: string
}

export default class CountDown {
  constructor(public endTime: string, public option: IOption) {
    this.init();
  }

  private day = 0;
  private hour = 0;
  private minute = 0;
  private milli = 0;

  private getReturnTime(): IReturn {
    const obj: IReturn = {}
    this.option.day && (obj['day'] = String(this.day).padStart(2, '0'));
    this.option.hour && (obj['hour'] = String(this.hour).padStart(2, '0'));
    this.option.minute && (obj['minute'] = String(this.minute).padStart(2, '0'));
    this.option.milli && (obj['milli'] = String(this.milli).padStart(2, '0'));
    return obj;
  }

  private init() {
    let diffTime = new Date(this.endTime).getTime() - Date.now();

    if (diffTime < 0) {
      this.option.callback && this.option.callback(this.getReturnTime());
      return;
    }

    this.computedTime(diffTime);

    this.option.callback && this.option.callback(this.getReturnTime());

    setTimeout(() => {
      this.init();
    }, 1000);
  }

  private computedTime(time: number) {
    if (this.option.day === true) {
      this.day = parseInt(time / (24 * 60 * 60 * 1000) + '');
      time = time % (24 * 60 * 60 * 1000);
    }
    if (this.option.hour === true) {
      this.hour = parseInt(time / (60 * 60 * 1000) + '');
      time = time % (60 * 60 * 1000);
    }
    if (this.option.minute === true) {
      this.minute = parseInt(time / (60 * 1000) + '');
      time = time % (60 * 1000);
    }
    if (this.option.milli === true) {
      this.milli = parseInt(time / 1000 + '');
    }
  }
}
