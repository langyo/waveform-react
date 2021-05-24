import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

const appElement = document.getElementById('root');

render(<App />, appElement);
