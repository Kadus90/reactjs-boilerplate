import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Index from './pages/index';

const App = () => (
  <div className="App">
    <Router>
      <Switch>
        <Route path="/">
          <Index />
        </Route>
      </Switch>
    </Router>
  </div>
);

export default App;
