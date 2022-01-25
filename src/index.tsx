import React, { Fragment } from "react";
import ReactDOM from 'react-dom';

import Modal from './modal/modal';


ReactDOM.render(
  <Fragment>
    <Modal/>
  </Fragment>,
  document.getElementById('root')
);

export {
  Modal
}
