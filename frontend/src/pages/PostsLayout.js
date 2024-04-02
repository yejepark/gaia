import { useLoaderData } from 'react-router-dom';
import { useState, useEffect } from 'react';

import KakaoMap from '../components/Map';
import CardContainer from '../components/CardContainer';

const jsonServer = "http://127.0.0.1:8080";
// cd to the directory: frontend/src/temp
// run: npx http-server --cors

function PostsLayout() {

    let assets = useLoaderData();

    return (
        <div id='posts-layout'>
			<main>
				<KakaoMap assets={assets} />
			</main>
			<nav>
				<CardContainer assets={assets} />
			</nav>
		</div>
    );
}

export default PostsLayout;

export async function loader() {
    let res = await fetch(jsonServer + '/assets.json');
    let data = await res.json();
    return data;
}