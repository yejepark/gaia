import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import SingleChoiceForm from './SingleChoiceForm';
import DropDownInputForm from './DropDownInputForm';

import { ItemContainer, ValuesToElementsForm } from '../pages/NewSellPost';
import parentClasses from '../pages/NewSellPost.module.css';


function NumberInput({ title, name, unit }) {
    let savedNum = sessionStorage.getItem(name);
    let [num, setNum] = useState(savedNum ? savedNum : 0);

    function textChangeHandler(event) {
        let newText = event.target.value
        let newNum = parseInt(newText);
        console.log(newText, newNum)

        if (!newNum || newText.length === 0) {
            setNum('');
            sessionStorage.setItem(name, '');
        }

        if (newNum >= 0) {
            setNum(newNum);
            sessionStorage.setItem(name, newNum);
        }
    }

    return (
        <ItemContainer title={title}>
        	<div className={parentClasses['input-subcontainer'] + ' ' + parentClasses['input-with-unit']}>
				<input type='text' name={name} value={num} onChange={textChangeHandler} autoComplete='off' className='focusable'/>
				<div className={parentClasses.unit}>{unit}</div>
			</div>
		</ItemContainer>
    );
}


function PriceEl() {
    let inputPriceValues = [
        { subtitle: '매매가' }, { unit: '만원', name: 'tradePrice' }, {}, {},
        { subtitle: '보증금' }, { unit: '만원', name: 'deposit' },
        { subtitle: '월세' }, { unit: '만원', name: 'monthlyRent' },
    ];

    return (
        <ItemContainer title='금액 정보'>
            <div className={parentClasses['input-subgrid']}>
                <ValuesToElementsForm values={inputPriceValues} />
            </div>
        </ItemContainer>
    );
}

function PremiumEl() {
    const { register } = useFormContext();

    let premiumMustMap = { noPremium: '무권리', negotiable: '권리금 협의 가능', must: '권리금 협의 불가능' };

    let inputPremiumValues = [
        { subtitle: ''}
    ];


    return (
        <ItemContainer title='권리금'>
            <div className={parentClasses['input-inner-grid']}>
                <ItemContainer title='권리금 있음' subEl={true}>
                    <label>
                        <input type="checkbox" {...register('premiumExist')} />
                        권리금 있음
                    </label>
                </ItemContainer>
                <ItemContainer title='권리금 총합' subEl={true}>
                    만원
                </ItemContainer>
                <ItemContainer title='바닥 권리금' subEl={true}>
                    만원
                </ItemContainer>
                <ItemContainer title='영업 권리금' subEl={true}>
                    만원
                </ItemContainer>
                <ItemContainer title='시설 권리금' subEl={true}>
                    만원
                </ItemContainer>
            </div>
        </ItemContainer>
    );
}

function TransferEl() {
    let transferMustMap = { noTransfer : '양도인수 불필요', transfer: '양도인수 필수' };

    let inputPremiumValues = [
        { subtitle: ''}
    ];

    return (
        <ItemContainer title='양도인수'>
            <div className={parentClasses['input-inner-grid']}>
                <ItemContainer title='양도인수 여부' subEl={true}>
                    <SingleChoiceForm name='transferMust' choiceMap={transferMustMap} btnLabel='선택하기' />
                </ItemContainer>
                <ItemContainer title='매출액' subEl={true}>
                    만원
                </ItemContainer>
                <ItemContainer title='비용' subEl={true}>
                    만원 (재료비, 인건비, 공과금, 기타경비, 관리비)
                </ItemContainer>
                <ItemContainer title='순수익' subEl={true}>
                    만원
                </ItemContainer>
            </div>
        </ItemContainer>
    );
}

function LoanEl() {
    let loanExistMap = { notShow: '표시안함', noLoan : '융자없음', loanExist: '융자있음' };


    return (
        <ItemContainer title='융자'>
            <div className={parentClasses['input-inner-grid']}>
                <ItemContainer title='융자 여부' subEl={true}>
                    <SingleChoiceForm name='loanExist' choiceMap={loanExistMap} btnLabel='선택하기' />
                </ItemContainer>
            </div>
        </ItemContainer>
    );
}


function MoveInDayEl() {

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
                                }}/>
                        );                        
                    } else if (item.unit) {
                        return <div key={idx} className={parentClasses.unit}>{item.unit}</div>;
                    }
                    return null;
                })}
                <label>
                    <input type='checkbox' />
                    {' 협의가능 '}
                </label>
            </div>
        </ItemContainer>
    );
}

function ProductContainer({ addressState }) {

    return (
        <div className={parentClasses["input-grid"]}>
            <PriceEl />
            <PremiumEl />
        	<TransferEl />
            <LoanEl />
            <MoveInDayEl />
            
        	<div className={parentClasses["input-title"]}>입주가능일</div> 
        	<div>입주일지정, [초순, 중순, 하순], [협의가능]</div>
        	<div className={parentClasses["input-title"]}>면적</div> 
        	<div>계약면적, 전용면적</div>
        	<div className={parentClasses["input-title"]}>방향</div> 
        	<div>동, 서, 남, 북, 남동, 남서, 북동, 북서 (주된 출입구 기준)</div>
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