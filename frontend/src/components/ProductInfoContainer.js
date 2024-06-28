import { useState, useEffect } from 'react';

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

function ProductInfoContainer({ addressState }) {
    let addressData = addressState.data;
    let dongName = addressState.dongName;
    let brTitle;
    if (addressData && addressData.brTitle.length > 0) {
        brTitle = addressData.brTitle[addressState.brTitleIdx];
    }
    console.log(brTitle);
    
    let hasAddressData = addressData ? Object.keys(addressData).length > 0 : null;

    let storedMainPurpose = sessionStorage.getItem('mainPurpose');
    let [mainPurpose, setMainPurpose] = useState(storedMainPurpose ? storedMainPurpose : '');
    
    useEffect(() => {
        if (sessionStorage) sessionStorage.setItem('mainPurpose', mainPurpose);
    }, [mainPurpose]);    

    useEffect(() => {
        if (hasAddressData && addressData.brTitle.length > 0) {
            setMainPurpose(addressData.brTitle[0]['mainPurpsCdNm']);
        }    
    }, [addressData]);

    useEffect(() => {        
        if (hasAddressData) {
            if (addressData.brTitle.length > 1) {
                for (let item of addressData.brTitle) {
                    if (item['dongNm'] === dongName) {
                        setMainPurpose(item['mainPurpsCdNm']);
                        break;
                    }
                }        
            }
        }
    }, [dongName]);

    // console.log(addressData)
    
    let addressMainPurposeEl, addressPlatAreaEl, addressRoomCntEl;
    if (hasAddressData) {
        addressMainPurposeEl = (
            <>
                <div className={newSellPostClasses["input-title"]}>건축물 주용도</div>
                <DropDownInput
                    localValue={mainPurpose} setLocalValue={setMainPurpose} 
                    values={buildingUsages} 
                    options={{
                        placeholder: "직접입력",
                        custumClass: classes['main-purpose-input'],
                    }}
                />
            </>
        );

        let buildingLandRatio = brTitle.platArea > 0 ? Math.round(brTitle.archArea/brTitle.platArea*100) : '';
        let floorAreaRatio = brTitle.platArea > 0 ? Math.round(brTitle.vlRatEstmTotArea/brTitle.platArea*100) : '';
        addressPlatAreaEl = (
            <>
                <div className={newSellPostClasses["input-title"]}>면적정보</div>
                <div className={newSellPostClasses['input-subgrid']}>
                    <div className={classes.subtitle}>대지면적</div>
                    <div className={classes.subinput}>
                        <input type="text" 
                            className={classes["input-value"]}
                            placeholder={'직접입력'} 
                            defaultValue={brTitle.platArea}
                            autoComplete="off"
                        />
                        <div className={classes.unit}>m&sup2;</div>
                    </div>

                    <div></div>
                    <div></div>

                    <div className={classes.subtitle}>건축면적</div>
                    <div className={classes.subinput}>
                        <input type="text" 
                            className={classes["input-value"]}
                            placeholder={'직접입력'} 
                            defaultValue={brTitle.archArea}
                            autoComplete="off"
                        />
                        <div className={classes.unit}>m&sup2;</div>
                    </div>

                    <div className={classes.subtitle}>건패율</div>
                    <div className={classes.subinput}>
                        <input type="text" 
                            className={classes["input-value"]}
                            placeholder={'직접입력'} 
                            defaultValue={buildingLandRatio}
                            autoComplete="off"
                        />
                        <div className={classes.unit}>%</div>
                    </div>

                    <div className={classes.subtitle}>연면적</div>
                    <div className={classes.subinput}>
                        <input type="text" 
                            className={classes["input-value"]}
                            placeholder={'직접입력'} 
                            defaultValue={brTitle.vlRatEstmTotArea}
                            autoComplete="off"
                        />
                        <div className={classes.unit}>m&sup2;</div>
                    </div>

                    <div className={classes.subtitle}>용적률</div>
                    <div className={classes.subinput}>
                        <input type="text" 
                            className={classes["input-value"]}
                            placeholder={'직접입력'} 
                            defaultValue={floorAreaRatio}
                            autoComplete="off"
                        />
                        <div className={classes.unit}>%</div>
                    </div>                    
                </div>
            </>
        )

        addressRoomCntEl = (
            <>
                <div className={newSellPostClasses["input-title"]}>총 사무실수</div>
                <input type="text" 
                    className={classes["input-value"]}
                    placeholder={'직접입력'} 
                    defaultValue={brTitle.hoCnt}
                    autoComplete="off"
                />
            </>
        )
    }

    return (
        <div className={newSellPostClasses["input-grid"]}>
                {addressMainPurposeEl}
                {addressPlatAreaEl}
                {addressRoomCntEl}
        </div>
    );
}

export default ProductInfoContainer;