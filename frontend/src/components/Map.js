import React, { useEffect, useState, useRef } from "react";

import classes from './Map.module.css';

const { kakao } = window;

const DiamondHtml = `<svg class="diamond-container" viewBox="-50 -20 200 220" xmlns="http://www.w3.org/2000/svg">
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
</svg>`

function makeCustomMarkers(positions, dataIds, kakaoMap) {

    return positions.map((pos, idx) => {

        let content = document.createElement('div');

        content.id = dataIds[idx];

        content.innerHTML = DiamondHtml;
        content.addEventListener('mouseover', function() { this.firstChild.classList.add('large'); });
        content.addEventListener('mouseout', function() { this.firstChild.classList.remove('large'); });

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
    const [kakaoMap, setKakaoMap] = useState(null);
    const [markers, setMarkers] = useState([]);

    const container = useRef();

    useEffect(() => {
        const center = new kakao.maps.LatLng(37.4995, 127.0263);
        const options = {
            center,
            level: 3
        };
        const map = new kakao.maps.Map(container.current, options);
        setKakaoMap(map);

        // console.log(container.current)

    }, [container]);

    useEffect(() => {
        if (kakaoMap === null) {
            return;
        }

        let dataIds = assets.map(data => `marker-${data.id}`);

        let latlngs = assets.map(data => data.latlng);
        let positions = latlngs.map(pos => new kakao.maps.LatLng(...pos));

        setMarkers((markers) => {
            markers.forEach(marker => marker.setMap(null)); // clear prev markers

            return makeCustomMarkers(positions, dataIds, kakaoMap); // return new markers
        });

        if (positions.length > 0) {
            const bounds = positions.reduce(
                (bds, latlng) => bds.extend(latlng),
                new kakao.maps.LatLngBounds()
            );

            kakaoMap.setBounds(bounds);
        }
    }, [kakaoMap, assets]);

    return <div className={classes["map-container"]} ref={container} />;
}

export default KakaoMap;