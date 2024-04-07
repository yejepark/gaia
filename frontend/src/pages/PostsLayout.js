import { useLoaderData } from 'react-router-dom';
import { useState, useEffect } from 'react';

import KakaoMap from '../components/Map';
import CardContainer from '../components/CardContainer';

import classes from './PostsLayout.module.css';

import { debounce } from '../utilities/methods';

const jsonServer = "http://127.0.0.1:8080";
// cd to the directory: frontend/src/temp
// run: npx http-server --cors


function UpDown() {
    return (
        <div className={classes['arrow-container']}>
            <i className={classes['arrow']}></i>
        </div>
    );
}


function PostsLayout() {

    let [showMap, setShowMap] = useState(true);

    let assets = useLoaderData();

    console.log(assets)

    // Create the map component only if the screen is large enough:
    useEffect(() => {
        let resizeHandler = debounce(() => {
            let largeScreen = window.matchMedia('(min-width: 900px)').matches;
            setShowMap(largeScreen);
        }, 200);
        window.addEventListener('resize', resizeHandler);
        return () => { window.removeEventListener('resize', resizeHandler); };
    }, []);

    useEffect(() => {
        let buttons = document.querySelectorAll('.' + classes.filters +
            ' :is(#trade-type, #space-usage, #rent-range, #use-area, #all-filters)');
        // console.log(buttons)

        for (let i = 0; i < buttons.length; i++) {
            let arrowEl = buttons[i].querySelector('i');
            buttons[i].addEventListener('click', function() { arrowEl.classList.toggle(classes['up']); });
        }
    }, []);

    return (
        <div className={classes['posts-layout-parent']}>
            <div className={classes.filters}>
                <form className={classes['search-container']}>
                    <input type="search" placeholder="지역을 입력해 주세요" name="region-search" />
                </form>
                <button className={classes.filter} id="trade-type"> 임대 <UpDown /> </button>
                <button className={classes.filter} id="space-usage"> 용도 <UpDown /> </button>
                <button className={classes.filter} id="rent-range"> 월세 <UpDown /> </button>
                <button className={classes.filter} id="use-area"> 면적 <UpDown /> </button>
                <button className={classes.filter} id="all-filters"> 모든필터 <UpDown /> </button>
                <button className={classes.filter} id="save-search"> 검색저장 </button>
            </div>
            <div className={classes['posts-layout']}>
                <main id="mapSection">
                    {showMap && <KakaoMap assets={assets}/>}
                </main>
                <nav id="cardNav">
                    <CardContainer assets={assets} />
                </nav>
            </div>
        </div>
    );
}

export default PostsLayout;

export async function loader() {
    let res = await fetch(jsonServer + '/assets.json');
    let data = await res.json();
    return data;
}