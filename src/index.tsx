import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';

import './index.css';
import * as serviceWorker from './serviceWorker';
import {store} from "./store";
import {joinRoomStartAction} from "./slices";
import {App} from "./components";

store.dispatch(joinRoomStartAction('alex'))

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
