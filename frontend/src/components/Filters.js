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

const spaceUseMap = {
    office: '사무실', coworking: '공유오피스', industrial: '산업용', retail: '소매업', restaurant: '식당', medical: '의료업', land: '토지'
};

const spaceUses = ['office', 'coworking', 'industrial', 'retail', 'restaurant', 'medical', 'land'];

function Filters() {
    let [listingType, setListingType] = useState('rent');
    let [checkedSpaceUses, setCheckedSpaceUses] = useState([]);

    useEffect(() => {
        let buttons = document.querySelectorAll('.' + classes.filters +
            ' :is(#listing-type-button, #space-use-button, #rent-range, #use-area, #all-filters)');

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

    function checkClickHandler(event) {
        let inputEl = event.currentTarget;
        let checked = inputEl.value;
        if (!checkedSpaceUses.includes(checked)) {
            setCheckedSpaceUses((prevUses) => [...prevUses, checked] );
        } else {
            setCheckedSpaceUses((prevUses) => prevUses.filter((x) => x != checked));
        }
    }

    useEffect(() => {
        console.log(checkedSpaceUses);
    }, [checkedSpaceUses]);

    return (
        <div className={classes.filters}>
            <form className={classes['search-container']}>
                <input type="search" placeholder="지역을 입력해 주세요" name="region-search"/>
            </form>

            <div className={classes['filter-container']}>
                <button className={`${classes.filter} + ' ' + ${classes.active}`} id="listing-type-button" onClick={btnClickHandler}>
                    {listingTypeMap[listingType]}
                    <UpDown />
                </button>
                <div className={classes.backdrop + ' ' + classes.hidden} onClick={backdropClickHandler} id="listing-type-backdrop"></div>
                <div className={classes.dialog + ' ' + classes.hidden} id="listing-type-dialog"> 
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

            <div className={classes['filter-container']}>
                <button className={`${classes.filter} + ${checkedSpaceUses.length > 0 ? (' ' + classes.active) : ''}`} id="space-use-button" onClick={btnClickHandler}>
                    <div className={classes.list}>{checkedSpaceUses.length == 0 ? "용도" : checkedSpaceUses.map((x)=>spaceUseMap[x]).join(',')}</div>
                    <UpDown />
                </button>
                <div className={classes.backdrop + ' ' + classes.hidden} onClick={backdropClickHandler} id="space-use-backdrop"></div>
                <div className={classes['space-use-dialog'] + ' ' + classes.dialog + ' ' + classes.hidden} id="space-use-dialog">
                    {spaceUses.map((spaceUse)=> <label key={spaceUse}>
                        <input type="checkbox" value={spaceUse} name="space-use" onClick={checkClickHandler}/>
                        <span>{spaceUseMap[spaceUse]}</span>
                    </label>)}
                </div>
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