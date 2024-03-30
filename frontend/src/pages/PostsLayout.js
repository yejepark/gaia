import { Outlet, useLoaderData } from 'react-router-dom';
import { useState, useEffect } from 'react';

import KakaoMap from '../components/Map';
import assets from '../temp/assets'

// import testImg from '../test_img.jpeg';

const positions = assets.map(data => data.latlng);

const imageServer = "http://127.0.0.1:8080/pictures";

function Arrow() {
	return (
		<svg className='arrow' viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
	  		<polyline fill="none" stroke="white" stroke-width="20" points="4 4 92 98 4 196"></polyline>
		</svg>
	)
}

function PostsLayout() {

	console.log(assets)

	let cards = assets.map((data) => {
		let urls = data.pic_urls;
		
		let url;
		if (urls && urls.length > 0) {
			url = urls[0];
		};

		if (url) return (
			<div key={data.id} className='card-item'>
				<div className='img-container'>
					<div className='arrow-container left shadow'><Arrow /></div>
					<img src={imageServer+url}/>
					<div className='arrow-container right shadow'><Arrow /></div>
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
	});

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