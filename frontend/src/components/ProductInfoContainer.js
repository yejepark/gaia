import { useState, useEffect, memo } from 'react';
import React from 'react';

import parentClasses from '../pages/NewSellPost.module.css';
import classes from './ProductInfoContainer.module.css';

import DropDownInput from './DropDownInput';

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

function ValuesToElements({ curValue, setCurValue, values }) {
    return values.map((item, idx) => {
        if (item.subtitle) {
            return <div key={idx} className={parentClasses['input-subtitle']}>{item.subtitle}</div>;
        } else {
            return (
                <div key={idx} className={parentClasses['input-with-unit']}>
                    <input type='text' name={item.name} className={parentClasses["input-value"]} autoComplete='off'
                            value={curValue[item.name]}
                            onChange={(e) => { setCurValue({...curValue, [item.name]: e.target.value}); }} />
                    <div className={parentClasses.unit}>{item.unit}</div>
                </div>
            );
        }
    });
}


function ValuesToDropDown({ eventDep, title, dataKey, values, data, isSubEl }) {
    let [value, setValue] = useState(data ? data[dataKey] : '');

    useEffect(() => {
        if (dataKey) {
            if (data) setValue(data[dataKey]);    
        } else {
            if (data) setValue(data);
        }
    }, [eventDep, data, dataKey]);
    
    return (
        <ItemContainer title={title} isSubEl={isSubEl}>
            <DropDownInput
                localValue={value} setLocalValue={setValue} 
                values={values} 
                options={{
                    placeholder: "직접입력",
                    custumClass: parentClasses['dropdown-container'],
                }}
            />
        </ItemContainer>
    );
}


function BuildingFloorEl({ brTitle }) {
    let ugrndFlrCnt = brTitle ? brTitle.ugrndFlrCnt : 0;
    let grndFlrCnt = brTitle ? brTitle.grndFlrCnt : 1;

    let [floorInfo, setFloorInfo] = useState({ugrndFlrCnt, grndFlrCnt});

    useEffect(() => {
        setFloorInfo({ ugrndFlrCnt, grndFlrCnt });
    }, [ugrndFlrCnt, grndFlrCnt]);

    let inputFloorValues = [
        {subtitle: '지하'}, {unit: '층', name: 'ugrndFlrCnt'},
        {subtitle: '지상'}, {unit: '층', name: 'grndFlrCnt'},
    ];

    return (
        <ItemContainer title='층정보'>
            <div className={parentClasses['input-subgrid'] + ' buildingFloorInfo'}>
                <ValuesToElements curValue={floorInfo} setCurValue={setFloorInfo} values={inputFloorValues} />
            </div>
        </ItemContainer>
    );
}


function MainPurposeEl({ buildingCode, brTitle }) {
    return <ValuesToDropDown 
        eventDep={buildingCode} title='건축물 주용도' 
        dataKey='mainPurpsCdNm' 
        values={buildingUsages} data={brTitle} />
}


