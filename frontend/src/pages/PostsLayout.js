import { Outlet, useLoaderData } from 'react-router-dom';
import { useState, useEffect } from 'react';

import KakaoMap from '../components/Map';
import CardItem from '../components/CardItem'
import assets from '../temp/assets'

const positions = assets.map(data => data.latlng);

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