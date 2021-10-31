import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiURL } from '../helpers/apiURL';
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
    onLogin = async () => {
        const { username, password } = this.state
        const res = await axios.post(`${apiURL}/login`, { username, password })
        console.log(res.headers);
        try {
            if (!res.data.length) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Akun tidak ditemukan!',
                    timer: 1500,
                    timerProgressBar: true
                })
            }
            localStorage.setItem("token", res.headers["access-token"])
            this.props.LoginAction(res.data[0])
        } catch (error) {
            alert("error")
        }
    }

    render() {
        if (this.props.isLogin) {
            return <Redirect to="/" />
        }

        return (
            <div className="login-page">
                <div className="login-box">
                    <h1 className="login-judul">Login</h1>
                    <div className="login-input">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="login-input-style"
                            onChange={this.inputHandler}
                        />
                    </div>
                    <div className="login-input">
                        <input
                            type={this.state.lihatPass}
                            name="password"
                            placeholder="Password"
                            className="login-input-style"
                            onChange={this.inputHandler}
                        />
                    </div>
                    <div className="login-input">
                        <input
                            type="checkbox"
                            onChange={this.onCheck}
                        /> Lihat Password
                    </div>
                    <div className="login-input">
                        <button
                            onClick={this.onLogin}
                            className="login-button-style"
                        >
                            Login
                        </button>
                    </div>
                    <p className="fix-p">Belum punya akun? <Link to="/signup">Sign up</Link> disini!</p>
                    <p className=""><Link to="/">Kembali ke Home</Link></p>
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
