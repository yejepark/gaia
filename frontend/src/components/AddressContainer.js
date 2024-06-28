import { useEffect, useState } from 'react';

import newSellPostClasses from '../pages/NewSellPost.module.css';
import classes from './AddressContainer.module.css';

import AddressInput from './AddressInput';
import DropDownInput from './DropDownInput';


function AddressContainer({ floor, setFloor, addressState, dispatchAddress }) {
    
    let [brTitleIdx, setBrTitleIdx] = useState(0);

    let topEl, dongEl, floorEl, detailEl;
    let dongNms = [];

    let addressData = addressState.data;
    let hasAddressData  = addressData ? Object.keys(addressData).length > 0 : null;

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
        
        // console.log(addressData.brTitle.map(item => item.dongNm))
        dongNms = addressData.brTitle.map(item => item.dongNm.trim()).filter(name => name.length > 0);    
        if (dongNms.length > 0) {
            dongNms.sort();
            let dongNmMaxLen = Math.max(...addressData.brTitle.map(item=>item.dongNm.length));
            dongNmMaxLen = Math.min(dongNmMaxLen, 10)
            
            dongEl = (
                <>
                    <div className={newSellPostClasses["input-title"]}>동명칭</div>
                    <DropDownInput
                        localValue={addressState.dongName}
                        setLocalValue={(dong) => dispatchAddress({ type: 'UPDATE_DONGNAME', payload: dong })} 
                        values={dongNms} 
                        options={{
                            placeholder: "직접입력",
                            custumClass: classes['address-dropdown'],
                            // style: {width: `${dongNmMaxLen+5}rem`}
                        }}
                    />
                </>
            );    
        }

        let chosenBrTitle = addressState.data ? addressState.data.brTitle[addressState.brTitleIdx] : null;        
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
                        localValue={addressState.floor}
                        setLocalValue={(floor) => dispatchAddress({ type: 'UPDATE_FLOOR', payload: floor })} 
                        values={floorValues} 
                        options={{
                            placeholder: "직접입력",
                            custumClass: classes['address-dropdown'],
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

    return (
        <div className={newSellPostClasses["input-grid"]}>
            <div className={newSellPostClasses["input-title"]}>주소</div>
            <AddressInput addressState={addressState} dispatchAddress={dispatchAddress} />

            {topEl}
            {dongEl}
            {floorEl}
            {detailEl}
        </div>
    )
}

export default AddressContainer;