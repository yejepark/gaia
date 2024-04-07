import { useEffect } from 'react';

import classes from './Filters.module.css';

function UpDown() {
    return (
        <div className={classes['arrow-container']}>
            <i className={classes['arrow']}></i>
        </div>
    );
}


function Filters() {

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
        <div className={classes.filters}>
            <form className={classes['search-container']}>
                <input type="search" placeholder="지역을 입력해 주세요" name="region-search" />
            </form>
            <button className={classes.filter} id="trade-type"> 임대 <UpDown /> </button>
            <button className={classes.filter} id="space-usage"> 용도 <UpDown /> </button>
            <button className={classes.filter} id="rent-range"> 월세 <UpDown /> </button>
            <button className={classes.filter} id="use-area"> 면적 <UpDown /> </button>
            <button className={classes.filter} id="all-filters"> 모든필터 <UpDown /> </button>
            <button className={classes.filter + ' ' + classes["save-search"]}> 검색저장 </button>
        </div>
    )
}

export default Filters;