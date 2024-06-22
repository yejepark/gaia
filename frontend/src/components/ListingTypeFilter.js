import { useState, memo } from 'react';

import UpDown from './UpDown';
import ApplyButton from './ApplyButton';

import classes from './Filters.module.css';

const listingTypeMap = { rent: '임대', trade: '매매', 'direct-rent': '직거래' };

function ListingTypeFilter({ listingType, setListingType }) {

    let [dialogOpen, setDialogOpen] = useState(false);

    function btnClickHandler() {
        setDialogOpen((isOpen) => { return !isOpen; });
    }

    function radioClickHandler(event) {
        let inputEl = event.currentTarget;
        setListingType(inputEl.value);
        event.stopPropagation();
    }

    let btnClass = classes.filter + ' ' + classes.active;
    let dialogOpenClass = dialogOpen ? '' : ' ' + classes.hidden;

    let inputEls = Object.keys(listingTypeMap).map((type)=> {return (
        <label key={type}>
            <input type="radio" value={type} name="listing-type" onClick={radioClickHandler} checked={listingType===type} readOnly/>
            <span>{listingTypeMap[type]} 물건 찾기</span>
        </label>
    ); });

    return (<>
        <button className={btnClass} onClick={btnClickHandler} id="listing-type-button">
            {listingTypeMap[listingType]}
            <UpDown up={dialogOpen} />
        </button> 

        <div className = {classes.backdrop + dialogOpenClass} onClick={btnClickHandler} id="listing-type-backdrop"> </div>

        <div className={classes['positional-container']}>
            <div className={classes.dialog + dialogOpenClass} id="listing-type-dialog"> 
                {inputEls}
                <ApplyButton clickHandler={btnClickHandler} />
            </div> 
        </div> 
    </>)
}

export default memo(ListingTypeFilter);