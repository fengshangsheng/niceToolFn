import 'react-app-polyfill/ie9';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { LoopFrames } from '../dist'; // 此处存在parcel alias 见下文
import '../dist/nicetoolfn.css';
import './index.less';


const App = () => { 
  return <div>
    <h1>123</h1>
    <LoopFrames
      className={'xxxxx'}
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
      'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00011.png',
      'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00012.png',
      'http://img-game.yy.com/szhuodong/test/00%E7%89%9B_00013.png'
    ]}
      pace={120}
      style={({width:'100px'})}
    />
  </div>
};

ReactDOM.render(<App/>, document.getElementById('root'));
