import { useEffect, useState } from 'react';

import classes from './Filters.module.css';

import { arrayRange } from '../utilities/methods';

import UpDown from './UpDown';
import ListingTypeFilter from './ListingTypeFilter';
import SpaceUseFilter from './SpaceUseFilter';
import RangeFilter from './RangeFilter';

const rentValues = [...arrayRange(0, 300, 20), ...arrayRange(350, 600, 50), ...arrayRange(700, 1000, 100)];
const areaValues = [...arrayRange(0, 20, 5), ...arrayRange(30, 100, 10), ...arrayRange(200, 400, 100)];

function Filters() {

    let storedListingType = sessionStorage.getItem('listingType');
    let storedCheckedSpaceUses = sessionStorage.getItem('checkedSpaceUses');
    let storedMinRent = sessionStorage.getItem('minRent');
    let storedMaxRent = sessionStorage.getItem('maxRent');
    let storedMinArea = sessionStorage.getItem('minArea');
    let storedMaxArea = sessionStorage.getItem('maxArea');

    let [listingType, setListingType] = useState( storedListingType ? storedListingType : 'rent' );
    let [checkedSpaceUses, setCheckedSpaceUses] = useState( storedCheckedSpaceUses ? storedCheckedSpaceUses.split(',') : []);
    let [minRent, setMinRent] = useState( storedMinRent | '' );
    let [maxRent, setMaxRent] = useState( storedMaxRent | '' );
    let [minArea, setMinArea] = useState( storedMinArea | '' );
    let [maxArea, setMaxArea] = useState( storedMaxArea | '' );

    useEffect(()=>{
        if (sessionStorage) {
            // console.log('listing type')
            sessionStorage.setItem('listingType', listingType);
        }
    }, [listingType]);

    useEffect(()=>{
        // console.log('space use')
        if (sessionStorage) {
            sessionStorage.setItem('checkedSpaceUses', checkedSpaceUses);
        }
    }, [checkedSpaceUses]);

    useEffect(()=>{
        // console.log('rent range')
        if (sessionStorage) {
            sessionStorage.setItem('minRent', minRent);
            sessionStorage.setItem('maxRent', maxRent);
        }
    }, [minRent, maxRent]);

    useEffect(()=>{
        // console.log('area range')
        if (sessionStorage) {
            sessionStorage.setItem('minArea', minArea);
            sessionStorage.setItem('maxArea', maxArea);
        }
    }, [minArea, maxArea]);

    return (
        <div className={classes.filters}>
            <form className={classes['search-container']}>
                <input type="search" placeholder="지역을 입력해 주세요" name="region-search"/>
            </form>

            <div className={classes['filter-container']}>
                <ListingTypeFilter listingType={listingType} setListingType={setListingType} />
            </div>

            <div className={classes['filter-container']}>
                <SpaceUseFilter checkedSpaceUses={checkedSpaceUses} setCheckedSpaceUses={setCheckedSpaceUses} />
            </div>

            <div className={classes['filter-container']}>
                <RangeFilter minValue={minRent} setMinValue={setMinRent} maxValue={maxRent} setMaxValue={setMaxRent} unit={'만'} values={rentValues} btnName={'월세'} />
            </div>

            <div className={classes['filter-container']}>
                <RangeFilter minValue={minArea} setMinValue={setMinArea} maxValue={maxArea} setMaxValue={setMaxArea} unit={'평'} values={areaValues} btnName={'면적'} />
            </div>
            <div className={classes['filter-container']}>
                <button className={classes.filter} id="all-filters">모든필터 <UpDown /></button>
            </div>
            <div className={classes['filter-container']}>
                <button className={classes.filter + ' ' + classes["save-search"]}>검색저장</button>
            </div>
        </div>
    )
}

export default Filters;