import React from 'react';

// import * as styles from './index.css';
class TipInput extends React.Component {
  hander(e: any) {
    console.log(e);
    console.log('ccc');
  }

  render() {
    return <input onInput={(e) => this.hander(e)}/>
  }
}

export default TipInput;
