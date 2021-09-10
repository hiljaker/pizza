import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LoginAction } from '../redux/actions';
import "./styles/Login.css"



class Login extends Component {
    state = {
        lihatPass: "password",
        username: "",
        password: ""
    }

    // Lihat Password
    onCheck = (e) => {
        if (e.target.checked) {
            this.setState({ lihatPass: "text" })
        } else {
            this.setState({ lihatPass: "password" })
        }
    }

    // Ambil Input
    inputHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
        console.log(this.state);
    }

    // Login
    onLogin = () => {
        const { username, password } = this.state
        axios.get(`http://localhost:9000/users?username=${username}&password=${password}`)
            .then((res) => {
                if (res.data.length) {
                    localStorage.setItem("id", res.data[0].id)
                    this.props.LoginAction(res.data[0])
                    Swal.fire({
                        icon: 'success',
                        title: 'Yay!',
                        text: 'Berhasil login!',
                        timer: 2000,
                        timerProgressBar: true
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Akun tidak ditemukan!'
                    })
                }
            }).catch((err) => {
                alert(`server error`)
            })
    }

    render() {
        if (this.props.isLogin) {
            return <Redirect to="/" />
        }

        return (
            <div className="login-page container">
                <div className="box1 d-xl-flex flex-xl-column m-xl-5 p-xl-5 m-md-5 p-md-5 my-5 mx-2 p-2">
                    <h1 className="text-center mb-xl-5 mt-xl-5 mb-md-5 mt-md-5 mb-5 mt-5">Login</h1>
                    <div className="text-center">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="lebar align-self-center mb-xl-3 mb-md-3 mb-3"
                            onChange={this.inputHandler}
                        />
                    </div>
                    <div className="text-center">
                        <input
                            type={this.state.lihatPass}
                            name="password"
                            placeholder="Password"
                            className="lebar align-self-center mb-xl-3 mb-md-3 mb-3"
                            onChange={this.inputHandler}
                        />
                    </div>
                    <div className="text-center mb-xl-3 mb-md-3 mb-3">
                        <input
                            type="checkbox"
                            onChange={this.onCheck}
                        /> Lihat Password
                    </div>
                    <div className="text-center mb-xl-2 mb-md-2 mb-2">
                        <button
                            onClick={this.onLogin}
                            className="btn btn-primary lebar align-self-center mb-xl-3 mb-md-3 mb-3"
                        >
                            Login
                        </button>
                    </div>
                    <p className="text-center mb-xl-2 mb-md-2">Belum punya akun? <Link to="/signup">Sign up</Link> disini!</p>
                    <p className="text-center"><Link to="/">Kembali ke Home</Link></p>
                </div>
            </div>
        )
    }
}

const MapStateToProps = (state) => {
    return {
        isLogin: state.auth.isLogin
    }
}

export default connect(MapStateToProps, { LoginAction })(Login);
