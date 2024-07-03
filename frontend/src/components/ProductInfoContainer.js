import { useState, useEffect, memo } from 'react';
import React from 'react';

import newSellPostClasses from '../pages/NewSellPost.module.css';
import classes from './ProductInfoContainer.module.css';

import DropDownInput from './DropDownInput';

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


function BuildingFloorEl({ buildingCode, brTitle }) {
    let bldName = brTitle?.bldNm;
    let dongName = brTitle?.dongNm;

    let ugrndFlrCntEl, grndFlrCntEl

    let ugrndFlrCnt = brTitle ? brTitle.ugrndFlrCnt : 0;
    let grndFlrCnt = brTitle ? brTitle.grndFlrCnt : 1;

    let [floorInfo, setFloorInfo] = useState({ugrndFlrCnt, grndFlrCnt});

    useEffect(() => {
        setFloorInfo({ ugrndFlrCnt, grndFlrCnt });
    }, [buildingCode, bldName, dongName]);

    let inputFloorValues = [
        {subtitle: '지하'}, {unit: '층', name: 'ugrndFlrCnt'},
        {subtitle: '지상'}, {unit: '층', name: 'grndFlrCnt'},
    ];

    return (<>
        <div className={newSellPostClasses["input-title"]}>층정보</div>
        <div className={newSellPostClasses['input-subgrid'] + ' buildingFloorInfo'}>
            {inputFloorValues.map((item, idx) => {
                if (item.subtitle) {
                    return <div key={idx} className={classes.subtitle}>{item.subtitle}</div>;
                } else {
                    return (
                        <div key={idx} className={classes.subinput}>
                            <input type='text' name={item.name} className={classes["input-value"]} autoComplete='off'
                                    value={floorInfo[item.name]}
                                    onChange={(e) => { setFloorInfo({...floorInfo, [item.name]: e.target.value}); }} />
                            <div className={classes.unit}>{item.unit}</div>
                        </div>
                    );
                }
            })}
        </div>
    </>);
}

function MainPurposeEl({ buildingCode, brTitle }) {
    let [mainPurpose, setMainPurpose] = useState(brTitle ? brTitle.mainPurpsCdNm : '');

    useEffect(() => {
        if (brTitle) setMainPurpose(brTitle.mainPurpsCdNm);
    }, [buildingCode]);
    
    return (<>
        <div className={newSellPostClasses["input-title"]}>건축물 주용도</div>
        <DropDownInput
            localValue={mainPurpose} setLocalValue={setMainPurpose} 
            values={buildingUsages} 
            options={{
                placeholder: "직접입력",
                custumClass: classes['main-purpose-input'],
            }}
        />
    </>);
}

function BuildingAreaEl({ buildingCode, brTitle }) {
    let bldName = brTitle?.bldNm;
    let dongName = brTitle?.dongNm;
    // console.log('BuildingAreaEl', buildingCode, '|', bldName, '|', dongName, '|')
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
    }, [buildingCode, bldName, dongName]);

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

    return (<>
        <div className={newSellPostClasses["input-title"]}>면적정보</div>
        <div className={newSellPostClasses['input-subgrid'] + ' buildingAreaInfo'}>
            {inputAreaValues.map((item, idx) => {
                if (item.subtitle) {
                    return <div key={idx} className={classes.subtitle}>{item.subtitle}</div>;
                } else if (item.name) {
                    let unitEl;
                    if (item.unit === 'm2') {
                        unitEl = <div className={classes.unit}>m<sup>2</sup></div>;
                    } else {
                        unitEl = <div className={classes.unit}>{item.unit}</div>;
                    }
                    return ( 
                        <div key={idx} className={classes.subinput}>
                            <input type='text'
                                name={item.name}
                                className={classes["input-value"]}
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
    </>);
}

function DistrictTypeEl({ buildingCode, baseDistrictType }) {
    let [districtType, setDistrictType] = useState(baseDistrictType ? baseDistrictType : '');

    useEffect(() => {
        if (baseDistrictType) setDistrictType(baseDistrictType);
    }, [buildingCode]);

    return (<>
        <div className={newSellPostClasses["input-title"]}>용도지역</div>
        <DropDownInput
            localValue={districtType} setLocalValue={setDistrictType} 
            values={districtTypes} 
            options={{
                placeholder: "직접입력",
                custumClass: classes['main-purpose-input'],
            }}
        />
    </>);
}

function BulidingRoomCntEl({ buildingCode, brTitle }) {

    let hhldCnt = brTitle ? brTitle.hhldCnt : 0;
    let hoCnt = brTitle ? brTitle.hoCnt : 0;
    let fmlyCnt = brTitle ? brTitle.fmlyCnt : 0;
    
    let [roomCntInfo, setRoomCntInfo] = useState({hhldCnt, hoCnt, fmlyCnt});

    useEffect(() => {
        setRoomCntInfo({ hhldCnt, hoCnt, fmlyCnt });
    }, [buildingCode]);

    let inputRoomCntValues = [
        {subtitle: '세대'}, {unit: '개', name: 'hhldCnt'},
        {subtitle: '호'}, {unit: '개', name: 'hoCnt'},
        {subtitle: '가구'}, {unit: '개', name: 'fmlyCnt'},
    ];

    return (<>
        <div className={newSellPostClasses["input-title"]}>총 세대/호</div>
        <div className={newSellPostClasses['input-subgrid'] + ' buildingRoomCnt'}>
            {inputRoomCntValues.map((item, idx) => {
                if (item.subtitle) {
                    return <div key={idx} className={classes.subtitle}>{item.subtitle}</div>;
                } else {
                    return (
                        <div key={idx} className={classes.subinput}>
                            <input type='text' name={item.name} className={classes["input-value"]} autoComplete='off'
                                    value={roomCntInfo[item.name]}
                                    onChange={(e) => { setRoomCntInfo({...roomCntInfo, [item.name]: e.target.value}); }} />
                            <div className={classes.unit}>{item.unit}</div>
                        </div>
                    );
                }
            })}
        </div>
    </>);
}

function ProductInfoContainer({ addressState }) {
    console.log('ProductInfoContainer')
    let addressData = addressState.data;

    let buildingCode = addressData?.buildingCode;
    let dongName = addressState.dongName;
    let bldName = addressState.bldName;

    // console.log('addressData: ', addressData)
    
    let hasBrTitleData = addressData ? addressData.brTitle.length > 0 : false;
    let brTitle = hasBrTitleData ? addressData.brTitle[addressState.brTitleIdx] : null;
    // console.log('buildingCode: ', buildingCode)
    console.log('brTitle: ', brTitle);

    return (
        <div className={newSellPostClasses["input-grid"]}>
            <BuildingFloorEl buildingCode={buildingCode} brTitle={brTitle} />
            <MainPurposeEl buildingCode={buildingCode} brTitle={brTitle} />
            <BuildingAreaEl buildingCode={buildingCode} brTitle={brTitle} />
            <DistrictTypeEl buildingCode={buildingCode} baseDistrictType={addressState.districtType} />
            <BulidingRoomCntEl buildingCode={buildingCode} brTitle={brTitle} />
        </div>
    );
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