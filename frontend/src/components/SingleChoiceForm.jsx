import { useState } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';

import UpDown from './UpDown';
import ApplyButton from './ApplyButton';

import classes from './Filters.module.css';

function SingleChoiceForm({ choiceMap, btnLabel, name }) {

    const { register, control } = useFormContext();

    let [dialogOpen, setDialogOpen] = useState(false);

    function btnClickHandler() {
        setDialogOpen((isOpen) => { return !isOpen; });
    }
    let chosen = useWatch({ control, name });
    // console.log('--------', chosen)

    let btnClass = chosen && chosen.length > 0 ? classes.filter + ' ' + classes.active : classes.filter;
    let dialogOpenClass = dialogOpen ? '' : ' ' + classes.hidden;

    let inputEls = Object.keys(choiceMap).map((choice) => {
        return (
            <label key={choice}>
            <input {...register(name)} type="radio" value={choice} name={name} />
            <span>{choiceMap[choice]}</span>
        </label>
        );
    });

    return (<>
        <button type="button" className={btnClass} onClick={btnClickHandler}>
            {chosen && choiceMap[chosen] ? choiceMap[chosen] : btnLabel}
            <UpDown up={dialogOpen} />
        </button>

        <div className = { classes.backdrop + dialogOpenClass } onClick = { btnClickHandler }> </div>

        <div className = { classes['positional-container'] }>
            <div className={classes.dialog + dialogOpenClass}> 
                {inputEls}
                <ApplyButton clickHandler={btnClickHandler} />
            </div> 
        </div>  
        </>)
    }

    export default SingleChoiceForm;