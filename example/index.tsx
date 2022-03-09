import 'react-app-polyfill/ie9';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Thing, Popup } from '../dist'; // 此处存在parcel alias 见下文
import '../dist/nicetoolfn.css';
import './index.less';

const App = () => {
  const [data, update] = useState(0);
  const handlePopup = () => {
    new Popup((props) => {
      const [count, updateCount] = useState(0);
      const [data] = useState(Date.now());

      useEffect(() => {
        const { childCount = 0 } = props.childData;
        updateCount(childCount + count);
        update(childCount + count);
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
      <p>data:{data}</p>

      <button onClick={() => handlePopup()}>click function</button>
    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('root'));
