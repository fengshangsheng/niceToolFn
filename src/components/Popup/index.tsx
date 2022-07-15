import React, { useImperativeHandle, useState, useContext, useLayoutEffect, useMemo, useRef, useEffect } from 'react';
import ReactDOM from "react-dom";
import useTransition, { TKeyVal } from "../../hook/useTransition";

const _popupDefaultStyle: TList[] = [
  [300, {
    position: 'fixed',
    left: '50%',
    top: '50%',
    zIndex: '10',
    transform: 'translateX(calc(-50% + 0.5px)) translateY(calc(-50% + 0.5px)) scale(0.875)',
    opacity: 0
  }],
  [300, {
    position: 'fixed',
    left: '50%',
    top: '50%',
    zIndex: '10',
    transform: 'translateX(calc(-50% + 0.5px)) translateY(calc(-50% + 0.5px)) scale(1)',
    opacity: 1
  }]
]
const _popupMaskStyle: TList[] = [
  [300, {
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    opacity: 0,
    zIndex: -10
  }],
  [300, {
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    opacity: 1,
    zIndex: 10
  }]
]
const rootEle = () => {
  return document.getElementById('nicetoolfn-popup') || (() => {
    const div = document.createElement('div')
    div.setAttribute('id', 'nicetoolfn-popup');
    document.body.appendChild(div);
    return div
  })()
}
const PopupContext = React.createContext<{
  deps: TKeyVal
  popupList: TPopup[]
  delPopup: Function
}>({
  deps: {},
  popupList: [],
  delPopup: () => {}
});

type TComponentProps = { [key: string]: any };
type TComponent = React.FC<TComponentProps>;
type TPopup = {
  component: TComponent
  style: TList[]
  show: boolean
  close: boolean
}
type TList = [number, TKeyVal];
type IProps_Popup = { [key: string]: any }
type IProps_PopupItem = {
  item: TPopup
  index: number
}

let closeIng = false;
let batchCloseIng = false;

function getOpenNewList(list: TPopup[], newPopupComponent: TComponent, style?: TList[]) {
  list = list.map((item) => {
    item.show = false;
    return item
  })
  const newPopup: TPopup = {
    component: newPopupComponent,
    show: true,
    close: false,
    style: style || _popupDefaultStyle
  }
  return [...list, newPopup];
}

function getShowPopupStyle(list: TPopup[]): undefined | TList[] {
  const item = list.find((item) => item.show);
  return item?.style
}

const Popup = React.forwardRef((props: IProps_Popup, ref) => {
  const [popupList, triggerPopupList] = useState<TPopup[]>([]);

  const open = (component: TComponent, option?: {
    style?: TList[]
  }) => {
    const list = getOpenNewList(popupList, component, option?.style);
    triggerPopupList(list);
  }

  const clear = () => {
    if (popupList.length === 0) {
      return;
    }
    if (closeIng) {
      return;
    }
    closeIng = true;

    popupList[popupList.length - 1].show = false;
    popupList[popupList.length - 1].close = true;

    if (popupList.length > 1) {
      popupList[popupList.length - 2].show = true;
    }

    triggerPopupList([...popupList]);
  }
  const clearAll = () => {
    if (popupList.length === 0) {
      return;
    }
    if (batchCloseIng) {
      return;
    }

    batchCloseIng = true;

    triggerPopupList(popupList.map((item) => {
      item.show = false;
      item.close = true;
      return item;
    }));
  }

  const _delPopup = (index?: number) => {
    if (batchCloseIng) {
      triggerPopupList([]);
      setTimeout(() => {
        batchCloseIng = false;
      });
    } else {
      popupList.splice(index as number, 1);
      triggerPopupList([...popupList]);
      setTimeout(() => {
        closeIng = false;
      });
    }
  }

  useImperativeHandle(ref, () => ({ open, clear, clearAll }));

  return <PopupContext.Provider value={({
    deps: {
      ...props,
      clear,
      clearAll,
      open
    },
    popupList,
    delPopup: _delPopup
  })}>
    {ReactDOM.createPortal(<PopupList/>, rootEle())}
  </PopupContext.Provider>
})
const PopupList = () => {
  const { popupList } = useContext(PopupContext);
  const activeStyle = getShowPopupStyle(popupList);

  const [style, triggerStyle] = useTransition([[
    activeStyle ? activeStyle[0][0] : _popupMaskStyle[0][0],
    _popupMaskStyle[0][1]
  ], [
    activeStyle ? activeStyle[1][0] : _popupMaskStyle[1][0],
    _popupMaskStyle[1][1]
  ]]);

  const show = useMemo(() => {
    return popupList.some((item) => {
      return item.show
    })
  }, [popupList])

  useLayoutEffect(() => {
    if (show) {
      triggerStyle(1);
    } else {
      triggerStyle(0)
    }
  }, [show]);

  return <>
    <div className="nicetoolfn-popup-mask" style={style}/>
    {popupList.map((item: TPopup, index: number) => {
      return <PopupItem
        key={index}
        index={index}
        item={item}
      />
    })}
  </>
}
const PopupItem = (props: IProps_PopupItem) => {
  const { item, index } = props
  const { deps, delPopup } = useContext(PopupContext);
  const _ref = useRef<any>({});
  _ref.current = {
    close: item.close,
    index,
    delPopup
  }
  const FunComponent = item.component;
  const [style, triggerStyle] = useTransition(item.style, (cur: number) => {
    const { close, index } = _ref.current;

    if (batchCloseIng) {
      delPopup();
    } else if (close && cur === 0) {
      delPopup(index);
    }
  });

  useEffect(() => {
    setTimeout(() => {
      if (item.show) {
        triggerStyle(1)
      } else {
        triggerStyle(0)
      }
    })
  }, [item.show]);

  return <>
    {React.createElement('div', {
      className: 'nicetoolfn-popup-item',
      style: style
    }, [
      typeof FunComponent === 'function' && <FunComponent {...deps} key={index}/>,
      typeof FunComponent === 'object' && React.cloneElement(FunComponent, {
        ...(FunComponent as React.ReactElement).props,
        ...deps,
        key: index
      })
    ])}
  </>;
}
export default Popup;
