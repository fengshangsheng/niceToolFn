import 'react-app-polyfill/ie9';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Popup, Popup2, Tooltip } from '../dist'; // 此处存在parcel alias 见下文
// import '../dist/nicetoolfn.css';
import './index.less';

const TipBox = (props: any) => {
  return <div style={({ backgroundColor: 'red' })}>
    <p>~~~~{props.count}~~~</p>
    <p>{Date.now()}</p>
    <p>{props.count % 2}</p>
    <button onClick={() => props.handleAdd()}>add</button>
  </div>
}

const App = () => {
  const [count, updateShow] = useState(0);
  const _ref = useRef();
  const handleAdd = () => {
    updateShow(count + 1);
  }

  const handleEvNew = () => {
    /** _ref.current绑定组件实例，抛出两个事件
     * _ref.current.open()
     * @param { Element | (props)=>Element } 弹窗组件
     * @param { Array<{ [key]:value },Array<Array<[ string, {[key]:value} ]>>> } 弹出动画
     * _ref.current.clear()     关闭当前弹窗
     * _ref.current.clearAll()  关闭全部弹窗
     * */
    (_ref.current as any).open(
      (props: any) => (<div>
        <h1>fengfengss{props.count}</h1>
        <button onClick={() => handleEvNew()}>open</button>
        <button onClick={() => (_ref.current as any).clear()}>clear</button>
        <button onClick={() => (_ref.current as any).clearAll()}>clearAll</button>
        <button onClick={() => props.handleAdd()}>add</button>
      </div>),
      [{
        opacity: 0,
        transform: 'translateX(-50%) translateY(-50%) scale(1.185)'
      }, [
        [300, {
          transform: 'translateX(-50%) translateY(-50%) scale(1)',
          opacity: 1,
          backgroundColor: 'red'
        }],
        [300, {
          opacity: 0,
          transform: 'translateX(-50%) translateY(-50%) scale(1.185)',
          backgroundColor: 'blue'
        }]
      ]]
    )
  }
  const handleEv = () => {
    new Popup2((props) => {
      return (
        <div className='modal'>
          count:{count}
          <button onClick={() => {
            props.closePopup()
            props.emit({ childCount: count })
          }}>emit
          </button>
        </div>
      )
    });
  }
  return <div>
    <p>{count}</p>
    <p>
      <button onClick={() => handleAdd()}>add</button>
    </p>
    <p>
      <button onClick={() => handleEv()}>open old</button>
    </p>
    <p>
      <button onClick={() => handleEvNew()}>open new</button>
    </p>
    <Popup ref={_ref} count={count} handleAdd={handleAdd}/>
    <Tooltip trigger={'click'} // 必填:事件类型: click, mouse
             placement={['top', 'right']} // 必填:弹出位置: left,right,top,bottom
             popup={() => <TipBox count={count} handleAdd={handleAdd}/>} // 选填:弹出组件
             gap={10}// 选填: 弹出组件与目标元素之间的间隔大小
    >
      <button style={({ background: 'red', left: '50%', top: '50%', position: 'absolute' })} onClick={() => handleAdd()}>
        component{count}
      </button>
    </Tooltip>
    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    <Tooltip trigger={'click'} // 必填:事件类型: click, mouse
             // placement={['bottom', 'left']} // 必填:弹出位置: left,right,top,bottom
             popup={<TipBox count={count } handleAdd={handleAdd}/>} // 选填:弹出组件
             gap={10}// 选填: 弹出组件与目标元素之间的间隔大小
    >
      <button style={({ background: 'red', left: '50%', top: 'auto', position: 'absolute' })} onClick={() => handleAdd()}>component</button>
    </Tooltip>
    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    {/*<Tooltip trigger={'mouse'} // 必填:事件类型: click, mouse*/}
    {/*         placement={['left', 'top']} // 必填:弹出位置: left,right,top,bottom*/}
    {/*         popup={() => <TipBox count={count}/>} // 选填:弹出组件*/}
    {/*         gap={10}// 选填: 弹出组件与目标元素之间的间隔大小*/}
    {/*>*/}
    {/*  <button style={({ background: 'red', left: '30%', top: '30%', position: 'absolute' })} onClick={() => handleAdd()}>component</button>*/}
    {/*</Tooltip>*/}
  </div>
};

ReactDOM.render(<App/>, document.getElementById('root'));
