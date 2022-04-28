import React, { useImperativeHandle, useState, useContext, useLayoutEffect } from 'react';
import ReactDOM from "react-dom";
import useTransition, { TKeyVal } from "../../hook/useTransition";
import { setRequestAnimationFrame } from "../../helpers/requestAnimationFrame";

type TComponentProps = {
  [key: string]: any
};
type TComponent = React.FC<TComponentProps>;
type TList = [number, TKeyVal];

const PopupContext = React.createContext<{
  deps: TKeyVal
  popupList: TComponent[]
  pointer: number
  transition: TList[]
}>({
  deps: {},
  popupList: [],
  pointer: -1,
  transition: []
});

const _popupItemStyle: TKeyVal = {
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translateX(-50%) translateY(-50%)',
  zIndex: '10'
}

const _popupMaskStyle: TKeyVal = {
  position: 'fixed',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)'
}

const _popupTransition: TList[] = [
  [300, {
    transform: 'translateX(-50%) translateY(-50%) scale(1)',
    opacity: 0
  }],
  [300, {
    transform: 'translateX(-50%) translateY(-50%) scale(1.185)',
    opacity: 1
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

let canceller: () => void;
// let toInMs: number = 0;
// let toOutMs: number = 0;

type IProps_PopupItem = {
  funComponent: TComponent
  pointer: number
  index: number
}
const PopupItem = (props: IProps_PopupItem) => {
  const { transition } = useContext(PopupContext);
  const { funComponent, pointer, index } = props
  const { deps } = useContext(PopupContext);
  const [style, triggerStyle] = useTransition(transition);

  useLayoutEffect(() => {
    index !== pointer && triggerStyle(0);
    index === pointer && setTimeout(() => {
      triggerStyle(1);
    });
  }, [pointer])

  const FunComponent = funComponent;
  return <>
    {React.createElement('div', {
      className: 'nicetoolfn-popup-item',
      style: { ..._popupItemStyle, ...style }
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

const PopupList = () => {
  const { popupList, pointer, transition } = useContext(PopupContext);

  const [style, triggerStyle] = useTransition([
    [transition[0][0], { opacity: 0, zIndex: -10 }],
    [transition[1][0], { opacity: 1, zIndex: 10 }]
  ]);

  useLayoutEffect(() => {
    if (pointer === -1) {
      triggerStyle(0);
    } else {
      triggerStyle(1)
    }
  }, [pointer]);

  return <>
    <div className="nicetoolfn-popup-mask" style={({ ..._popupMaskStyle, ...style })}/>
    {popupList.map((item: TComponent, index: number) => {
      return <PopupItem key={index} funComponent={item} pointer={pointer} index={index}/>
    })}
  </>
}

type IProps_Popup = { [key: string]: any }
const Popup = React.forwardRef((props: IProps_Popup, ref) => {
  const [popupList, triggerPopupList] = useState<TComponent[]>([]);
  const [pointer, triggerPointer] = useState(-1);
  const [transition, triggerTransition] = useState(_popupTransition);

  const open = (component: TComponent, transition?: TList[]) => {
    if (transition) {
      triggerTransition(transition);
    }

    triggerPopupList([...popupList, component]);
    triggerPointer(pointer + 1);
  }

  const clear = () => {
    if (popupList.length === 0) {
      return;
    }
    if (pointer !== popupList.length - 1) {
      return;
    }

    triggerPointer(pointer - 1);

    // 等待离开动画执行完毕，再删除对应的弹窗组件
    canceller && canceller();
    canceller = setRequestAnimationFrame(() => {
      triggerPopupList(popupList.slice(0, -1));
    }, transition[0][0])
  }
  const clearAll = () => {
    triggerPointer(-1);
    setRequestAnimationFrame(() => {
      triggerPopupList([]);
    }, transition[0][0])
  }

  useImperativeHandle(ref, () => ({
    open,
    clear,
    clearAll
  }));

  return <PopupContext.Provider value={({
    deps: {
      ...props,
      clear,
      clearAll,
      open
    },
    popupList,
    pointer,
    transition
  })}>
    {ReactDOM.createPortal(<PopupList/>, rootEle())}
  </PopupContext.Provider>
})
export default Popup;
