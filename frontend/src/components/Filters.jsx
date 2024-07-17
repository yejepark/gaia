import { useEffect, useState } from 'react';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';

import classes from './Filters.module.css';

import { arrayRange } from '../utilities/methods';

import UpDown from './UpDown';
import SingleChoiceForm from './SingleChoiceForm';
import MultipleChoiceForm from './MultipleChoiceForm';
import RangeFilterForm from './RangeFilterForm';

const tradeTypeMap = {
    sell: '매매',
    jeonse: '전세',
    lease: '월세',
    shortLease: '단기임대'
}

const spaceUseMap = {
    office: '사무실',
    coworking: '공유오피스',
    industrial: '산업용',
    retail: '소매업',
    restaurant: '식당',
    medical: '의료업',
    land: '토지'
};

const rentValues = [...arrayRange(0, 300, 20), ...arrayRange(350, 600, 50), ...arrayRange(700, 1000, 100)];
const areaValues = [...arrayRange(0, 20, 5), ...arrayRange(30, 100, 10), ...arrayRange(200, 400, 100)];

let renderCount = 0;

function Filters() {

    const methods = useForm({ defaultValues: {
        tradeType: 'lease',
        usage: '',
        rentMin: '0', rentMax: '',
        areaMin: '0', areaMax: '',
    } });
    const { register, watch, handleSubmit, getValues, setValue, reset, formState: { errors }, } = methods;

    const onSubmit = (data) => {
        console.log('(in onSubmit) data: ', data);
    }

    renderCount++;
    console.log(renderCount);
    return (
        <FormProvider {...methods}>
            <form className={classes.filters} onSubmit={handleSubmit(onSubmit)}>
                <div className={classes['search-container'] + ' focusable'}>
                    <input type="search" placeholder="지역을 입력해 주세요" name="region-search"/>
                </div>

                <div className={classes['filter-container']}>
                    <SingleChoiceForm name='tradeType' choiceMap={tradeTypeMap} btnLabel='거래' />
                </div>

                <div className={classes['filter-container']}>
                    <MultipleChoiceForm name='usage' choiceMap={spaceUseMap} defaultBtnLabel='용도' fitContent={true} notActive={false}/>
                </div>

                <div className={classes['filter-container']}>
                    <RangeFilterForm name='rent' unit='만원' values={rentValues} btnName={'월세'} />
                </div>

                <div className={classes['filter-container']}>
                    <RangeFilterForm name='area' unit='평' values={areaValues} btnName={'면적'} />
                </div>
                {/*<div className={classes['filter-container']}>
                    <button type='button' className={classes.filter + ' alive-btn'} id="all-filters">모든필터 <UpDown /></button>
                </div>*/}
                <div className={classes['filter-container']}>
                    <button type='button' className={classes.filter + ' inverted-alive-btn'}>검색저장</button>
                </div>
                <div className={classes['filter-container']}>
                    <button type='submit' className={classes.filter + ' inverted-alive-btn'}>테스트</button>
                </div>
            </form>
        </FormProvider>
    )
}

export default Filters;