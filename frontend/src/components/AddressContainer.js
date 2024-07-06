import { useState } from 'react';

import parentClasses from '../pages/NewSellPost.module.css';

import AddressInput from './AddressInput';
import DropDownInput from './DropDownInput';

import { ItemContainer } from '../pages/NewSellPost';

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
    return (
        <ItemContainer>
            <input type="text" 
                className={parentClasses["input-value"]} id='address-value' 
                placeholder={'직접입력'} 
                defaultValue={addressData.userSelectedType === 'R' ? addressData.roadAddress : addressData.jibunAddress}
                autoComplete="off"
                name='topAddress'
            />
        </ItemContainer>
    );
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

    dongNms.sort(function(a,b) { return ('' + a.value).localeCompare(b.value); });
    // let dongNmMaxLen = Math.max(...addressData.brTitle.map(item=>item.dongNm.length));

    let currentDongName = (addressState.bldName + ' ' + addressState.dongName).trim();    

    let dongEl = (
        <ItemContainer title='동 명칭'>
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
                    custumClass: parentClasses['dropdown-container'],
                    // style: {width: `${dongNmMaxLen+5}rem`}
                }}
            />
        </ItemContainer>
    );
 
    return <> {dongNms.length > 0 && dongEl} </>;    
}

function FloorEl({ brTitle, addressState, dispatchAddress }) {
    
    let ugrndFlrKeys = Array.from({length: brTitle.ugrndFlrCnt}, (x,i)=> -(brTitle.ugrndFlrCnt-i));
    let grndFlrKeys = Array.from({length: brTitle.grndFlrCnt}, (x,i)=> i+1);
    let flrKeys = ugrndFlrKeys.concat(grndFlrKeys);
    let floorValues = flrKeys.map(k => {
        if (k < 0) return {key: k, value: `지하${-k}층`, text: `지하${-k}층`};
        return {key: k, value: `${k}층`, text: `${k}층`};
    });

    return (
        <ItemContainer title='층 명칭' isSubEl={true}>
            <DropDownInput
                localValue={addressState.floor}
                setLocalValue={(floor) => dispatchAddress({ type: 'UPDATE_FLOOR', payload: floor })} 
                values={floorValues}
                name='floor'
                options={{
                    placeholder: "직접입력",
                    custumClass: parentClasses['dropdown-container'],
                }}
            />                    
        </ItemContainer>
    );
}


function AddressContainer({ addressState, dispatchAddress }) {

    let addressData = addressState.data;
    let hasAddressData  = addressData ? Object.keys(addressData).length > 0 : null;

    let brTitle;
    if (addressState.data && addressState.data.brTitle.length > 0) {
        brTitle = addressState.data.brTitle[addressState.brTitleIdx];
    }
        
    let searchBtn = (
        <ItemContainer title='주소'>
            <AddressInput addressState={addressState} dispatchAddress={dispatchAddress} />
        </ItemContainer>
    );

    let hoEl = (
        <ItemContainer title='호 명칭' isSubEl={true}>
            <div className={parentClasses['input-with-unit']}>
                <SavedTextInput name='hoName' customClass={parentClasses["input-value"]} />
                <div className={parentClasses.unit}>호</div>
            </div>
        </ItemContainer>
    );

    let midEl = (
        <ItemContainer>
            <div className={parentClasses['input-subgrid']}>
                {brTitle && <FloorEl brTitle={brTitle} addressState={addressState} dispatchAddress={dispatchAddress} />}
                {brTitle && hoEl}                
            </div>
        </ItemContainer>
    );

    let detailEl = (
        <ItemContainer title='상세주소'>
            <SavedTextInput id='address-detail' name='addressDetail' customClass={parentClasses["input-value"]} />
        </ItemContainer>
    );

    return (<>
        {searchBtn}
        {hasAddressData && <TopEl addressData={addressData} />}
        {hasAddressData && <DongEl addressState={addressState} dispatchAddress={dispatchAddress} />}
        {hasAddressData && midEl}
        {hasAddressData && detailEl}
    </>)
}

export default AddressContainer;