import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
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
  private flag: number = Date.now();
  private showModal: boolean = false

  private init() {
    this.rootDOM = this.initTargetDOM('root') as HTMLElement;
    this.rootDOM.setAttribute('data-nicetoolfn-modal', String(this.flag));

    this.setShowModal(true);
    this.render();
  }

  initTargetDOM(type: ITargetDOM): HTMLElement | null {
    switch (type) {
      case "root":
        const _target: HTMLElement = document.createElement('div');
        document.body.appendChild(_target);
        return _target;
      default:
        return null;
    }
  }

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

  closeModal() {
    this.setShowModal(false);
    // this.playAnimate(false, () => setTimeout(() => {
    //   const modalId: string | null = (this.rootDOM as HTMLElement).getAttribute('data-nicetoolfn-modal')
    //   const targetDom = document.querySelector<Element>(`[data-nicetoolfn-modal="${modalId}"]`);
    //
    //   ReactDOM.unmountComponentAtNode(this.rootDOM as HTMLElement);
    //
    //   // @ts-ignore
    //   targetDom !== null && targetDom.parentNode.removeChild(targetDom);
    // }, 150));
  }

  setShowModal(data: boolean) {
    this.showModal = data
  }

  render() {
    const Component = this.component;
    ReactDOM.render(
      <>
        <div data-nicetoolfn-mask={this.flag}/>
        <CSSTransition
          in={this.showModal}
          timeout={300}
          classNames="modal"
          appear
        >
          {typeof Component === 'object' ? Component :
            typeof Component === 'function' ? <Component {...this.propsOption}/>
              : Component}
        </CSSTransition>
      </>,
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

type ITargetDOM = 'root';
