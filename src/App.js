import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import BasicHeader from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
        </Switch>
      </div>
    )
  }
}

export default App;