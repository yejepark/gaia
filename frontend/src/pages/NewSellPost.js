import { useEffect, useState } from 'react';

import SingleChoice from '../components/SingleChoice';
import DropDownInput from '../components/DropDownInput';

import AddressContainer from '../components/AddressContainer';
import ProductTypeContainer from '../components/ProductTypeContainer';
import ProductInfoContainer from '../components/ProductInfoContainer';

function NewSellPost() {

    let storedProductType = sessionStorage.getItem('productType');
    let storedProductSubType = sessionStorage.getItem('productSubType');
    let storedAddressData = JSON.parse(sessionStorage.getItem('addressData') || '{}');
    let storedDongName = sessionStorage.getItem('dongName');
    let storedMainPurpose = sessionStorage.getItem('mainPurpose');

    let [productType, setProductType] = useState(storedProductType ? storedProductType : '');
    let [productSubType, setProductSubType] = useState(storedProductSubType ? storedProductSubType : '');

    let [addressData, setAddressData] = useState(storedAddressData ? storedAddressData : {});
    let [dongName, setDongName] = useState(storedDongName ? storedDongName : '');

    let [mainPurpose, setMainPurpose] = useState(storedMainPurpose ? storedMainPurpose : '');

    let hasAddressData = Object.keys(addressData).length > 0;

    let addressMainPurposeEl;
 
    function resetAll() {
        setProductType('');
        setAddressData({});
    }

    useEffect(() => {
        if (sessionStorage) {
            sessionStorage.setItem('productType', productType);
        }
    }, [productType]);

    useEffect(() => {
        if (sessionStorage) {
            sessionStorage.setItem('productSubType', productSubType);
        }
    }, [productSubType]);

    useEffect(() => {
        if (sessionStorage) {
            sessionStorage.setItem('addressData', JSON.stringify(addressData));
        }
    }, [addressData]);

    useEffect(() => {
        // console.log(dongName);
        if (sessionStorage) {
            sessionStorage.setItem('dongName', dongName);
        }
        
        if (hasAddressData) {

            if (addressData.brTitle.length === 1) {
                setMainPurpose(addressData.brTitle[0]['mainPurpsCdNm']);
            } else {
                for (let item of addressData.brTitle) {
                    if (item['dongNm'] === dongName) {
                        setMainPurpose(item['mainPurpsCdNm']);
                        break;
                    }
                }        
            }
        }
    }, [dongName]);

    useEffect(() => {
        if (sessionStorage) {
            sessionStorage.setItem('mainPurpose', mainPurpose);
        }
    }, [mainPurpose]);    

    return (
        <div className="body-container"> 
            <div className="main-container">
                <ProductTypeContainer productType={productType} setProductType={setProductType} productSubType={productSubType} setProductSubType={setProductSubType} />
                <AddressContainer addressData={addressData} setAddressData={setAddressData} dongName={dongName} setDongName={setDongName} />
                <ProductInfoContainer addressData={addressData} mainPurpose={mainPurpose} setMainPurpose={setMainPurpose} />
                <button onClick={resetAll}>모두 지우기</button>
            </div>
        </div>
    );
}

export default NewSellPost;