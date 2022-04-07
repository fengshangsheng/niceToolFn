interface IOption {
  callback: (res: IReturn | false) => any;
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
  constructor(public endTime: string | number, public option: IOption) {
    this.init();
  }

  private _time: NodeJS.Timeout | undefined;
  private day = 0;
  private hour = 0;
  private minute = 0;
  private milli = 0;

  private getReturnTime(): IReturn | false {
    if (this.day === 0 && this.hour === 0 && this.minute === 0 && this.milli === 0) {
      return false;
    }

    const obj: IReturn = {}
    this.option.day && (obj['day'] = String(this.day).padStart(2, '0'));
    this.option.hour && (obj['hour'] = String(this.hour).padStart(2, '0'));
    this.option.minute && (obj['minute'] = String(this.minute).padStart(2, '0'));
    this.option.milli && (obj['milli'] = String(this.milli).padStart(2, '0'));
    return obj;
  }

  private init() {
    let diffTime = new Date(this.endTime).getTime() - Date.now();

    this.computedTime(diffTime);

    this.option.callback && this.option.callback(this.getReturnTime());

    if (diffTime > 0) {
      this._time && clearTimeout(this._time);
      this._time = setTimeout(() => {
        this.init();
      }, 1000);
    }
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
      this.milli = time <= 0 ? 0 : parseInt(time / 1000 + '');
    }
  }

  public stopCountDown() {
    this._time && clearTimeout(this._time);
  }
}
