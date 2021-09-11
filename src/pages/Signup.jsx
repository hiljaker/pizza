import axios from 'axios';
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';
import "./styles/Signup.css"

class Signup extends Component {
    state = {
        lihatPass: "password",
        username: "",
        password: "",
        confirmPassword: "",
        doneSignup: false
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
        const { username, password, confirmPassword } = this.state
        if (!username || !password || !confirmPassword) {
            Swal.fire({
                icon: 'warning',
                text: 'Isi semua!'
            })
            return
        } else if (confirmPassword !== password) {
            Swal.fire({
                icon: 'error',
                text: 'Password tidak sesuai.'
            })
            return
        }
        axios.get(`http://localhost:9000/users?username=${username}`)
            .then((res) => {
                if (res.data.length) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Username telah digunakan',
                        timer: 2000,
                        timerProgressBar: true
                    })
                } else {
                    axios.post(`http://localhost:9000/users`, {
                        username: username,
                        password: password,
                        role: "user"
                    }).then((res) => {
                        Swal.fire({
                            icon: 'success',
                            text: 'Berhasil sign up!'
                        })
                        this.setState({ doneSignup: true })
                    }).catch((err) => {
                        Swal.fire({
                            icon: 'error',
                            text: 'Server error'
                        })
                    })
                }
            }).catch((err) => {
                Swal.fire({
                    icon: 'error',
                    text: 'Server error'
                })
            })

    }

    render() {
        if (this.state.doneSignup) {
            return <Redirect to="/login" />
        }

        return (
            <div className="signup-page">
                <div className="signup-box">
                    <h1 className="signup-judul">Sign Up</h1>
                    <div className="signup-input">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="signup-input-style"
                            onChange={this.inputHandler}
                        />
                    </div>
                    <div className="signup-input">
                        <input
                            type={this.state.lihatPass}
                            name="password"
                            placeholder="Password"
                            className="signup-input-style"
                            onChange={this.inputHandler}
                        />
                    </div>
                    <div className="signup-input">
                        <input
                            type={this.state.lihatPass}
                            name="confirmPassword"
                            placeholder="Confirm password"
                            className="signup-input-style"
                            onChange={this.inputHandler}
                        />
                    </div>
                    <div className="signup-input">
                        <input
                            type="checkbox"
                            onChange={this.onCheck}
                        /> Lihat Password
                    </div>
                    <div className="signup-input">
                        <button
                            onClick={this.onSignup}
                            className="signup-button-style"
                        >
                            Sign Up
                        </button>
                    </div>
                    <p className="">Sudah punya akun? <Link to="/login">Login</Link> disini!</p>
                </div>
            </div>
        )
    }
}

export default Signup;