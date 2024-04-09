import { useEffect, useState } from 'react';

import classes from './Filters.module.css';

function UpDown() {
    return (
        <div className={classes['arrow-container']}>
            <i className={classes['arrow']}></i>
        </div>
    );
}

function btnClickHandler(event) {
    let button = event.currentTarget;
    let id = button.id.substring(0, button.id.lastIndexOf('-'));
    let backdrop = document.getElementById(id+'-backdrop');
    let dialog = document.getElementById(id+'-dialog');
    backdrop.classList.toggle(classes.hidden);
    dialog.classList.toggle(classes.hidden);    
    event.stopPropagation();
}

function backdropClickHandler(event) {
    let backdrop = event.currentTarget;
    let id = backdrop.id.substring(0, backdrop.id.lastIndexOf('-'));
    let button = document.getElementById(id+'-button');
    button.click();    
    event.stopPropagation();
}

const listingTypeMap = { rent: '임대', trade: '매매' };

function Filters() {
    let [listingType, setListingType] = useState('rent');

    useEffect(() => {
        let buttons = document.querySelectorAll('.' + classes.filters +
            ' :is(#listing-type-button, #space-usage, #rent-range, #use-area, #all-filters)');

        for (let i = 0; i < buttons.length; i++) {
            let arrowEl = buttons[i].querySelector('i');
            buttons[i].addEventListener('click', function() { arrowEl.classList.toggle(classes['up']); });
        }
    }, []);

    function radioClickHandler(event) {
        let inputEl = event.currentTarget;
        setListingType(inputEl.value);

        let button = document.getElementById(inputEl.name + '-button');
        button.click();

        event.stopPropagation();
    }

    useEffect(() => {
        
    }, []);


    return (
        <div className={classes.filters}>
            <form className={classes['search-container']}>
                <input type="search" placeholder="지역을 입력해 주세요" name="region-search"/>
            </form>
            <div className={classes['filter-container']}>
                <button className={classes.filter} id="listing-type-button" onClick={btnClickHandler}>
                    {listingTypeMap[listingType]}
                    <UpDown />
                </button>
                <div className={classes.backdrop + ' ' + classes.hidden} onClick={backdropClickHandler} id="listing-type-backdrop"></div>
                <div className={classes.dialog + ' ' + classes.hidden} id="listing-type-dialog"> 
                    <label>
                        <input type="radio" value="rent" name="listing-type" onClick={radioClickHandler} checked={listingType=='rent'} readOnly/>
                        임대 물건 찾기
                    </label>
                    <label>
                        <input type="radio" value="trade" name="listing-type" onClick={radioClickHandler} checked={listingType=='trade'} readOnly/>
                        매매 물건 찾기
                    </label>
                </div>
            </div>
            <div className={classes['filter-container']}>
                <button className={classes.filter} id="space-usage">용도 <UpDown /></button>
            </div>
            <div className={classes['filter-container']}>
                <button className={classes.filter} id="rent-range">월세 <UpDown /></button>
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