import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './style.less';

const PopupList: {
  component: React.SFC<any>,
  childData: object
}[] = []

let ForcedRefresh: Function = function () {};

const PopupGroup = () => {
  const [, update] = useState(0);
  const closePopup = (index: number, size: number = PopupList.length) => {
    PopupList.splice(index, size);
    ForcedRefresh();
  }
  const emit = (data: IKeyVal, parentIdx: number) => {
    PopupList[parentIdx].childData = {
      ...PopupList[parentIdx].childData,
      ...data
    };
    ForcedRefresh();
  }

  useEffect(() => {ForcedRefresh = () => update(Date.now());});

  return (
    <>
      {PopupList.length !== 0 && <div className="nicetoolfn-mask"/>}
      <TransitionGroup>
        {PopupList.map((Item, index) => {
          const Component = Item.component;
          const props = Object.assign({
            key: index,
            childData: PopupList[index].childData,
            closePopup: () => closePopup(index, 1),
            closeAllPopup: () => closePopup(0),
          }, index === 0 ? {} : {
            emit: (data: IKeyVal) => emit(data, index - 1),
          });
          return <CSSTransition key={index}
                                timeout={300}
                                classNames="nicetoolfnPopupItem"
                                appear={true}
          >
            <Component {...props}/>
          </CSSTransition>
        })}
      </TransitionGroup>
    </>);
}

const Render = (root: HTMLElement) => {
  ReactDOM.render(<PopupGroup/>, root);
}

/**
 * @param {React.SFC<{[key: string]: any}>} Component 函数组件或组件实例
 * */
export default class Index {
  constructor(
    public Component: React.SFC<IKeyVal>
  ) {
    this.Init();
  };

  private Root: HTMLElement | null = null;

  private Init() {
    let DOM = document.getElementById('nicetoolfn-modal');

    PopupList.push({
      component: this.Component,
      childData: {}
    });
    if (DOM == null) {
      DOM = document.createElement('div');
      DOM.setAttribute('id', 'nicetoolfn-modal');
      document.body.appendChild(DOM);

      this.Root = DOM;

      Render(this.Root);
    } else {
      ForcedRefresh();
    }
  }
}

interface IKeyVal {
  [key: string]: any
}
