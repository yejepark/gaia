import { useState, memo } from 'react';

import UpDown from './UpDown';
import ApplyButton from './ApplyButton';
import DropDownInput from './DropDownInput';

import classes from './Filters.module.css';


function RangeFilter({ minValue, setMinValue, maxValue, setMaxValue, unit, values, btnName }) {

	let [dialogOpen, setDialogOpen] = useState(false);
    let [tempMinValue, setTempMinValue] = useState(minValue);
    let [tempMaxValue, setTempMaxValue] = useState(maxValue);

	function btnClickHandler() {
        setMinValue(String(tempMinValue));
        setMaxValue(String(tempMaxValue));
        setDialogOpen((isOpen) => { return !isOpen; });
    }

    let dialogOpenClass = dialogOpen ? '' : ' ' + classes.hidden;
    let rangeBtnClass = tempMinValue > 0 | tempMaxValue > 0 ? ' ' + classes.active : '';
  
    let intMinValue = parseInt(tempMinValue);
    let intMaxValue = parseInt(tempMaxValue);
    let minValueEl = intMinValue > 0 ? <span className={classes['min-value']}>{tempMinValue}{unit}</span>: '';
    let maxValueEl = intMaxValue > 0 ? <span className={classes['max-value']}>{tempMaxValue}{unit}</span>: '';

    let minValues = (intMaxValue > 0) ? values.filter((x) => x<intMaxValue) : values;    
    let maxValues = (intMinValue > 0) ? values.slice(1).filter((x) => x>intMinValue) : values.slice(1);

    // console.log('tempMin', tempMinValue, 'min', minValue, ' ~ ', 'tempMax', tempMaxValue, 'max', maxValue);

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
                    <DropDownInput
                        localValue={tempMinValue} setLocalValue={setTempMinValue} 
                        values={minValues} 
                        options={{
                            unit, 
                            custumClass: classes['min-input-container'], 
                            placeholder:'0',
                            validator: (v) => parseInt(v) >= 0,
                            transformer: (v) => String(parseInt(v))
                        }}
                    />

                    <div className={classes.dash}>-</div>

                    <div className={classes['max-header']}>최대</div>
                    <DropDownInput
                        localValue={tempMaxValue} setLocalValue={setTempMaxValue} 
                        values={maxValues} 
                        options={{
                            unit, 
                            custumClass: classes['max-input-container'], 
                            placeholder:'제한없음',
                            validator: (v) => parseInt(v) >= 0,
                            transformer: (v) => String(parseInt(v)),
                            extraItems: [{key:-1, value: '', text: '제한없음'}]
                        }}
                    />

                </div>
                <ApplyButton clickHandler={btnClickHandler} />
            </div>
        </div>
	</>)
}

export default memo(RangeFilter);