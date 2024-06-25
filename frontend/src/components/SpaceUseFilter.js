import { useState, memo } from 'react';

import UpDown from './UpDown';
import ApplyButton from './ApplyButton';

import filtersClasses from './Filters.module.css';
import classes from './SpaceUseFilter.module.css';

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


function SpaceUseFilter({ checkedSpaceUses, setCheckedSpaceUses }) {
 	
 	let [dialogOpen, setDialogOpen] = useState(false);

 	function btnClickHandler() {
        setDialogOpen((isOpen) => { return !isOpen; });
    }

    function checkClickHandler(event) {
        let inputEl = event.currentTarget;
        let clicked = inputEl.value;
        if (!checkedSpaceUses.includes(clicked)) {
            setCheckedSpaceUses((prevUses) => [...prevUses, clicked]);
        } else {
            setCheckedSpaceUses((prevUses) => prevUses.filter((x) => x !== clicked));
        }
    }
	
	let btnClass = checkedSpaceUses.length === 0 ? '' : ' ' + filtersClasses.active;
    let btnLabel = checkedSpaceUses.length === 0 ? "용도" : checkedSpaceUses.map((x)=>spaceUseMap[x]).join(',');

	let dialogOpenClass = dialogOpen ? '' : ' ' + filtersClasses.hidden;

    let spaceUseItems = spaceUses.map((spaceUse)=> {
    	return (
			<label key={spaceUse}>
	            <input type="checkbox" value={spaceUse} name="space-use" onClick={checkClickHandler} checked={checkedSpaceUses.includes(spaceUse)} readOnly/>
	            <span>{spaceUseMap[spaceUse]}</span>
	        </label>
	    );
    });

	return (<>
        <button className={filtersClasses.filter + btnClass} id="space-use-button" onClick={btnClickHandler}>
            <div className={classes['list-string']}>{btnLabel}</div>
            <UpDown up={dialogOpen}/>
        </button>

        <div className={filtersClasses.backdrop + dialogOpenClass} onClick={btnClickHandler} id="space-use-backdrop"></div>

        <div className={filtersClasses['positional-container']}>
            <div className={classes['space-use-dialog'] + ' ' + filtersClasses.dialog + dialogOpenClass} id="space-use-dialog">
                {spaceUseItems}
                <ApplyButton clickHandler={btnClickHandler} />
            </div>
        </div>
	</>)
}

export default memo(SpaceUseFilter);