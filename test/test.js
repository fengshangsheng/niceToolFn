import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM, { render } from 'react-dom'

import { Modal } from './../lib'

const App = function() {
  console.log('------------------------------App2');
  const [count, setCount] = useState(0)

  const handleModal = () => {
    const obj = new Modal((props) => {
      const [a, setA] = useState(0);
      console.log(props);
      return (
        <div>
          <h1>{Date.now()}</h1>
          <h2>count:{count}
            <button onClick={handleAddCount}>add count</button>
          </h2>
          <h3>a:{a}
            <button onClick={() => setA(a + 1)}>add a</button>
          </h3>
          <button className={'fengfeng123'} onClick={handleModal}>click</button>
          <button className={'fengfeng123'} onClick={props.handleClose}>close</button>
        </div>
      )
    })
  };

  const handleAddCount = () => {
    console.log('handleAddCount', count);
    curCount();
    setCount(count + 1);
  }
  const curCount = ()=>{
    console.log('curCount', count);
  }
  console.log('xxxxxxx2');
  return <>
    <p>{Date.now()}</p>
    <p>count:{count}</p>
    <button onClick={handleAddCount}>add count</button>
    <button onClick={handleModal}>open modal</button>

  </>
}

render(<App/>, document.getElementById('root'))
