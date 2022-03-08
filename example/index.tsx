import 'react-app-polyfill/ie9';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Thing, Modal, Popup } from '../dist'; // 此处存在parcel alias 见下文
import '../dist/nicetoolfn.css';
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
  const handlePopup3 = () => {
    const Compoent = (props) => {
      return (
        <div className='modal'>
          <h1>Compoent</h1>
          <strong>{props.title}</strong>
          {props.children}
        </div>
      )
    }
    new Popup((props) => <Compoent title={'fengfeng123'} {...props}>
      <h1>fengfeng123</h1>
      <h2>哇哈哈哈</h2>
      <h3>~~~~~</h3>
    </Compoent>)
  }


  return (
    <div>
      <Thing/>
      <button onClick={() => handleModal()}>click1</button>
      <button onClick={() => handlePopup()}>click2</button>
      <button onClick={() => handlePopup3()}>click3</button>

    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('root'));
