import { useLoaderData, useFetcher } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import KakaoMap from '../components/Map';
import CardContainer from '../components/CardContainer';
import Filters from '../components/Filters';

import classes from './PostsLayout.module.css';

import { debounce } from '../utilities/methods';

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
    console.log('in PostsLayout', renderCount);

    let [showMap, setShowMap] = useState(window.matchMedia('(min-width: 900px)').matches);

    // ------------------------------------------------------------------
    const methods = useForm({ defaultValues: defaultFilterState });
    const { watch, formState: { isDirty } } = methods;
    const filterValues = watch();
    const productTypeStr = filterValues.productType.join(',');
    // console.log('isDirty: ', isDirty, filterValues)
    
    // ------------------------------------------------------------------
    const fetcher = useFetcher();

    useEffect(() => {    
        if (isDirty) {
            // console.log('call fetcher')
            const queryState = encodeURIComponent(JSON.stringify(filterValues));
            fetcher.load('/posts/' + queryState);
        }
    }, [
        isDirty,
        filterValues.tradeType, productTypeStr, 
        filterValues.rentMin, filterValues.rentMax,
        filterValues.areaMin, filterValues.areaMax,
        filterValues.sort
    ]);

    // ------------------------------------------------------------------
    let assets = useLoaderData();
    let subAssets = fetcher.data;

    // console.log('assets : ', assets)
    console.log('subAssets: ', subAssets)

    assets = isDirty && subAssets ? subAssets : assets;

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
            <FormProvider {...methods}>
                <Filters />
            </FormProvider>
            <div className={classes['posts-layout']}>
                <main id="mapSection" className={classes['map-section']}>
                    {showMap && <KakaoMap assets={assets}/>}
                </main>
                <nav id="cardNav" className={classes['card-nav']}>
                    <CardContainer assets={assets} formMethods={methods} tradeType={filterValues.tradeType} />
                </nav>
            </div>
        </div>
    );
}

export default PostsLayout;

export async function loader({ request, params }) {
    console.log('\nIn PostsLayout loader');
    // console.log(params, '---', request)

    let url = "http://localhost:8000/sell_posts/list_all";
    if (Object.keys(params).length > 0) {
        url += '?query_state=' + encodeURIComponent(params.queryState);
    }
    // console.log(url)

    const res = await fetch(url)
    const data = await res.json();
    // console.log('data: ', data)
    return data['ad_posts'];
}