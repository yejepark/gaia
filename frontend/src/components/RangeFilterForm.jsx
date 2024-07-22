import { useState } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';

import UpDown from './UpDown';
import ApplyButton from './ApplyButton';
import DropDownInputForm from './DropDownInputForm';

import filtersClasses from './Filters.module.css';
import classes from './RangeFilter.module.css';


function RangeFilterForm({ name, unit, values, btnName }) {

    const [dialogOpen, setDialogOpen] = useState(false);

    function btnClickHandler() {
        setDialogOpen((isOpen) => { return !isOpen; });
    }

    const { control } = useFormContext();
    const tempMinValue = useWatch({ control, name: name + 'Min'});
    const tempMaxValue = useWatch({ control, name: name + 'Max'});

    const dialogOpenClass = dialogOpen ? '' : ' hidden';
    const rangeBtnClass = tempMinValue > 0 | tempMaxValue > 0 ? ' active' : '';
  
    const intMinValue = parseInt(tempMinValue);
    const intMaxValue = parseInt(tempMaxValue);
    const minValueEl = intMinValue > 0 ? <span>{tempMinValue}{unit}</span>: '';
    const maxValueEl = intMaxValue > 0 ? <span>{tempMaxValue}{unit}</span>: '';

    const minValues = (intMaxValue > 0) ? values.filter((x) => x<intMaxValue) : values;    
    const maxValues = (intMinValue > 0) ? values.slice(1).filter((x) => x>intMinValue) : values.slice(1);

    // console.log('tempMin', tempMinValue, 'min', minValue, ' ~ ', 'tempMax', tempMaxValue, 'max', maxValue);

    return (<>
        <button type='button' className={filtersClasses.filter + ' alive-btn ' + rangeBtnClass} id="range-button" onClick={btnClickHandler}>
            {btnName}
            {minValueEl}
            {intMinValue > 0 | intMaxValue > 0 ? <i className={filtersClasses.tilde}></i> : ''}
            {maxValueEl}
            <UpDown up={dialogOpen}/>
          </button>

        <div className={'backdrop' + dialogOpenClass} onClick={btnClickHandler} id="range-backdrop"></div>

        <div className={'positional-container'}>
            <div className={ 'dialog' + dialogOpenClass }>
                <div className={classes['range-container']}>

                    <div className={classes['min-header']}>최소</div>
                    <DropDownInputForm name={name + 'Min'} values={minValues}
                        options={{
                            unit, 
                            customClass: classes['min-input-container'], 
                            placeholder:'0',
                        }}
                    />
    
                    <div className={classes.dash}>-</div>

                    <div className={classes['max-header']}>최대</div>
                    <DropDownInputForm name={name + 'Max'} values={maxValues}
                        options={{
                            unit, 
                            customClass: classes['max-input-container'], 
                            placeholder:'제한없음',
                            extraItems: [{key:-1, value: '', text: '제한없음'}]
                        }}
                    />

                </div>
                <ApplyButton clickHandler={btnClickHandler} />
            </div>
        </div>
    </>)
}

export default RangeFilterForm;