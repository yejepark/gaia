import React, { useEffect, useState, useRef } from "react";

const { kakao } = window;

function KakaoMap({ markerPositions=[] }) {
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
			// clear prev markers
			markers.forEach(marker => marker.setMap(null));

			// assign new markers
			return positions.map(pos => new kakao.maps.Marker({ map: kakaoMap, position: pos }));
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