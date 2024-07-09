import { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import UpDown from './UpDown';
import ApplyButton from './ApplyButton';

import parentClasses from './Filters.module.css';
import classes from './MultipleChoice.module.css';


function MultipleChoiceForm({ choiceMap, defaultBtnLabel, name, notActive }) {

    const { control } = useFormContext();
    const { field } = useController({ control, name });

    let [dialogOpen, setDialogOpen] = useState(false);

    function btnClickHandler() {
        setDialogOpen((isOpen) => { return !isOpen; });
    }

    function onCheckChange(event, idx) {
        let inputEl = event.currentTarget;
        let clicked = inputEl.value;
        if (!field.value.includes(clicked)) {
            let newList = [...field.value, clicked];
            newList.sort();
            field.onChange(newList);
        } else {
            field.onChange([...field.value].filter((x) => x !== clicked));
        }
    }
    // console.log('in multiple choice form : ', field.value)

    let btnClass = field.length === 0 ? '' : (notActive ? '' : ' ' + parentClasses.active);
    let btnLabel = field.length === 0 ? defaultBtnLabel : (
        field.value.map((x) => choiceMap[x]).filter((x) => x && x.length > 0).join(',')
    );

    let dialogOpenClass = dialogOpen ? '' : ' ' + parentClasses.hidden;

    let items = Object.keys(choiceMap).map((item, idx) => {
        return (
            <label key={item}>
                <input 
                    type="checkbox" 
                    value={item} 
                    onChange={(e) => onCheckChange(e, idx)}
                    checked={field.value.includes(item)}
                    ref={field.ref}
                    readOnly
                />
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

export default MultipleChoiceForm;