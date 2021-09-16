import React from 'react';
import { UncontrolledCarousel } from 'reactstrap';
import Kar1 from "../assets/kar1.png"
import Kar2 from "../assets/kar2.png"
import Kar3 from "../assets/kar3.png"

const items = [
    {
        src: Kar1,
        altText: 'Slide 1',
        key: '1'
    },
    {
        src: Kar2,
        altText: 'Slide 2',
        key: '2'
    },
    {
        src: Kar3,
        altText: 'Slide 3',
        key: '3'
    }
];

const Karosel = () => <UncontrolledCarousel items={items} autoPlay indicators controls />;

export default Karosel;
