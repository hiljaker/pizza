import axios from 'axios';
import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { toRupiah } from '../../helpers/toRupiah';
import "./styles/manageProducts.css"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Swal from 'sweetalert2';

class ManageProducts extends Component {
    state = {
        products: [],
        modalOpen: false,
        modalEdit: false,
        modalHapus: false,
        indexHapus: -1,
        nama: "",
        gambar: "",
        stok: 0,
        harga: 0
    }

    // Get Data from Server
    componentDidMount = () => {
        axios.get(`http://localhost:9000/products`)
            .then((res) => {
                console.log(res.data)
                this.setState({ products: res.data })
            }).catch((err) => {
                alert(`server error`)
            })
    }

    // Render Produk ke Tabel
    renderProducts = () => {
        return this.state.products.map((val, index) => {
            return (
                <tr className="text-center">
                    <th scope="row">{index + 1}</th>
                    <td>{val.nama}</td>
                    <td><img src={val.gambar} alt={val.nama} className="pict-size" /></td>
                    <td>{val.stok}</td>
                    <td>{toRupiah(val.harga)} per buah</td>
                    <td><button className="button-edit">Edit</button></td>
                    <td><button className="button-hapus" onClick={() => this.modalHapusHandler(index)}>Hapus</button></td>
                </tr>
            )
        })
    }

    // Buka Modal
    modalHandler = () => {
        this.setState({ modalOpen: !this.state.modalOpen })
    }

    modalEditHandler = () => {
        this.setState({ modalEdit: !this.state.modalEdit })
    }

    modalHapusHandler = (index) => {
        this.setState({ indexHapus: index, modalHapus: !this.state.modalHapus })
    }

    // Modal Tambah
    modalAddItem = () => {
        return (
            <div>
                <Modal isOpen={this.state.modalOpen} toggle={this.modalHandler}>
                    <ModalHeader>Tambah Produk</ModalHeader>
                    <ModalBody>
                        <input type="text" name="nama" placeholder="Nama" className="modal-input-style" onChange={this.inputHandler} />
                        <input type="text" name="gambar" placeholder="Link Gambar" className="modal-input-style" onChange={this.inputHandler} />
                        <input type="number" name="stok" placeholder="Stok" className="modal-input-style" onChange={this.inputHandler} />
                        <input type="number" name="harga" placeholder="Harga" className="modal-input-style" onChange={this.inputHandler} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.onTambah} >Tambah</Button>
                        <Button color="secondary" onClick={this.modalHandler}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }



    // Get Input
    inputHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
        console.log(this.state);
        console.log(this.state.products)

    }

    // Tambah
    onTambah = () => {
        const { nama, gambar, stok, harga } = this.state
        if (!nama || !gambar || !stok || !harga) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Isi semua!',
                timer: 2000,
                timerProgressBar: true
            })
            return
        }
        axios.post(`http://localhost:9000/products`, {
            nama: nama,
            gambar: gambar,
            stok: parseInt(stok),
            harga: parseInt(harga)
        }).then((res) => {
            Swal.fire({
                icon: 'success',
                title: 'Yay!',
                text: 'Berhasil tambah produk',
                timer: 2000,
                timerProgressBar: true
            })
            this.setState({ modalOpen: false })
        }).catch((err) => {
            alert(`server error`)
        })
        // window.location.reload(false);
    }

    // Modal Hapus
    modalHapus = () => {
        return (
            <Modal isOpen={this.state.modalHapus} toggle={this.modalHapusHandler}>
                <ModalHeader>
                    Hapus Item
                </ModalHeader>
                <ModalBody>
                    Kamu akan menghapus produk
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.onHapus} >Ya</Button>
                    <Button color="secondary" onClick={this.modalHapusHandler}>Tidak</Button>
                </ModalFooter>
            </Modal>
        )
    }

    // Hapus
    onHapus = () => {
        let { products, indexHapus } = this.state
        let idHapus = products[indexHapus].id

        axios.delete(`http://localhost:9000/products/${idHapus}`)
            .then((res) => {
                axios.get(`http://localhost:9000/products/`)
                    .then((res1) => {
                        this.setState({
                            products: res1.data,
                            indexHapus: -1,
                            modalHapus: !this.state.modalHapus
                        })
                    }).catch((err) => {
                        alert(`server error`)
                    })
            }).catch((err) => {
                alert(`server error`)
            })
    }

    render() {
        return (
            <div className="mp-box">
                {this.modalAddItem()}
                {this.modalHapus()}
                <button className="mp-button" onClick={this.modalHandler}>
                    Tambah Produk
                </button>
                <Table hover>
                    <thead className="text-center">
                        <tr>
                            <th className="t-nomor">#</th>
                            <th className="t-nama">Nama</th>
                            <th className="t-gambar">Gambar</th>
                            <th className="t-stok">Stok</th>
                            <th className="t-harga">Harga</th>
                            <th className="t-aksi" colSpan={2}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderProducts()}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default ManageProducts;