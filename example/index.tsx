import 'react-app-polyfill/ie9';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Thing, Modal } from '../dist'; // 此处存在parcel alias 见下文
import '../dist/react-easy-popup.min.css';

const App = () => {
  console.log('Thing', Thing);
  console.log('Modal',);
  const handleModal = () => {
    new Modal((props) => {
      const [count, updateCount] = useState(0);
      return (
        <div>
          <h1>count:{count}
            <button onClick={() => updateCount(count + 1)}>add a</button>
          </h1>
        </div>
      )
    }, {})
  }
  return (
    <div>
      <button onClick={() => handleModal()}>click</button>
      fengfeng123
      {/*<Thing />*/}
    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('root'));
