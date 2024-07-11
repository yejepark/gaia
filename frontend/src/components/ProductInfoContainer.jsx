import { useEffect } from 'react';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import parentClasses from '../pages/NewSellPost.module.css';

import { ValuesToElementsForm, ValuesToDropDownForm } from '../pages/NewSellPost';
import DropDownInputForm from './DropDownInputForm';

import { ItemContainer } from '../pages/NewSellPost';

const buildingUsages = [
    "단독주택", "공동주택", "제1종근린생활시설", "제2종근린생활시설",
    "문화및집회시설", "종교시설", "판매시설", "운수시설", "의료시설",
    "교육연구시설", "노유자시설", "수련시설", "운동시설", "업무시설",
    "숙박시설", "위락시설", "공장", "창고시설", "위험물저장및처리시설",
    "자동차관련시설", "동.식물관련시설", "분뇨.쓰레기처리시설",
    "교정및군사시설", "방송통신시설", "발전시설", "묘지관련시설", "관광휴게시설",
    "가설건축물", "장례식장", "미등기건물", "그밖에토지의정착물"
];

const districtTypes = [
    "제1종일반주거지역", "제1종전용주거지역",
    "제2종일반주거지역", "제2종전용주거지역", "제3종일반주거지역",
    "준주거지역",
    "중심상업지역", "일반상업지역", "근린상업지역", "유통상업지역",
    "전용공업지역", "일반공업지역", "준공업지역",
    "보전녹지지역", "생산녹지지역", "자연녹지지역",
    "계획관리지역", "생산관리지역", "보전관리지역",
    "농림지역", "자연환경보전지역"
];

const structureTypes = [
    "조적구조", "벽돌구조", "블럭구조", "석구조", "스틸하우스조", "보강콘크리트조", "기타조적구조",
    "콘크리트구조", "철근콘크리트구조", "프리케스트콘크리트구조",
    "철파이프조", "돌담 및 토담조", "라멘조", "석회 및 흙혼합 벽돌조", "기타콘크리트구조",
    "철골구조", "일반철골구조", "경량철골구조", "강파이프구조",
    "황토조", "연와조", "조석조", "기타강구조",
    "철골철근콘크리트구조", "철골콘크리트구조", "경량철골조", "기타철골철근콘크리트구조",
    "목구조", "일반목구조", "통나무구조", "시켄트블럭조", "조립식판넬조", "흙벽돌조",
    "컨테이너조", "막구조", "기타구조"
];
structureTypes.sort();

function BuildingFloorEl() {
    let inputFloorValues = [
        { subtitle: '지하' }, { unit: '층', name: 'ugrndFlrCnt' },
        { subtitle: '지상' }, { unit: '층', name: 'grndFlrCnt' },
    ];
    return (
        <ItemContainer title='층정보'>
            <div className={parentClasses['input-subgrid']}>
                <ValuesToElementsForm values={inputFloorValues} />
            </div>
        </ItemContainer>
    );
}


function BuildingAreaEl() {

    const { control, setValue, register } = useFormContext();

    let inputAreaValues = [
        { subtitle: '대지면적' }, { unit: 'm2', name: 'platArea' }, {}, {},
        { subtitle: '건축면적' }, { unit: 'm2', name: 'archArea' },
        { subtitle: '건폐율' }, { unit: '%', name: 'buildingLandRatio', calculated: true},
        { subtitle: '연면적' }, { unit: 'm2', name: 'totArea' },
        { subtitle: '용적률' }, { unit: '%', name: 'floorAreaRatio', calculated: true },
    ];

    let platArea = useWatch({control, name: 'platArea'});
    let archArea = useWatch({control, name: 'archArea'});
    let totArea = useWatch({control, name: 'totArea'});
    // console.log('buidingArea: ', platArea, archArea, totArea);

    let buildingLandRatio = platArea > 0 ? Math.round(archArea / platArea * 100) : 0;
    let floorAreaRatio = platArea > 0 ? Math.round(totArea / platArea * 100) : 0;
    let calculatedValues = {buildingLandRatio, floorAreaRatio};
   

    return (
        <ItemContainer title='면적정보'>
            <div className={parentClasses['input-subgrid']}>
                {inputAreaValues.map((item, idx) => {
                    if (item.subtitle) {
                        return <div key={idx} className={parentClasses['input-subtitle']}>{item.subtitle}</div>;
                    } else if (item.calculated) {
                        return ( 
                            <div key={idx} className={parentClasses['input-subcontainer'] + ' ' + parentClasses['input-with-unit']}>
                                <input type='text' 
                                    value={calculatedValues[item.name]} 
                                    className={parentClasses["input-value"] + ' not-focusable'} 
                                    readOnly
                                />
                                <div className={parentClasses.unit}>{item.unit}</div>
                            </div>
                         );
                    } else if (item.name) {
                        let unitEl;
                        if (item.unit === 'm2') {
                            unitEl = <div className={parentClasses.unit}>m<sup>2</sup></div>;
                        } else {
                            unitEl = <div className={parentClasses.unit}>{item.unit}</div>;
                        }
                        return ( 
                            <div key={idx} className={parentClasses['input-subcontainer'] + ' ' + parentClasses['input-with-unit']}>
                                <input type='text'
                                    {...register(item.name)}
                                    className={parentClasses["input-value"] + ' focusable'}
                                    autoComplete='off'
                                />
                                {unitEl}
                         </div>
                        );
                    } else {
                        return <div key={idx}></div>;                            
                    }
                })}
            </div>
        </ItemContainer>
    );
}


