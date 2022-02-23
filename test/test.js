import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM, { render } from 'react-dom'

import { Modal } from './../lib'


const Component = function(props) {
  const [count, updateCount] = useState(0);

  return (
    <div>
      <h1>{Date.now()}</h1>
      <h2>count:{count}
        <button onClick={() => updateCount(count + 1)}>add count</button>
        <button onClick={() => props.emitFn(count)}>emit</button>
      </h2>
      {/*<button className={'fengfeng123'} onClick={handleModal}>click</button>*/}
      <button className={'fengfeng123'} onClick={props.closeModal}>close</button>
    </div>
  )
}
const App = function() {
  console.log('------------------------------App2', this);
  const [count, setCount] = useState(0)

  const handleModal = () => {
    const curModal = new Modal(<Component
      closeModal={() => curModal.closeModal()}
      emitFn={(count) => {
        handleAddCount(count)
        curModal.closeModal()
      }}
    />);
  };

  const handleAddCount = (emitCount) => {
    setCount(emitCount ? emitCount : count + 1);
  }
  return <>
    <p>{Date.now()}</p>
    <p>count:{count}</p>
    <button onClick={()=>handleAddCount()}>add count</button>
    <button onClick={handleModal}>open modal</button>

  </>
}

render(<App/>, document.getElementById('root'))
