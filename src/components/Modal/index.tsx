import React from 'react';
import { Title } from '@/components/Modal/style'

export default class TipModal extends React.Component {
  hander(e: any) {
    console.log(e);
    console.log('ccc', require, require.context);
  }

  render() {
    return <div>
      <Title onClick={(e: any) => this.hander(e)}>vv</Title>
    </div>
  }
}

