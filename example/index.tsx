import 'react-app-polyfill/ie9';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Tooltip,LoopFrames } from '../dist'; // 此处存在parcel alias 见下文
import '../dist/nicetoolfn.css';
import './index.less';


const App = () => {
  const [count, updateShow] = useState(0);
  const handleEv = () => {
    console.log('show', count);
    updateShow(count+1);
  }

  return <div>
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
        'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00010.png',
      ]}
      pace={100} // 帧切换速率
      // className={'myclass'}
    />
    <h1>{count}~~~{count%2 ? '1111111111111' : '222222222222222'}</h1>
    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    <Tooltip trigger={'click'} placement={['bottom', 'center']} style={({
      background: 'red',
      position: 'absolute',
      left: '100px',
      top: '100px'
    })}>
      <button onClick={()=>handleEv()}>component</button>
      <span style={({ background: 'red' })}>~~~~{count}~~~{Date.now()}</span>
    </Tooltip>
    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    <div>fengfeng123</div>
    <Tooltip trigger={'mouse'} style={({
      background: 'red',
      position: 'absolute',
      left: '100px',
      top: '1000px'
    })}>
      <button >component</button>
      <div style={({ background: 'red', display: 'inline-block', height: '150px', width: '150px', })}>
        fengfeng123fengfeng123fengfeng123fengfeng123
        {count%2 ? '1111111111111' : '222222222222222'}
      </div>
    </Tooltip>
  </div>
};

ReactDOM.render(<App/>, document.getElementById('root'));
