import React from 'react'
import { render } from 'react-dom'
import ALL, { TipInput, TipModal } from '@/components/' // 引入组件
import Utils, { Count } from '@/uitls';

// import { TipInput } from '@/components/TipInput'
// import TipModal from '@/components/TipModal'

console.log('ALL', ALL);
console.log('TipInput', TipInput);
console.log('TipModal', TipModal);
console.log('Utils', Utils);
console.log('Count', Count);
console.log('require', require);
var a = require.context('./../src/', true)
console.log('~~~~~~~~~', a.keys());

const App = () => <>
  <TipModal/>
  <br/>
  <TipInput/>
  <br/>
  <button onClick={() => Count(1, 2)}>click</button>
</>
render(<App/>, document.getElementById('root'))
