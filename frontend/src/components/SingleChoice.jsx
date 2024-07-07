import { useState, memo } from 'react';

import UpDown from './UpDown';
import ApplyButton from './ApplyButton';

import classes from './Filters.module.css';

function SingleChoice({ chosen, setChosen, choiceMap, btnLabel, name }) {

    let [dialogOpen, setDialogOpen] = useState(false);

    function btnClickHandler() {
        setDialogOpen((isOpen) => { return !isOpen; });
    }

    function radioClickHandler(event) {
        let inputEl = event.currentTarget;
        setChosen(inputEl.value);
        event.stopPropagation();
    }

    let btnClass = chosen.length > 0 ? classes.filter + ' ' + classes.active : classes.filter;
    let dialogOpenClass = dialogOpen ? '' : ' ' + classes.hidden;

    let inputEls = Object.keys(choiceMap).map((choice)=> {return (
        <label key={choice}>
            <input type="radio" value={choice} name={name} onClick={radioClickHandler} checked={chosen===choice} readOnly/>
            <span>{choiceMap[choice]}</span>
        </label>
    ); });

    return (<>
        <button type="button" className={btnClass} onClick={btnClickHandler}>
            {chosen && choiceMap[chosen] ? choiceMap[chosen] : btnLabel}
            <UpDown up={dialogOpen} />
        </button> 

        <div className = {classes.backdrop + dialogOpenClass} onClick={btnClickHandler}> </div>

        <div className={classes['positional-container']}>
            <div className={classes.dialog + dialogOpenClass}> 
                {inputEls}
                <ApplyButton clickHandler={btnClickHandler} />
            </div> 
        </div> 
    </>)
}

export default memo(SingleChoice);