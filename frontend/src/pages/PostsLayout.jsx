import { useLoaderData } from 'react-router-dom';
import { useState, useEffect } from 'react';

import KakaoMap from '../components/Map';
import CardContainer from '../components/CardContainer';
import Filters from '../components/Filters';

import classes from './PostsLayout.module.css';

import { debounce } from '../utilities/methods';

// const jsonServer = "http://127.0.0.1:8080";
// cd to the directory: frontend/src/temp
// run: npx http-server --cors


function PostsLayout() {
    // console.log('in PostsLayout');

    let [showMap, setShowMap] = useState(window.matchMedia('(min-width: 900px)').matches);

    let assets = useLoaderData();

    console.log(assets)

    // Create the map component only if the screen is large enough:
    useEffect(() => {
        let resizeHandler = debounce(() => {
            let isLargeScreen = window.matchMedia('(min-width: 900px)').matches;
            setShowMap(isLargeScreen);
        }, 200);
        window.addEventListener('resize', resizeHandler);
        return () => { window.removeEventListener('resize', resizeHandler); };
    }, []);

    // console.log('showMap', showMap);
    return (
        <div className={classes['posts-layout-parent']}>
            <Filters />
            <div className={classes['posts-layout']}>
                <main id="mapSection" className={classes['map-section']}>
                    {showMap && <KakaoMap assets={assets}/>}
                </main>
                <nav id="cardNav" className={classes['card-nav']}>
                    <CardContainer assets={assets} />
                </nav>
            </div>
        </div>
    );
}

export default PostsLayout;

export async function loader() {
    console.log('In PostsLayout loader');
    // let res = await fetch(jsonServer + '/assets.json');
    let res = await fetch("http://localhost:8000/sell_posts/list_all")
    let data = await res.json();
    // return data;
    return data['sell_posts'];
}