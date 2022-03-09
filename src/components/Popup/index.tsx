import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { IKeyVal, IPopupItem, IComponent, IComponentProps } from './interfac';
import './style.less';

const POPUP_LIST: IPopupItem[] = []
let forcedRefresh: Function = function () {};

function PopupGroup() {
  const [refresh, updateRefresh] = useState(0);
  const [popupList, updatePopupList] = useState<IPopupItem[]>([]);

  const closePopup = (index: number, size: number = popupList.length) => {
    popupList.splice(index, size);
    POPUP_LIST.splice(index, size);
    updatePopupList([...popupList]);
  }
  const emit = (data: IKeyVal, parentIdx: number) => {
    popupList[parentIdx].childData = {
      ...popupList[parentIdx].childData,
      ...data
    };
    updatePopupList([...popupList]);
  }

  useEffect(() => {
    updatePopupList([...POPUP_LIST]);
  }, [refresh]);
  useEffect(() => {
    forcedRefresh = () => updateRefresh(Date.now());
  });

  return (<>
    <CSSTransition in={popupList.length !== 0} timeout={300} classNames="nicetoolfnPopupMask">
      <div className="nicetoolfn-mask"/>
    </CSSTransition>
    <TransitionGroup>
      {popupList.map((item, index) => {
        const Component = item.component;
        const props: IComponentProps = {
          childData: popupList[index].childData,
          closePopup: () => closePopup(index, 1),
          closeAllPopup: () => closePopup(0),
          forcedRefresh: () => forcedRefresh(),
          emit: (data: IKeyVal) => index !== 0 && emit(data, index - 1)
        };
        return (
          <CSSTransition key={index} timeout={300} classNames="nicetoolfnPopupItem">
            <Component {...props}/>
          </CSSTransition>
        )
      })}
    </TransitionGroup>
  </>);
}

/**
 * @param {IComponent} component 函数组件或组件实例
 * */
export default class Index {
  constructor(public component: IComponent) {
    this.init();
  };

  private root: HTMLElement | null = document.getElementById('nicetoolfn-modal');

  private init() {
    POPUP_LIST.push({ component: this.component, childData: {} });

    if (this.root == null) {
      this.root = document.createElement('div');
      this.root.setAttribute('id', 'nicetoolfn-modal');
      document.body.appendChild(this.root);

      ReactDOM.render(<PopupGroup/>, this.root);
    } else {
      forcedRefresh();
    }
  }
}