function BulidingRoomCntEl() {

    let inputRoomCntValues = [
        { subtitle: '세대' }, { name: 'hhldCnt', unit: '개' },
        { subtitle: '호' }, { name: 'hoCnt', unit: '개' },
        { subtitle: '가구' }, { name: 'fmlyCnt', unit: '개' },
    ];

    return (
        <ItemContainer title='총 세대/호'>
            <div className={parentClasses['input-subgrid']}>
                <ValuesToElementsForm values={inputRoomCntValues} />
            </div>
        </ItemContainer>
    );
}


function BuildingParkingEl() {

    let inputParkingValues = [
        { subtitle: '실내 자주식' }, { name: 'indrAutoUtcnt', unit: '대' },
        { subtitle: '실내 기계식' }, { name: 'indrMechUtcnt', unit: '대' },
        { subtitle: '실외 자주식' }, { name: 'oudrAutoUtcnt', unit: '대' },
        { subtitle: '실외 기계식' }, { name: 'oudrMechUtcnt', unit: '대' },
    ];

    return (
        <ItemContainer title='주차장'>
            <div className={parentClasses['input-subgrid']}>
                <ValuesToElementsForm  values={inputParkingValues} />
            </div>
        </ItemContainer>
    );
}


function ElevatorEl() {

    let inputElevatorValues = [
        { subtitle: '승용' }, { unit: '대', name: 'rideUseElvtCnt' },
        { subtitle: '비상용' }, { unit: '대', name: 'emgenUseElvtCnt' },
    ];

    return (
        <ItemContainer title='승강기'>
            <div className={parentClasses['input-subgrid']}>
                <ValuesToElementsForm values={inputElevatorValues} />
            </div>
        </ItemContainer>
    );
}


function UseAprDayEl() {

    let curDate = new Date();
    let thisYear = curDate.getFullYear();

    let yearValues = Array.from({ length: 100 }, (x, i) => thisYear - i);
    let monthValues = Array.from({ length: 12 }, (x, i) => i + 1);
    let dayValues = Array.from({ length: 31 }, (x, i) => i + 1);

    let items = [{
            name: 'useAprDay.Y',
            values: yearValues,
            inputClass: parentClasses['year-input']
        }, { unit: '년' },
        {
            name: 'useAprDay.M',
            values: monthValues,
            inputClass: parentClasses['month-input']
        }, { unit: '월' },
        {
            name: 'useAprDay.D',
            values: dayValues,
            inputClass: parentClasses['day-input']
        }, { unit: '일' }
    ];
    return (
        <ItemContainer title='사용승인일'>
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
            </div>
        </ItemContainer>
    );
}


function ProductInfoContainer({ addressState }) {
    console.log('in ProductInfoContainer')

    return [
        <ValuesToDropDownForm key={1} name='mainPurpose' title='건축물 주용도' values={buildingUsages} />,
        <ValuesToDropDownForm key={2} name='districtType' title='용도지역' values={districtTypes} />,
        <BuildingFloorEl key={3} />,
        <BulidingRoomCntEl key={4} />,
        <BuildingAreaEl key={5} />,
        <BuildingParkingEl key={6} />,
        <ElevatorEl key={7} />,
        <ValuesToDropDownForm key={8} name='strctCdNm' title='건축물 구조' values={structureTypes} />,
        <UseAprDayEl key={9} />
    ];
}

export default ProductInfoContainer;

// export default memo(ProductInfoContainer, function(prevProps, nextProps) {
//     let prevState = prevProps.addressState;
//     let nextState = nextProps.addressState;

//     let prevData = prevState.data;
//     let nextData = nextState.data;

//     // console.log('(', prevProps.bldName, '|', prevProps.dongName, ')');
//     // console.log('(', nextProps.bldName, '|', nextProps.dongName, ')');
//     let isNewData = prevData === null && nextData !== null;
//     if (isNewData) return false;

//     let isSameAddress = prevData?.buildingCode === nextData?.buildingCode;
//     let isSameBuilding = prevState.bldName === nextState.bldName;
//     let isSameDong = prevState.dongName === nextState.dongName;
//     // console.log('memo of ProductInfoContainer: ', isNewData, isSameAddress, isSameBuilding, isSameDong);

//     return isSameAddress && isSameBuilding && isSameDong;
// });