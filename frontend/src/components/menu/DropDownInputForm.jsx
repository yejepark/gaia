import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import UpDown from '../simple/UpDown';

import classes from './DropDownInput.module.css';


function ListItem({ value, text, unit, onClick, customClass }) {
    return (
        <li value={value} onClick={onClick} className={customClass}>
            <button type='button' className={classes['dropdown-item']}>{text || value}{unit}</button>
        </li>
    );
}


function DropDownInputForm({ values, name, options }) {
    // console.log('----in DropDownInputForm', name)

    const { register, setValue, setFocus, formState: { errors } } = useFormContext();
    const currentValue = useWatch({ name });

    function inputClickHandler(event) {
        event.stopPropagation();
        setFocus(name);
    }

    const setValue1 = options.withoutPipe ? 
        (name, v) => setValue(name, v.replace('|', ' ').trim(), { shouldDirty: true }) : 
        (name, v) => setValue(name, v, { shouldDirty: true });

    const setValue2 = options.setCustomValue ? (name, v) => {
        options.setCustomValue(v);
        setValue1(name, v);
    } : setValue1;

    const [dropdownOpen, setDropdownOpen] = useState(false);

    function containerClickHandler(event) {
        inputClickHandler(event);
        setDropdownOpen((isOpen) => {
            if (isOpen) {
                document.activeElement.blur();
            }
            return !isOpen; 
        });
    }

    function dropdownClickHandler(event) {
        event.stopPropagation();
        const optionEl = event.currentTarget;
        const v = optionEl.getAttribute('value');

        if (options.mode === 'append') {
            let newValues = currentValue.split(',').slice(0,-1);
            newValues.push(v);
            setValue2(name, newValues.join(','));    
        } else {
            setValue2(name, v);    
        }

        setDropdownOpen(false);
    }

    const dropdownOpenClass = dropdownOpen ? '' : ' hidden';

    let dropdownItems;
    if (values.length > 0 && ((typeof values[0] === 'number') || (typeof values[0] === 'string' || values[0] instanceof String))) {
        dropdownItems = values.map((v) => {
            return <ListItem key={v} value={v} text={v} unit={options.unit} onClick={dropdownClickHandler}/>});
    } else {
        dropdownItems = values.map((item) => {
            return <ListItem key={item.key} value={item.value} text={item.text} onClick={dropdownClickHandler} customClass={item.customClass}/>});
    }

    if (options.extraItems) {
        options.extraItems.forEach((item) => {
            dropdownItems.push(
                <ListItem key={item.key} value={item.value} text={item.text} onClick={dropdownClickHandler} customClass={item.customClass}/>);
        });
    }

    const dropdownCustomClass = options.customClass ? options.customClass : '';

    let error;
    const names = name.split('.');
    if (errors[names[0]]) {
        error = names.length === 1 ? errors[names[0]] : errors[names[0]][names[1]];
    }

    return (
        <div className={classes['dropdown-container'] + ' ' + dropdownCustomClass} onClick={containerClickHandler} style={options.style}>
            <div className={classes['dropdown-input'] + ' focusable'}>
                <input {...register(name, options.registerOptions)}
                    type='text' 
                    autoComplete="off"
                    placeholder={options.placeholder ? options.placeholder : '직접입력 또는 선택'}
                    readOnly={options.readOnly}
                /> 
                <UpDown up={dropdownOpen} />
            </div>

            <div className={'backdrop' + dropdownOpenClass} onClick={containerClickHandler}></div>
            
            <div className={'positional-container'}>
                <ol className={classes['dropdown'] + dropdownOpenClass} tabIndex='-1'>
                    {dropdownItems}
                </ol>
            </div>
            {error && <span className={'error-message'}> {error.message} </span>}
        </div>
    )
}

export default DropDownInputForm;