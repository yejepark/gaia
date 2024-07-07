import { useState, memo } from 'react';

import UpDown from './UpDown';
import ApplyButton from './ApplyButton';

import parentClasses from './Filters.module.css';
import classes from './MultipleChoice.module.css';


function MultipleChoice({ checkedList, setCheckedList, choiceMap, defaultBtnLabel, name, notActive }) {
 	
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
	let btnClass = checkedList?.length === 0 ? '' : (notActive ? '' : ' ' + parentClasses.active);
    let btnLabel = checkedList?.length === 0 ? defaultBtnLabel : (
        checkedList.map((x)=>choiceMap[x]).filter((x)=> x && x.length > 0).join(',')
    );

	let dialogOpenClass = dialogOpen ? '' : ' ' + parentClasses.hidden;

    let items = Object.keys(choiceMap).map((item)=> {
    	return (
			<label key={item}>
	            <input type="checkbox" value={item} name={name} onClick={checkClickHandler} checked={checkedList.includes(item)} readOnly/>
	            <span>{choiceMap[item]}</span>
	        </label>
	    );
    });

	return (<div className={classes.container}>
        <button type='button' className={parentClasses.filter + btnClass} onClick={btnClickHandler}>
            <div className={classes.string}>{btnLabel}</div>
            <UpDown up={dialogOpen}/>
        </button>

        <div className={parentClasses.backdrop + dialogOpenClass} onClick={btnClickHandler}></div>

        <div className={parentClasses['positional-container']}>
            <div className={parentClasses.dialog + dialogOpenClass}>
                <div className={classes.dialog}>
                    {items}
                </div>
                <ApplyButton clickHandler={btnClickHandler} />
            </div>
        </div>
	</div>)
}

export default memo(MultipleChoice);