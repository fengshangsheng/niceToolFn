import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { isDomEle } from '@/uitls';
import { Component, Mask } from '@/components/Modal/style';
import { StyledComponent } from "styled-components";

export default class Modal {
  constructor(component: typeof React.Component) {
    this.content = component;
    this.init();

    console.log('fengfeng');
    console.log(new Map());
  };

  // 内容主体
  content: typeof React.Component;
  // 挂载页面目标节点
  targetContentNode?: Element;

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
  setDomFlag(target: Element | StyledComponent<any, any>, type: string) {
    if (isDomEle(target)) {
      $(target).attr({
        [`data-nicetoolfn-${type}`]: String(Date.now())
      })
    } else {
      (target as StyledComponent<any, any>).attrs = [
        ...(target as StyledComponent<any, any>).attrs,
        { [`data-nicetoolfn-${type}`]: String(Date.now()) }
      ]
    }
  }

  render() {
    const Content = this.content;
    ReactDOM.render(
      <Component>
        <Mask/>
        <Content
          handleClose={() => this.handleClose()}
        />
      </Component>,
      this.targetContentNode as HTMLElement
    );
  }

  playAnimate(isInit: boolean, callback?: Function) {
    if (isInit) {
      $('[data-nicetoolfn-mask]').fadeOut(150).eq(-1).fadeIn(150);
      $('[data-nicetoolfn-mask] + *').css({
        opacity: 1,
        transform: 'translate(-50%, -50%) scale(1, 1)'
      });
    } else {
      $("[data-nicetoolfn-mask]").eq(-1).fadeOut(150);
      $('[data-nicetoolfn-mask] + *').eq(-1).css({
        opacity: 0,
        transform: 'translate(-50%, -50%) scale(1.2, 1.2)'
      });
      $("[data-nicetoolfn-mask]").eq(-2).fadeIn(150)

      setTimeout(() => {
        callback && callback()
      }, 150)
    }
  }

  // 关闭当前弹窗
  handleClose() {
    this.playAnimate(false, () => {
      const modalId: string | undefined = $(this.targetContentNode as Element).attr('data-nicetoolfn-modal');
      ReactDOM.unmountComponentAtNode(this.targetContentNode as Element);
      modalId && $(`[data-nicetoolfn-modal=${modalId}]`).remove();
    });
  }
}

