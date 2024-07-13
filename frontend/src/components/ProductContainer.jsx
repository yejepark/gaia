import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import SingleChoiceForm from './SingleChoiceForm';
import DropDownInputForm from './DropDownInputForm';
import ApplyButton from './ApplyButton';

import { ItemContainer, ValuesToElementsForm } from '../pages/NewSellPost';
import parentClasses from '../pages/NewSellPost.module.css';
import classes from './ProductContainer.module.css';

const checkIfNum = {
    valueAsNumber: true, 
    validate: (v) => {
        return !isNaN(v) || '숫자만 입력 가능합니다.' 
    },
};

function PriceEl() {

    let inputPriceValues = [
        { subtitle: '매매가' }, { unit: '만원', name: 'price.sale', options: checkIfNum }, {}, {},
        { subtitle: '보증금' }, { unit: '만원', name: 'price.deposit', options: checkIfNum },
        { subtitle: '월세' }, { unit: '만원', name: 'price.monthlyRent', options: checkIfNum },
    ];

    return (
        <ItemContainer title='가격 정보'>
            <div className={parentClasses['input-subgrid']}>
                <ValuesToElementsForm values={inputPriceValues} />
            </div>
        </ItemContainer>
    );
}

function PremiumEl() {
    const { register, control } = useFormContext();

    let [ pOp, pFac, pLoc, pExist ] = useWatch({ 
        control, 
        name: [ 'premium.operation', 'premium.facility', 'premium.location', 'premium.exist' ]
    });
    let pTot = pOp + pFac + pLoc;
    // console.log(pOp, pFac, pLoc, pTot);

    let inputPremiumValues = [
        { subtitle: '영업권리금' }, { name: 'premium.operation', unit: '만원', options: checkIfNum },
        { subtitle: '시설권리금' }, { name: 'premium.facility', unit: '만원', options: checkIfNum },
        { subtitle: '바닥권리금' }, { name: 'premium.location', unit: '만원', options: checkIfNum },
        { subtitle: '권리금 총합' }, { unit: '만원', calculated: pTot }
    ];

    return (
        <ItemContainer title='권리금 정보'>
            <div className={'subflex-col'}>
                <div className={'subflex-row'}>
                    <label className={'input-checkbox'}>
                        <input type="checkbox" {...register('premium.exist')} />
                        <div>권리금 있음</div>
                    </label>
                    {pExist &&
                        <label className={'input-checkbox'}>
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


function AcquireEl() {
    const { register, control } = useFormContext();

    let [ revenue, rent, cogs, wage, utilityCost, manageCost, profit, incomeExpose ] = useWatch({
        control, 
        name: [ 
            'income.revenue', 'income.rent', 'income.cogs', 'income.wage', 
            'income.utilityCost', 'income.manageCost', 'income.profit',
            'income.expose' 
        ]
    });
    let etc = revenue - rent - cogs - wage - utilityCost - manageCost - profit;

    let inputAcquireValues = [
        { subtitle: '월 매출' }, { name: 'income.revenue', unit: '만원', options: checkIfNum },
        { subtitle: '월세' }, { name: 'income.rent', unit: '만원', options: checkIfNum },
        { subtitle: '재료비' }, { name: 'income.cogs', unit: '만원', options: checkIfNum },
        { subtitle: '인건비' }, { name: 'income.wage', unit: '만원', options: checkIfNum },
        { subtitle: '공과금' }, { name: 'income.utilityCost', unit: '만원', options: checkIfNum },
        { subtitle: '관리비' }, { name: 'income.manageCost', unit: '만원', options: checkIfNum },
        { subtitle: '기타비용' }, { unit: '만원', calculated: etc },
        { subtitle: '월 순수익' }, { name: 'income.profit', unit: '만원', options: checkIfNum },
    ];

    return (
        <ItemContainer title='영업 정보'>
            <div className={'subflex-col'}>
                <div className={'subflex-row'}>
                    <label className={'input-checkbox'}>
                        <input type="checkbox" {...register('income.expose')} />
                        <div>순수익 공개</div>
                    </label>
                    <label className={'input-checkbox'}>
                        <input type="checkbox" {...register('income.mustAquire')} />
                        <div>영업 양도인수 필수</div>
                    </label>
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
    const { register, control, formState: { errors } } = useFormContext();

    let [ loanExist, loanExpose ] = useWatch({
        control, 
        name: [ 'loan.exist', 'loan.expose' ]
    });
    
    let error = errors['loan'] && errors['loan']['pct'] ? errors['loan']['pct'] : null;

    return (
        <ItemContainer title='융자 정보'>
            <div className={'subflex-col'}>
                <div className={'subflex-row'}>
                        <label className={'input-checkbox'}>
                            <input type="checkbox" {...register('loan.exist')} />
                            <div>융자 있음</div>
                        </label>
                        {loanExist &&
                            <label className={'input-checkbox'}>
                                <input type="checkbox" {...register('loan.expose')} />
                                <div>융자 공개</div>
                            </label>
                        }
                </div>
                {loanExpose &&
                    <div className={parentClasses['input-container']}>
                        <div className={parentClasses['input-subtitle']}>시세대비 융자비율</div>
                        <div className={'subflex-col-inner'}>
                            <div className={parentClasses['input-with-unit']}>
                                <input type='text'
                                    className={parentClasses["input-value"] + ' focusable'} 
                                    autoComplete='off'
                                    {...register('loan.pct', {
                                         ...checkIfNum,
                                         min: {value: 0, message: '0 보다 작을 수 없습니다.'},
                                         max: {value: 100, message: '100 보다 클 수 없습니다.'},
                                    })} 
                                />
                                <div className={parentClasses.unit}>%</div>
                            </div>
                            {error && <span className={'error-message'}> {error.message} </span>}
                        </div>
                    </div>
                }
            </div>
        </ItemContainer>
    );
}


function MoveInDayEl() {
    const { register, control } = useFormContext();

    let curDate = new Date();
    let thisYear = curDate.getFullYear();

    let yearValues = Array.from({ length: 10 }, (x, i) => thisYear + i);
    let monthValues = Array.from({ length: 12 }, (x, i) => i + 1);
    let dayValues = Array.from({ length: 31 }, (x, i) => i + 1);

    let items = [{
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
        <ItemContainer title='입주가능일'>
            <div className={parentClasses['input-subflex']}>
                {items.map((item, idx) => {
                    if (item.name) {
                        return (
                            <DropDownInputForm key={idx} name={item.name}
                                values={item.values}
                                options={{
                                    placeholder: "",
                                    custumClass: item.inputClass
                                }}
                                readOnly={true}
                            />
                        );                        
                    } else if (item.unit) {
                        return <div key={idx} className={parentClasses.unit}>{item.unit}</div>;
                    }
                    return null;
                })}
               <label className={'input-checkbox'}>
                    <input type="checkbox" {...register('moveInDay.negotiable')} />
                    <div>협의 가능</div>
                </label>
            </div>
        </ItemContainer>
    );
}

function AreaEl() {

    let inputAreaValues = [
        { subtitle: '전용면적' }, { unit: 'm2', name: 'prodArea.use', options: checkIfNum },
        { subtitle: '계약면적' }, { unit: 'm2', name: 'prodArea.contract', options: checkIfNum },
    ];

    return (
        <ItemContainer title='면적 정보'>
            <div className={parentClasses['input-subgrid']}>
                <ValuesToElementsForm values={inputAreaValues} />
            </div>
        </ItemContainer>
    );
}

function DirectionEl() {
    const { register, setValue, control } = useFormContext();


    let [dropdownOpen, setDropdownOpen] = useState(false);

    function btnClickHandler(event) {
        setDropdownOpen((isOpen) => { return !isOpen; });
    }

    function directionClickHandler(event) {
        let optionEl = event.currentTarget;
        let v = optionEl.getAttribute('value');
        setValue('direction', v);
    }

    let chosenDirection = useWatch({control, name: 'direction'});

    let dropdownOpenClass = dropdownOpen ? '' : ' hidden';

    let directions = [ '북서', '북', '북동', '서', '', '동', '남서', '남', '남동' ];
    let buttons = directions.map((item, idx) => {
        if (item.length > 0) {
            return <button
                        key={idx} 
                        type='button' 
                        className={'alive-btn' + (item === chosenDirection ? ' active' : '')}
                        value={item}
                        onClick={directionClickHandler}
                    >
                        {item}
                    </button>
        } else {
            return <div key={idx}></div>
        }
    })

    return (
        <ItemContainer title='방향 정보'>
            <ItemContainer title='주된 출입구 기준' isSubEl={true}>
                <div>
                    <input type='hidden' {...register('direction')} />
                    <button type="button" 
                        className={classes['direction-opener'] + ' ' + 'alive-btn'}
                        onClick={btnClickHandler}>방향 선택</button>
                
                    <div className={'backdrop' + dropdownOpenClass} onClick={btnClickHandler}></div>
                    
                    <div className={'positional-container'}>
                        <div className={classes['direction-selector-container'] + dropdownOpenClass} >
                            <div className={classes['direction-selector']}>
                                {buttons}
                            </div>
                            <ApplyButton clickHandler={btnClickHandler} />
                        </div>
                    </div>
                </div>
            </ItemContainer>
        </ItemContainer>
    );
}

function ProductContainer({ addressState }) {

    return (
        <div className={parentClasses["input-grid"]}>
            <PriceEl />
            <PremiumEl />
        	<AcquireEl />
            <LoanEl />
            <MoveInDayEl />
            <AreaEl />
            <DirectionEl />

        	<div className={parentClasses["input-title"]}>주차가능여부</div> 
        	<div>가능, 불가능</div>
        	<div className={parentClasses["input-title"]}>현재업종 (현재용도)</div> 
        	<div></div>
        	<div className={parentClasses["input-title"]}>추천업종 (추천용도)</div> 
        	<div></div>
        	<div className={parentClasses["input-title"]}>매물 특징</div> 
        	<div>40글자</div>
        	<div className={parentClasses["input-title"]}>매물 설명</div> 
        	<div>1000글자</div>
        </div>
    );
}

export default ProductContainer;
