import React from 'react';

// import * as styles from './index.css';
export default class TipModal extends React.Component {
  hander(e: any) {
    console.log(e);
    console.log('ccc', require, require.context);
  }

  render() {
    return <h2 onClick={(e) => this.hander(e)}>vv</h2>
  }
}

