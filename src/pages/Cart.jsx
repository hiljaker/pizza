import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toRupiah } from '../helpers/toRupiah';
import BasicHeader from "./../components/Header";
import "./styles/Cart.css"
import EmptyCart from "../assets/empty-cart.svg"
import { apiURL } from '../helpers/apiURL';

class Cart extends Component {
    state = {
        keranjang: [],
        products: []
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

    // Hapus Item
    onHapus(index) {
        let idProduk = this.state.keranjang[index].product_id
        console.log(idProduk);
        Swal.fire({
            icon: "warning",
            title: `Kamu mau hapus ${idProduk.nama}?`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            denyButtonText: `Tidak`,
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${apiURL}/deletefromcart/${idProduk}/${this.props.auth.user_id}`)
                    .then((res) => {
                        this.setState({ keranjang: res.data })
                    }).catch((err) => {
                        alert(`server error`)
                    })
                Swal.fire('Berhasil dihapus!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Batal dihapus', '', 'info')
            }
        })
    }

    // Render Keranjang
    renderKeranjang = () => {
        return this.state.keranjang.map((val, index) => {
            return (
                <div className="item-details" key={index + 1}>
                    <div className="detail-sec1">
                        <img src={val.image} alt="" className="item-imgstyle" />
                    </div>
                    <div className="detail-sec2">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h2>{val.name}</h2>
                            <button onClick={() => this.onHapus(index)} className="tombolhapus-cart">Hapus</button>
                        </div>
                        <hr />
                        <p>Harga per {val.type} = {toRupiah(val.price)}</p>
                        <p>Kuantitas = {val.quantity} {val.type}</p>
                        <p style={{ fontWeight: "bold" }}>Total = {toRupiah(val.price * val.quantity)}</p>
                    </div>
                </div>
            )
        })
    }

    // Total Belanja
    grandTotal() {
        let total = 0
        this.state.keranjang.forEach((val) => {
            total += val.price * val.quantity
        })
        return <h4>{toRupiah(total)}</h4>
    }

    render() {
        return (
            <div>
                <BasicHeader />
                <div className="page-keranjang">
                    <div className="list-item">
                        {this.state.keranjang.length === 0 ? (
                            <div style={{ textAlign: "center", marginTop: 50 }}>
                                <img src={EmptyCart} alt="" width={"200vw"} />
                                <h1 style={{ marginTop: 20 }}>Keranjang kosong</h1>
                                <p style={{ marginTop: 20 }}>Silahkan <Link to="/" style={{ color: "#f9773e" }}>tambahkan</Link> produk.</p>
                            </div>
                        ) : this.renderKeranjang()}
                    </div>
                    <div className="total-harga-sec">
                        <div>
                            <div className="total-harga">
                                <h1>Total</h1>
                                <hr />
                                {this.grandTotal()}
                            </div>
                            <Link to="cart/checkout">
                                <button className="checkout-button">Check Out</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const MapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

export default connect(MapStateToProps)(Cart);