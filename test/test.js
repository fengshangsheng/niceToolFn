import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM, { render } from 'react-dom'

import { Modal } from './../lib'

const App = function() {
  const [count, setCount] = useState(0)

  const handleModal = () => {
    new Modal((props) => {
      const [a, setA] = useState(0);
      return (
        <div>
          <h1>{Date.now()}</h1>
          <h2>count:{count}
            <button onClick={() => props.handleAddCount()}>add count</button>
          </h2>
          <h3>a:{a}
            <button onClick={() => setA(a + 1)}>add a</button>
          </h3>
          <button onClick={() => props.handleModal()}>click</button>
        </div>
      )
    }, {
      handleAddCount: handleAddCount,
      handleModal: handleModal,
      // beforeMount: () => {
      //   console.log(count);
      //   return 2 <= count && count <= 3
      // },
    })
  };

  const handleAddCount = () => {
    console.log('count', count);
    setCount(count + 1);
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
