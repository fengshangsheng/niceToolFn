import 'react-app-polyfill/ie9';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Popup, Popup2, Tooltip, LoopFrames, useCountDown } from '../dist'; // 此处存在parcel alias 见下文
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
  const [day, hour, min, ms] = useCountDown(new Date(new Date().toLocaleDateString()).getTime() - 1)
  const handleAdd = () => {
    updateShow(count + 1);
  }

  const handleEvNew = (ev: any) => {
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
        {/*<button onClick={() => handleEvNew()}>open</button>*/}
        <button onClick={() => (_ref.current as any).clear()}>clear</button>
        <button onClick={() => (_ref.current as any).clearAll()}>clearAll</button>
        <button onClick={() => props.handleAdd()}>add</button>
      </div>),
      // [{
      //   opacity: 0,
      //   transform: 'scale(0)',
      //   backgroundColor: 'yellow'
      // }, [
      //   [300, {
      //     transform: 'scale(1)',
      //     opacity: 1,
      //     backgroundColor: 'red'
      //   }],
      //   [300, {
      //     opacity: 0,
      //     transform: 'scale(1.185)',
      //     backgroundColor: 'yellow'
      //   }]
      // ]]
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
    {day}, {hour}, {min}, {ms}
    <p>{count}</p>
    <p>
      <button onClick={() => handleAdd()}>add</button>
    </p>
    <p>
      <button onClick={() => handleEv()}>open old</button>
    </p>
    <p>
      <button onClick={handleEvNew}>open new</button>
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
             popup={<TipBox count={count} handleAdd={handleAdd}/>} // 选填:弹出组件
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
    <LoopFrames
      frames={[
        'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00000.png',
        'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00001.png',
        'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00002.png',
        'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00003.png',
        'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00004.png',
        'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00005.png',
        'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00006.png',
        'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00007.png',
        'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00008.png',
        'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00009.png',
        'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00010.png'
      ]}
      pace={100} // 帧切换速率
      className={'myclass'}
    />
  </div>
};

ReactDOM.render(<App/>, document.getElementById('root'));
