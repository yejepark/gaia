import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import UpDown from './UpDown';

import parentClasses from '../pages/NewSellPost.module.css';
import classes from './DropDownInput.module.css';


function ListItem({ value, text, unit, onClick, customClass }) {
    return (
        <li value={value} onClick={onClick} className={customClass}>
            <button className={classes['dropdown-item']}>{text || value}{unit}</button>
        </li>
    );
}


function DropDownInputForm({ values, name, options, setCustomValue, withoutPipe, readOnly }) {
    const { register, setValue, setFocus } = useFormContext();

    function inputClickHandler(event) {
        event.stopPropagation();
        setFocus(name);
    }

    const setValue1 = withoutPipe ? (name, v) => setValue(name, v.replace('|', ' ').trim()) : setValue;
    const setValue2 = setCustomValue ? (name, v) => {
        setCustomValue(v);
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

        setValue2(name, v);
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
    return (
        <div className={classes['dropdown-container'] + ' ' + dropdownCustomClass} onClick={containerClickHandler} style={options.style}>
            <div className={classes['dropdown-input'] + ' focusable'}>
                <input {...register(name)}
                    type='text' 
                    autoComplete="off"
                    placeholder={options.placeholder}
                    readOnly={readOnly}
                /> 
                <UpDown up={dropdownOpen} />
            </div>

            <div className={'backdrop' + dropdownOpenClass} onClick={containerClickHandler}></div>
            
            <div className={'positional-container'}>
                <ol className={classes['dropdown'] + dropdownOpenClass}>
                    {dropdownItems}
                </ol>
            </div>
        </div>
    )
}

export default DropDownInputForm;