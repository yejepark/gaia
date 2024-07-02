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


function InputWithDefault({ subtitle, defaultValue, unit, inputClass, name }) {

    let unitEl;
    if (unit === 'm2') {
        unitEl = <div className={classes.unit}>m<sup>2</sup></div>;
    } else {
        unitEl = <div className={classes.unit}>{unit}</div>;
    }

    return (<>
        <div className={classes.subtitle}>{subtitle}</div>
        <div className={classes.subinput}>
            <input type="text" 
                name={name}
                className={classes["input-value"] + ' ' + inputClass}
                defaultValue={defaultValue}
                placeholder={'직접입력'} 
                autoComplete="off"
            />
            {unitEl}
        </div>
    </>);
}

function BuildingFloorEl({ brTitle }) {

    if (!brTitle) {
        return (<>
            <div className={newSellPostClasses["input-title"]}>층정보</div>
            <div className={newSellPostClasses['input-subgrid'] + ' buildingFloorInfo'}>
                 <InputWithDefault subtitle={'지하'} defaultValue={0} unit={'층'} inputClass={'resettable'} />
                 <InputWithDefault subtitle={'지상'} defaultValue={1} unit={'층'} inputClass={'resettable'} />
            </div>
        </>);
    }
    
    let inputFloorValues = [
        {subtitle: '지하', defaultValue: brTitle.ugrndFlrCnt, unit: '층'},
        {subtitle: '지상', defaultValue: brTitle.grndFlrCnt, unit: '층'},
    ];
    return (<>
        <div className={newSellPostClasses["input-title"]}>층정보</div>
        <div className={newSellPostClasses['input-subgrid'] + ' buildingFloorInfo'}>
            {inputFloorValues.map((item, idx) => {
                if (Object.keys(item).length > 0) {
                    return <InputWithDefault key={idx}
                        subtitle={item.subtitle}
                        defaultValue={item.defaultValue} 
                        unit={item.unit}
                        inputClass={'resettable'} />;   
                } else {
                    return <div key={idx}></div>;
                }
            })}
        </div>
    </>);
}

function MainPurposeEl({ mainPurpose, setMainPurpose }) {
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

function BuildingAreaEl({ brTitle }) {

    let platArea = brTitle ? brTitle.platArea : 0;
    let archArea = brTitle ? brTitle.archArea : 0;
    let totArea = brTitle ? brTitle.vlRatEstmTotArea : 0;
    let buildingLandRatio = brTitle && platArea > 0 ? Math.round(archArea/platArea*100) : 0;
    let floorAreaRatio = brTitle && platArea > 0 ? Math.round(totArea/platArea*100) : 0;
       
    let inputAreaValues = [
        {subtitle: '대지면적', defaultValue: platArea, unit: 'm2', name: 'platArea', inputClass: 'resettable'}, {}, {},
        {subtitle: '건축면적', defaultValue: archArea.toFixed(1), unit: 'm2', name: 'archArea', inputClass: 'resettable'},
        {subtitle: '건폐율', defaultValue: buildingLandRatio, unit: '%', name: 'buildingLandRatio'},
        {subtitle: '연면적', defaultValue: totArea.toFixed(1), unit: 'm2', name: 'totArea'},
        {subtitle: '용적률', defaultValue: floorAreaRatio, unit: '%', name: 'floorAreaRatio'},
    ];

    return (<>
        <div className={newSellPostClasses["input-title"]}>면적정보</div>
        <div className={newSellPostClasses['input-subgrid'] + ' buildingAreaInfo'}>
            {inputAreaValues.map((item, idx) => {
                if (Object.keys(item).length > 0) {
                    return <InputWithDefault key={idx}
                        subtitle={item.subtitle}
                        defaultValue={item.defaultValue} 
                        unit={item.unit}
                        inputClass={'resettable'}
                        name={item.name} />;   
                } else {
                    return <div key={idx}></div>;
                }
            })}
        </div>
    </>);
}

function DistrictTypeEl({ districtType, setDistrictType }) {
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

function BulidingRoomCntEl({ brTitle }) {
    if (!brTitle) {
        return (<>
            <div className={newSellPostClasses["input-title"]}>총 사무실수</div>
            <input type="text" className={classes["input-value"]} placeholder={'직접입력'} defaultValue={0} autoComplete="off"/>
        </>);
    }

    return (<>
        <div className={newSellPostClasses["input-title"]}>총 사무실수</div>
        <input type="text" 
            className={classes["input-value"]}
            placeholder={'직접입력'} 
            defaultValue={brTitle.hoCnt}
            autoComplete="off"
        />
    </>);
}

function ProductInfoContainer({ bldName, dongName, addressState }) {
    console.log('ProductInfoContainer')

    let addressData = addressState.data;
    console.log('addressData: ', addressData)
    
    let hasAddressData = addressData ? Object.keys(addressData).length > 0 : null;
    
    let hasBrTitleData = addressData ? addressData.brTitle.length > 0 : null;
    let brTitle = hasBrTitleData ? addressData.brTitle[addressState.brTitleIdx] : null;
    console.log('brTitle: ', brTitle);

    let [mainPurpose, setMainPurpose] = useState('');
    let [districtType, setDistrictType] = useState('');

    useEffect(() => {
        if (brTitle) {
            setMainPurpose(brTitle['mainPurpsCdNm']);
            setDistrictType(addressState['districtType']);
            let resettables = document.querySelector('.buildingAreaInfo').querySelectorAll(".resettable");
            resettables.forEach(el => { el.value = el.defaultValue; });
        }
    }, [bldName, dongName, hasBrTitleData]);

    return (
        <div className={newSellPostClasses["input-grid"]}>
            <BuildingFloorEl brTitle={brTitle} />
            <MainPurposeEl mainPurpose={mainPurpose} setMainPurpose={setMainPurpose} />
            <BuildingAreaEl brTitle={brTitle} />
            <DistrictTypeEl districtType={districtType} setDistrictType={setDistrictType} />
            <BulidingRoomCntEl brTitle={brTitle} />
        </div>
    );
}

export default memo(ProductInfoContainer, function(prevProps, nextProps) {
    // console.log(prevProps.addressState.data);
    // console.log(nextProps.addressState.data);
    // console.log('(', prevProps.bldName, '|', prevProps.dongName, ')');
    // console.log('(', nextProps.bldName, '|', nextProps.dongName, ')');

    if (!prevProps.addressState.data && nextProps.addressState.data) return false;

    return (
        prevProps.bldName === nextProps.bldName &&
        prevProps.dongName === nextProps.dongName
    );
});