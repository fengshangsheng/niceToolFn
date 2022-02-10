import React from 'react';

// import * as styles from './index.css';
class TipModal extends React.Component {
  hander(e: any) {
    console.log(e);
    console.log('ccc');
  }

  render() {
    return <h2 onClick={(e) => this.hander(e)}>xxxxxfengfeng</h2>
  }
}

export { TipModal } ;
