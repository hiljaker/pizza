import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import BasicHeader from '../components/Header';
import { Card, CardImg, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import "./styles/Home.css"
import { toRupiah } from '../helpers/toRupiah';

class Home extends Component {
    state = {
        products: []
    }

    componentDidMount() {
        axios.get(`http://localhost:9000/products`)
            .then((res) => {
                this.setState({ products: res.data })
                console.log(this.state.products);
            }).catch((err) => {
                alert(`server error`)
            })
    }

    renderProducts = () => {
        return this.state.products.map((val, index) => {
            return (
                <div key={index + 1} className="kartu-box-style">
                    <Card className="kartu-style">
                        <CardImg src={val.gambar} alt={val.nama} className="gambar-kartu" />
                        <CardBody>
                            <CardTitle tag="h5">{val.nama}</CardTitle>
                            <CardSubtitle tag="h6" className="teks-harga mb-3">{toRupiah(val.harga)}/buah</CardSubtitle>
                            <button className="cart-button-style">Tambahkan ke Keranjang</button>
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