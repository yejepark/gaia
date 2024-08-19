import { useLoaderData, useFetcher, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import KakaoMap from '../components/Map';
import CardContainer from '../components/CardContainer';
import Filters from '../components/Filters';

import classes from './PostsLayout.module.css';

import { debounce } from '../utilities/methods';

const { kakao } = window;

// const jsonServer = "http://127.0.0.1:8080";
// cd to the directory: frontend/src/temp
// run: npx http-server --cors

let renderCount = 0;

const defaultFilterState = {
    tradeType: 'lease',
    productType: [],
    rentMin: '0', rentMax: '',
    areaMin: '0', areaMax: '',
    sort: '최신순'
};

function PostsLayout() {
    renderCount ++ ;
    console.log('\nin PostsLayout', renderCount);
    const location = useLocation();
    const pathname = location.pathname;

    const [showMap, setShowMap] = useState(window.matchMedia('(min-width: 900px)').matches);

    const [boundingRect, setBoundingRect] = useState(null);
    const boundingRectStr = boundingRect ? boundingRect.toString() : '';

    // ------------------------------------------------------------------
    const methods = useForm({ defaultValues: defaultFilterState });
    const { watch } = methods;
    const filterValues = watch();
    const productTypeStr = filterValues.productType.join(',');
    
    // ------------------------------------------------------------------
    const { ad_posts, region_data } = useLoaderData();
    const fetcher = useFetcher();
    const queryStateValues = showMap ? {...filterValues, boundingRectStr, showMap} : {...filterValues, showMap};
    // console.log('queryStateValues', queryStateValues)

    useEffect(() => {    
        if (fetcher.state === 'idle' && Object.keys(queryStateValues).length > 0) {
            console.log('call fetcher !!')
            const queryState = encodeURIComponent(JSON.stringify(queryStateValues));
            fetcher.load((pathname.endsWith('/') ? pathname : pathname + '/') + queryState);    
        }
    }, [
        boundingRectStr,
        filterValues.tradeType, productTypeStr, 
        filterValues.rentMin, filterValues.rentMax,
        filterValues.areaMin, filterValues.areaMax,
        filterValues.sort
    ]);

    // ------------------------------------------------------------------
    let assets = fetcher.data ? fetcher.data.ad_posts : ad_posts;

    // ------------------------------------------------------------------
    // Create the map component only if the screen is large enough:
    useEffect(() => {
        let resizeHandler = debounce(() => {
            let isLargeScreen = window.matchMedia('(min-width: 900px)').matches;
            setShowMap(isLargeScreen);
        }, 200);
        window.addEventListener('resize', resizeHandler);
        return () => { window.removeEventListener('resize', resizeHandler); };
    }, []);

    return (
        <div className={classes['posts-layout-parent']}>
            <FormProvider {...methods}>
                <Filters />
            </FormProvider>
            <div className={classes['posts-layout']}>
                <main id="mapSection" className={classes['map-section']}>
                    {showMap && <KakaoMap assets={assets} boundingRect={boundingRect} setBoundingRect={setBoundingRect} /> }
                </main>
                <FormProvider {...methods}>
                    <nav id="cardNav" className={classes['card-nav']}>
                        <CardContainer assets={assets} tradeType={filterValues.tradeType} />
                    </nav>
                </FormProvider>
            </div>
        </div>
    );
}

export default PostsLayout;

export async function loader({ request, params }) {
    console.log('\nIn PostsLayout loader');
    // console.log(params, '---', request);

    const queryState = params.queryState ? JSON.parse(params.queryState) : {};
    console.log('queryState', queryState)
    // console.log('location', params.location)

    let regionURL;
    let regionData;
    if (Object.keys(params).length > 0 && params.location) {
        regionURL = "http://localhost:8000/sell_posts/get_region?id_str=" + params.location;
        const regionResult = await fetch(regionURL);
        regionData = await regionResult.json();
        // console.log('regionData', regionData);

        sessionStorage.setItem('regionData', JSON.stringify(regionData));
    }
    
    if (regionData) {
        queryState.LOC_CD = ''
        if (regionData.EMD_CD) {
            queryState.LOC_CD = regionData.EMD_CD;
        } else if (regionData.SIG_CD) {
            queryState.LOC_CD = regionData.SIG_CD;
        } else if (regionData.CTP_CD) {
            queryState.LOC_CD = regionData.CTP_CD;
        }
    }
    
    if (queryState.showMap &&  !queryState.boundingRectStr && regionData) {
        let regionBounds = new kakao.maps.LatLngBounds(
            new kakao.maps.LatLng(...regionData.sw.coordinates.toReversed()),
            new kakao.maps.LatLng(...regionData.ne.coordinates.toReversed())
        );
        queryState.boundingRectStr = regionBounds.toString();
    }

    let url = "http://localhost:8000/sell_posts/list_all";
    if (Object.keys(params).length > 0 && params.queryState) {
        url += '?query_state=' + encodeURIComponent(JSON.stringify(queryState));
    }
    const res = await fetch(url);
    const data = await res.json();

    if (regionData) {
        data['regionData'] = regionData;
    }

    return data;
}