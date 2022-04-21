import 'react-app-polyfill/ie9';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Tooltip, LoopFrames } from '../dist'; // 此处存在parcel alias 见下文
import '../dist/nicetoolfn.css';
import './index.less';

const TipBox = (props: any) => {
  return <div datatype={'1111111111111'}
              // style={({ background: 'yellow' })}
  >
    <p>~~~~{props.count}~~~</p>
    <p>{Date.now()}</p>
    <p>{props.count % 2 ? '1111111111111' : '1111111111112'}</p>
  </div>
}

const App = () => {
  const [count, updateShow] = useState(0);
  const [aaa, updateAAA] = useState<'left' | 'top' | 'right' | 'bottom' | 'center'>('top');
  const handleEv = () => {
    updateShow(count + 1);
  }

  return <div>
    <button onClick={()=>updateAAA('left')}>placement</button>
    <LoopFrames frames={[
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
    ]} pace={60}/>
    <h1>{count}~~~{count % 2 ? '1111111111111' : '222222222222222'}</h1>
    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    <Tooltip trigger={'click'}
             placement={[aaa, 'right']}
             popup={() => <TipBox count={count}/>}
    >
      <button style={({ background: 'red'})} onClick={() => handleEv()}>component</button>
    </Tooltip>
    <Tooltip trigger={'click'}
             placement={[aaa, 'left']}
             popup={() => <TipBox count={count}/>}
    >
      <button style={({ background: 'red', position: 'absolute', left: '200px', top: '200px' })} onClick={() => handleEv()}>component</button>
    </Tooltip>
    <Tooltip trigger={'mouse'}
             placement={[aaa, 'center']}
             popup={() => <TipBox count={count}/>}
    >
      <button style={({ background: 'red', position: 'absolute', left: '200px', top: '300px' })} onClick={() => handleEv()}>component</button>
    </Tooltip>
    <div></div>
    {/*<Tooltip trigger={'click'}*/}
    {/*         placement={['right', 'center']}*/}
    {/*         popup={<TipBox count={count}/> }*/}
    {/*>*/}
    {/*  <button*/}
    {/*    style={({ background: 'red', position: 'absolute', left: '200px', top: '300px' })}*/}
    {/*    onClick={() => handleEv()}*/}
    {/*  >component*/}
    {/*  </button>*/}
    {/*</Tooltip>*/}
    <div>fengfeng123</div>
  </div>
};

ReactDOM.render(<App/>, document.getElementById('root'));
