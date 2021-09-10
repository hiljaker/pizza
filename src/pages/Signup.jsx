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

    render() {
        if (this.state.doneSignup) {
            return <Redirect to="/login" />
        }

        return (
            <div className="container">
                <div className="box1 d-xl-flex flex-xl-column m-xl-5 p-xl-5 m-md-5 p-md-5 my-5 mx-2 p-2">
                    <h1 className="text-center mb-xl-5 mt-xl-5 mb-md-5 mt-md-5 mb-5 mt-5">Sign Up</h1>
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
                    <div className="text-center">
                        <input
                            type={this.state.lihatPass}
                            name="confirmPassword"
                            placeholder="Confirm password"
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
                    <div className="text-center">
                        <button
                            onClick={this.onSignup}
                            className="btn btn-primary lebar align-self-center mb-xl-3 mb-md-3 mb-3"
                        >
                            Sign Up
                        </button>
                    </div>
                    <p className="text-center">Sudah punya akun? <Link to="/login">Login</Link> disini!</p>
                </div>
            </div>
        )
    }
}

export default Signup;