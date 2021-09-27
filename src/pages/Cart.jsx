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
    componentDidMount() {
        axios.get(`${apiURL}/users/${this.props.auth.id}`)
            .then((res) => {
                this.setState({ keranjang: res.data.cart })
                console.log(this.state.keranjang);
                axios.get(`${apiURL}/products`)
                    .then((res2) => {
                        this.setState({ products: res2.data })
                        console.log(this.state.products);
                    }).catch((err2) => {
                        alert(`error`)
                    })
            }).catch((err) => {
                alert(`error`)
            })
    }

    // Hapus Item
    onHapus(index) {
        let idProduk = this.state.keranjang[index]
        Swal.fire({
            icon: "warning",
            title: `Kamu mau hapus ${idProduk.nama}?`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            denyButtonText: `Tidak`,
        }).then((result) => {
            if (result.isConfirmed) {
                let keranjangCopy = this.state.keranjang
                keranjangCopy.splice(index, 1)
                console.log(keranjangCopy);
                axios.patch(`${apiURL}/users/${this.props.auth.id}`, {
                    cart: [
                        ...keranjangCopy
                    ]
                }).then((res) => {
                    axios.get(`${apiURL}/users/${this.props.auth.id}`)
                        .then((res2) => {
                            this.setState({ keranjang: res2.data.cart })
                        }).catch((err2) => {
                            alert(`server error`)
                        })
                    // Batas
                    let productsCopy = this.state.products
                    let indexProduk = productsCopy.findIndex(x => x.nama === idProduk.nama)
                    productsCopy[indexProduk].stok += idProduk.kuantitas
                    this.setState({ products: productsCopy })
                    axios.patch(`${apiURL}/products/${productsCopy[indexProduk].id}`, {
                        ...this.state.products[indexProduk]
                    })
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
                        <img src={val.gambar} alt="" className="item-imgstyle" />
                    </div>
                    <div className="detail-sec2">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h2>{val.nama}</h2>
                            <button onClick={() => this.onHapus(index)} className="tombolhapus-cart">Hapus</button>
                        </div>
                        <hr />
                        <p>Harga per {val.tipe} = {toRupiah(val.harga)}</p>
                        <p>Kuantitas = {val.kuantitas} {val.tipe}</p>
                        <p style={{ fontWeight: "bold" }}>Total = {toRupiah(val.harga * val.kuantitas)}</p>
                    </div>
                </div>
            )
        })
    }

    // Total Belanja
    grandTotal() {
        let total = 0
        this.state.keranjang.forEach((val) => {
            total += val.harga * val.kuantitas
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
                        <div className="">
                            <h1>Total</h1>
                            <hr />
                            {this.grandTotal()}
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