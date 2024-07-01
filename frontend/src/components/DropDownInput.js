import { useState, memo } from 'react';

import UpDown from './UpDown';

import filtersClasses from './Filters.module.css';
import classes from './DropDownInput.module.css';


function inputClickHandler(event) {
    event.stopPropagation();
    let textInput = event.currentTarget.querySelector('input');
    if (textInput) {
        textInput.focus()
    };
}


function DropDownInput({ localValue, setLocalValue, values, name, options }) {

    let [dropdownOpen, setDropdownOpen] = useState(false);

    function containerClickHandler(event) {
        inputClickHandler(event);
        setDropdownOpen((isOpen) => { return !isOpen; });
    }

    function textChangeHandler(event, validator = null) {
        event.stopPropagation();

        let textInputContainer = event.currentTarget;
        let v = textInputContainer.value;

        if (v.length === 0) {
            setLocalValue('');
            return;
        }

        if (options.validator && !options.validator(v)) {
               return;        
        }

        if (options.transformer) {
            v = options.transformer(v);
        } 

        setLocalValue(v);       
    }

    function dropdownClickHandler(event) {
        event.stopPropagation();
        let optionEl = event.currentTarget;
        let v = optionEl.getAttribute('value');

        setLocalValue(v);
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
            <div className={classes['dropdown-input']}>
                <input type='text' name={name} autoComplete="off"
                    placeholder={options.placeholder}
                    onChange={textChangeHandler} 
                    value={localValue}
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

export default DropDownInput;