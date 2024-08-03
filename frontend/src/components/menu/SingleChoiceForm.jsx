import { useState } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';

import UpDown from '../simple/UpDown';
import ApplyButton from '../simple/ApplyButton';

import classes from '../Filters.module.css';

function SingleChoiceForm({ choiceMap, btnLabel, name, options }) {

    const { register, control, formState: { errors } } = useFormContext();

    const [dialogOpen, setDialogOpen] = useState(false);

    function btnClickHandler(e) {
        setDialogOpen((isOpen) => { return !isOpen; });
    }

    function enterStrokeHandler(e) {
        if (e.key === 'Enter') {
            setDialogOpen((isOpen) => { return !isOpen; });
        }
    }
    const chosen = useWatch({ control, name });
    // console.log('--------', chosen)

    const btnClass = chosen && chosen.length > 0 ? classes.filter + ' alive-btn active' : classes.filter + ' alive-btn';
    const dialogOpenClass = dialogOpen ? '' : ' hidden';

    const inputEls = Object.keys(choiceMap).map((choice, idx) => {
        return (<li key={idx}>
            <label>
                <input {...register(name, options)} type="radio" value={choice} onKeyPress={enterStrokeHandler} className={'focusable'}/>
                <span>{choiceMap[choice]}</span>
            </label>
        </li>);
    });

    let error;
    const names = name.split('.');
    if (errors[names[0]]) {
        error = names.length === 1 ? errors[names[0]] : errors[names[0]][names[1]];
    }

    return (<>
        <button type="button" className={btnClass} onClick={btnClickHandler}>
            {chosen && choiceMap[chosen] ? choiceMap[chosen] : btnLabel}
            <UpDown up={dialogOpen} />
        </button>

        <div className = { 'backdrop' + dialogOpenClass } onClick = { btnClickHandler }> </div>

        <div className = { 'positional-container' }>
            <ol className={ 'dialog' + dialogOpenClass }> 
                {inputEls}
                <ApplyButton clickHandler={btnClickHandler} />
            </ol> 
        </div>
        {error && <span className={'error-message'}> {error.message} </span>}
        </>)
    }

    export default SingleChoiceForm;