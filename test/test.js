import React from 'react'
import { render } from 'react-dom'
// import ALL, { TipInput, TipModal, Utils } from '@/' // 引入组件

import { TipInput, TipModal, Utils } from './../lib'

console.log(Utils);
const App = () => <>
  <TipModal/>1
  <br/>
  <TipInput/>3
  <br/>
  <button onClick={() => Utils.Count(true, 2)}>click2</button>
</>
render(<App/>, document.getElementById('root'))
