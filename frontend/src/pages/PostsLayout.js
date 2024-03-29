import { Outlet, useLoaderData } from 'react-router-dom';
import { useState, useEffect } from 'react';

import KakaoMap from '../components/Map';
import assets from '../temp/assets'

// import testImg from '../test_img.jpeg';

const positions = assets.map(data => data.latlng);

const imageServer = "http://127.0.0.1:8080/pictures";

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
					<img src={imageServer+url}/>
				</div>
				<div className='data-container'>
					<div className='asset-address'> {data.address} </div>
					<div className='asset-deposit'> 보증금 {data.deposit}원 </div>
					<div className='asset-rent-monthly'> 월세 {data.rent_monthly}원 </div>
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