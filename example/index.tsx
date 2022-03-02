import 'react-app-polyfill/ie9';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Thing, Modal, Popup } from '../dist'; // 此处存在parcel alias 见下文
import '../dist/react-easy-popup.min.css';
import './index.less';

const App = () => {
  const handleModal = () => {
    const modal = new Modal((props) => {
      const [count, updateCount] = useState(0);
      return (
        <div data-xxx={'cacsac'}>
          <h1>count:{count}
            <button onClick={() => updateCount(count + 1)}>add a</button>
            <button onClick={() => handleModal()}>open</button>

            <button onClick={() => modal.closeModal()}>close modal</button>
          </h1>
        </div>
      )
    })
  }
  const handlePopup = () => {
    new Popup((props) => {
      console.log('props', props);
      const [count, updateCount] = useState(0);
      const [data] = useState(Date.now());

      useEffect(() => {
        if (props.childData) {

          const { childCount = 0 } = props.childData;
          updateCount(childCount + count);
        }
      }, [props.childData]);
      return (
        <div className='modal'>
          <h1>{data}</h1>

          count:{count}
          <button onClick={() => updateCount(count + 1)}>click</button>
          <button onClick={() => handlePopup()}>open</button>
          <button onClick={() => props.closePopup()}>close</button>
          <button onClick={() => props.closeAllPopup()}>closeAll</button>
          <button onClick={() => {
            props.closePopup()
            props.emit({ childCount: count })
          }}>emit
          </button>
        </div>
      )
    })
  }

  return (
    <div>
      <Thing/>
      <button onClick={() => handleModal()}>click1</button>
      <button onClick={() => handlePopup()}>click2</button>

    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('root'));
