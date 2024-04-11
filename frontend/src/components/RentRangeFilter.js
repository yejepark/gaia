import { useState } from 'react';

import UpDown from './UpDown'

import classes from './Filters.module.css';
import { arrayRange } from '../utilities/methods';

const rentValues = [...arrayRange(0, 300, 20), ...arrayRange(350, 600, 50), ...arrayRange(700, 1000, 100)];

function RentRangeFilter({ minRent, setMinRent, maxRent, setMaxRent }) {

	let [dialogOpen, setDialogOpen] = useState(false);
	let [minDropdownOpen, setMinDropdownOpen] = useState(false);
	let [maxDropdownOpen, setMaxDropdownOpen] = useState(false);

	function btnClickHandler() {
        setDialogOpen((isOpen) => {
        	if (dialogOpen) {
        		setMinDropdownOpen(false);
        		setMaxDropdownOpen(false);
        	}
        	return !isOpen; 
     });
    }

	function minInputClickHandler() {
        setMinDropdownOpen((isOpen) => { return !isOpen; });
    }

    function maxInputClickHandler() {
        setMaxDropdownOpen((isOpen) => { return !isOpen; });
    }

   function textClickHandler(event) {
        let textInput = event.currentTarget.querySelector('input');
        if (textInput) { textInput.focus() };
        setMinDropdownOpen((isOpen) => { return !isOpen; });
        event.stopPropagation();
    }

    function textChangeHandler(event) {
        let textInputContainer = event.currentTarget;
        let value = parseInt(textInputContainer.value);
        if (value | value == 0) {
            setMinRent(value);
        }
        event.stopPropagation();
    }

    function dropdownClickHandler(event) {
        let optionEl = event.currentTarget;
        let value = optionEl.getAttribute('value');

        let inputEl = document.getElementById('rent-min-input');
        inputEl.value = value;;

        setMinRent(value);
        event.stopPropagation();
    }

    let dialogOpenClass = dialogOpen ? '' : ' ' + classes.hidden;

    let minRentEl = minRent > 0 ? <span className={classes['rent-min-value']}>{minRent}만</span> : "월세";
    let minDropdownOpenClass = minDropdownOpen ? '' : ' ' + classes.hidden;

    let dropdownItems = rentValues.map((rentValue)=> {
    	return (
	        <div key={rentValue} value={rentValue} onClick={dropdownClickHandler}>
	            <span className={classes['dropdown-item']}>{rentValue}만원</span>
	        </div>
        ); 
   	});

	return (<>
		<button className={classes.filter} id="rent-range-button" onClick={btnClickHandler}>
            {minRentEl}
            <UpDown up={dialogOpen}/>
      	</button>

        <div className={classes.backdrop + dialogOpenClass} onClick={btnClickHandler} id="rent-range-backdrop"></div>

        <div className={classes['positional-container']}>
            <div className={classes.dialog + dialogOpenClass} id="rent-range-dialog">
                <div className={classes['range-container']}>

                    <div className={classes['min-header']}>최소</div>

                    <div className={classes['min-input-container']} onClick={textClickHandler}>
                        
                        <div className={classes['min-input']}>
                            <input type='text' placeholder="0" autocomplete="off" name="minimum" id='rent-min-input' onChange={textChangeHandler}/> 
                            <UpDown up={minDropdownOpen} />
                        </div>

                        <div className={classes.backdrop + minDropdownOpenClass} onClick={textClickHandler} id="rent-dropdown-backdrop"></div>
                        
                        <div className={classes['positional-container']}>
                            <div className={classes['dropdown'] + minDropdownOpenClass}>
                                {dropdownItems}
                            </div>
                        </div>
                    </div>

                    <div className={classes.dash}>-</div>

                    <div className={classes['max-header']}>최대</div>

                    <div className={classes['max-input-container']} onClick={textClickHandler}>
                        <div className={classes['max-input']}>
                            <input type='text' placeholder="제한없음" name="maximum" />
                            <UpDown />
                        </div>
                    </div>
                </div>
            </div>
        </div>
	</>)
}

export default RentRangeFilter;