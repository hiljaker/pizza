import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toRupiah } from '../helpers/toRupiah';
import BasicHeader from "./../components/Header";
import "./styles/Cart.css"
import EmptyCart from "../assets/empty-cart.svg"

class Cart extends Component {
    state = {
        keranjang: []
    }

    componentDidMount() {
        axios.get(`http://localhost:9000/users/${this.props.auth.id}`)
            .then((res) => {
                this.setState({ keranjang: res.data.cart })
                console.log(this.state.keranjang);
            }).catch((err) => {
                alert(`error`)
            })
    }

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
                axios.patch(`http://localhost:9000/users/${this.props.auth.id}`, {
                    cart: [
                        ...keranjangCopy
                    ]
                }).then((res) => {
                    axios.get(`http://localhost:9000/users/${this.props.auth.id}`)
                        .then((res2) => {
                            this.setState({ keranjang: res2.data.cart })
                        }).catch((err2) => {
                            alert(`server error`)
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
                        <p>Harga per buah = {toRupiah(val.harga)}</p>
                        <p>Kuantitas = {val.kuantitas}</p>
                        <p style={{ fontWeight: "bold" }}>Total = {toRupiah(val.harga * val.kuantitas)}</p>
                    </div>
                </div>
            )
        })
    }

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
                        <div className="total-harga">
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