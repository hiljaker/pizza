import axios from 'axios';
import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { toRupiah } from '../../helpers/toRupiah';
import "./styles/manageProducts.css"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Swal from 'sweetalert2';
import { debounce } from 'throttle-debounce';
import NoData from "../../assets/nodata.svg"
import { apiURL } from '../../helpers/apiURL';

class ManageProducts extends Component {
    state = {
        products: [],
        modalOpen: false,
        addProducts: {
            nama: "",
            gambar: "",
            stok: 0,
            harga: 0,
            tipe: ""
        },
        modalHapus: false,
        indexHapus: -1,
        modalEdit: false,
        indexEdit: -1,
        // Edit
        nama: "",
        gambar: "",
        stok: 0,
        harga: 0,
        tipe: "",
        // Edit End
        inputCari: ""
    }

    // Get Data from Server
    componentDidMount = () => {
        axios.get(`${apiURL}/products`)
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
                    <td>{toRupiah(val.harga)} per {val.tipe}</td>
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
                        <div style={{ textAlign: "center", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                            <div>
                                <input type="radio" id="perbuah" name="tipe" value="buah" style={{ marginRight: 5 }} onChange={this.inputHandler} />
                                <label htmlFor="perbuah">per buah</label>
                            </div>
                            <div>
                                <input type="radio" id="perkilo" name="tipe" value="kg" style={{ marginRight: 5 }} onChange={this.inputHandler} />
                                <label htmlFor="perbuah">per kilo</label>
                            </div>
                            <div>
                                <input type="radio" id="pertangkai" name="tipe" value="tangkai" style={{ marginRight: 5 }} onChange={this.inputHandler} />
                                <label htmlFor="perbuah">per tangkai</label>
                            </div>
                        </div>
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
        const { nama, gambar, stok, harga, tipe } = this.state.addProducts
        if (!nama || !gambar || !stok || !harga || !tipe) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Isi semua!',
                timer: 1500,
                timerProgressBar: true
            })
            return
        }
        axios.post(`${apiURL}/products`, {
            nama: nama,
            gambar: gambar,
            stok: parseInt(stok),
            harga: parseInt(harga),
            tipe: tipe
        }).then((res) => {
            axios.get(`${apiURL}/products`)
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
                axios.delete(`${apiURL}/products/${idProduk.id}`)
                    .then((res) => {
                        axios.get(`${apiURL}/products`)
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
                    <div style={{ textAlign: "center", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <div>
                            <input type="radio" id="perbuah" name="tipe" value="buah" style={{ marginRight: 5 }} onChange={this.editInputHandler} />
                            <label htmlFor="perbuah">per buah</label>
                        </div>
                        <div>
                            <input type="radio" id="perkilo" name="tipe" value="kg" style={{ marginRight: 5 }} onChange={this.editInputHandler} />
                            <label htmlFor="perbuah">per kilo</label>
                        </div>
                        <div>
                            <input type="radio" id="pertangkai" name="tipe" value="tangkai" style={{ marginRight: 5 }} onChange={this.editInputHandler} />
                            <label htmlFor="perbuah">per tangkai</label>
                        </div>
                    </div>
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
        this.setState({ [e.target.name]: e.target.value })
        console.log(this.state)
    }

    // Simpan Hasil Edit
    onSimpan = () => {
        const { nama, gambar, stok, harga, tipe } = this.state
        if (!nama || !gambar || !stok || !harga || !tipe) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Isi semua!',
                timer: 1500,
                timerProgressBar: true
            })
            return
        }

        let { indexEdit, products } = this.state
        let idEdit = products[indexEdit].id

        axios.put(`${apiURL}/products/${idEdit}`, {
            nama: nama,
            gambar: gambar,
            stok: parseInt(stok),
            harga: parseInt(harga),
            tipe: tipe
        })
            .then((res) => {
                axios.get(`${apiURL}/products`)
                    .then((res1) => {
                        this.setState({
                            products: res1.data,
                            nama: "",
                            gambar: "",
                            stok: 0,
                            harga: 0,
                            tipe: "",
                            modalEdit: !this.state.modalEdit
                        })
                        Swal.fire({
                            icon: 'success',
                            title: 'Yay!',
                            text: 'Berhasil edit produk',
                            timer: 1500,
                            timerProgressBar: true
                        })
                    }).catch((err) => {
                        alert(`server error`)
                    })
            }).catch((err) => {
                alert(`server error`)
            })

    }

    inputCariHandler = (e) => {
        axios.get(`${apiURL}/products?nama_like=${e.target.value}`)
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
                    <input type="text" placeholder="Cari Produk" className="input-cari" onChange={debounce(500, this.inputCariHandler)} />
                </div>
                {this.state.products.length === 0 ? (
                    <div style={{ textAlign: "center", margin: "10% 0" }}>
                        <img src={NoData} alt="" style={{ width: "15vw", marginBottom: 30 }} />
                        <h3>Produk yang kamu cari tidak ada :(</h3>
                    </div>
                ) : (
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
                )}

            </div>
        )
    }
}

export default ManageProducts;