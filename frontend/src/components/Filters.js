import { useEffect, useState } from 'react';

import classes from './Filters.module.css';

import { arrayRange } from '../utilities/methods';

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
    let backdrop = document.getElementById(id + '-backdrop');
    let dialog = document.getElementById(id + '-dialog');
    backdrop.classList.toggle(classes.hidden);
    dialog.classList.toggle(classes.hidden);
    event.stopPropagation();
}

function backdropClickHandler(event) {
    let backdrop = event.currentTarget;
    let id = backdrop.id.substring(0, backdrop.id.lastIndexOf('-'));
    let button = document.getElementById(id + '-button');
    button.click();
    event.stopPropagation();
}

const listingTypeMap = { rent: '임대', trade: '매매' };

const spaceUseMap = {
    office: '사무실',
    coworking: '공유오피스',
    industrial: '산업용',
    retail: '소매업',
    restaurant: '식당',
    medical: '의료업',
    land: '토지'
};

const spaceUses = ['office', 'coworking', 'industrial', 'retail', 'restaurant', 'medical', 'land'];

const rentValues = [...arrayRange(0, 300, 20), ...arrayRange(350, 600, 50), ...arrayRange(700, 1000, 100)];

function Filters() {

    let [listingType, setListingType] = useState('rent');
    let [checkedSpaceUses, setCheckedSpaceUses] = useState([]);
    let [minRent, setMinRent] = useState(0);

    useEffect(() => {
        let buttons = document.querySelectorAll('.' + classes.filters +
            ' :is(#listing-type-button, #space-use-button, #rent-range-button, #use-area, #all-filters)');

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
            setCheckedSpaceUses((prevUses) => [...prevUses, checked]);
        } else {
            setCheckedSpaceUses((prevUses) => prevUses.filter((x) => x != checked));
        }
    }

    function textClickHandler(event) {
        let textInputContainer = event.currentTarget;
        textInputContainer.querySelector('input').focus();

        let arrowEl = textInputContainer.querySelector('i');
        arrowEl.classList.add(classes['up']);

        let dropdownEl = textInputContainer.parentElement.querySelector('section');
        dropdownEl.classList.remove(classes.hidden);

        event.stopPropagation();
    }

    function textChangeHandler(event) {
        let textInputContainer = event.currentTarget;
        let value = parseInt(textInputContainer.value);
        if (value | value == 0) {
            setMinRent(value);
        }
        event.stopPropagation();
    }

    function dropdownClickHandler(event) {
        let optionEl = event.currentTarget;
        let value = optionEl.getAttribute('value');

        let inputEl = document.getElementById('rent-min-input');
        inputEl.value = value;

        let arrowEl = inputEl.nextElementSibling.firstChild;
        arrowEl.classList.remove(classes['up']);

        let dropdownEl = optionEl.parentElement;
        dropdownEl.classList.add(classes.hidden);

        setMinRent(value);

        event.stopPropagation();
    }

    let minRentEl = minRent > 0 ? <span className={classes['rent-min-value']}>{minRent}만</span> : "월세";

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

                <div className={classes['positional-container']}>
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
            </div>

            <div className={classes['filter-container']}>
                <button className={`${classes.filter} + ${checkedSpaceUses.length > 0 ? (' ' + classes.active) : ''}`} id="space-use-button" onClick={btnClickHandler}>
                    <div className={classes.list}>{checkedSpaceUses.length == 0 ? "용도" : checkedSpaceUses.map((x)=>spaceUseMap[x]).join(',')}</div>
                    <UpDown />
                </button>
                <div className={classes.backdrop + ' ' + classes.hidden} onClick={backdropClickHandler} id="space-use-backdrop"></div>
                <div className={classes['positional-container']}>
                    <div className={classes['space-use-dialog'] + ' ' + classes.dialog + ' ' + classes.hidden} id="space-use-dialog">
                        {spaceUses.map((spaceUse)=> <label key={spaceUse}>
                            <input type="checkbox" value={spaceUse} name="space-use" onClick={checkClickHandler}/>
                            <span>{spaceUseMap[spaceUse]}</span>
                        </label>)}
                    </div>
                </div>
            </div>

            <div className={classes['filter-container']}>
                <button className={classes.filter} id="rent-range-button" onClick={btnClickHandler}>
                    {minRentEl}
                    <UpDown />
                </button>
                <div className={classes.backdrop + ' ' + classes.hidden} onClick={backdropClickHandler} id="rent-range-backdrop"></div>
                <div className={classes['positional-container']}>
                    <div className={classes.dialog + ' ' + classes.hidden} id="rent-range-dialog">
                        <div className={classes['range-container']}>
                            <div className={classes['min-header']}>최소</div>
                            <div className={classes['min-input-container']} onClick={textClickHandler}>
                                {/*<div className={classes.backdrop + ' ' + classes.hidden} onClick={backdropClickHandler} id="backdrop"></div>*/}
                                <div className={classes['min-input']}>
                                    <input type='text' placeholder="0" name="minimum" id='rent-min-input' onChange={textChangeHandler}/> 
                                    <UpDown />
                                </div>
                                <div className={classes['positional-container']}>
                                    <section className={classes['dropdown'] + ' ' + classes.hidden}>
                                        {rentValues.map((rentValue)=>
                                            <div key={rentValue} value={rentValue} onClick={dropdownClickHandler}>
                                                <span>{rentValue}만원</span>
                                            </div>
                                        )}
                                    </section>
                                </div>
                            </div>
                            <div className={classes.dash}>-</div>
                            <div className={classes['max-header']}>최대</div>
                            <div className={classes['max-input-container']} onClick={textClickHandler}>
                                <div className={classes['max-input']}>
                                    <input type='text' placeholder="제한없음" name="maximum" />
                                    <UpDown />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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