function BuildingAreaEl({ brTitle }) {
    // console.log('brTitle: ', brTitle)

    let platArea = brTitle ? Number(brTitle.platArea.toFixed(2)) : 0;
    let archArea = brTitle ? Number(brTitle.archArea.toFixed(2)) : 0;
    let totArea = brTitle ? Number(brTitle.vlRatEstmTotArea.toFixed(2)) : 0;
    
    // if (archArea === 0 && totArea > 0) {
    //     archArea = brTitle ? Number((totArea / brTitle.grndFlrCnt).toFixed(2)) : 0;
    // } else if (totArea === 0 && archArea > 0) {
    //     totArea = brTitle ? Number((archArea * brTitle.grndFlrCnt).toFixed(2)) : 0;
    // }
    
    // console.log(platArea, archArea, totArea)

    let buildingLandRatio = platArea > 0 ? Math.round(archArea/platArea*100) : 0;
    let floorAreaRatio = platArea > 0 ? Math.round(totArea/platArea*100) : 0;
       
    let [areaInfo, setAreaInfo] = useState({
        platArea, archArea, totArea, buildingLandRatio, floorAreaRatio
    });
    // console.log('areaInfo: ', areaInfo)

    // let hasBrTitleData = brTitle ? Object.keys(brTitle).length > 0 : false;
    // console.log(buildingCode, hasBrTitleData)

    useEffect(()=>{
        setAreaInfo({platArea, archArea, totArea, buildingLandRatio, floorAreaRatio});
    }, [platArea, archArea, totArea, buildingLandRatio, floorAreaRatio]);

    function updateInfo(event, key) {
        setAreaInfo(prevInfo => {
            
            if (key === 'archArea') {
                let tempPlatArea = prevInfo.platArea;
                let tempArchArea = Number(event.target.value);
                return {...prevInfo, [key]: tempArchArea,
                    buildingLandRatio: tempPlatArea > 0 ? Math.round(tempArchArea/tempPlatArea*100): 0};

            } else if (key === 'totArea') {
                let tempPlatArea = prevInfo.platArea;
                let tempTotArea = Number(event.target.value);
                return {...prevInfo, [key]: tempTotArea,
                    floorAreaRatio: tempPlatArea > 0 ? Math.round(tempTotArea/tempPlatArea*100): 0};

            } else if (key === 'platArea') {
                let tempPlatArea = Number(event.target.value);
                return {...prevInfo, [key]: tempPlatArea,
                    buildingLandRatio: tempPlatArea > 0 ? Math.round(prevInfo.archArea/tempPlatArea*100): 0,
                    floorAreaRatio: tempPlatArea > 0 ? Math.round(prevInfo.totArea/tempPlatArea*100): 0,
                };
            }

            return prevInfo;
        });
    }
   
    let inputAreaValues = [
        {subtitle: '대지면적'}, {unit: 'm2', name: 'platArea'}, {}, {},
        {subtitle: '건축면적'}, {unit: 'm2', name: 'archArea'},
        {subtitle: '건폐율'}, {unit: '%', name: 'buildingLandRatio'},
        {subtitle: '연면적'}, {unit: 'm2', name: 'totArea'},
        {subtitle: '용적률'}, {unit: '%', name: 'floorAreaRatio'},
    ];

    return (
        <ItemContainer title='면적정보'>
            <div className={parentClasses['input-subgrid'] + ' buildingAreaInfo'}>
                {inputAreaValues.map((item, idx) => {
                    if (item.subtitle) {
                        return <div key={idx} className={parentClasses['input-subtitle']}>{item.subtitle}</div>;
                    } else if (item.name) {
                        let unitEl;
                        if (item.unit === 'm2') {
                            unitEl = <div className={parentClasses.unit}>m<sup>2</sup></div>;
                        } else {
                            unitEl = <div className={parentClasses.unit}>{item.unit}</div>;
                        }
                        return ( 
                            <div key={idx} className={parentClasses['input-with-unit']}>
                                <input type='text'
                                    name={item.name}
                                    className={parentClasses["input-value"]}
                                    value={areaInfo[item.name]}
                                    onChange={(e) => updateInfo(e, item.name)}
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


function DistrictTypeEl({ buildingCode, baseDistrictType }) {
    return <ValuesToDropDown
        eventDep={buildingCode} title='용도지역'
        values={districtTypes} data={baseDistrictType} />
}


function BulidingRoomCntEl({ brTitle }) {

    let hhldCnt = brTitle ? brTitle.hhldCnt : 0;
    let hoCnt = brTitle ? brTitle.hoCnt : 0;
    let fmlyCnt = brTitle ? brTitle.fmlyCnt : 0;
    
    let [roomCntInfo, setRoomCntInfo] = useState({ hhldCnt, hoCnt, fmlyCnt });

    useEffect(() => {
        setRoomCntInfo({ hhldCnt, hoCnt, fmlyCnt });
    }, [hhldCnt, hoCnt, fmlyCnt]);

    let inputRoomCntValues = [
        {subtitle: '세대'}, {name: 'hhldCnt', unit: '개'},
        {subtitle: '호'}, {name: 'hoCnt', unit: '개'},
        {subtitle: '가구'}, {name: 'fmlyCnt', unit: '개'},
    ];

    return (
        <ItemContainer title='총 세대/호'>
            <div className={parentClasses['input-subgrid'] + ' buildingRoomCnt'}>
                <ValuesToElements curValue={roomCntInfo} setCurValue={setRoomCntInfo} values={inputRoomCntValues} />
            </div>
        </ItemContainer>
    );
}

function BuildingParkingEl({ brTitle }) {

    let indrAutoUtcnt = brTitle ? brTitle.indrAutoUtcnt : 0;
    let indrMechUtcnt = brTitle ? brTitle.indrMechUtcnt : 0;
    let oudrAutoUtcnt = brTitle ? brTitle.oudrAutoUtcnt : 0;
    let oudrMechUtcnt = brTitle ? brTitle.oudrMechUtcnt : 0;

    let [parkingInfo, setParkingInfo] = useState({ indrAutoUtcnt, indrMechUtcnt, oudrAutoUtcnt, oudrMechUtcnt });

    useEffect(() => {
        setParkingInfo({ indrAutoUtcnt, indrMechUtcnt, oudrAutoUtcnt, oudrMechUtcnt });
    }, [indrAutoUtcnt, indrMechUtcnt,oudrAutoUtcnt, oudrMechUtcnt]);

    let inputParkingValues = [
        {subtitle: '실내 자주식'}, {name: 'indrAutoUtcnt', unit: '대'},
        {subtitle: '실내 기계식'}, {name: 'indrMechUtcnt', unit: '대'},
        {subtitle: '실외 자주식'}, {name: 'oudrAutoUtcnt', unit: '대'},
        {subtitle: '실외 기계식'}, {name: 'oudrMechUtcnt', unit: '대'},
    ];

    return (
        <ItemContainer title='주차장'>
            <div className={parentClasses['input-subgrid'] + ' buildingRoomCnt'}>
                <ValuesToElements curValue={parkingInfo} setCurValue={setParkingInfo} values={inputParkingValues} />
            </div>
        </ItemContainer>
    );
}

function ElevatorEl({ brTitle }) {
    let rideUseElvtCnt = brTitle ? brTitle.rideUseElvtCnt : 0;
    let emgenUseElvtCnt = brTitle ? brTitle.emgenUseElvtCnt : 0;

    let [elevatorInfo, setElevatorInfo] = useState({ rideUseElvtCnt, emgenUseElvtCnt });

    useEffect(() => {
        setElevatorInfo({ rideUseElvtCnt, emgenUseElvtCnt });
    }, [rideUseElvtCnt, emgenUseElvtCnt]);

    let inputElevatorValues = [
        {subtitle: '승용'}, {unit: '대', name: 'rideUseElvtCnt'},
        {subtitle: '비상용'}, {unit: '대', name: 'emgenUseElvtCnt'},
    ];

    return (
        <ItemContainer title='승강기'>
            <div className={parentClasses['input-subgrid'] + ' buildingFloorInfo'}>
                <ValuesToElements curValue={elevatorInfo} setCurValue={setElevatorInfo} values={inputElevatorValues} />
            </div>
        </ItemContainer>
    );
}

function StructureEl({ buildingCode, brTitle }) {
    return <ValuesToDropDown
        eventDep={buildingCode} title='건축물 구조'
        dataKey='strctCdNm'
        values={structureTypes} data={brTitle} />
}

function UseAprDayEl({ brTitle }) {
    let useAprDay = brTitle?.useAprDay;

    let curDate = new Date();
    let thisYear = curDate.getFullYear();

    let [yearValue, setYearValue] = useState(useAprDay ? Number(useAprDay.slice(0, 4)) : thisYear);
    let [monthValue, setMonthValue] = useState(useAprDay ? Number(useAprDay.slice(4, 6)) : 1);
    let [dayValue, setDayValue] = useState(useAprDay ? Number(useAprDay.slice(6, 8)) : 1);

    useEffect(() => {
        setYearValue(useAprDay ? Number(useAprDay.slice(0, 4)) : thisYear);
        setMonthValue(useAprDay ? Number(useAprDay.slice(4, 6)) : 1);
        setDayValue(useAprDay ? Number(useAprDay.slice(6, 8)) : 1);
    }, [useAprDay, thisYear]);

    let yearValues = Array.from({length: 100}, (x, i) => thisYear - i);
    let monthValues = Array.from({length: 12}, (x, i) => i+1);
    let dayValues = Array.from({length: 31}, (x, i) => i+1);

    let items = [
        {name: 'useAprYear', value: yearValue, setValue: setYearValue,
            values: yearValues, inputClass: classes['year-input']}, {unit: '년'},
        {name: 'useAprMonth', value: monthValue, setValue: setMonthValue,
            values: monthValues, inputClass: classes['month-input']}, {unit: '월'},
        {name: 'useAprDay', value: dayValue, setValue: setDayValue, 
            values: dayValues, inputClass: classes['day-input']}, {unit: '일'}
    ];
    return (
        <ItemContainer title='사용승인일'>
            <div className={classes['input-subflex']}>
                {items.map((item, idx) => {
                    if (item.name) {
                        return (
                            <DropDownInput key={idx} name={item.name}
                                localValue={item.value} setLocalValue={item.setValue}
                                values={item.values}
                                options={{
                                    placeholder: "직접입력",
                                    custumClass: item.inputClass
                                }}/>
                        );                        
                    } else if (item.unit) {
                        return <div key={idx} className={parentClasses.unit}>{item.unit}</div>        
                    }

                })}
            </div>
        </ItemContainer>
    );
}

function ProductInfoContainer({ addressState }) {
    // console.log('ProductInfoContainer')
    let addressData = addressState.data;

    let buildingCode = addressData?.buildingCode;

    // console.log('addressData: ', addressData)
    
    let hasBrTitleData = addressData ? addressData.brTitle.length > 0 : false;
    let brTitle = hasBrTitleData ? addressData.brTitle[addressState.brTitleIdx] : null;
    // console.log('buildingCode: ', buildingCode)
    // console.log('brTitle: ', brTitle);

    return (<>
        <MainPurposeEl buildingCode={buildingCode} brTitle={brTitle} />
        <DistrictTypeEl buildingCode={buildingCode} baseDistrictType={addressState.districtType} />
        <BuildingFloorEl brTitle={brTitle} />
        <BulidingRoomCntEl brTitle={brTitle} />
        <BuildingAreaEl brTitle={brTitle} />
        <BuildingParkingEl brTitle={brTitle} />
        <ElevatorEl brTitle={brTitle} />
        <StructureEl buildingCode={buildingCode} brTitle={brTitle} />
        <UseAprDayEl brTitle={brTitle} />
    </>);
}

export default memo(ProductInfoContainer, function(prevProps, nextProps) {
    let prevState = prevProps.addressState;
    let nextState = nextProps.addressState;

    let prevData = prevState.data;
    let nextData = nextState.data;

    // console.log('(', prevProps.bldName, '|', prevProps.dongName, ')');
    // console.log('(', nextProps.bldName, '|', nextProps.dongName, ')');
    let isNewData = prevData === null && nextData !== null;
    if (isNewData) return false;

    let isSameAddress = prevData?.buildingCode === nextData?.buildingCode;
    let isSameBuilding = prevState.bldName === nextState.bldName;
    let isSameDong = prevState.dongName === nextState.dongName;
    // console.log('memo of ProductInfoContainer: ', isNewData, isSameAddress, isSameBuilding, isSameDong);
    
    return isSameAddress && isSameBuilding && isSameDong;
});