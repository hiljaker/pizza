import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import AdminHome from './pages/admin/adminHome';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';
import { LoginAction } from './redux/actions';

class App extends Component {

  // Keep Login
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

  // Render Rute Berdasarkan Role User
  ruteAdmin = () => (
    <Switch>
      <Route path="/" exact component={AdminHome} />
      <Route path="/login" exact component={Login} />
      <Route path="/signup" exact component={Signup} />
      <Route path="*" component={NotFound} />
    </Switch>
  )

  ruteUmum = () => (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/login" exact component={Login} />
      <Route path="/signup" exact component={Signup} />
      <Route path="/cart" exact component={Cart} />
      <Route path="*" component={NotFound} />
    </Switch>
  )

  renderRute = () => {
    let { role } = this.props.auth
    if (role === `admin`) {
      return this.ruteAdmin()
    } else {
      return this.ruteUmum()
    }
  }

  render() {
    return (
      <div>
        {this.renderRute()}
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