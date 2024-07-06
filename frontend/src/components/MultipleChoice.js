import { useState, memo } from 'react';

import UpDown from './UpDown';
import ApplyButton from './ApplyButton';

import filtersClasses from './Filters.module.css';


function MultipleChoice({ checkedList, setCheckedList, choiceMap, defaultBtnLabel, name }) {
 	
 	let [dialogOpen, setDialogOpen] = useState(false);

 	function btnClickHandler() {
        setDialogOpen((isOpen) => { return !isOpen; });
    }

    function checkClickHandler(event) {
        let inputEl = event.currentTarget;
        let clicked = inputEl.value;
        if (!checkedList.includes(clicked)) {
            setCheckedList((prevList) => [...prevList, clicked]);
        } else {
            setCheckedList((prevList) => prevList.filter((x) => x !== clicked));
        }
    }
	
	let btnClass = checkedList.length === 0 ? '' : ' ' + filtersClasses.active;
    let btnLabel = checkedList.length === 0 ? defaultBtnLabel : checkedList.map((x)=>choiceMap[x]).join(',');

	let dialogOpenClass = dialogOpen ? '' : ' ' + filtersClasses.hidden;

    let items = Object.keys(choiceMap).map((item)=> {
    	return (
			<label key={item}>
	            <input type="checkbox" value={item} name={name} onClick={checkClickHandler} checked={checkedList.includes(item)} readOnly/>
	            <span>{choiceMap[item]}</span>
	        </label>
	    );
    });

	return (<>
        <button className={filtersClasses.filter + btnClass} onClick={btnClickHandler}>
            <div className={filtersClasses['multi-choice-string']}>{btnLabel}</div>
            <UpDown up={dialogOpen}/>
        </button>

        <div className={filtersClasses.backdrop + dialogOpenClass} onClick={btnClickHandler}></div>

        <div className={filtersClasses['positional-container']}>
            <div className={filtersClasses['multi-choice-dialog'] + ' ' + filtersClasses.dialog + dialogOpenClass}>
                {items}
                <ApplyButton clickHandler={btnClickHandler} />
            </div>
        </div>
	</>)
}

export default memo(MultipleChoice);