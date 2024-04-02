import React, { useEffect, useState, useRef } from "react";

const { kakao } = window;

function getDiamondHtml(width = 37, fillColor = 'red') {
    return `<svg width=${width} viewBox="-50 -20 200 220" xmlns="http://www.w3.org/2000/svg">
			<defs>
				 <radialGradient id="gradientDefinition"  cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
			      <stop stop-color="gray" offset="0%" stop-opacity="0.9" />
			      <stop stop-color="white" offset="100%" stop-opacity="0" />
			    </radialGradient>
		    </defs>
		    <g>
		  		<polygon fill='${fillColor}' stroke="white" stroke-width="10" points="50 4 96 70 50 196 4 70"></polygon>
		  		<polyline fill='none' stroke='white' stroke-width='8' points="50 4 40 75 50 196"></polyline>
		  		<polyline fill='none' stroke='white' stroke-width='8' points="4 70 40 75 96 70"></polyline>
		  		<ellipse cx="50" cy="190" rx="90" ry="25" stroke="white" stroke-width="1" stroke-dasharray="1 1 1 1" style="fill:url(#gradientDefinition)" />
		  	</g>
	</svg>`
}

function makeCustomMarkers(positions, kakaoMap) {
    let redDiamondHtml = getDiamondHtml();

    return positions.map(pos => {

        let content = document.createElement('div');
        content.innerHTML = redDiamondHtml;
        content.addEventListener('mouseover',
            function() { 
            	this.querySelector('polygon').setAttribute('fill', 'blue');
            	let gEl = this.querySelector('g');
            	gEl.setAttribute('transform', 'scale(1.25) translate(-10 -35)');
            });
        content.addEventListener('mouseout',
            function() { 
            	this.querySelector('polygon').setAttribute('fill', 'red');
            	let gEl = this.querySelector('g');
            	gEl.setAttribute('transform', '');
        	});

        return new kakao.maps.CustomOverlay({
            map: kakaoMap,
            position: pos,
            content: content,
            xAnchor: 0.5,
            yAnchor: 0.8,
        });

    });
}

function KakaoMap({ markerPositions = [] }) {
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

        // console.log(markerPositions);

        if (kakaoMap === null) {
            return;
        }

        const positions = markerPositions.map(pos => new kakao.maps.LatLng(...pos));

        setMarkers((markers) => {
            markers.forEach(marker => marker.setMap(null)); // clear prev markers

            return makeCustomMarkers(positions, kakaoMap); // return new markers
        });

        if (positions.length > 0) {
            const bounds = positions.reduce(
                (bds, latlng) => bds.extend(latlng),
                new kakao.maps.LatLngBounds()
            );

            kakaoMap.setBounds(bounds);
        }
    }, [kakaoMap, markerPositions]);

    return <div id="map-container" ref={container} />;
}

export default KakaoMap;