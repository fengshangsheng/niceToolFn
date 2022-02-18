import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { isDomEle } from '@/uitls';
import { Component, Mask } from '@/components/Modal/style';
import { StyledComponent } from "styled-components";

// class Popup extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//
//   componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any) {
//     ReactDOM.createPortal(
//       this.props.children,
//       this.props.targetContent
//     )
//   }
//
//   renderContent() {
//     return (
//       <Component>
//         {this.props.children}
//       </Component>
//     )
//   }
//
//   render() {
//     return null
//   }
// }

export default class Modal {
  constructor(component: FunctionComponent, option?: any) {
    this.content = component;
    this.option = option
    this.init();
  };

  private option: any;

  // 内容主体
  private content: FunctionComponent;
  // 挂载页面目标节点
  private targetContentNode?: HTMLElement;

  private init() {
    this.targetContentNode = this.verifyParameter();

    this.setDomFlag(this.targetContentNode, 'modal');
    this.setDomFlag(Mask, 'mask');
     this.render();

    setTimeout(() => {
      this.playAnimate();
    })
  }

  // 验证参数
  private verifyParameter() {
    if (this.targetContentNode === undefined) {
      const _target: HTMLElement = document.createElement('div');
      document.body.appendChild(_target);
      return _target;
    }
    return this.targetContentNode
  }

  // 设置DOM节点标识
  private setDomFlag(target: HTMLElement | StyledComponent<any, any>, type: string) {
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


  private render() {
    const Content = this.content
    console.log('option', this.option);
    ReactDOM.render(
      <Component>
        <Mask/>
        <Content {...this.option}/>
      </Component>,
      this.targetContentNode as HTMLElement
    );
  }

  private playAnimate() {
    $('[data-nicetoolfn-mask]')
      .fadeOut()
      .eq(-1)
      .fadeIn();

    $('[data-nicetoolfn-mask] + *').fadeIn();
  }
}

