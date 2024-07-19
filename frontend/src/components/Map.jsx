import React, { useEffect, useState, useRef, useCallback } from "react";

import { debounce } from '../utilities/methods';
import classes from './Map.module.css';

const { kakao } = window;

// const DiamondHtml = `<div class="diamond-container">
// <svg class="diamond-container" viewBox="-50 -20 200 220" xmlns="http://www.w3.org/2000/svg">
//     <defs>
//          <radialGradient id="gradientDefinition"  cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
//           <stop stop-color="gray" offset="0%" stop-opacity="0.9" />
//           <stop stop-color="white" offset="100%" stop-opacity="0" />
//         </radialGradient>
//     </defs>
//     <g>
//         <polygon class="diamond-shape" stroke="white" stroke-width="10" points="50 4 96 70 50 196 4 70"></polygon>
//         <polyline fill='none' stroke='white' stroke-width='8' points="50 4 40 75 50 196"></polyline>
//         <polyline fill='none' stroke='white' stroke-width='8' points="4 70 40 75 96 70"></polyline>
//         <ellipse cx="50" cy="190" rx="90" ry="25" stroke="white" stroke-width="1" stroke-dasharray="1 1 1 1" style="fill:url(#gradientDefinition)" />
//     </g>
// </svg>
// `


function makeCustomMarkers(positions, dataIds, kakaoMap) {
    const nav = document.getElementById("cardNav");
    const cardContainer = nav.firstChild;
    const baseOffset = nav.offsetTop + parseInt(getComputedStyle(cardContainer).marginTop) + 10;
    // console.log(baseOffset)

    return positions.map((pos, idx) => {

        const content = document.createElement('div');

        // content.innerHTML = DiamondHtml;

        content.id = dataIds[idx];

        const id = content.id.split('-')[1];
        const cardId = `card-${id}`;
        const card = document.getElementById(cardId);

        if (card) {
            content.className = classes["price-tag"];
            content.textContent = card.querySelector('#rent').textContent;
        }

        content.addEventListener('mouseover', function() { this.style.setProperty('--tag-background', '#B00000'); });
        content.addEventListener('mouseout', function() { this.style.setProperty('--tag-background', '#4285F4'); });

        // content.addEventListener('mouseover', function() { this.firstChild.classList.add('large'); });
        // content.addEventListener('mouseout', function() { this.firstChild.classList.remove('large'); });

        content.addEventListener('click', function(event) {
            if (card) {
                card.focus({ preventScroll: true });
                nav.scrollTo({ top: card.offsetTop - baseOffset, behavior: 'smooth' });
            }
        })

        // return new kakao.maps.Marker({ map: kakaoMap, position: pos });

        return new kakao.maps.CustomOverlay({
            map: kakaoMap,
            position: pos,
            content: content,
            xAnchor: 0.5,
            yAnchor: 1.5,
        });

    });
}

function KakaoMap({ assets }) {
    const [kakaoMap, setKakaoMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [positions, setPositions] = useState([]);

    const container = useRef();

    const centerMap = useCallback(function(positions) {
        if (positions.length > 0) {
            const bounds = positions.reduce(
                (bds, latlng) => bds.extend(latlng),
                new kakao.maps.LatLngBounds()
            );
            kakaoMap.setBounds(bounds);
        }
    }, [kakaoMap]);

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

        const dataIds = assets.map(data => `marker-${data.id}`);
        const latlngs = assets.map(data => data.latlng);
        const newPositions = latlngs.map(pos => new kakao.maps.LatLng(...pos));
        setPositions(newPositions);

        setMarkers((markers) => {
            markers.forEach(marker => marker.setMap(null)); // clear previous markers
            return makeCustomMarkers(newPositions, dataIds, kakaoMap); // return new markers
        });

        centerMap(newPositions);

        // console.log('end of setBounds');

    }, [kakaoMap, assets, centerMap]);

    // useEffect(() => {
    //     if (positions.length > 0) {
    //         const resizeHandler = debounce((event) => { centerMap(positions); } , 200);
    //         window.addEventListener('resize', resizeHandler);
    //         return () => { window.removeEventListener('resize', resizeHandler); }    
    //     }
    // }, [positions]);

    return <div className={classes["map-container"]} ref={container} />;
}

export default KakaoMap;