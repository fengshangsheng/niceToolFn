import 'react-app-polyfill/ie9';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Popup, Popup2, Tooltip, LoopFrames, useTransition, useCountDown, CountDown } from '../dist'; // 此处存在parcel alias 见下文
import './index.less';

const Modal = (props) => {
  return <div>
    <h1>!!!!!!{props.count}</h1>
    <button onClick={() => props.handleOpen()}>open</button>
    <button onClick={() => props.clear()}>clear</button>
    <button onClick={() => props.clearAll()}>clearAll</button>
    <button onClick={() => props.handleAdd(props.count + 1)}>add</button>
  </div>
}
const App = () => {
  const [count, triggerCount] = useState(0);
  const _ref = useRef<any>();

  const handleAdd = () => {
    triggerCount(count + 1);
  }
  const handleOpen = () => {
    /** _ref.current绑定组件实例，抛出两个事件
     * _ref.current.open()
     * @param { Element | (props)=>Element } 弹窗组件
     * @param { Array<Array<[ string, {[key]:value} ]>> } 弹出动画
     * _ref.current.clear()     关闭当前弹窗
     * _ref.current.clearAll()  关闭全部弹窗
     * */
    _ref.current.open(
      <Modal/>,
      // 选填，可自定义动画
      // {
      //   style: [
      //     [200, {
      //       transform: 'translateX(-50%) translateY(-50%) scale(1)',
      //       opacity: 0,
      //       backgroundColor: 'yellow'
      //     }],
      //     [200, {
      //       opacity: 1,
      //       transform: 'translateX(-50%) translateY(-50%) scale(2.185)',
      //       backgroundColor: 'blue'
      //     }]
      //   ]
      // }
    )
  }

  return <>
    {count}
    <button onClick={() => handleAdd()}>add</button>
    <button onClick={() => handleOpen()}>open</button>
    {/*
      将数据传递至<Popup/>,
      可在 _ref.current.open((props)=><></>) 中获取即时最新的数据
    */}
    <Popup ref={_ref} count={count} handleAdd={handleAdd} handleOpen={handleOpen}/>
  </>
}

ReactDOM.render(<App/>, document.getElementById('root'));
