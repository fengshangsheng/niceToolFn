import React, { useImperativeHandle, useMemo, useRef, useState, useContext, useLayoutEffect } from 'react';
import ReactDOM from "react-dom";
import useTransition, { TKeyVal, TList } from "../../hook/useTransition";
import { setRequestAnimationFrame } from "../../helpers/requestAnimationFrame";

type TComponentProps = {};
type TComponent = React.FC<TComponentProps>;
type TTransition = [TKeyVal, TList[]]
type TDefaultStyle = false | TTransition;

const PopupContext = React.createContext<{
  deps: TKeyVal,
  defaultStyle: TDefaultStyle
}>({
  deps: {},
  defaultStyle: false
});

const _popupItemStyle: TKeyVal = {
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translateX(-50%) translateY(-50%)',
  zIndex: '10'
}
const _defaultStyle: TDefaultStyle = [{
  opacity: 0,
  transform: 'translateX(-50%) translateY(-50%) scale(1.185)'
}, [
  [150, {
    transform: 'translateX(-50%) translateY(-50%) scale(1)',
    opacity: 1
  }],
  [150, {
    opacity: 0,
    transform: 'translateX(-50%) translateY(-50%) scale(1.185)'
  }]
]]
const _popupMaskStyle: TKeyVal = {
  position: 'fixed',
  left: '0',
  top: '0',
  right: '0',
  bottom: '0',
  backgroundColor: 'rgba(0, 0, 0, 0.3)'
}

type IProps_Popup = { [key: string]: any }
const Popup = React.forwardRef((props: IProps_Popup, ref) => {
  const _refDefaultStyle = useRef<TDefaultStyle>(false);
  const [pointer, triggerPointer] = useState(-1);
  const [popupList, triggerPopupList] = useState<TComponent[]>([]);

  const open = (component: TComponent, defaultStyle?: TTransition) => {
    if (defaultStyle) {
      _refDefaultStyle.current = defaultStyle;
    }
    triggerPointer(pointer + 1);
    triggerPopupList([...popupList, component]);
  }

  const clear = () => {
    if (popupList.length === 0) {
      return;
    }
    if (popupList.length - 1 !== pointer) {
      return;
    }
    triggerPointer(pointer - 1);

    // 等待离开动画执行完毕，再删除对应的弹窗组件
    setRequestAnimationFrame(() => {
      triggerPopupList([...popupList.slice(0, -1)]);
    }, clearTimeMs)
  }

  const clearAll = () => {
    triggerPointer(-1);
    // 等待离开动画执行完毕，再删除对应的弹窗组件
    setRequestAnimationFrame(() => {
      triggerPopupList([]);
    }, clearTimeMs)
  }

  const PopupRoot = useMemo(() => {
    return document.getElementById('nicetoolfn-popup') || (() => {
      const div = document.createElement('div')
      div.setAttribute('id', 'nicetoolfn-popup');
      document.body.appendChild(div);
      return div
    })();
  }, []);
  const clearTimeMs = useMemo(() => {
    return _refDefaultStyle.current ? _refDefaultStyle.current[1][0][0] : 150
  }, [_refDefaultStyle.current])

  useImperativeHandle(ref, () => ({
    open,
    clear,
    clearAll
  }));

  return <PopupContext.Provider value={({
    deps: props,
    defaultStyle: _refDefaultStyle.current,
  })}>
    {ReactDOM.createPortal(
      <PopupList
        popupList={popupList}
        pointer={pointer}
      />, PopupRoot
    )}
  </PopupContext.Provider>
})

type IProps_PopupList = {
  popupList: TComponent[]
  pointer: number
}
const PopupList = (props: IProps_PopupList) => {
  const { popupList, pointer } = props;
  const [style, triggerStyle] = useTransition(
    { opacity: 0, zIndex: -9 },
    [
      [300, { opacity: 1, zIndex: 9 }],
      [300, { opacity: 0, zIndex: -9 }]
    ],
  );

  useLayoutEffect(() => {
    triggerStyle(Number(pointer === -1));
  }, [pointer]);

  return <>
    <div className="nicetoolfn-popup-mask" style={({ ..._popupMaskStyle, ...style })}/>
    {popupList.map((item: TComponent, index: number) => {
      return <PopupItem key={index} funComponent={item} pointer={pointer} index={index}/>
    })}
  </>
}

type IProps_PopupItem = {
  funComponent: TComponent
  pointer: number
  index: number
}
const PopupItem = (props: IProps_PopupItem) => {
  const { funComponent, pointer, index } = props
  const { deps, defaultStyle } = useContext(PopupContext);
  const _refStyle = useRef<TTransition>(defaultStyle || _defaultStyle);
  const [style, triggerStyle] = useTransition(..._refStyle.current);

  useLayoutEffect(() => {
    if (index === pointer) {
      setTimeout(() => {
        triggerStyle(0)
      })
    } else {
      triggerStyle(1);
    }
  }, [pointer])

  const FunComponent = funComponent;

  return <>
    {React.createElement('div', {
      className: 'nicetoolfn-popup-item',
      style: { ..._popupItemStyle, ...style }
    }, [FunComponent ? <FunComponent {...deps} key={index}/> : ''])}
  </>;
}

export default Popup;
