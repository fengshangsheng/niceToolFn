import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM, { render } from 'react-dom'

import { Modal } from './../lib'


const Component = function(props) {
  const [a, setA] = useState(0);
  console.log('Component', props, this);
  return (
    <div>
      <h1>{Date.now()}</h1>
      <h2>count:{props.count}
        <button onClick={() => props.setCount(props.count + 1)}>add count</button>
      </h2>
      <h3>a:{a}
        <button onClick={() => setA(a + 1)}>add a</button>
      </h3>
      {/*<button className={'fengfeng123'} onClick={handleModal}>click</button>*/}
      <button className={'fengfeng123'} onClick={props.closeModal}>close</button>
    </div>
  )
}
const App = function() {
  console.log('------------------------------App2');
  const [count, setCount] = useState(0)

  const handleModal = useCallback(() => {
    const obj = new Modal(Component, {
      count, setCount
    });
    obj.aaaaaa = function() {
      console.log('xxxxxxxxxxxxxxx~~~~~~~');
      setCount(count + 0.5)
    }
  });

  const handleAddCount = () => {
    setCount(count + 1);
  }
  return <>
    <p>{Date.now()}</p>
    <p>count:{count}</p>
    <button onClick={handleAddCount}>add count</button>
    <button onClick={handleModal}>open modal</button>

  </>
}

render(<App/>, document.getElementById('root'))
