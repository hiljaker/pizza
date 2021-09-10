import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { LoginAction } from './redux/actions';

class App extends Component {

  componentDidMount() {
    let id = localStorage.getItem("id")
    if (id) {
      axios.get(`http://localhost:9000/users/${id}`)
        .then((res) => {
          this.props.LoginAction(res.data)
        }).catch((err) => {
          alert(`server error`)
        })
    }
  }

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

const MapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

export default connect(MapStateToProps, { LoginAction })(App);