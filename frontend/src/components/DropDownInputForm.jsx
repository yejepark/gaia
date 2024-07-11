import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import UpDown from './UpDown';

import filtersClasses from './Filters.module.css';
import classes from './DropDownInput.module.css';



function DropDownInputForm({ values, name, options, setCustomValue, withoutPipe }) {
    const { register, setValue, setFocus } = useFormContext();

    function inputClickHandler(event) {
        event.stopPropagation();
        let liEl = event.currentTarget.querySelector('li');
        if (liEl) {
            setFocus(name);
        };
    }

    let setValue1 = withoutPipe ? (name, v) => setValue(name, v.replace('|', ' ').trim()) : setValue;
    let setValue2 = setCustomValue ? (name, v) => {
        setCustomValue(v);
        setValue1(name, v);
    } : setValue1;

    let [dropdownOpen, setDropdownOpen] = useState(false);

    function containerClickHandler(event) {
        inputClickHandler(event);
        setDropdownOpen((isOpen) => { return !isOpen; });
    }

    function dropdownClickHandler(event) {
        event.stopPropagation();
        let optionEl = event.currentTarget;
        let v = optionEl.getAttribute('value');

        setValue2(name, v);
        setDropdownOpen(false);
    }

    let dropdownOpenClass = dropdownOpen ? '' : ' ' + filtersClasses.hidden;

    let dropdownItems;
    if (values.length > 0 && ((typeof values[0] === 'number') || (typeof values[0] === 'string' || values[0] instanceof String))) {
        dropdownItems = values.map((v) => {
            return (
                <li key={v} value={v} onClick={dropdownClickHandler}>
                   <button className={classes['dropdown-item']}>{v}{options.unit}</button>
                </li>
            );
        });
    } else {
        dropdownItems = values.map((item) => {
            return (
                <li key={item.key} value={item.value} onClick={dropdownClickHandler}>
                   <button className={classes['dropdown-item']}>{item.text}</button>
                </li>
            );
        });
    }

    if (options.extraItems) {
        options.extraItems.forEach((item) => {
            dropdownItems.push(
                <li key={item.key} value={item.value} onClick={dropdownClickHandler}>
                    <button className={classes['dropdown-item']}>{item.text}</button>
                </li>
            );
        })
    }

    return (
        <div className={options.custumClass} onClick={containerClickHandler} style={options.style}>
            <div className={classes['dropdown-input'] + ' focusable'}>
                <input {...register(name)}
                    type='text' 
                    autoComplete="off"
                    placeholder={options.placeholder}
                /> 
                <UpDown up={dropdownOpen} />
            </div>

            <div className={filtersClasses.backdrop + dropdownOpenClass} onClick={containerClickHandler} id="dropdown-backdrop"></div>
            
            <div className={'positional-container'}>
                <ol className={classes['dropdown'] + dropdownOpenClass}>
                    {dropdownItems}
                </ol>
            </div>
        </div>
    )
}

export default DropDownInputForm;