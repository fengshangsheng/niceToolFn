import React from 'react';
import ReactDOM from 'react-dom';
import { isDomEle } from '@/uitls';
import { Component, Mask } from '@/components/Modal/style';
import { StyledComponent } from "styled-components";

interface IComponentProps {
  // 关闭弹窗
  closeModal: Function
}

interface IPropsOption {
  [key: string]: any
}

export default class Modal {
  constructor(component: React.SFC<IComponentProps>, props: IPropsOption = {}) {
    this.content = component;
    this.props = props;
    this.init();
  };

  // 内容主体
  content: React.SFC<IComponentProps>;
  // 挂载页面目标节点
  targetContentNode?: HTMLElement;
  //
  props?: IPropsOption;

  init() {
    this.targetContentNode = this.verifyParameter();

    this.setDomFlag(this.targetContentNode, 'modal');
    this.setDomFlag(Mask, 'mask');
    this.render();

    setTimeout(() => {
      this.playAnimate(true);
    })
  }

  // 验证参数
  verifyParameter() {
    if (this.targetContentNode === undefined) {
      const _target: HTMLElement = document.createElement('div');
      document.body.appendChild(_target);
      return _target;
    }
    return this.targetContentNode
  }

  // 设置DOM节点标识
  setDomFlag(target: HTMLElement | StyledComponent<any, any>, type: string) {
    if (isDomEle(target)) {
      target.setAttribute(`data-nicetoolfn-${type}`, Date.now());
    } else {
      (target as StyledComponent<any, any>).attrs = [
        ...(target as StyledComponent<any, any>).attrs,
        { [`data-nicetoolfn-${type}`]: String(Date.now()) }
      ]
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

  // 关闭当前弹窗
  closeModal() {
    this.playAnimate(false, () => setTimeout(() => {
      const modalId: string | null = (this.targetContentNode as HTMLElement).getAttribute('data-nicetoolfn-modal')
      const targetDom = document.querySelector<Element>(`[data-nicetoolfn-modal="${modalId}"]`);

      // @ts-ignore
      this.aaaaaa();
      console.log('this[\'aaaaaa\']', this);

      ReactDOM.unmountComponentAtNode(this.targetContentNode as HTMLElement);
      // @ts-ignore
      targetDom !== null && targetDom.parentNode.removeChild(targetDom);
    }, 150));
  }

  render() {
    const Content = this.content;
    ReactDOM.render(
      <Component>
        <Mask/>
        <Content
          closeModal={() => this.closeModal()}
          {...this.props}
        />
      </Component>,
      this.targetContentNode as HTMLElement
    );
  }
}

