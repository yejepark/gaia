import { useState } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';

import UpDown from './UpDown';
import ApplyButton from './ApplyButton';

import classes from './Filters.module.css';

function SingleChoiceForm({ choiceMap, btnLabel, name }) {

    const { register, control } = useFormContext();

    let [dialogOpen, setDialogOpen] = useState(false);

    function btnClickHandler(e) {
        setDialogOpen((isOpen) => { return !isOpen; });
    }

    function enterStrokeHandler(e) {
        if (e.key === 'Enter') {
            setDialogOpen((isOpen) => { return !isOpen; });    
        }
    }
    let chosen = useWatch({ control, name });
    // console.log('--------', chosen)

    let btnClass = chosen && chosen.length > 0 ? classes.filter + ' alive-btn active' : classes.filter + ' alive-btn';
    let dialogOpenClass = dialogOpen ? '' : ' ' + classes.hidden;

    let inputEls = Object.keys(choiceMap).map((choice, idx) => {
        return (<li key={idx}>
            <label>
                <input {...register(name)} type="radio" value={choice} onKeyPress={enterStrokeHandler} className={'focusable'}/>
                <span>{choiceMap[choice]}</span>
            </label>
        </li>);
    });

    return (<>
        <button type="button" className={btnClass} onClick={btnClickHandler}>
            {chosen && choiceMap[chosen] ? choiceMap[chosen] : btnLabel}
            <UpDown up={dialogOpen} />
        </button>

        <div className = { classes.backdrop + dialogOpenClass } onClick = { btnClickHandler }> </div>

        <div className = { 'positional-container' }>
            <ol className={classes.dialog + dialogOpenClass}> 
                {inputEls}
                <ApplyButton clickHandler={btnClickHandler} />
            </ol> 
        </div>  
        </>)
    }

    export default SingleChoiceForm;