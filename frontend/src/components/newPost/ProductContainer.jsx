import { useState, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import DropDownInputForm from '../menu/DropDownInputForm';
import ApplyButton from '../simple/ApplyButton';

import { ItemContainer, ValuesToElementsForm, ValuesToDropDownForm, InputWithUnit, onAreaUnitClick, initialDefaultValues } from '../../pages/NewSellPost';
import parentClasses from '../../pages/NewSellPost.module.css';
import classes from './ProductContainer.module.css';

// import BusinessTypes from './business_types.json';

import CommerceTypes from '../business_types.json';

for (const [idx, ] of Object.entries(CommerceTypes)) {
    CommerceTypes[idx]['text'] = '(' + CommerceTypes[idx].category + ') ' + CommerceTypes[idx].value;
}

const LodgingTypes = CommerceTypes.filter(x => x.key.startsWith('I1'));

const checkIfNum = {
    valueAsNumber: true, 
    validate: (v) => {
        return !isNaN(v) || '숫자만 입력 가능합니다.' 
    },
};

const isRequired = {required: '필수 입력 항목입니다.'};

function PriceEl() {
    const tradeType = useWatch({ name: 'tradeType' });

    const options = {...isRequired, ...checkIfNum};

    let inputPriceValues = [];
    if (tradeType === 'sale') {
        inputPriceValues = [
            { subtitle: '매매가', required: true }, { name: 'price.sale', options }, {},{},
            { subtitle: '기보증금' }, { name: 'price.deposit', options: checkIfNum },
            { subtitle: '기월세금' }, { name: 'price.monthlyRent', options: checkIfNum },
        ];
    } else {
        inputPriceValues = [
            { subtitle: '보증금', required: true }, { name: 'price.deposit', options },
            { subtitle: '월세가', required: true }, { name: 'price.monthlyRent', options },
        ];
    }

    return (
        <ItemContainer title='가격 정보'>
            <div className={parentClasses['input-subgrid']}>
                <ValuesToElementsForm values={inputPriceValues} />
            </div>
        </ItemContainer>    
    );
}

function PremiumEl() {
    const { register, setValue } = useFormContext();

    const [ pOp, pFac, pLoc, pExist ] = useWatch({ 
        name: [ 'premium.operation', 'premium.facility', 'premium.location', 'premium.exist' ]
    });
    const pTot = pOp + pFac + pLoc;
    // console.log(pOp, pFac, pLoc, pTot);

    const options = checkIfNum;
    const inputPremiumValues = [
        { subtitle: '영업권리금' }, { name: 'premium.operation', options },
        { subtitle: '시설권리금' }, { name: 'premium.facility', options },
        { subtitle: '바닥권리금' }, { name: 'premium.location', options },
        { subtitle: '권리금 총합' }, { unit: '만원', calculated: pTot }
    ];

    useEffect(() => {
        if (!pExist) {
            setValue('premium.operation', initialDefaultValues.premium.operation);
            setValue('premium.facility', initialDefaultValues.premium.facility);
            setValue('premium.location', initialDefaultValues.premium.location);
            setValue('premium.negotiable', initialDefaultValues.premium.negotiable);
        }
    }, [pExist]);

    return (
        <ItemContainer title='권리금 정보'>
            <div className={parentClasses['input-subflex-col']}>
                <div className={parentClasses['input-subflex-row']}>
                    <label className={parentClasses['input-checkbox']}>
                        <input type="checkbox" {...register('premium.exist')} />
                        <div>권리금 있음</div>
                    </label>
                    {pExist &&
                        <label className={parentClasses['input-checkbox']}>
                            <input type="checkbox" {...register('premium.negotiable')} />
                            <div>협의 가능</div>
                        </label>
                    }
                </div>
                {pExist && 
                    <div className={parentClasses['input-subgrid']}>
                        <ValuesToElementsForm values={inputPremiumValues} />
                    </div>
                }
            </div>
        </ItemContainer>
    );
}


function UpkeepEl() {

    const inputUpkeepValues = [
        { subtitle: '관리비' }, { name: 'upkeep.cost', checkIfNum }
    ];

    return (
        <ItemContainer title='관리비 정보'>
            <div className={parentClasses['input-subgrid']}>
                <ValuesToElementsForm values={inputUpkeepValues} />
            </div>
        </ItemContainer>    
    );
}


function AcquireEl() {
    const { register, setValue } = useFormContext();

    const [ revenue, rent, cogs, wage, utilityCost, manageCost, profit, incomeExpose, operating ] = useWatch({
        name: [ 
            'income.revenue', 'income.rent', 'income.cogs', 'income.wage', 
            'income.utilityCost', 'upkeep.cost', 'income.profit',
            'income.expose', 'income.operating'
        ]
    });
    const etc = revenue - rent - cogs - wage - utilityCost - manageCost - profit;

    const inputAcquireValues = [
        { subtitle: '월 매출' }, { name: 'income.revenue', options: checkIfNum },
        { subtitle: '기월세금' }, { name: 'income.rent', options: checkIfNum },
        { subtitle: '재료비' }, { name: 'income.cogs', options: checkIfNum },
        { subtitle: '인건비' }, { name: 'income.wage', options: checkIfNum },
        { subtitle: '공과금' }, { name: 'income.utilityCost', options: checkIfNum },
        { subtitle: '기타비용' }, { unit: '만원', calculated: etc },
        { subtitle: '월 순수익' }, { name: 'income.profit', options: checkIfNum },
    ];

    useEffect(() => {
        if (operating === 'empty') {
            setValue('income.expose', initialDefaultValues.income.expose);
            setValue('income.mustAcquire', initialDefaultValues.income.mustAcquire);
        }
    }, [operating]);

    return (
        <ItemContainer title='영업 정보'>
            <div className={parentClasses['input-subflex-col']}>

                <div className={parentClasses['input-subflex-row']}>
                    <label className={parentClasses['input-checkbox']}>
                        <input type="radio" value='operating' {...register('income.operating')} />
                        <div>영업중</div>
                    </label>

                    <label className={parentClasses['input-checkbox']}>
                        <input type="radio" value='empty' {...register('income.operating')} />
                        <div>공실</div>
                    </label>
                    {operating === 'operating' && <>
                        <label className={parentClasses['input-checkbox']}>
                            <input type="checkbox" {...register('income.expose')} />
                            <div>순수익 공개</div>
                        </label>
                        <label className={parentClasses['input-checkbox']}>
                            <input type="checkbox" {...register('income.mustAcquire')} />
                            <div>영업 양도인수 필수</div>
                        </label>
                    </>}
                </div>
                {incomeExpose &&
                    <div className={parentClasses['input-subgrid']}>
                        <ValuesToElementsForm values={inputAcquireValues} />
                    </div>
                }
            </div>
    
        </ItemContainer>
    );
}


function LoanEl() {
    const { register, setValue } = useFormContext();

    const loanExist = useWatch({ name: 'loan.exist' });

    useEffect(()=>{
        if (!loanExist) {
            setValue('loan.pct', initialDefaultValues.loan.pct);
            setValue('loan.expose', initialDefaultValues.loan.expose);
        }
    }, [loanExist]);

    return (
        <ItemContainer title='융자 정보'>
            <div className={parentClasses['input-subflex-col']}>
                <div className={parentClasses['input-subflex-row']}>
                        <label className={parentClasses['input-checkbox']}>
                            <input type="checkbox" {...register('loan.exist')} />
                            <div>융자 있음</div>
                        </label>
                        {loanExist &&
                            <label className={parentClasses['input-checkbox']}>
                                <input type="checkbox" {...register('loan.expose')} />
                                <div>융자 공개</div>
                            </label>
                        }
                </div>
                {loanExist &&
                    <div className={parentClasses['input-subflex-row']}>
                        <ItemContainer title="시세대비 융자비율" isSubEl={true}>
                            <div style={{width: '12rem'}}>
                                <InputWithUnit name='loan.pct' options={{
                                    ...checkIfNum,
                                    min: {value: 0, message: '0 보다 작을 수 없습니다.'},
                                    max: {value: 100, message: '100 보다 클 수 없습니다.'},
                                }}/>
                            </div>
                        </ItemContainer>
                    </div>
                }
            </div>
        </ItemContainer>
    );
}


function MoveInDayEl() {
    const { register } = useFormContext();

    const curDate = new Date();
    const thisYear = curDate.getFullYear();

    const yearValues = Array.from({ length: 10 }, (x, i) => thisYear + i);
    const monthValues = Array.from({ length: 12 }, (x, i) => i + 1);
    const dayValues = Array.from({ length: 31 }, (x, i) => i + 1);

    const items = [{
            name: 'moveInDay.Y',
            values: yearValues,
            inputClass: parentClasses['year-input']
        }, { unit: '년' },
        {
            name: 'moveInDay.M',
            values: monthValues,
            inputClass: parentClasses['month-input']
        }, { unit: '월' },
        {
            name: 'moveInDay.D',
            values: dayValues,
            inputClass: parentClasses['day-input']
        }, { unit: '일' }
    ];
    return (
        <ItemContainer title='입주가능일' required={true}>
            <div className={parentClasses['input-subflex-date']}>
                {items.map((item, idx) => {
                    if (item.name) {
                        return (
                            <DropDownInputForm key={idx} name={item.name}
                                values={item.values}
                                options={{
                                    customClass: item.inputClass,
                                    readOnly: true
                                }}
                            />
                        );                        
                    } else if (item.unit) {
                        return <div key={idx} className={parentClasses.unit}>{item.unit}</div>;
                    }
                    return null;
                })}
               <label className={parentClasses['input-checkbox']}>
                    <input type="checkbox" {...register('moveInDay.negotiable')} />
                    <div>협의 가능</div>
                </label>
            </div>
        </ItemContainer>
    );
}

function AreaEl() {
    const { setValue, getValues } = useFormContext();

    const options = {...checkIfNum, ...isRequired};

    const useArea = useWatch({ name: 'prodArea.use' });

    const inputAreaValues = [
        { subtitle: '전용면적' },
        { name: 'prodArea.use', options,
            onUnitClick: (e) => onAreaUnitClick(e, 'prodArea.use', setValue, getValues) },
        { subtitle: '계약면적' },
        { name: 'prodArea.contract', options: {...options, min: {value: useArea, message: '전용면적보다 작을 수 없습니다.'}},
            onUnitClick: (e) => onAreaUnitClick(e, 'prodArea.contract', setValue, getValues) },
    ];


    return (
        <ItemContainer title='면적 정보' required={true}>
            <div className={parentClasses['input-subgrid']}>
                <ValuesToElementsForm values={inputAreaValues} />
            </div>
        </ItemContainer>
    );
}

function DirectionEl() {
    const { register, setValue, formState: { errors } } = useFormContext();

    const chosenDirection = useWatch({ name: 'direction'});

    const [dropdownOpen, setDropdownOpen] = useState(false);

    function btnClickHandler(event) {
        setDropdownOpen((isOpen) => { return !isOpen; });
    }

    function directionClickHandler(event) {
        const optionEl = event.currentTarget;
        const v = optionEl.getAttribute('value');
        setValue('direction', v);
    }

    const dropdownOpenClass = dropdownOpen ? '' : ' hidden';

    const directions = [ '북서', '북', '북동', '서', '', '동', '남서', '남', '남동' ];
    const buttons = directions.map((item, idx) => 
        <button
            key={idx} type='button'
            className={'alive-btn' + (item === chosenDirection ? ' active' : '')}
            value={item}
            onClick={directionClickHandler}> {item} </button>
    );

    const btnLabel = chosenDirection ? chosenDirection + '향' : '방향 선택';

    const isAgent = useWatch({ name: 'isAgent' });
    const options = isAgent ? {required: '필수 선택 항목입니다.'} : {};
    let error = errors['direction'];

    return (
        <ItemContainer title='방향 정보' required={isAgent}>
            <ItemContainer title='주된 출입구 기준' isSubEl={true}>
                <input type='text' {...register('direction', options)} style={{height: '0', width: '0', border: 'none'}}/>
                <button type="button" 
                    className={classes['direction-opener'] + ' alive-btn'}
                    onClick={btnClickHandler}>{btnLabel}</button>
            
                <div className={'backdrop' + dropdownOpenClass} onClick={btnClickHandler}></div>
                
                <div className={'positional-container'}>
                    <div className={classes['direction-selector-container'] + dropdownOpenClass} >
                        <div className={classes['direction-selector']}>
                            {buttons}
                        </div>
                        <ApplyButton clickHandler={btnClickHandler} />
                    </div>
                </div>
                {!chosenDirection && error && <span className={'error-message'}> {error.message} </span>}
            </ItemContainer>
        </ItemContainer>
    );
}


function ParkingEl() {
    const { register, setValue } = useFormContext();

    const parkingAvailable = useWatch({ name: 'parking.available' });

    useEffect(() => {
        if (!parkingAvailable) {
            setValue('parking.count', initialDefaultValues.parking.count);
        }
    }, [parkingAvailable]);
    
    const isAgent = useWatch({ name: 'isAgent' });
    return (
        <ItemContainer title="주차 정보" required={isAgent}>
            <div className={parentClasses['input-subflex-col']}>
                <div className={parentClasses['subflex-row']}>
                    <label className={parentClasses['input-checkbox']}>
                        <input type="checkbox" {...register('parking.available')} />
                        <div>주차 가능</div>
                    </label>
                </div>

                {parkingAvailable &&
                    <div className={parentClasses['input-subflex-row']}>
                        <ItemContainer title='사용가능 주차대수' isSubEl={true}>
                            <div style={{width: '12rem'}}>
                                <InputWithUnit name={'parking.count'} options={checkIfNum} />
                            </div>
                        </ItemContainer>
                    </div>
                }
            </div>
        </ItemContainer>
    );
}


function BusinessTypeEl() {
    // console.log('in BusinessTypeEl')

    const { register } = useFormContext();

    const productType = useWatch({ name: 'productType' });

    const values = productType === 'lodging' ? LodgingTypes : CommerceTypes;
    
    const [currentValues, setCurrentValues] = useState(values);
    const [recommendValues, setRecommendValues] = useState(values);

    const currentTypes = useWatch({ name: 'businessType.current' });
    const currentTypeList = currentTypes.split(',');
    const currentType = currentTypeList[currentTypeList.length - 1];

    const recommendTypes = useWatch({ name: 'businessType.recommend' });
    const recommendTypeList = recommendTypes.split(',');
    const recommendType = recommendTypeList[recommendTypeList.length - 1];

    function addCustomClass(item, target, customClass) {
        if (!item.text.includes(target.trim())) {
            return {...item, name: item.value, customClass: customClass};
        } else {
            return {...item, name: item.value};
        }
    }

    useEffect(() => {
        let timer;
        timer = setTimeout(() => {
            setCurrentValues( values.map((item) => addCustomClass(item, currentType, 'not-show')) );
        }, 250);
        return () => { clearTimeout(timer); };
    }, [currentType, productType]);

    useEffect(() => {
        let timer;
        timer = setTimeout(() => {
            setRecommendValues( values.map((item) => addCustomClass(item, recommendType, 'not-show')) );
        }, 250);
        return () => { clearTimeout(timer); };
    }, [recommendType, productType]);

    return (
        <ItemContainer title='업종 정보'>
            <div className={parentClasses['input-long-subgrid']}>
                <ItemContainer title='상호명' isSubEl={true}>
                    <input {...register('businessType.storeName')}
                        type='text' 
                        className={parentClasses['input-value'] + ' focusable'}
                        placeholder='직접입력'
                    />
                </ItemContainer>
                <ValuesToDropDownForm title='현재 업종' values={currentValues} isSubEl={true} name='businessType.current'
                    options={{ 
                        mode: 'append', 
                        placeholder: '직접입력 또는 선택 (쉼표로 구분하여 복수 선택 가능).' 
                    }} 
                />
                <ValuesToDropDownForm title='추천 업종' values={recommendValues} isSubEl={true} name='businessType.recommend' 
                    options={{ 
                        mode: 'append', 
                        placeholder: '직접입력 또는 선택 (쉼표로 구분하여 복수 선택 가능).' 
                    }}
                />
            </div>
        </ItemContainer>
    );
}

function UsageTypeEl() {
    const { register } = useFormContext();

    return (
        <ItemContainer title='용도 정보'>
            <div className={parentClasses['input-long-subgrid']}>
                <ItemContainer title='현재 용도' isSubEl={true}>
                    <input {...register('usageType.current')} 
                        type='text' 
                        className={parentClasses['input-value'] + ' focusable'}
                        placeholder='직접입력'
                    />
                </ItemContainer>
                <ItemContainer title='추천 용도' isSubEl={true}>
                    <input {...register('usageType.recommend')}
                        type='text'
                        className={parentClasses['input-value'] + ' focusable'}
                        placeholder='직접입력'
                    />
                </ItemContainer>
            </div>
        </ItemContainer>
    );
}

function FacilityEl() {

    const heatingMethodValues = ['개별난방', '중앙난방', '지역난방'];
    const coolingMethodValues = ['벽걸이에어컨', '스탠드에어컨', '천장에어컨'];
    const heatingFuelValues = ['도시가스', '기름', '전기', '심야전기', '태양열', 'LPG', '열병합', '지열'];

    const productType = useWatch({ name: 'productType' });

    return (
        <ItemContainer title='시설 정보'>
            <div className={parentClasses['input-subgrid']}>
                <ValuesToDropDownForm title='난방 방식' values={heatingMethodValues} isSubEl={true} name='facility.heatingMethod' />
                <ValuesToDropDownForm title='냉방 방식' values={coolingMethodValues} isSubEl={true} name='facility.coolingMethod' />
                <ValuesToDropDownForm title='난방 연료' values={heatingFuelValues} isSubEl={true} name='facility.heatingFuel' />
                {(productType === 'industrial' || productType === 'intIndCenter') &&
                    <ItemContainer title="사용 전력" isSubEl={true}>
                        <InputWithUnit name='facility.electricCap' options={{
                            ...checkIfNum,
                            min: {value: 0, message: '0 보다 작을 수 없습니다.'},
                        }}/>
                    </ItemContainer>
                }
            </div>
        </ItemContainer>
    )
}

function ShortLeaseEl() {
    const { register } = useFormContext();

    const leaseLengthValues = Array.from({ length: 23 }, (x, i) => i + 1);
    
    const isAgent = useWatch({ name: 'isAgent' });
    const negotiable = useWatch({ name: 'shortLease.negotiable' });
    const leaseLength = useWatch({ name: 'shortLease.length' });
    return (
        <ItemContainer title='단기임대기간' required={isAgent}>
            <div className={parentClasses['input-subflex-date']}>
                <DropDownInputForm name='shortLease.length' 
                    values={leaseLengthValues} 
                    options={{
                        customClass: parentClasses['month-input'],
                        readOnly: true
                    }}
                />
                <div className={parentClasses.unit}>개월</div>
            
                <label className={parentClasses['input-checkbox']}>
                    <input type="checkbox" {...register('shortLease.negotiable')} />
                    <div>협의 가능</div>
                </label>

                {negotiable && <>
                    <label className={parentClasses['input-checkbox']}>
                        <input type="radio" value='more' {...register('shortLease.moreOrLess')} />
                        <div>{leaseLength}개월 이상</div>
                    </label>

                    <label className={parentClasses['input-checkbox']}>
                        <input type="radio" value='less' {...register('shortLease.moreOrLess')} />
                        <div>{leaseLength}개월 이내</div>
                    </label>
                </>}
            </div>
        </ItemContainer>
    )
}

function ProductContainer({ addressState }) {
    console.log('in ProductContainer');

    const tradeType = useWatch({ name: 'tradeType' });
    const productType = useWatch({ name: 'productType' });
    const entireBuilding = useWatch({ name: 'floors.entireBuilding' });

    return (
        <div className={parentClasses["input-grid"] + ' ' + parentClasses['hline']}>
            <PriceEl />
            <UpkeepEl />
            {(productType === 'commercial' || productType === 'lodging') && <PremiumEl />}
        	{tradeType !== 'sale' && <AcquireEl />}
            <LoanEl />
            <MoveInDayEl />
            {tradeType === 'shortLease' && <ShortLeaseEl />}
            {!entireBuilding && <AreaEl />}
            {(productType === 'commercial' || productType === 'lodging') && <BusinessTypeEl />}
            {!(productType === 'commercial' || productType === 'lodging') && <UsageTypeEl />}
            <DirectionEl />
            {!entireBuilding && <ParkingEl />}
            <FacilityEl />
        </div>
    );
}

export default ProductContainer;
