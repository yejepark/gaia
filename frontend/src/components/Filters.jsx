import { useFormContext } from 'react-hook-form';

import classes from './Filters.module.css';

import { arrayRange } from '../utilities/methods';
import { useWindowDimensions } from '../utilities/customHooks';

import UpDown from './simple/UpDown';
import SingleChoiceForm from './menu/SingleChoiceForm';
import MultipleChoiceForm from './menu/MultipleChoiceForm';
import RangeFilterForm from './menu/RangeFilterForm';
import SearchContainer from './SearchContainer';

import { productTypeMap, tradeTypeMap } from './newPost/ProductTypeContainer';

const rentValues = [...arrayRange(0, 300, 20), ...arrayRange(350, 600, 50), ...arrayRange(700, 1000, 100)];
const areaValues = [...arrayRange(0, 20, 5), ...arrayRange(30, 100, 10), ...arrayRange(200, 400, 100)];

let renderCount = 0;

function HidableSearchContainer() {
    const { width } = useWindowDimensions();
    return <>
        { width > 900 && <SearchContainer /> }
    </>
}

function Filters() {
    renderCount++;
    // console.log('filters renderCount: ', renderCount);
    return (
        <div className={classes.filters}>
            <HidableSearchContainer />

            <div className={classes['filter-container']}>
                <SingleChoiceForm name='tradeType' choiceMap={tradeTypeMap} btnLabel='거래' />
            </div>

            <div className={classes['filter-container'] + ' ' + classes.removable}>
                <MultipleChoiceForm name='productType' choiceMap={productTypeMap} defaultBtnLabel='용도' notActive={false}/>
            </div>

            <div className={classes['filter-container'] + ' ' + classes.removable}>
                <RangeFilterForm name='rent' unit='만원' values={rentValues} btnName={'월세'} />
            </div>

            <div className={classes['filter-container'] + ' ' + classes.removable}>
                <RangeFilterForm name='area' unit='평' values={areaValues} btnName={'면적'} />
            </div>
            <div className={classes['filter-container']}>
                <button type='button' className={classes.filter + ' alive-btn'} id="all-filters">모든필터 <UpDown /></button>
            </div>
            <div className={classes['filter-container']}>
                <button type='submit' className={classes.filter + ' inverted-alive-btn'}>검색저장</button>
            </div>
        </div>
    )
}

export default Filters;