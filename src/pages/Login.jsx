import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
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
                    alert(`data ada`)
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
        return (
            <div className="login-page container">
                <div className="box1 d-xl-flex flex-xl-column m-xl-5 p-xl-5">
                    <h1 className="text-center mb-xl-5">Login</h1>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="form-control w-25 align-self-center mb-xl-3"
                        onChange={this.inputHandler}
                    />
                    <input
                        type={this.state.lihatPass}
                        name="password"
                        placeholder="Password"
                        className="form-control w-25 align-self-center mb-xl-3"
                        onChange={this.inputHandler}
                    />
                    <div className="text-center mb-xl-3">
                        <input
                            type="checkbox"
                            onChange={this.onCheck}
                        /> Lihat Password
                    </div>
                    <button
                        onClick={this.onLogin}
                        className="btn btn-primary w-25 align-self-center mb-xl-3"
                    >
                        Login
                    </button>
                    <p className="text-center">Belum punya akun? <Link to="/signup">Sign up</Link> disini!</p>
                </div>
            </div>
        )
    }
}

// const MapStateToProps = (state) => {
//     return {
//         isLogin: state.auth
//     }
// }

export default Login;
