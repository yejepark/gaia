import { useState, useEffect } from 'react';

import classes from './CardItem.module.css'
import { debounce } from '../utilities/methods';

const imageServer = "http://127.0.0.1:8080";
// cd to the directory: frontend/src/temp
// run: npx http-server --cors

function Arrow() {
    return (
        <svg className={classes.arrow} viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
            <polyline fill="none" stroke="white" strokeWidth="20" points="4 4 92 98 4 196"></polyline>
        </svg>
    )
}

function CardItem({ data }) {

    let [imgPos, setImgPos] = useState(0);

    let urls = data.pic_urls;

    let cardId = 'card-' + data.id;
    let imgCarousel;

    function cardClickHandler(event) {
        console.log('card', event.target);
        event.stopPropagation();
    }

    // Actions for clicking arrows on a card:
    function leftClickHandler(event) {
        if (imgPos > 0) {
            setImgPos(imgPos - 1)
        }
        event.stopPropagation();
    }

    function rightClickHandler(event) {
        if (imgPos < urls.length - 1) {
            setImgPos(imgPos + 1);
        }
        event.stopPropagation();
    }

    // Make the marker larger when a mouse is over a corresponding card:
    function mouseOverHandler(event) {
        let markerId = 'marker-' + event.currentTarget.id.split('-')[1];
        let marker = document.getElementById(markerId);
        if (marker) { marker.firstChild.classList.add('large'); }
        event.stopPropagation();
    }

    function mouseOutHandler(event) {
        let markerId = 'marker-' + event.currentTarget.id.split('-')[1];
        let marker = document.getElementById(markerId);
        if (marker) { marker.firstChild.classList.remove('large'); }
        event.stopPropagation();
    }

    let imgElements = [];
    if (urls && urls.length > 0) {
        urls.forEach((url, imgIdx) => {
            let key = data.id + '-' + imgIdx;
            imgElements.push(<img id={'pic-' + key} key={key} src={imageServer+ '/pictures' + url}/>)
        })
    }

    // Slide images in the image carousel when arrows are clicked:
    useEffect(() => {
        if (!imgCarousel) { imgCarousel = document.querySelector('#' + cardId + ' .' + classes['img-carousel']); }
        if (imgCarousel) { 
            let width = imgCarousel.firstChild.getBoundingClientRect().width;
            imgCarousel.style.transform = `translate(${-width*imgPos}px)`;
        }
    }, [imgPos]);

    // When the window is resized, reset the image carousel:
    useEffect(() => {
        if (imgCarousel) {
            let resizeHandler = debounce((event) => {
                imgCarousel.style.transform = "translate(0px)";
                setImgPos(0);
            }, 200);
            window.addEventListener('resize', resizeHandler);
            return () => { window.removeEventListener('resize', resizeHandler); };
        };
    }, []);

    if (imgElements.length > 0) return (
        <div id={cardId} tabIndex='0' className={classes['card-item']} onClick={cardClickHandler} onMouseOver={mouseOverHandler} onMouseOut={mouseOutHandler}>
            <div className={classes['img-container']}>
                <div className={classes['arrow-container'] + ' ' + classes.left} onClick={leftClickHandler}><Arrow /></div>
                <div className={classes['img-carousel']}>{imgElements}</div>
                <div className={classes['arrow-container'] + ' ' + classes.right} onClick={rightClickHandler}><Arrow /></div>
            </div>
            <div className={classes['data-container']}>
                <div className={classes['renting-cost']}> 
                    <div className={classes['asset-deposit']}>보증금 <span>{data.deposit}</span>원</div>
                    <div className={classes['asset-rent-monthly']}>월세 <span>{data.rent_monthly}</span>원</div>
                </div>
                <div className={classes['asset-premium']}>권리금 <span>{data.premium}</span>원</div>
                <div className={classes.geo}>
                    <div className={classes['asset-address']}>{data.address_legal} ({data.floor}층)</div>

                    <div className={classes['asset-area']}>
                        <div className={classes['m-area']}><span>{data.area_usage}</span>m<sup>2</sup></div>
                        <div className={classes['default-area']}><span>{Math.round(data.area_usage/3.3*10) / 10}</span>평</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardItem;