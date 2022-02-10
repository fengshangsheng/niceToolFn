import React from 'react'
import { render } from 'react-dom'
import { TipInput,TipModal } from './../src' // 引入组件

console.log(TipInput,TipModal);

const App = () => <>
  <TipModal/>___
  <TipInput/>
</>
render(<App/>, document.getElementById('root'))
