import axios from 'axios';
import React, { Component } from 'react';
import Swal from 'sweetalert2';

class Signup extends Component {
    state = {
        lihatPass: "password",
        username: "",
        password: "",
        confirmPassword: ""
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
    }

    // Klik Sign Up
    onSignup = () => {
        const { email, username, password, confirmPassword } = this.state
        if (!username || !password || !confirmPassword) {
            Swal.fire({
                icon: 'warning',
                text: 'Isi semua!'
            })
            return
        } else if (confirmPassword != password) {
            Swal.fire({
                icon: 'error',
                text: 'Password tidak sesuai.'
            })
            return
        }
        axios.post(`http://localhost:9000/users`, {
            username: username,
            password: password,
            role: "user"
        }).then((res) => {
            Swal.fire({
                icon: 'success',
                text: 'Berhasil sign up!'
            })
        }).catch((err) => {
            Swal.fire({
                icon: 'error',
                text: 'Server error'
            })
        })
    }

    render() {
        return (
            <div className="login-page container">
                <div className="box1 d-xl-flex flex-xl-column m-xl-5 p-xl-5">
                    <h1 className="text-center mb-xl-5">Sign Up</h1>
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
                    <input
                        type={this.state.lihatPass}
                        name="confirmPassword"
                        placeholder="Confirm password"
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
                        onClick={this.onSignup}
                        className="btn btn-primary w-25 align-self-center mb-xl-3"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        )
    }
}

export default Signup;