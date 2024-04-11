import { useState } from 'react';

import UpDown from './UpDown'

import classes from './Filters.module.css';

const listingTypeMap = { rent: '임대', trade: '매매' };


function ListingTypeFilter({ listingType, setListingType }) {

    let [dialogOpen, setDialogOpen] = useState(false);

    function btnClickHander() {
        setDialogOpen((isOpen) => { return !isOpen; });
    }

    function radioClickHandler(event) {
        let inputEl = event.currentTarget;
        setListingType(inputEl.value);

        btnClickHander();
        event.stopPropagation();
    }

    let btnClass = classes.filter + ' ' + classes.active;
    let dialogOpenClass = dialogOpen ? '' : ' ' + classes.hidden;

    return (<>
        <button className={btnClass} onClick={btnClickHander} id="listing-type-button">
            {listingTypeMap[listingType]}
            <UpDown up={dialogOpen} />
        </button> 

        <div className = {classes.backdrop + dialogOpenClass} onClick={btnClickHander} id="listing-type-backdrop"> </div>

        <div className={classes['positional-container']}>
            <div className={classes.dialog + dialogOpenClass} id="listing-type-dialog"> 
                <label>
                    <input type="radio" value="rent" name="listing-type" onClick={radioClickHandler} checked={listingType=='rent'} readOnly/>
                    <span>임대 물건 찾기</span>
                </label>
                <label>
                    <input type="radio" value="trade" name="listing-type" onClick={radioClickHandler} checked={listingType=='trade'} readOnly/>
                    <span>매매 물건 찾기</span>
                </label>
            </div> 
        </div> 
    </>)
}

export default ListingTypeFilter;