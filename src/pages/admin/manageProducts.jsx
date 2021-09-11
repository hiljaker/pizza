import axios from 'axios';
import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { toRupiah } from '../../helpers/toRupiah';
import "./styles/manageProducts.css"

class ManageProducts extends Component {
    state = {
        products: []
    }

    componentDidMount = () => {
        axios.get(`http://localhost:9000/products`)
            .then((res) => {
                console.log(res.data)
                this.setState({ products: res.data })
            }).catch((err) => {
                alert(`server error`)
            })
    }

    renderProducts = () => {
        return this.state.products.map((val, index) => {
            return (
                <tr className="text-center">
                    <th scope="row">{index + 1}</th>
                    <td>{val.nama}</td>
                    <td><img src={val.gambar} alt={val.nama} className="pict-size" /></td>
                    <td>{val.stok}</td>
                    <td>{toRupiah(val.harga)} per buah</td>
                </tr>
            )
        })
    }


    render() {
        return (
            <div className="mp-box">
                <button className="mp-button">
                    Add Item
                </button>
                <Table bordered>
                    <thead className="text-center">
                        <tr>
                            <th className="t-nomor">#</th>
                            <th className="t-nama">Nama</th>
                            <th>Gambar</th>
                            <th className="t-stok">Stok</th>
                            <th className="t-harga">Harga</th>
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