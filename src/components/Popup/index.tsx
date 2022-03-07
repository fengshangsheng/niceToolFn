import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { IKeyVal, IComponentProps, IPopupItem, IPopupComponent } from './interfac';
import './style.less';

const _PopupList: IPopupItem[] = []

let ForcedRefresh: Function = function () {};

const PopupGroup = () => {
  const [Refresh, UpdateRefresh] = useState(0);
  const [PopupList, UpdatePopupList]: [IPopupItem[], Function] = useState([]);
  const ClosePopup = (index: number, size: number = PopupList.length) => {
    PopupList.splice(index, size);
    _PopupList.splice(index, size);
    UpdatePopupList([...PopupList]);
  }
  const Emit = (data: IKeyVal, parentIdx: number) => {
    PopupList[parentIdx].childData = {
      ...PopupList[parentIdx].childData,
      ...data
    };
    UpdatePopupList([...PopupList]);
  }

  useEffect(() => {ForcedRefresh = () => UpdateRefresh(Date.now());});
  useEffect(() => UpdatePopupList([..._PopupList]), [Refresh]);

  return (<>
    <CSSTransition in={PopupList.length !== 0} timeout={300} classNames="nicetoolfnPopupMask">
      <div className="nicetoolfn-mask"/>
    </CSSTransition>
    <TransitionGroup>
      {PopupList.map((Item, index) => {
        const Component = Item.component;
        const props: IComponentProps = Object.assign({
          key: index,
          childData: PopupList[index].childData,
          closePopup: () => ClosePopup(index, 1),
          closeAllPopup: () => ClosePopup(0),
          emit: (data: IKeyVal) => index !== 0 && Emit(data, index - 1)
        });
        return (
          <CSSTransition key={Item.id} timeout={300} classNames="nicetoolfnPopupItem">
            <Component {...props}/>
          </CSSTransition>
        )
      })}
    </TransitionGroup>
  </>);
}

/**
 * @param {IPopupComponent} Component 函数组件或组件实例
 * */
export default class Index {
  constructor(
    public Component: IPopupComponent
  ) {
    this.Init();
  };

  private Root: HTMLElement | null = null;

  private Init() {
    let DOM = document.getElementById('nicetoolfn-modal');

    _PopupList.push({ id: Date.now(), component: this.Component, childData: {} });

    if (DOM == null) {
      DOM = document.createElement('div');
      DOM.setAttribute('id', 'nicetoolfn-modal');
      document.body.appendChild(DOM);

      this.Root = DOM;

      ReactDOM.render(<PopupGroup/>, this.Root);
    } else {
      ForcedRefresh();
    }
  }
}
