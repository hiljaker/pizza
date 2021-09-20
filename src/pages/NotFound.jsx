import React, { Component } from 'react';
import "./styles/NotFound.css"
import ImgNotFound from "../assets/notfound.svg";

class NotFound extends Component {
    render() {
        return (
            <div className="nf-box">
                <div className="nf-style">
                    <img src={ImgNotFound} alt="not-found" style={{ width: '30%' }} />
                    <div style={{ fontSize: 30, marginTop: 20 }} >Maaf, halaman yang kamu cari tidak ada :(</div>
                </div>
            </div>
        )
    }
}

export default NotFound;