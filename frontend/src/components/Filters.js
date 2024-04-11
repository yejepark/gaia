import { useEffect, useState } from 'react';

import classes from './Filters.module.css';

import { arrayRange } from '../utilities/methods';

import UpDown from './UpDown';
import ListingTypeFilter from './ListingTypeFilter';
import SpaceUseFilter from './SpaceUseFilter';
import RentRangeFilter from './RentRangeFilter';

function Filters() {

    let [listingType, setListingType] = useState('rent');
    let [checkedSpaceUses, setCheckedSpaceUses] = useState([]);
    let [minRent, setMinRent] = useState('');
    let [maxRent, setMaxRent] = useState('');

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
                <RentRangeFilter minRent={minRent} setMinRent={setMinRent} maxRent={maxRent} setMaxRent={setMaxRent} />
            </div>

            <div className={classes['filter-container']}>
                <button className={classes.filter} id="use-area">면적 <UpDown /></button>
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