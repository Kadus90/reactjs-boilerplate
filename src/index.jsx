import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.css';
import App from './App';
import {DevConfigProvider} from './contexts/devConfigContext';

const DevConfig = ['Webpack', 'ESLint', 'Prettier', 'Husky', 'Lint-Staged', 'Commitlint'];

ReactDOM.render(
  <React.StrictMode>
    <DevConfigProvider value={DevConfig}>
      <App />
    </DevConfigProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
