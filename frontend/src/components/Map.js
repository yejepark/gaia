import React, { useEffect, useState, useRef } from "react";

import { debounce } from '../utilities/methods';
import classes from './Map.module.css';

const { kakao } = window;

const DiamondHtml = `<div class="diamond-container">
<svg class="diamond-container" viewBox="-50 -20 200 220" xmlns="http://www.w3.org/2000/svg">
    <defs>
         <radialGradient id="gradientDefinition"  cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop stop-color="gray" offset="0%" stop-opacity="0.9" />
          <stop stop-color="white" offset="100%" stop-opacity="0" />
        </radialGradient>
    </defs>
    <g>
        <polygon class="diamond-shape" stroke="white" stroke-width="10" points="50 4 96 70 50 196 4 70"></polygon>
        <polyline fill='none' stroke='white' stroke-width='8' points="50 4 40 75 50 196"></polyline>
        <polyline fill='none' stroke='white' stroke-width='8' points="4 70 40 75 96 70"></polyline>
        <ellipse cx="50" cy="190" rx="90" ry="25" stroke="white" stroke-width="1" stroke-dasharray="1 1 1 1" style="fill:url(#gradientDefinition)" />
    </g>
</svg>
`

function makeCustomMarkers(positions, dataIds, kakaoMap) {
    let nav = document.getElementById("cardNav");
    let cardContainer = nav.firstChild;
    let baseOffset = nav.offsetTop + parseInt(getComputedStyle(cardContainer).marginTop);

    return positions.map((pos, idx) => {

        let content = document.createElement('div');
        content.innerHTML = DiamondHtml;
        content.id = dataIds[idx];

        let id = content.id.split('-')[1];
        let cardId = `card-${id}`;
        let card = document.getElementById(cardId);

        content.addEventListener('mouseover', function() { this.firstChild.classList.add('large'); });
        content.addEventListener('mouseout', function() { this.firstChild.classList.remove('large'); });
        content.addEventListener('click', function(event) {
            if (card) {
                card.focus({ preventScroll: true });
                nav.scrollTo({ top: card.offsetTop - baseOffset, behavior: 'smooth' });
            }
        })

        return new kakao.maps.CustomOverlay({
            map: kakaoMap,
            position: pos,
            content: content,
            xAnchor: 0.5,
            yAnchor: 0.8,
        });

    });
}

function KakaoMap({ assets }) {
    let [kakaoMap, setKakaoMap] = useState(null);
    let [markers, setMarkers] = useState([]);
    let [positions, setPositions] = useState([]);

    let container = useRef();

    function centerMap(positions) {
        if (positions.length > 0) {
            const bounds = positions.reduce(
                (bds, latlng) => bds.extend(latlng),
                new kakao.maps.LatLngBounds()
            );
            kakaoMap.setBounds(bounds);
        }
    }

    // Create the kakao map object:
    useEffect(() => {
        // console.log('in setKakaoMap');

        const center = new kakao.maps.LatLng(37.4995, 127.0263);
        const options = {
            center,
            level: 3
        };
        const map = new kakao.maps.Map(container.current, options);
        setKakaoMap(map);

    }, []);

    // Set markers and center the map to contain all markers:
    useEffect(() => {
        // console.log('in setBounds');

        if (kakaoMap === null) { return; }

        let dataIds = assets.map(data => `marker-${data.id}`);
        let latlngs = assets.map(data => data.latlng);
        let newPositions = latlngs.map(pos => new kakao.maps.LatLng(...pos));
        setPositions(newPositions);

        setMarkers((markers) => {
            markers.forEach(marker => marker.setMap(null)); // clear previous markers
            return makeCustomMarkers(newPositions, dataIds, kakaoMap); // return new markers
        });

        centerMap(newPositions);
        
    }, [kakaoMap, assets]);

    // useEffect(() => {
    //     if (positions.length > 0) {
    //         let resizeHandler = debounce((event) => { centerMap(positions); } , 200);
    //         window.addEventListener('resize', resizeHandler);
    //         return () => { window.removeEventListener('resize', resizeHandler); }    
    //     }
    // }, [positions]);

    return <div className={classes["map-container"]} ref={container} />;
}

export default KakaoMap;