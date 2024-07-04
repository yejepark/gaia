import { useState } from 'react';

import newSellPostClasses from '../pages/NewSellPost.module.css';
import classes from './AddressContainer.module.css';

import AddressInput from './AddressInput';
import DropDownInput from './DropDownInput';

function SavedTextInput({ id, name, customClass, placeholder, defaultValue }) {
    let savedText = sessionStorage.getItem(name);
    let [text, setText] = useState(savedText ? savedText : defaultValue);

    function textChangeHandler(event) {
        let newText = event.target.value
        setText(newText);
        sessionStorage.setItem(name, newText);
    }

    return <input type="text"
        name={name} id={id} className={customClass}
        placeholder={placeholder} autoComplete="off"
        value={text} onChange={textChangeHandler} />
}

function TopEl({ addressData }) {
    return (<>
        <div className={newSellPostClasses["input-title"]}></div>
        <input type="text" 
            className={classes["address-value"]} id='address-value' 
            placeholder={'직접입력'} 
            defaultValue={addressData.userSelectedType === 'R' ? addressData.roadAddress : addressData.jibunAddress}
            autoComplete="off"
            name='topAddress'
        />
    </>);
}

function DongEl({ addressState, dispatchAddress }) {

    let dongNms = addressState.data.brTitle.map((item, idx) => {
        let dongNm = item.bldNm === item.dongNm ? ' ' : item.dongNm;
        return {
            text: (item.bldNm + ' ' + dongNm).trim(),
            value: item.bldNm + '|' + dongNm,
            key: item.bldNm + '-' + dongNm + '-' + idx,
        };
    }).filter((item) => item.text.trim().length > 0);

    if (dongNms.length === 0) return;

    dongNms.sort(function(a,b) { return ('' + a.value).localeCompare(b.value); });
    // let dongNmMaxLen = Math.max(...addressData.brTitle.map(item=>item.dongNm.length));
    let currentDongName = (addressState.bldName + ' ' + addressState.dongName).trim()
 
    return (<>
        <div className={newSellPostClasses["input-title"]}>동명칭</div>
        <DropDownInput
            localValue={currentDongName}
            setLocalValue={(bldAndDong) => {
                let [bldName, dongName] = bldAndDong.split('|');
                dispatchAddress({ type: 'UPDATE_DONGNAME', payload: {bldName, dongName} });
            }}
            values={dongNms}
            name='dongName'
            options={{
                placeholder: "직접입력",
                custumClass: classes['address-dropdown'],
                // style: {width: `${dongNmMaxLen+5}rem`}
            }}
        />
    </>);    
}

function FloorEl({ brTitle, addressState, dispatchAddress }) {
    
    let ugrndFlrKeys = Array.from({length: brTitle.ugrndFlrCnt}, (x,i)=> -(brTitle.ugrndFlrCnt-i));
    let grndFlrKeys = Array.from({length: brTitle.grndFlrCnt}, (x,i)=> i+1);
    let flrKeys = ugrndFlrKeys.concat(grndFlrKeys);
    let floorValues = flrKeys.map(k => {
        if (k < 0) return {key: k, value: `지하${-k}층`, text: `지하${-k}층`};
        return {key: k, value: `${k}층`, text: `${k}층`};
    });

    return (<>
        <div className={newSellPostClasses["input-title"]}>층정보</div>
        <DropDownInput
            localValue={addressState.floor}
            setLocalValue={(floor) => dispatchAddress({ type: 'UPDATE_FLOOR', payload: floor })} 
            values={floorValues}
            name='floor'
            options={{
                placeholder: "직접입력",
                custumClass: classes['address-dropdown'],
            }}
        />                    
    </>);
}


function AddressContainer({ addressState, dispatchAddress }) {

    let addressData = addressState.data;
    let hasAddressData  = addressData ? Object.keys(addressData).length > 0 : null;

    let brTitle;
    if (addressState.data && addressState.data.brTitle.length > 0) {
        brTitle = addressState.data.brTitle[addressState.brTitleIdx];
    }
        
    let detailEl = (
        <>
            <div className={newSellPostClasses["input-title"]}>상세주소</div>
            <SavedTextInput id='address-detail' name='addressDetail' customClass={classes["address-detail"]} />
        </>
    );

    return (
        <fieldset className={newSellPostClasses['input-set']}>
            <legend>주소 정보</legend>
            <div className={newSellPostClasses["input-grid"]}>
                <div className={newSellPostClasses["input-title"]}>주소</div>
                <AddressInput addressState={addressState} dispatchAddress={dispatchAddress} />

                {hasAddressData && <TopEl addressData={addressData} />}
                {hasAddressData && <DongEl addressState={addressState} dispatchAddress={dispatchAddress} />}
                {brTitle && <FloorEl brTitle={brTitle} addressState={addressState} dispatchAddress={dispatchAddress} />}
                {hasAddressData && detailEl}
            </div>
        </fieldset>
    )
}

export default AddressContainer;