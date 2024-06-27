import { useEffect, useState } from 'react';

import newSellPostClasses from '../pages/NewSellPost.module.css';
import classes from './AddressContainer.module.css';

import AddressInput from './AddressInput';
import DropDownInput from './DropDownInput';


function AddressContainer({ addressData, setAddressData, dongName, setDongName, floor, setFloor }) {
    
    let [brTitleIdx, setBrTitleIdx] = useState(0);

    let topEl, dongEl, floorEl, detailEl;
    let dongNms = [];

    let hasAddressData = Object.keys(addressData).length > 0;

    if (hasAddressData) {
        topEl = (
            <>
                <div className={newSellPostClasses["input-title"]}></div>
                <input type="text" 
                    className={classes["address-value"]} id='address-value' 
                    placeholder={'직접입력'} 
                    defaultValue={addressData.userSelectedType === 'R' ? addressData.roadAddress : addressData.jibunAddress}
                    autoComplete="off"
                />
            </>
        );
        
        dongNms = addressData.brTitle.map(item => item.dongNm.trim()).filter(name => name.length > 0);    
        if (dongNms.length > 0) {
            dongNms.sort();
            let dongNmMaxLen = Math.max(...addressData.brTitle.map(item=>item.dongNm.length));
            dongNmMaxLen = Math.min(dongNmMaxLen, 10)
            
            dongEl = (
                <>
                    <div className={newSellPostClasses["input-title"]}>동명칭</div>
                    <DropDownInput
                        localValue={dongName} setLocalValue={setDongName} 
                        values={dongNms} 
                        options={{
                            placeholder: "직접입력",
                            custumClass: classes['dong-input'],
                            // style: {width: `${dongNmMaxLen+5}rem`}
                        }}
                    />
                </>
            );    
        }

        let chosenBrTitle = addressData.brTitle[brTitleIdx];

        if (chosenBrTitle) {
            let ugrndFlrKeys = Array.from({length: chosenBrTitle.ugrndFlrCnt}, (x,i)=> -(chosenBrTitle.ugrndFlrCnt-i));
            let grndFlrKeys = Array.from({length: chosenBrTitle.grndFlrCnt}, (x,i)=> i+1);
            let flrKeys = ugrndFlrKeys.concat(grndFlrKeys);
            let floorValues = flrKeys.map(k => {
                if (k < 0) return {key: k, value: `지하${-k}층`, text: `지하${-k}층`};
                return {key: k, value: `${k}층`, text: `${k}층`};
            });
            floorEl = (
                <>
                    <div className={newSellPostClasses["input-title"]}>층정보</div>
                    <DropDownInput
                        localValue={floor} setLocalValue={setFloor} 
                        values={floorValues} 
                        options={{
                            placeholder: "직접입력",
                            custumClass: classes['dong-input'],
                        }}
                    />                    
                </>
            );
        }
        
        detailEl = (
            <>
                <div className={newSellPostClasses["input-title"]}>상세주소</div>
                <input type="text" className={classes["address-detail"]} id="address-detail" placeholder="" autoComplete="off" />
            </>
        );
    }

    useEffect(() => {
        if (hasAddressData) {
            for (let [idx, item] of Object.entries(addressData.brTitle)) {
                if (item['dongNm'] === dongName) {
                    setBrTitleIdx(idx);
                    break;
                }
            }    
        }
    }, [dongName]);

    return (
        <div className={newSellPostClasses["input-grid"]}>
            <div className={newSellPostClasses["input-title"]}>주소</div>
            <AddressInput addressData={addressData} setAddressData={setAddressData} />

            {topEl}
            {dongEl}
            {floorEl}
            {detailEl}
        </div>
    )
}

export default AddressContainer;