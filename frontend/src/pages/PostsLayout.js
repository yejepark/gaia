import { Outlet, useLoaderData } from 'react-router-dom';
import { useState, useEffect } from 'react';

import KakaoMap from '../components/Map';
import assets from '../temp/assets'

// import testImg from '../test_img.jpeg';

const positions = assets.map(data => data.latlng);

const imageServer = "http://127.0.0.1:8080/pictures";
// cd to the directory: frontend/src/temp
// run: npx http-server -o pictures/ --cors

function Arrow() {
    return (
        <svg className='arrow' viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
	  		<polyline fill="none" stroke="white" strokeWidth="20" points="4 4 92 98 4 196"></polyline>
		</svg>
    )
}

function CardItem({ data, dataIdx }) {

    let [imgPos, setImgPos] = useState(0);

    let urls = data.pic_urls;

    let imgElements = [];
    if (urls && urls.length > 0) {
        urls.forEach((url, imgIdx) => {
            let key = dataIdx + '-' + imgIdx;
            imgElements.push(<img id={'pic-' + key} key={key} src={imageServer+url}/>)
        })
    }

    let dataId = 'data-' + dataIdx;

    function cardClickHandler(event) {
        console.log('card', event.target, event.target.offsetWidth);
    }

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

    useEffect(() => {
        let imgCarousel = document.querySelector(`#${dataId} .img-carousel`);
        if (imgCarousel) {
            let width = imgCarousel.firstChild.getBoundingClientRect().width;
            imgCarousel.style.transform = `translate(${-width*imgPos}px)`
        }
    }, [imgPos]);

    if (imgElements.length > 0) return (
        <div id={dataId} key={data.id} className='card-item' onClick={cardClickHandler}>
			<div className='img-container'>
				<div className='arrow-container left shadow' onClick={leftClickHandler}><Arrow /></div>
				<div className='img-carousel'>{imgElements}</div>
				<div className='arrow-container right shadow' onClick={rightClickHandler}><Arrow /></div>
			</div>
			<div className='data-container'>
				<div className='renting-cost'> 
					<div className='asset-deposit'>보증금 <span>{data.deposit}</span>원</div>
					<div className='asset-rent-monthly'>월세 <span>{data.rent_monthly}</span>원</div>
				</div>
				<div className='asset-premium'>권리금 <span>{data.premium}</span>원</div>
				<div className='geo'>
					<div className='asset-address'>{data.address_legal}</div>

					<div className='asset-area'>
						<div className='m-area'><span>{data.area_usage}</span>m<sup>2</sup></div>
						<div className='default-area'><span>{Math.round(data.area_usage/3.3*10) / 10}</span>평</div>
					</div>
				</div>
			</div>
		</div>
    )
}

function PostsLayout() {

    console.log(assets)

    let cards = assets.map((data, dataIdx) => <CardItem key={dataIdx} data={data} dataIdx={dataIdx} />);

    return (
        <div id='posts-layout'>
			<main>
				<KakaoMap markerPositions={positions}/>
			</main>
			<nav>
				<div className='card-container'>
					{cards}
				</div>
			</nav>
		</div>
    );
}

export default PostsLayout;