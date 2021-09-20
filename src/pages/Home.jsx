import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import BasicHeader from '../components/Header';
import { Card, CardImg, CardBody, CardTitle, CardSubtitle, Modal, ModalBody } from 'reactstrap';
import "./styles/Home.css"
import { toRupiah } from '../helpers/toRupiah';
import Karosel from '../components/Carousel';
import Swal from 'sweetalert2';

class Home extends Component {
    state = {
        products: [],
        modalPopupProdukOpen: false,
        indexProduk: -1,
        kuantitas: 0,
        keranjang: []
    }

    // Get Data dari Server
    componentDidMount() {
        axios.get(`http://localhost:9000/products`)
            .then((res) => {
                this.setState({ products: res.data })
                console.log(this.state.products);
            }).catch((err) => {
                alert(`server error`)
            })
    }

    // Trigger Pop Up Produk
    modalPopupProdukHandler = (index) => {
        if (!this.props.auth.isLogin) {
            Swal.fire({
                icon: 'warning',
                title: 'Hmm..',
                text: 'Kamu harus login',
                timer: 1500,
                timerProgressBar: true
            })
            return
        }
        if (index >= 0) {
            this.setState({ indexProduk: index, modalPopupProdukOpen: !this.state.modalPopupProdukOpen })
        } else {
            this.setState({ indexProduk: -1, modalPopupProdukOpen: !this.state.modalPopupProdukOpen })
        }
    }

    // Get Input Kuantitas
    inputKuantitasHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    // Tambah ke Keranjang
    onTambah = (index) => {
        const { products, indexProduk } = this.state
        const helpers2 = products[indexProduk]

        if (this.state.kuantitas === 0) {
            alert(`isi input`)
            return
        } else if (this.state.kuantitas > helpers2.stok) {
            alert(`Kelebihan `)
            return
        } else if (this.state.kuantitas < 1) {
            alert(`kekurangan`)
            return
        }

        axios.get(`http://localhost:9000/users/${this.props.auth.id}`)
            .then((res) => {
                let keranjang = res.data.cart
                axios.patch(`http://localhost:9000/users/${this.props.auth.id}`, {
                    cart: [
                        ...keranjang,
                        {
                            nama: helpers2.nama,
                            gambar: helpers2.gambar,
                            harga: helpers2.harga,
                            kuantitas: parseInt(this.state.kuantitas)
                        }
                    ]
                }).then((res2) => {
                    console.log(keranjang)
                    Swal.fire({
                        icon: 'success',
                        title: 'Yay!',
                        text: 'Pilihanmu berhasil ditambahkan',
                        timer: 1500,
                        timerProgressBar: true
                    })
                }).catch((err) => {
                    alert(`error`)
                })
            })

        if (index >= 0) {
            this.setState({ indexProduk: index, modalPopupProdukOpen: !this.state.modalPopupProdukOpen })
        } else {
            this.setState({ indexProduk: -1, modalPopupProdukOpen: !this.state.modalPopupProdukOpen })
        }


    }

    // Pop Up Produk
    modalPopupProduk = () => {
        const { products, indexProduk } = this.state
        const helpers1 = indexProduk < 0
        const helpers2 = products[indexProduk]

        return (
            <Modal centered isOpen={this.state.modalPopupProdukOpen} toggle={this.modalPopupProdukHandler}>
                <ModalBody className="popup-layout">
                    <div className="popup-sec">
                        <img className="gambar-popup" src={helpers1 ? "" : helpers2.gambar} alt="" />
                    </div>
                    <div className="popup-sec2">
                        <h4 style={{ fontWeight: "700" }} > {helpers1 ? "" : helpers2.nama}</h4>
                        <hr />
                        <p className="fw-bold" style={{ marginBottom: "0", color: "tomato" }}>{toRupiah(helpers1 ? "" : helpers2.harga)}</p>
                        <p style={{ marginBottom: "2vh" }}>Stok : {helpers1 ? "" : helpers2.stok}</p>
                        <div className="kuantitas-box">
                            <input className="kuantitas-input" name="kuantitas" type="number" placeholder="Kuantitas" onChange={this.inputKuantitasHandler} />
                        </div>
                        <button className="add-cart-button" onClick={this.onTambah}>Tambah</button>
                    </div>
                </ModalBody>
            </Modal >
        )
    }

    // Produk
    renderProducts = () => {
        return this.state.products.map((val, index) => {
            return (
                <div key={index + 1} className="kartu-box-style">
                    <Card className="kartu-style">
                        <CardImg src={val.gambar} alt={val.nama} className="gambar-kartu" />
                        <CardBody>
                            <CardTitle tag="h5">{val.nama}</CardTitle>
                            <CardSubtitle tag="h6" className="teks-harga mb-3">{toRupiah(val.harga)}/buah</CardSubtitle>
                            <button className="cart-button-style" onClick={() => this.modalPopupProdukHandler(index)} >+ Tambahkan ke Keranjang</button>
                        </CardBody>
                    </Card>
                </div>
            )
        })
    }

    render() {
        return (
            <div>
                <BasicHeader />
                <Karosel />
                {this.modalPopupProduk()}
                <div className="kartu-box">
                    {this.renderProducts()}
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

export default connect(MapStateToProps)(Home);