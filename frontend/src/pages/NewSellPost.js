import { useEffect, useState } from 'react';

import classes from './NewSellPost.module.css';

import SingleChoice from '../components/SingleChoice';
import DropDownInput from '../components/DropDownInput';

import AddressContainer from '../components/AddressContainer';
import ProductTypeContainer from '../components/ProductTypeContainer';
import ProductInfoContainer from '../components/ProductInfoContainer';

function NewSellPost() {
    console.log('NewSellPost');

    let storedProductType = sessionStorage.getItem('productType');
    let storedProductSubType = sessionStorage.getItem('productSubType');

    let storedAddressData = JSON.parse(sessionStorage.getItem('addressData') || '{}');
    let storedDongName = sessionStorage.getItem('dongName');
    let storedFloor = sessionStorage.getItem('floor');

    let [productType, setProductType] = useState(storedProductType ? storedProductType : '');
    let [productSubType, setProductSubType] = useState(storedProductSubType ? storedProductSubType : '');

    let [addressData, setAddressData] = useState(storedAddressData ? storedAddressData : {});
    let [dongName, setDongName] = useState(storedDongName ? storedDongName : '');
    let [floor, setFloor] = useState(storedFloor ? storedFloor : '1층');
 
    function resetAll() {
        setProductType('');
        setProductSubType('');
        
        setAddressData({});
        setDongName('');
        setFloor('1층');

        // setMainPurpose('');
    }

    useEffect(() => {
        if (sessionStorage) sessionStorage.setItem('productType', productType);
    }, [productType]);

    useEffect(() => {
        if (sessionStorage) sessionStorage.setItem('productSubType', productSubType);
    }, [productSubType]);

    useEffect(() => {
        if (sessionStorage) sessionStorage.setItem('addressData', JSON.stringify(addressData));
    }, [addressData]);

    useEffect(() => {
        if (sessionStorage) sessionStorage.setItem('dongName', dongName);
    }, [dongName]);

    useEffect(() => {
        if (sessionStorage) sessionStorage.setItem('floor', floor);
    }, [floor]);

    return (
        <div className={classes["body-container"]}> 
            <div className={classes["main-container"]}>
                <ProductTypeContainer
                    productType={productType} setProductType={setProductType}
                    productSubType={productSubType} setProductSubType={setProductSubType}
                />
                <AddressContainer 
                    addressData={addressData} setAddressData={setAddressData}
                    dongName={dongName} setDongName={setDongName}
                    floor={floor} setFloor={setFloor}
                />
                <ProductInfoContainer
                    addressData={addressData} dongName={dongName}
                />
                <button onClick={resetAll}>모두 지우기</button>
            </div>
        </div>
    );
}

export default NewSellPost;