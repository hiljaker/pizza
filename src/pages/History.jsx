import axios from 'axios';
import React, { Component } from 'react';
import BasicHeader from "../components/Header";
import "./styles/History.css"
import { apiURL } from "../helpers/apiURL";
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Table } from 'reactstrap';
import Swal from 'sweetalert2';
import { toRupiah } from '../helpers/toRupiah';
import EmptyCart from "../assets/empty-cart.svg";
import { Link } from 'react-router-dom';

class History extends Component {
    state = {
        history: [],
        detailModal: false,
        detailModalIndex: -1
    }

    componentDidMount() {
        axios.get(`${apiURL}/users/${this.props.auth.id}`)
            .then((res) => {
                this.setState({ history: res.data.trhistory })
            }).catch((err) => {
                alert(`error`)
            })
    }


    detailModalHandler = (index) => {
        if (index >= 0) {
            this.setState({ detailModalIndex: index, detailModal: !this.state.detailModal })
        } else {
            this.setState({ detailModalIndex: -1, detailModal: !this.state.detailModal })
        }
    }

    historyItems = () => {
        const { detailModalIndex } = this.state
        const helper2 = detailModalIndex < 0
        if (helper2) {
            return
        } else {
            return this.state.history[this.state.detailModalIndex].bought.map((val, index) => {
                return (
                    <>
                        <div className="history-items">
                            <img src={val.gambar} alt="" />
                            <div>
                                <h5>{val.nama}</h5>
                                <p>{toRupiah(val.harga)}/{val.tipe} x {val.kuantitas} {val.tipe}</p>
                                <p>{toRupiah(val.harga * val.kuantitas)}</p>
                            </div>
                        </div>
                        <hr />
                    </>
                )
            })
        }
    }

    grandTotal = () => {
        const { detailModalIndex } = this.state
        const helper2 = detailModalIndex < 0
        let total = 0
        if (helper2) {
            return
        } else {
            this.state.history[this.state.detailModalIndex].bought.forEach((val) => {
                total += val.harga * val.kuantitas
            });
        }
        return <h4>Total = {toRupiah(total)}</h4>
    }

    detailModal = () => {
        const { history, detailModalIndex } = this.state
        const helper1 = history[detailModalIndex]
        const helper2 = detailModalIndex < 0
        return (
            <Modal isOpen={this.state.detailModal} toggle={this.detailModalHandler}>
                <ModalHeader>
                    {helper2 ? "" : helper1.trid}
                </ModalHeader>
                <ModalBody style={{ maxHeight: "50vh", overflow: "auto" }}>
                    {this.historyItems()}
                </ModalBody>
                <ModalFooter>
                    {this.grandTotal()}
                </ModalFooter>
            </Modal >
        )
    }

    hapusHistory = (index) => {
        let idHistory = this.state.history[index]
        Swal.fire({
            title: `Yakin hapus ${idHistory.trid}?`,
            showDenyButton: true,
            confirmButtonText: 'Hapus',
            denyButtonText: `Batal`,
        }).then((result) => {
            if (result.isConfirmed) {
                let historyCopy = this.state.history
                historyCopy.splice(index, 1)
                axios.patch(`${apiURL}/users/${this.props.auth.id}`, {
                    trhistory: [
                        ...historyCopy
                    ]
                }).then(() => {
                    axios.get(`${apiURL}/users/${this.props.auth.id}`)
                        .then((res) => {
                            this.setState({ history: res.data.trhistory })
                        })
                })
                Swal.fire('Terhapus!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Batal dihapus', '', 'info')
            }
        })
    }

    renderHistory() {
        return this.state.history.map((val, index) => {
            return (
                <tr key={index + 1}>
                    <td style={{ width: "18%" }}>{val.trid}</td>
                    <td style={{ width: "18%" }}>{val.nama}</td>
                    <td>{val.alamat}</td>
                    <td style={{ width: "10%" }}>{val.payment}</td>
                    <td onClick={() => this.detailModalHandler(index)} style={{ width: "10%" }}>{val.bought.length}</td>
                    <td style={{ width: "10%", textAlign: "center" }}>
                        <button className="button-hapushistory" onClick={() => this.hapusHistory(index)}>
                            Hapus
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <>
                <BasicHeader />
                {this.detailModal()}
                <div className="history-layout">
                    <div className="history-page">
                        {this.state.history.length == 0 ? (
                            <div style={{ textAlign: "center", marginTop: 100 }}>
                                <img src={EmptyCart} alt="" width={"200vw"} />
                                <h1 style={{ marginTop: 20 }}>Tidak ada riwayat pembelian</h1>
                                <p style={{ marginTop: 20 }}>Silahkan <Link to="/" style={{ color: "#f9773e" }}>tambahkan</Link> produk.</p>
                            </div>
                        ) : (
                            <Table bordered hover>
                                <thead>
                                    <tr style={{ textAlign: "center" }}>
                                        <th>ID Transaksi</th>
                                        <th>Nama</th>
                                        <th>Alamat</th>
                                        <th>Payment</th>
                                        <th>Jenis</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderHistory()}
                                </tbody>
                            </Table>
                        )}
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

export default connect(MapStateToProps)(History);