import 'react-app-polyfill/ie9';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Thing, Modal, Popup } from '../dist'; // 此处存在parcel alias 见下文
import '../dist/nicetoolfn.css';
import './index.less';

const App = () => {
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
  const handlePopup2 = () => {
    const Compoent = (props) => {
      return (
        <div className='modal'>
          <h1>Compoent</h1>
          <h2>props.title：{props.title}</h2>
          <p>props.children:{props.children}</p>
        </div>
      )
    }
    new Popup(<Compoent title={'fengfeng123'}>
      <span>1111111111</span>
      {(props) => {
        return <button onClick={() => props.closePopup()}>close</button>
      }
      }
      <strong>22222222222</strong>
      44444444
    </Compoent>)
  }
  const handlePopup3 = () => {
    const name = [1, 2, 3, 4, 5];
    new Popup(<div>
      feng
      {(props) => {
        const [count, update] = useState(0);
        return <div>
          <h1>aaaa</h1>
          <button onClick={() => props.closePopup()}>close</button>
          <h2>bbbbb</h2>
          <button onClick={() => handlePopup3()}>open</button>
          {name.length && name.map(item => item)}
          <button onClick={() => update(count + 1)}>add count</button>{count}
        </div>
      }}
      {props => {
        return <p>{props.childData.childCount}</p>
      }}
      {props => <button onClick={() => {
        props.emit({ childCount: (props.childData.childCount || 0) + 1 });
        props.closePopup();
      }}>emit 1</button>}
      shang
    </div>)
  }


  return (
    <div>
      <Thing/>
      <button onClick={() => handlePopup()}>click function</button>
      <button onClick={() => handlePopup2()}>click component</button>
      <button onClick={() => handlePopup3()}>click jsx</button>

    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('root'));
