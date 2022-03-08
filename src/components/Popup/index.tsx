import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { IKeyVal, IComponentProps, IPopupItem, IComponent } from './interfac';
// import Uitls from './../../uitls';
import './style.less';

const POPUP_LIST: IPopupItem[] = []
let forcedRefresh: Function = function () {};

function PopupGroup() {
  const [refresh, updateRefresh] = useState(0);
  const [popupList, updatePopupList] = useState<IPopupItem[]>([]);

  const ClosePopup = (index: number, size: number = popupList.length) => {
    popupList.splice(index, size);
    POPUP_LIST.splice(index, size);
    updatePopupList([...popupList]);
  }
  const Emit = (data: IKeyVal, parentIdx: number) => {
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
      {popupList.map((Item, index) => {
        let Component = Item.component;
        const Props: IComponentProps = {
          childData: popupList[index].childData,
          closePopup: () => ClosePopup(index, 1),
          closeAllPopup: () => ClosePopup(0),
          emit: (data: IKeyVal) => index !== 0 && Emit(data, index - 1)
        };
        console.log('React.isValidElement(Component)', React.isValidElement(Component));
        React.isValidElement(Component) && React.Children.map((Component as React.ReactElement<IComponentProps>).props.children, (item) => {
          console.log(item);
        })
        return (
          <CSSTransition key={index} timeout={300} classNames="nicetoolfnPopupItem">
            <div>
              {React.isValidElement(Component) ?
                React.Children.map((Component as React.ReactElement<IComponentProps>).props.children, (item) => {
                  const Item = React.cloneElement(item);
                  return <>{Item}</>
                })
                : <Component  {...Props}/>
              }
            </div>
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
  constructor(public component: IComponent) {
    console.log('component', component);
    this.init();
  };

  private root: HTMLElement | null = document.getElementById('nicetoolfn-modal');

  private init() {
    POPUP_LIST.push({ id: Date.now(), component: this.component, childData: {} });

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

