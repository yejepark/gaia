import { useState, memo } from 'react';

import UpDown from './UpDown';
import ApplyButton from './ApplyButton';

import classes from './Filters.module.css';

function inputClickHandler(event) {
    event.stopPropagation();
    let textInput = event.currentTarget.querySelector('input');
    if (textInput) {
        textInput.focus() 
    };
}

function textChangeHandler(event) {
    event.stopPropagation();
    let textInputContainer = event.currentTarget;
    return textInputContainer.value;
}

function dropdownClickHandler(event) {
    event.stopPropagation();
    let optionEl = event.currentTarget;
    return optionEl.getAttribute('value');
}

function RangeFilter({ minValue, setMinValue, maxValue, setMaxValue, unit, values, btnName }) {

	let [dialogOpen, setDialogOpen] = useState(false);
	let [minDropdownOpen, setMinDropdownOpen] = useState(false);
	let [maxDropdownOpen, setMaxDropdownOpen] = useState(false);
    let [tempMinValue, setTempMinValue] = useState(minValue);
    let [tempMaxValue, setTempMaxValue] = useState(maxValue);

	function btnClickHandler() {
        setMinValue(String(tempMinValue));
        setMaxValue(String(tempMaxValue));
        if (dialogOpen) {
            setMinDropdownOpen(false);
            setMaxDropdownOpen(false);
        }    
        setDialogOpen((isOpen) => { return !isOpen; });
    }

	function minInputClickHandler(event) {
        inputClickHandler(event);
        setMinDropdownOpen((isOpen) => { return !isOpen; });
    }

    function maxInputClickHandler(event) {
        inputClickHandler(event);
        setMaxDropdownOpen((isOpen) => { return !isOpen; });
    }

    function minTextChangeHandler(event) {
        let value = textChangeHandler(event);
        if (value.length === 0) {
            setTempMinValue('');
            return;
        } 

        let intValue = parseInt(value);
        if (intValue >= 0) {
            setTempMinValue(String(intValue));
        }
    }

    function maxTextChangeHandler(event) {
        let value = textChangeHandler(event);
        if (value.length === 0) {
            setTempMaxValue('');
            return;
        }

        let intValue = parseInt(value);
        if (intValue >= 0) {
            setTempMaxValue(String(intValue));
        }
    }

    function minDropdownClickHandler(event) {
        let value = dropdownClickHandler(event);
        setTempMinValue(value);
        setMinDropdownOpen(false);
    }

    function maxDropdownClickHandler(event) {
        let value = dropdownClickHandler(event);
        setTempMaxValue(value);
        setMaxDropdownOpen(false);
    }

    let dialogOpenClass = dialogOpen ? '' : ' ' + classes.hidden;
    let rangeBtnClass = tempMinValue > 0 | tempMaxValue > 0 ? ' ' + classes.active : '';
    let minDropdownOpenClass = minDropdownOpen ? '' : ' ' + classes.hidden;
    let maxDropdownOpenClass = maxDropdownOpen ? '' : ' ' + classes.hidden;

    let intMinValue = parseInt(tempMinValue);
    let intMaxValue = parseInt(tempMaxValue);
    let minValueEl = intMinValue > 0 ? <span className={classes['min-value']}>{tempMinValue}{unit}</span>: '';
    let maxValueEl = intMaxValue > 0 ? <span className={classes['max-value']}>{tempMaxValue}{unit}</span>: '';

    let minValues = (intMaxValue > 0) ? values.filter((x) => x<intMaxValue) : values;    
    let minDropdownItems = minValues.map((value)=> {
        return (
    	    <div key={value} value={value} onClick={minDropdownClickHandler}>
    	       <span className={classes['dropdown-item']}>{value}{unit}</span>
    	    </div>
        ); 
   	});

    let maxValues = (intMinValue > 0) ? values.slice(1).filter((x) => x>intMinValue) : values.slice(1);
    let maxDropdownItems = maxValues.map((value)=> {
        return (
            <div key={value} value={value} onClick={maxDropdownClickHandler}>
                <span className={classes['dropdown-item']}>{value}{unit}</span>
            </div>
        ); 
    });

    maxDropdownItems.push(
        <div key={-1} value={''} onClick={maxDropdownClickHandler}>
            <span className={classes['dropdown-item']}>제한없음</span>
        </div>
    )

    // console.log(tempMinValue, minValue, tempMaxValue, maxValue);

	return (<>
		<button className={classes.filter + rangeBtnClass} id="range-button" onClick={btnClickHandler}>
            {btnName}
            {minValueEl}
            {intMinValue > 0 | intMaxValue > 0 ? <i className={classes.tilde}></i> : ''}
            {maxValueEl}
            <UpDown up={dialogOpen}/>
      	</button>

        <div className={classes.backdrop + dialogOpenClass} onClick={btnClickHandler} id="range-backdrop"></div>

        <div className={classes['positional-container']}>
            <div className={classes.dialog + dialogOpenClass} id="range-dialog">
                <div className={classes['range-container']}>

                    <div className={classes['min-header']}>최소</div>

                    <div className={classes['min-input-container']} onClick={minInputClickHandler}>
                        <div className={classes['min-input']}>
                            <input type='text' placeholder="0" autoComplete="off" name="minimum" id='min-input' onChange={minTextChangeHandler} value={tempMinValue}/> 
                            <UpDown up={minDropdownOpen} />
                        </div>

                        <div className={classes.backdrop + minDropdownOpenClass} onClick={minInputClickHandler} id="dropdown-backdrop"></div>
                        
                        <div className={classes['positional-container']}>
                            <div className={classes['dropdown'] + minDropdownOpenClass}>
                                {minDropdownItems}
                            </div>
                        </div>
                    </div>

                    <div className={classes.dash}>-</div>

                    <div className={classes['max-header']}>최대</div>

                    <div className={classes['max-input-container']} onClick={maxInputClickHandler}>
                        <div className={classes['max-input']}>
                            <input type='text' placeholder="제한없음" autoComplete="off" name="maximum" id='max-input' onChange={maxTextChangeHandler} value={tempMaxValue}/>
                            <UpDown up={maxDropdownOpen} />
                        </div>

                        <div className={classes.backdrop + maxDropdownOpenClass} onClick={maxInputClickHandler} id="dropdown-backdrop"></div>
                        
                        <div className={classes['positional-container']}>
                            <div className={classes['dropdown'] + maxDropdownOpenClass}>
                                {maxDropdownItems}
                            </div>
                        </div>

                    </div>
                </div>
                <ApplyButton clickHandler={btnClickHandler} />
            </div>
        </div>
	</>)
}

export default memo(RangeFilter);