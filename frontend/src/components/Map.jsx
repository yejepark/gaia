import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLoaderData } from "react-router-dom";

import { debounce } from '../utilities/methods';
import classes from './Map.module.css';

const { kakao } = window;


function makeCustomMarkers(latlngs, dataIds, kakaoMap) {
    const nav = document.getElementById("cardNav");

    // Information for scrolling when makers are clicked:
    const cardContainer = nav.firstChild;
    const baseOffset = nav.offsetTop + parseInt(getComputedStyle(cardContainer).marginTop) + 10;
    // console.log(baseOffset)

    return latlngs.map((pos, idx) => {
        const content = document.createElement('div');

        // Get information from a card identifed by id and put it into the marker:
        content.id = dataIds[idx];
        const id = content.id.split('-')[1];
        const cardId = `card-${id}`;
        const card = document.getElementById(cardId);
        if (card) {
            content.className = classes["price-tag"];
            content.textContent = card.querySelector('#rent').textContent;
        }

        content.addEventListener('click', function(event) {
            if (card) {
                card.focus({ preventScroll: true });
                nav.scrollTo({ top: card.offsetTop - baseOffset, behavior: 'smooth' });
            }
        })

        const marker = new kakao.maps.CustomOverlay({
            map: kakaoMap,
            position: pos,
            content: content,
            xAnchor: 0.5,
            yAnchor: 1.5,
            zIndex: 5
        });

        return marker;
    });
}

function getLatLngs(assets) {
    const latlngs = assets.map(
        data => new kakao.maps.LatLng(...data.lnglat.toReversed())
    );
    return latlngs
}

function getLatLngBounds(latlngs) {
    const bounds = latlngs.reduce(
        (bds, latlng) => bds.extend(latlng),
        new kakao.maps.LatLngBounds()
    );
    return bounds;
}

function getLatLngCenter(bounds) {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const center = new kakao.maps.LatLng(
        (sw.getLat() + ne.getLat())/2, (sw.getLng() + ne.getLng())/2
    );
    return center;
}

function checkBounds(bounds) {
    const [minlat, minlng, maxlat, maxlng] = bounds.toString().match(/-?[\d\.]+/g);
    return (
        -90 <= minlat && maxlat <= 90 && minlat <= maxlat &&
        -180 <= minlng && maxlng <= 180 && minlng <= maxlng
    );
}

function getPolygonFromCoords(coords) {
    const regionPath = coords.map(lnglat => new kakao.maps.LatLng(...lnglat.toReversed()));
                        
    const polygon = new kakao.maps.Polygon({
        path: regionPath,
        strokeWeight: 2,
        strokeColor: '#aa68ff',
        strokeOpacity: 0.7,
        strokeStyle: 'solid',
        fillColor: '#aa68ff',
        fillOpacity: 0.05,
    });

    return polygon;
}

function getRegionBounds(regionData) {
     const regionBounds = new kakao.maps.LatLngBounds(
        new kakao.maps.LatLng(...regionData.sw.coordinates.toReversed()),
        new kakao.maps.LatLng(...regionData.ne.coordinates.toReversed())
    );
    
    return regionBounds;
}


let renderCount = 0;
let callCount = 0;

function KakaoMap({ assets, boundingRect, setBoundingRect }) {
    renderCount ++;
    console.log('\nin KakaoMap', renderCount);

    const loaderData = useLoaderData();
    const regionData = loaderData?.regionData;

    const boundingRectStr = boundingRect ? boundingRect.toString() : '';

    const container = useRef();    
    const [kakaoMap, setKakaoMap] = useState(null);

    const [markers, setMarkers] = useState([]);
    const [boundFocused, setBoundFocused] = useState(true);
    const [shapes, setShapes] = useState([]);

    const dataIds = assets.map(data => `marker-${data.id}`);
    const latlngs = getLatLngs(assets);

    const bounds = latlngs.length > 0 ? getLatLngBounds(latlngs) : (
        regionData ? getRegionBounds(regionData) : []);

    const idStr = assets.map(data => data.id).join('-');

    const regionId = regionData?.id;

    // console.log(container.current, kakaoMap)
    // console.log(boundingRectStr, bounds, boundFocused, kakaoMap)
    // console.log(regionData)

    // ------------------------------------------------------------
    // Create the kakao map object:
    useEffect(() => {
        console.log('in setKakaoMap');
        const center = getLatLngCenter(bounds);
        const map = new kakao.maps.Map(container.current, { center, level: 3 });

        setMarkers((prevMarkers) => {
            prevMarkers.forEach(marker => marker.setMap(null));
            return makeCustomMarkers(latlngs, dataIds, map);
        });

        map.setBounds(bounds);
        setBoundingRect(bounds);

        kakao.maps.event.addListener(map, 'dragend', () => {
            const bounds = map.getBounds();
            if (!bounds.isEmpty() && checkBounds(bounds)) {
                setBoundingRect(bounds);    
            } else {
                setBoundFocused(false);
            }
        });

        kakao.maps.event.addListener(map, 'zoom_changed', () => {
            const bounds = map.getBounds();
            if (!bounds.isEmpty() && checkBounds(bounds)) {
                setBoundingRect(bounds);    
            } else {
                setBoundFocused(false);
            }
        });

        setKakaoMap(map);
    }, []);

    // ------------------------------------------------------------
    useEffect(() => {
        if (kakaoMap) {
            setMarkers((prevMarkers) => {
                prevMarkers.forEach(marker => marker.setMap(null));
                return makeCustomMarkers(latlngs, dataIds, kakaoMap);
            });    
        }
    }, [kakaoMap, idStr]);

    // ------------------------------------------------------------
    const centerMap = useCallback(function() {
        if (boundingRectStr) {
            kakaoMap.setBounds(boundingRect);
            setBoundFocused(true);
        }
    }, [kakaoMap, boundingRectStr]);

    useEffect(() => {
        if (kakaoMap === null) return;
        if (!boundFocused) centerMap();
    }, [kakaoMap, boundFocused]);

    // ------------------------------------------------------------
    useEffect(() => {
        if (kakaoMap && regionData) {
            const regionBounds = getRegionBounds(regionData);
            setBoundingRect(regionBounds);
            kakaoMap.setBounds(regionBounds);

            if (regionData.geometry) {
                const pathType = regionData.geometry.type;
                const polygons = [];
                if (pathType === 'Polygon') {
                    const polygon = getPolygonFromCoords(regionData.geometry.coordinates[0]);
                    polygons.push(polygon);
                    
                } else {
                    for (const coordinates of regionData.geometry.coordinates) {
                        const polygon = getPolygonFromCoords(coordinates[0]);
                        polygons.push(polygon);
                    }
                }
                setShapes((prevShapes) => {
                    prevShapes.forEach(shape => shape.setMap(null));
                    polygons.forEach(shape => shape.setMap(kakaoMap));
                    return polygons;
                })
            }
        }
    }, [kakaoMap, regionId]);

    return <div className={classes["map-container"]} ref={container} />;
}

export default KakaoMap;