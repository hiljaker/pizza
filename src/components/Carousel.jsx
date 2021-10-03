import React, { Component } from 'react';
import { Carousel } from "react-bootstrap";
import Kar1 from "../assets/kar1.png"
import Kar2 from "../assets/kar2.png"
import Kar3 from "../assets/kar3.png"

class Karosel extends Component {
    render() {
        return (
            <Carousel style={{ paddingTop: "9vh" }}>
                <Carousel.Item interval={1500}>
                    <img
                        className="d-block w-100"
                        src={Kar1}
                        alt="First slide"
                        style={{ width: "100%" }}
                    />
                </Carousel.Item>
                <Carousel.Item interval={1500}>
                    <img
                        className="d-block w-100"
                        src={Kar2}
                        alt="Second slide"
                        style={{ width: "100%" }}
                    />
                </Carousel.Item>
                <Carousel.Item interval={1500}>
                    <img
                        className="d-block w-100"
                        src={Kar3}
                        alt="Third slide"
                        style={{ width: "100%" }}
                    />
                </Carousel.Item>
            </Carousel>
        )
    }
}

export default Karosel;