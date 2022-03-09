import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { IKeyVal, IPopupItem, IComponent, IComponentProps } from './interfac';
import './style.less';

const POPUP_LIST: IPopupItem[] = []
let forcedRefresh: Function = function () {};

function recursionChildren(element: any, props: IKeyVal): any {
  const children = element.props.children;
  const switchChildren = (children: any): any => {
    if (typeof children === 'string' || typeof children === 'number') {
      return children;
    }
    if (children instanceof Array) {
      return React.Children.map(
        children.map((item) => item instanceof Function ? item(props) : item),
        (item) => switchChildren(item)
      )
    }
    if (children instanceof Function) {
      return children(props);
    }
    if (children instanceof Object) {
      return children
    }
    return children
  }
  return React.cloneElement(
    element,
    { ...element.props },
    children ?
      switchChildren(children)
      : []
  );
}

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
        const props: IComponentProps = {
          childData: popupList[index].childData,
          closePopup: () => closePopup(index, 1),
          closeAllPopup: () => closePopup(0),
          forcedRefresh: () => forcedRefresh(),
          emit: (data: IKeyVal) => index !== 0 && emit(data, index - 1)
        };

        let Component: any = item.component;
        Component = React.isValidElement(item.component) ?
          recursionChildren(item.component, { ...item.component.props, ...props })
          : React.cloneElement(<Component/>, props);
        return (
          <CSSTransition key={index} timeout={300} classNames="nicetoolfnPopupItem">
            {Component}
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

