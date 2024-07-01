import { useEffect, useState, useReducer } from 'react';
import { Form } from 'react-router-dom';

import classes from './NewSellPost.module.css';

import SingleChoice from '../components/SingleChoice';
import DropDownInput from '../components/DropDownInput';

import AddressContainer from '../components/AddressContainer';
import ProductTypeContainer from '../components/ProductTypeContainer';
import ProductInfoContainer from '../components/ProductInfoContainer';


const initialAddressState = {
	data: null,
	dongName: '',
	bldName: '',
	brTitleIdx: '0',
	districtType: '',
	floor: '1층',
}

function addressStateReducer(state, action) {
	if (action.type === 'FETCH_ERROR') {
		return {
			...state,
			error: action.payload,
		};
	}

	if (action.type === 'FETCH_SUCCESS') {
		let data = action.payload;
		console.log(data)
		let districtType = '';
		let brJijigu = [];
		if (data.brJijigu.length > 0) {
			brJijigu = data.brJijigu.filter(item => item['jijiguGbCd'] === '1');
			brJijigu.sort(function (a,b) {return a.jijiguCd.localeCompare(b.jijiguCd);});
			districtType = [... new Set(brJijigu.map(item => item.jijiguCdNm))].join(', ');
		}
		let nextState = {
			...initialAddressState,
			data,
			districtType
		};
		if (nextState.data && sessionStorage) sessionStorage.setItem('addressState', JSON.stringify(nextState));
		return nextState;
	}

	if (action.type === 'UPDATE_DONGNAME') {
		let bldName = action.payload.bldName;
		let dongName = action.payload.dongName;
		let brTitleIdx = '0';
		for (let [idx, item] of Object.entries(state.data.brTitle)) {
            if (item['dongNm'] === dongName && item['bldNm'] === bldName) {
                brTitleIdx = idx;
            	break;
            }
        }

        let nextState = { 
        	...state,
			dongName,
			bldName,
			brTitleIdx
		}
        if (nextState.data && sessionStorage) sessionStorage.setItem('addressState', JSON.stringify(nextState));
		return nextState;
	}

	if (action.type === 'UPDATE_FLOOR') {
		let floor = action.payload;
		let nextState = {
			...state,
			floor,
		};
		if (nextState.data && sessionStorage) sessionStorage.setItem('addressState', JSON.stringify(nextState));
		return nextState;
	}

	if (action.type === 'RESTORE') {
		let storedState = JSON.parse(sessionStorage.getItem('addressState') || '{}');
		if (Object.keys(storedState).length = 0) {
			return initialAddressState;
		}
		return storedState;
	}

	if (action.type === 'RESET') {
		if (sessionStorage) sessionStorage.setItem('addressState', JSON.stringify(initialAddressState));
	}

	return initialAddressState;
}

function NewSellPost() {
    console.log('NewSellPost');

    let storedProductType = sessionStorage.getItem('productType');
    let storedProductSubType = sessionStorage.getItem('productSubType');

    let [productType, setProductType] = useState(storedProductType ? storedProductType : '');
    let [productSubType, setProductSubType] = useState(storedProductSubType ? storedProductSubType : '');

    const [addressState, dispatchAddress] = useReducer(addressStateReducer, initialAddressState);
    console.log(addressState);
 
    function resetAll() {
        setProductType('');
        setProductSubType('');
        dispatchAddress({type: 'RESET'});
    }

    useEffect(() => {
    	dispatchAddress({ type: "RESTORE" });
    }, [])

    useEffect(() => {
        if (sessionStorage) sessionStorage.setItem('productType', productType);
    }, [productType]);

    useEffect(() => {
        if (sessionStorage) sessionStorage.setItem('productSubType', productSubType);
    }, [productSubType]);

    return (
        <div className={classes["body-container"]}> 
            <Form method="post" className={classes["main-container"]}>
                <ProductTypeContainer
                    productType={productType} setProductType={setProductType}
                    productSubType={productSubType} setProductSubType={setProductSubType}
                />
                <AddressContainer addressState={addressState} dispatchAddress={dispatchAddress} />
                <ProductInfoContainer bldName={addressState.bldName} dongName={addressState.dongName} addressState={addressState} />
                <button onClick={resetAll}>모두 지우기</button>
                <button type="submit">Create</button>
            </Form>
        </div>
    );
}

export default NewSellPost;


export async function action({ request }) {
	const formData = await request.formData();
	const postData = Object.fromEntries(formData);
	console.log(postData);
	return postData
}