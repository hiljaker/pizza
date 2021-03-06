import axios from 'axios';
import React, { Component } from 'react';
import Swal from 'sweetalert2';
import { apiURL } from '../helpers/apiURL';
import { toRupiah } from '../helpers/toRupiah';
import BasicHeader from "../components/Header";
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import { Link } from "react-router-dom";
import EmptyCart from "../assets/empty-cart.svg"
import "./styles/Checkout.css"

class Checkout extends Component {
    state = {
        keranjang: [],
        biodata: {
            nama: "",
            alamat: "",
            kodepos: "",
            payment: ""
        },
        trhistory: [],
        bought: []
    }

    // Get Data Keranjang
    async componentDidMount() {
        let res = await axios.get(`${apiURL}/getcart/${this.props.auth.user_id}`)
        try {
            this.setState({ keranjang: res.data })
        } catch (error) {
            alert("error")
        }
    }

    // Item details
    renderCheckout = () => {
        return this.state.keranjang.map((val, index) => {
            return (
                <tr key={index * 8}>
                    <th scope="row">{index + 1}</th>
                    <td>{val.name}</td>
                    <td>{val.quantity} {val.type}</td>
                    <td>{toRupiah(val.price * val.quantity)}</td>
                </tr>
            )
        })
    }

    // Get Inputs
    inputHandler = (e) => {
        let biodataCopy = this.state.biodata
        biodataCopy = { ...biodataCopy, [e.target.name]: e.target.value }
        this.setState({ biodata: biodataCopy })
        console.log(this.state.biodata);
    }

    // Total Belanja
    grandTotal = () => {
        let total = 0
        this.state.keranjang.forEach((val) => {
            total += val.price * val.quantity
        })
        return <h5 style={{ color: "white", margin: "5% 0", textAlign: "center" }}>{toRupiah(total)}</h5>
    }

    // When you click konfirmasi & bayar
    onPay = () => {
        var d = new Date().getTime()
        const { nama, alamat, kodepos, payment } = this.state.biodata

        if (this.state.keranjang.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Tidak ada item',
                timer: 1500,
                timerProgressBar: true
            })
            return
        }

        if (!nama || !alamat || !kodepos || !payment) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Tidak boleh ada yang kosong',
                timer: 1500,
                timerProgressBar: true
            })
            return
        }

        axios.get(`${apiURL}/users/${this.props.auth.id}`)
            .then((res) => {
                this.setState({ trhistory: res.data.trhistory })
                axios.patch(`${apiURL}/users/${this.props.auth.id}`, {
                    trhistory: [
                        ...this.state.trhistory,
                        {
                            nama: nama,
                            alamat: alamat,
                            kodepos: parseInt(kodepos),
                            payment: payment,
                            trid: `BW-${d}`,
                            bought: [
                                ...this.state.keranjang
                            ]
                        }
                    ]
                }).then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Yay!',
                        text: 'Pembayaran berhasil',
                        timer: 1500,
                        timerProgressBar: true
                    })
                    axios.patch(`${apiURL}/users/${this.props.auth.id}`, {
                        cart: []
                    })
                }).then(() => {
                    axios.get(`${apiURL}/users/${this.props.auth.id}`)
                        .then((res2) => {
                            this.setState({ keranjang: res2.data.cart })
                        }).catch(() => {
                            alert(`error`)
                        })
                }).catch(() => {
                    alert(`alert`)
                })
            })
    }

    render() {
        return (
            <>
                <BasicHeader />
                <div className="checkout-page-layout">
                    <div className="checkout-box">
                        <div className="box-1">
                            <h1 style={{ textAlign: "center" }}>Check Out</h1>
                            <hr />
                            {this.state.keranjang.length === 0 ? (
                                <div style={{ textAlign: "center", marginTop: "13%" }}>
                                    <img src={EmptyCart} alt="" width={"150vw"} />
                                    <h3 style={{ marginTop: 20 }}>Keranjang kosong</h3>
                                    <p style={{ marginTop: 20 }}>Silahkan <Link to="/" style={{ color: "#f9773e" }}>tambahkan</Link> produk.</p>
                                </div>
                            ) : (
                                <div style={{ overflow: "auto", maxHeight: "80%", margin: "0 5%" }}>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Nama</th>
                                                <th>Kuantitas</th>
                                                <th>Jumlah</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderCheckout()}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </div>
                        <div className="box-2">
                            <h1 style={{ textAlign: "center", color: "white" }}>Payment</h1>
                            <hr style={{ color: "white" }} />
                            <input
                                type="text" placeholder="Nama Penerima" name="nama"
                                onChange={this.inputHandler}
                                className="checkout-input"
                            />
                            <textarea
                                type="text" placeholder="Alamat" name="alamat"
                                onChange={this.inputHandler}
                                className="checkout-textarea"
                            />
                            <input
                                type="number" placeholder="Kode Pos" name="kodepos"
                                onChange={this.inputHandler}
                                className="checkout-input"
                            />
                            <div style={{ textAlign: "center", display: "flex", justifyContent: "space-around", alignItems: "center", marginBottom: "2%" }}>
                                <div>
                                    <input type="radio" id="bri" name="payment" value="BRI" style={{ marginRight: 5 }} onChange={this.inputHandler} />
                                    <label htmlFor="bri" style={{ color: "white" }}>BRI</label>
                                </div>
                                <div>
                                    <input type="radio" id="bca" name="payment" value="BCA" style={{ marginRight: 5 }} onChange={this.inputHandler} />
                                    <label htmlFor="bca" style={{ color: "white" }}>BCA</label>
                                </div>
                                <div>
                                    <input type="radio" id="bupay" name="payment" value="BuPay" style={{ marginRight: 5 }} onChange={this.inputHandler} />
                                    <label htmlFor="bupay" style={{ color: "white" }}>BuPay</label>
                                </div>
                            </div>
                            {this.grandTotal()}
                            <button className="cnp-button" onClick={this.onPay}>Konfirmasi & Bayar</button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const MapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

export default connect(MapStateToProps)(Checkout);