import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import UpDown from './UpDown';

import filtersClasses from './Filters.module.css';
import classes from './DropDownInput.module.css';



function DropDownInputForm({ values, name, options, setCustomValue, withoutPipe }) {
    const { register, setValue, setFocus } = useFormContext();

    function inputClickHandler(event) {
        event.stopPropagation();
        let textInput = event.currentTarget.querySelector('input');
        if (textInput) {
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
                <div key={v} value={v} onClick={dropdownClickHandler}>
                   <span className={classes['dropdown-item']}>{v}{options.unit}</span>
                </div>
            );
        });
    } else {
        dropdownItems = values.map((item) => {
            return (
                <div key={item.key} value={item.value} onClick={dropdownClickHandler}>
                   <span className={classes['dropdown-item']}>{item.text}</span>
                </div>
            );
        });
    }

    if (options.extraItems) {
        options.extraItems.forEach((item) => {
            dropdownItems.push(
                <div key={item.key} value={item.value} onClick={dropdownClickHandler}>
                    <span className={classes['dropdown-item']}>{item.text}</span>
                </div>
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
            
            <div className={filtersClasses['positional-container']}>
                <div className={classes['dropdown'] + dropdownOpenClass}>
                    {dropdownItems}
                </div>
            </div>
        </div>
    )
}

export default DropDownInputForm;