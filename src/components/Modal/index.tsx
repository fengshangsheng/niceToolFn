import React from 'react';
import ReactDOM from 'react-dom';
import './style.less';

/**
 * @param {React.SFC<IComponentProps> | React.ReactElement<IComponentProps>} component 函数组件或组件实例
 * @param {IPropsOption} propsOption param1传入的为函数，则此项为param1的props对象
 * */
export default class Index {
  constructor(
    public component: React.SFC<IComponentProps> | React.ReactElement<IComponentProps>,
    public propsOption: IPropsOption = {}
  ) {
    this.init();
  };

  // 挂载页面目标节点
  private rootDOM: HTMLElement | null = null;
  private maskDOM: JSX.Element | null = null;
  // private flag: number = Date.now();

  private init() {
    this.rootDOM = this.initTargetDOM('root') as HTMLElement;
    this.maskDOM = this.initTargetDOM('mask') as JSX.Element;

    // this.initDomFlag(this.rootDOM, 'root');
    // this.initDomFlag(this.maskDOM, 'mask');

    this.render();

    setTimeout(() => {
      // this.playAnimate(true);
    })
  }

  initTargetDOM(type: ITargetDOM): HTMLElement | JSX.Element | null {
    switch (type) {
      case "mask":
        return <div/>;
      case "root":
        const _target: HTMLElement = document.createElement('div');
        document.body.appendChild(_target);
        return _target;
      default:
        return null;
    }
  }

  // 设置DOM节点标识
  // initDomFlag(target: HTMLElement | JSX.Element, type: ITargetDOM) {
  //   switch (type) {
  //     case "mask":
  //       console.log(target);
  //       console.log((target as JSX.Element).props.set);
  //       (target as JSX.Element).props.set({
  //         [`data-nicetoolfn-${type}`]: String(Date.now())
  //       })
  //       break;
  //     case "root":
  //       (target as HTMLElement).setAttribute(`data-nicetoolfn-${type}`, String(Date.now()));
  //       break;
  //   }
  // }

  playAnimate(isInit: boolean, callback?: Function) {
    if (isInit) {
      const allMask = Array.from(document.querySelectorAll<HTMLElement>('[data-nicetoolfn-mask]')).reverse();
      allMask[0].style.opacity = '1';
      allMask[1] && (allMask[1].style.opacity = '0');

      const content = Array.from(document.querySelectorAll<HTMLElement>('[data-nicetoolfn-mask] + *')).reverse()[0];
      content.style.opacity = '1';
      content.style.transform = 'translate(-50%, -50%) scale(1, 1)';
    } else {
      const allMask = Array.from(document.querySelectorAll<HTMLElement>('[data-nicetoolfn-mask]')).reverse();
      allMask[0].style.opacity = '0';
      allMask[1] && (allMask[1].style.opacity = '1');

      const content = Array.from(document.querySelectorAll<HTMLElement>('[data-nicetoolfn-mask] + *')).reverse()[0]
      content.style.opacity = '0';
      content.style.transform = 'translate(-50%, -50%) scale(1.1, 1.1)';
    }
    callback && callback()
  }

  // 关闭当前弹窗
  closeModal() {
    this.playAnimate(false, () => setTimeout(() => {
      const modalId: string | null = (this.rootDOM as HTMLElement).getAttribute('data-nicetoolfn-modal')
      const targetDom = document.querySelector<Element>(`[data-nicetoolfn-modal="${modalId}"]`);

      ReactDOM.unmountComponentAtNode(this.rootDOM as HTMLElement);

      // @ts-ignore
      targetDom !== null && targetDom.parentNode.removeChild(targetDom);
    }, 150));
  }

  render() {
    const Component = this.component;
    const Mask = this.maskDOM;
    console.log('Mask', Mask);
    ReactDOM.render(
      <div>
        {Mask}

        {typeof Component === 'object' && Component}
        {typeof Component === 'function' && <Component
          {...this.propsOption}
        />}
      </div>,
      this.rootDOM as HTMLElement
    );
  }
}


interface IComponentProps {
  [key: string]: any
}

interface IPropsOption {
  [key: string]: any
}

type ITargetDOM = 'root' | 'mask';
