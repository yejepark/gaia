import { useState } from 'react';
import { useController, useFormContext, useFormState } from 'react-hook-form';

import UpDown from '../simple/UpDown';
import ApplyButton from '../simple/ApplyButton';

import parentClasses from '../Filters.module.css';
import classes from './MultipleChoice.module.css';


function MultipleChoiceForm({ choiceMap, defaultBtnLabel, name, notActive, rules }) {

    const { control, setFocus } = useFormContext();
    const { field } = useController({ control, name, rules: (rules ? rules : {}) });
    const { errors } = useFormState({ control, name });

    const [dialogOpen, setDialogOpen] = useState(false);

    function btnClickHandler() {
        setDialogOpen((isOpen) => { return !isOpen; });
        setFocus(name);
    }

    function enterStrokeHandler(e) {
        if (e.key === 'Enter') {
            setDialogOpen((isOpen) => { return !isOpen; });
        }
    }

    function onCheckChange(event, idx) {
        const inputEl = event.currentTarget;
        const clicked = inputEl.value;
        if (!field.value.includes(clicked)) {
            const newList = [...field.value, clicked];
            newList.sort();
            field.onChange(newList);
        } else {
            field.onChange([...field.value].filter((x) => x !== clicked));
        }
    }
    // console.log('in multiple choice form : ', field.value)

    let btnClass = '';
    if (!notActive && field.value.length > 0) {
        btnClass = btnClass + ' active';
    }

    // console.log('----', field, field.length)
    const btnLabel = field.value.length === 0 ? defaultBtnLabel : (
        field.value.map((x) => choiceMap[x]).filter((x) => x && x.length > 0).join(',')
    );

    const dialogOpenClass = dialogOpen ? '' : ' hidden';

    const items = Object.keys(choiceMap).map((item, idx) => {
        return (<li key={idx}>
            <label>
                <input 
                    type="checkbox" 
                    value={item} 
                    onChange={(e) => onCheckChange(e, idx)}
                    checked={field.value.includes(item)}
                    ref={idx === 0 ? field.ref : null}
                    className={'focusable'}
                    onKeyPress={enterStrokeHandler}
                />
                <span>{choiceMap[item]}</span>
            </label>
        </li>);
    });

    let error;
    const names = name.split('.');
    if (errors[names[0]]) {
        error = names.length === 1 ? errors[names[0]] : errors[names[0]][names[1]];
    }

    return (<div className={classes.container}>
        <button type='button' className={parentClasses.filter + ' alive-btn ' + btnClass} onClick={btnClickHandler}>
            <div className={classes.string}>{btnLabel}</div>
            <UpDown up={dialogOpen}/>
        </button>

        <div className={'backdrop' + dialogOpenClass} onClick={btnClickHandler}></div>

        <div className={'positional-container'}>
            <div className={ 'dialog' + dialogOpenClass }>
                <ol className={classes.dialog} tabIndex='-1'>
                    {items}
                </ol>
                <ApplyButton clickHandler={btnClickHandler} />
            </div>
        </div>

        {error && <span className={'error-message'}> {error.message} </span>}
    </div>)
}

export default MultipleChoiceForm;