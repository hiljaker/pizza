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
        addProducts: {
            nama: "",
            gambar: "",
            stok: 0,
            harga: 0
        },
        modalHapus: false,
        indexHapus: -1,
        modalEdit: false,
        indexEdit: -1,
        editProducts: {
            nama: "",
            gambar: "",
            stok: 0,
            harga: 0
        },
        inputCari: ""
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
                <tr className="text-center" key={index + 1}>
                    <th scope="row">{index + 1}</th>
                    <td>{val.nama}</td>
                    <td><img src={val.gambar} alt={val.nama} className="pict-size" /></td>
                    <td>{val.stok}</td>
                    <td>{toRupiah(val.harga)} per buah</td>
                    <td><button className="button-edit" onClick={() => this.modalEditHandler(index)}>Edit</button></td>
                    <td><button className="button-hapus" onClick={() => this.onHapus(index)}>Hapus</button></td>
                </tr>
            )
        })
    }

    // Buka Modal
    modalHandler = () => {
        this.setState({ modalOpen: !this.state.modalOpen })
    }

    modalEditHandler = (index) => {
        this.setState({ indexEdit: index, modalEdit: !this.state.modalEdit })
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
        let addProductsCopy = this.state.addProducts
        addProductsCopy = { ...addProductsCopy, [e.target.name]: e.target.value }
        this.setState({ addProducts: addProductsCopy })
    }

    // Tambah
    onTambah = () => {
        const { nama, gambar, stok, harga } = this.state.addProducts
        if (!nama || !gambar || !stok || !harga) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Isi semua!',
                timer: 1500,
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
            axios.get(`http://localhost:9000/products`)
                .then((res2) => {
                    this.setState({ products: res2.data })
                }).catch((err2) => {
                    alert(`server error`)
                })
            Swal.fire({
                icon: 'success',
                title: 'Yay!',
                text: 'Berhasil tambah produk',
                timer: 1500,
                timerProgressBar: true
            })
            this.setState({ modalOpen: false })
        }).catch((err) => {
            alert(`server error`)
        })
    }

    // Hapus
    onHapus = (index) => {
        let idProduk = this.state.products[index]
        Swal.fire({
            icon: "warning",
            title: `Hapus ${idProduk.nama}?`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            denyButtonText: `Tidak`,
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:9000/products/${idProduk.id}`)
                    .then((res) => {
                        axios.get(`http://localhost:9000/products`)
                            .then((res2) => {
                                this.setState({ products: res2.data })
                            }).catch((err2) => {
                                alert(`server error`)
                            })
                    }).catch((err) => {
                        alert(`server error`)
                    })
                Swal.fire('Terhapus!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Batal dihapus', '', 'info')
            }
        })
    }

    // Modal Edit
    modalEdit = () => {
        return (
            <Modal isOpen={this.state.modalEdit} toggle={this.modalEditHandler}>
                <ModalHeader>
                    Edit Produk
                </ModalHeader>
                <ModalBody>
                    <input type="text" name="nama" placeholder="Nama" className="modal-input-style" onChange={this.editInputHandler} />
                    <input type="text" name="gambar" placeholder="Link Gambar" className="modal-input-style" onChange={this.editInputHandler} />
                    <input type="number" name="stok" placeholder="Stok" className="modal-input-style" onChange={this.editInputHandler} />
                    <input type="number" name="harga" placeholder="Harga" className="modal-input-style" onChange={this.editInputHandler} />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.onSimpan}>
                        Simpan
                    </Button>
                    <Button color="secondary" onClick={this.modalEditHandler}>
                        Batal
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }

    // Get Edit Input
    editInputHandler = (e) => {
        let editProductsCopy = this.state.editProducts
        editProductsCopy = { ...editProductsCopy, [e.target.name]: e.target.value }
        this.setState({ editProducts: editProductsCopy })
        console.log(this.state.editProducts);
    }

    // Simpan Hasil Edit
    onSimpan = () => {
        let { nama, gambar, stok, harga } = this.state.editProducts
        if (!nama || !gambar || !stok || !harga) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Isi semua!',
                timer: 1500,
                timerProgressBar: true
            })
            return
        }

        let { indexEdit, products, editProducts } = this.state
        let idEdit = products[indexEdit].id

        axios.put(`http://localhost:9000/products/${idEdit}`, editProducts)
            .then((res) => {
                axios.get(`http://localhost:9000/products`)
                    .then((res1) => {
                        let defEditProducts = {
                            nama: "",
                            gambar: "",
                            stok: 0,
                            harga: 0
                        }
                        this.setState({
                            products: res1.data,
                            editProducts: defEditProducts,
                            modalEdit: !this.state.modalEdit
                        })
                    }).catch((err) => {
                        alert(`server error`)
                    })
            }).catch((err) => {
                alert(`server error`)
            })

    }

    inputCariHandler = (e) => {
        axios.get(`http://localhost:9000/products?nama_like=${e.target.value}`)
            .then((res) => {
                this.setState({ products: res.data })
            }).catch((err) => {
                alert(`server error`)
            })
    }

    render() {
        return (
            <div className="mp-box">
                {this.modalAddItem()}
                {this.modalEdit()}
                <button className="mp-button" onClick={this.modalHandler}>
                    Tambah Produk
                </button>
                <div className="input-cari-box">
                    <input type="text" placeholder="Cari Produk" className="input-cari" onChange={this.inputCariHandler} />
                </div>
                <Table hover>
                    <thead className="text-center warna-tabel">
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