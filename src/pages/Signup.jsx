import axios from 'axios';
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiURL } from '../helpers/apiURL';
import "./styles/Signup.css"

class Signup extends Component {
    state = {
        lihatPass: "password",
        username: "",
        password: "",
        confirmPassword: "",
        doneSignup: false,
        openAlert: true,
        buttonDisabled: false
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.password !== this.state.password) {
            this.setState({ password: this.state.password })
            const cekPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})")
            if (!cekPass.test(this.state.password)) {
                this.setState({ openAlert: false, buttonDisabled: true })
                return
            } else {
                this.setState({ openAlert: true, buttonDisabled: false })
            }
            console.log(this.state.password);
        }

    }

    // Lihat Password
    onCheck = (e) => {
        if (e.target.checked) {
            this.setState({ lihatPass: "text" })
        } else {
            this.setState({ lihatPass: "password" })
        }
    }

    // Ambil Input Username
    inputHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    // Klik Sign Up
    onSignup = () => {
        const { username, password, confirmPassword } = this.state
        if (!username || !password || !confirmPassword) {
            Swal.fire({
                icon: 'warning',
                text: 'Isi semua!',
                timer: 1500,
                timerProgressBar: true
            })
            return
        } else if (confirmPassword !== password) {
            Swal.fire({
                icon: 'error',
                text: 'Password tidak sesuai.',
                timer: 1500,
                timerProgressBar: true
            })
            return
        }
        axios.get(`${apiURL}/users?username=${username}`)
            .then((res) => {
                if (res.data.length) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Username telah digunakan',
                        timer: 1500,
                        timerProgressBar: true
                    })
                } else {
                    axios.post(`${apiURL}/users`, {
                        username: username,
                        password: password,
                        role: "user",
                        cart: [],
                        trhistory: []
                    }).then((res) => {
                        Swal.fire({
                            icon: 'success',
                            text: 'Berhasil sign up!',
                            timer: 1500,
                            timerProgressBar: true
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
                            onKeyUp={this.inputHandler}
                        />
                    </div>
                    <p className="pass-alert" hidden={this.state.openAlert}>Password harus berisi setidaknya 1 huruf kecil, 1 huruf besar, dan 1 angka</p>
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
                            disabled={this.state.buttonDisabled}
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