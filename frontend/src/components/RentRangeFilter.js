import { useState } from 'react';

import UpDown from './UpDown'

import classes from './Filters.module.css';
import { arrayRange } from '../utilities/methods';

const rentValues = [...arrayRange(0, 300, 20), ...arrayRange(350, 600, 50), ...arrayRange(700, 1000, 100)];

function inputClickHandler(event) {
    event.stopPropagation();
    let textInput = event.currentTarget.querySelector('input');
    if (textInput) {
        // textInput.setAttribute('placeholder', '');
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

function RentRangeFilter({ minRent, setMinRent, maxRent, setMaxRent }) {

	let [dialogOpen, setDialogOpen] = useState(false);
	let [minDropdownOpen, setMinDropdownOpen] = useState(false);
	let [maxDropdownOpen, setMaxDropdownOpen] = useState(false);

	function btnClickHandler() {
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
        if (value.length == 0) {
            setMinRent('');
            return;
        } 

        let intValue = parseInt(value);
        if (intValue >= 0) {
            setMinRent(String(intValue));
        }
    }

    function maxTextChangeHandler(event) {
        let value = textChangeHandler(event);
        if (value.length == 0) {
            setMaxRent('');
            return;
        }

        let intValue = parseInt(value);
        if (intValue >= 0) {
            setMaxRent(String(intValue));
        }
    }

    function minDropdownClickHandler(event) {
        let value = dropdownClickHandler(event);
        setMinRent(value);
        setMinDropdownOpen(false);
    }

    function maxDropdownClickHandler(event) {
        let value = dropdownClickHandler(event);
        setMaxRent(value);
        setMaxDropdownOpen(false);
    }

    let dialogOpenClass = dialogOpen ? '' : ' ' + classes.hidden;
    let RentRangeBtnClass = minRent > 0 ? ' ' + classes.active : '';
    let minDropdownOpenClass = minDropdownOpen ? '' : ' ' + classes.hidden;
    let maxDropdownOpenClass = maxDropdownOpen ? '' : ' ' + classes.hidden;

    let intMinRent = parseInt(minRent);
    let intMaxRent = parseInt(maxRent);
    let minRentEl = intMinRent > 0 ? <span className={classes['rent-min-value']}>{minRent}만</span>: '';
    let maxRentEl = intMaxRent > 0 ? <span className={classes['rent-max-value']}>{maxRent}만</span>: '';

    // <i className={classes.tilde}></i>

    let minRentValues = (intMaxRent > 0) ? rentValues.filter((x) => x<intMaxRent) : rentValues;    
    let minDropdownItems = minRentValues.map((rentValue)=> {
        return (
    	    <div key={rentValue} value={rentValue} onClick={minDropdownClickHandler}>
    	       <span className={classes['dropdown-item']}>{rentValue}만원</span>
    	    </div>
        ); 
   	});

    let maxRentValues = (intMinRent > 0) ? rentValues.slice(1).filter((x) => x>intMinRent) : rentValues.slice(1);
    let maxDropdownItems = maxRentValues.map((rentValue)=> {
        return (
            <div key={rentValue} value={rentValue} onClick={maxDropdownClickHandler}>
                <span className={classes['dropdown-item']}>{rentValue}만원</span>
            </div>
        ); 
    });

    maxDropdownItems.push(
        <div key={-1} value={''} onClick={maxDropdownClickHandler}>
            <span className={classes['dropdown-item']}>제한없음</span>
        </div>
    )

	return (<>
		<button className={classes.filter + RentRangeBtnClass} id="rent-range-button" onClick={btnClickHandler}>
            월세
            {minRentEl}
            {intMinRent > 0 | intMaxRent > 0 ? <i className={classes.tilde}></i> : ''}
            {maxRentEl}
            <UpDown up={dialogOpen}/>
      	</button>

        <div className={classes.backdrop + dialogOpenClass} onClick={btnClickHandler} id="rent-range-backdrop"></div>

        <div className={classes['positional-container']}>
            <div className={classes.dialog + dialogOpenClass} id="rent-range-dialog">
                <div className={classes['range-container']}>

                    <div className={classes['min-header']}>최소</div>

                    <div className={classes['min-input-container']} onClick={minInputClickHandler}>
                        <div className={classes['min-input']}>
                            <input type='text' placeholder="0" autoComplete="off" name="minimum" id='rent-min-input' onChange={minTextChangeHandler} value={minRent}/> 
                            <UpDown up={minDropdownOpen} />
                        </div>

                        <div className={classes.backdrop + minDropdownOpenClass} onClick={minInputClickHandler} id="rent-dropdown-backdrop"></div>
                        
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
                            <input type='text' placeholder="제한없음" autoComplete="off" name="maximum" id='rent-max-input' onChange={maxTextChangeHandler} value={maxRent}/>
                            <UpDown up={maxDropdownOpen} />
                        </div>

                        <div className={classes.backdrop + maxDropdownOpenClass} onClick={maxInputClickHandler} id="rent-dropdown-backdrop"></div>
                        
                        <div className={classes['positional-container']}>
                            <div className={classes['dropdown'] + maxDropdownOpenClass}>
                                {maxDropdownItems}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
	</>)
}

export default RentRangeFilter;