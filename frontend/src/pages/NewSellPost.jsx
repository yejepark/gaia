import { useEffect, useState, useReducer } from 'react';
import { Form, useActionData  } from 'react-router-dom';

import classes from './NewSellPost.module.css';

import ProductTypeContainer from '../components/ProductTypeContainer';
import AddressContainer from '../components/AddressContainer';
import ProductContainer from '../components/ProductContainer';
import ProductInfoContainer from '../components/ProductInfoContainer';


export function ItemContainer({ children, title, isSubEl }) {
	let titleClass = isSubEl ? classes['input-subtitle'] : classes["input-title"];
	let containerClass = isSubEl ? classes['input-subcontainer'] : classes['input-container']; 
    return (
        <>
            <div className={titleClass}>{title}</div>

            <div className={containerClass}>{children}</div>
        </>
    );
}

const initialAddressState = {
	data: null,
	dongName: '',
	bldName: '',
	brTitleIdx: '0',
	districtType: '',
	floors: '',
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
		// console.log('addressStateReducer:', data);

		let districtType = '';
		let brJijigu = [];
		if (data.brJijigu.length > 0) {
			brJijigu = data.brJijigu.filter(item => item['jijiguGbCd'] === '1');
			brJijigu.sort(function (a,b) {return a.jijiguCd.localeCompare(b.jijiguCd);});
			districtType = [...(new Set(brJijigu.map(item => item.jijiguCdNm)))].join(', ');
		}

		let dongName = '';
		let bldName = '';
		if (data && data.brTitle) {
			let brTitle = data.brTitle.length > 0 ? data.brTitle[0] : null;
			if (brTitle) {
				dongName = brTitle.dongNm.trim();
				bldName = brTitle.bldNm.trim();
			}
		}

		let nextState = {
			...initialAddressState,
			dongName,
			bldName,
			data,
			districtType
		};
		if (nextState.data && sessionStorage) sessionStorage.setItem('addressState', JSON.stringify(nextState));
		return nextState;
	}

	if (action.type === 'UPDATE_DONGNAME') {
		let bldName = action.payload.bldName.trim();
		let dongName = action.payload.dongName.trim();
		let brTitleIdx = '0';
		for (let [idx, item] of Object.entries(state.data.brTitle)) {
            if (dongName === item['dongNm'].trim() && bldName === item['bldNm'].trim()) {
                brTitleIdx = idx;
            	break;
            }
        }

        let floors = '';

        let nextState = { 
        	...state,
        	floors,
			dongName,
			bldName,
			brTitleIdx
		}
        if (nextState.data && sessionStorage) sessionStorage.setItem('addressState', JSON.stringify(nextState));
		return nextState;
	}

	if (action.type === 'UPDATE_FLOOR') {
		let floors = action.payload;
		let nextState = {
			...state,
			floors,
		};
		if (nextState.data && sessionStorage) sessionStorage.setItem('addressState', JSON.stringify(nextState));
		return nextState;
	}

	if (action.type === 'RESTORE') {
		let storedState = JSON.parse(sessionStorage.getItem('addressState') || '{}');
		if (Object.keys(storedState).length === 0) {
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

    let storedTradeType = sessionStorage.getItem('tradeType');
    let storedProductType = sessionStorage.getItem('productType');
    let storedProductSubType = sessionStorage.getItem('productSubType');

    let [tradeType, setTradeType] = useState(storedTradeType ? storedTradeType : '');;
    let [productType, setProductType] = useState(storedProductType ? storedProductType : '');
    let [productSubType, setProductSubType] = useState(storedProductSubType ? storedProductSubType : '');

    const [addressState, dispatchAddress] = useReducer(addressStateReducer, initialAddressState);
    console.log('addressState: ', addressState);

    let actionData = useActionData();
    console.log('actionData:', actionData)
 
    function resetAll(event) {
    	setTradeType('');
        setProductType('');
        setProductSubType('');
        dispatchAddress({type: 'RESET'});
        sessionStorage.setItem('addressDetail', '');
    }

    useEffect(() => {
    	dispatchAddress({ type: "RESTORE" });
    }, [])

    useEffect(() => {
        if (sessionStorage) sessionStorage.setItem('tradeType', tradeType);
    }, [tradeType]);

    useEffect(() => {
        if (sessionStorage) sessionStorage.setItem('productType', productType);
    }, [productType]);

    useEffect(() => {
        if (sessionStorage) sessionStorage.setItem('productSubType', productSubType);
    }, [productSubType]);

    return (
        <div className={classes["body-container"]}> 
            <Form method="post" className={classes["main-container"]}>
            	<fieldset className={classes['input-set']}>
            		<legend>매물 종류</legend>
                	<ProductTypeContainer
	                	tradeType={tradeType} setTradeType={setTradeType}
	                    productType={productType} setProductType={setProductType}
	                    productSubType={productSubType} setProductSubType={setProductSubType}
	                />
	            </fieldset>

	            <fieldset className={classes['input-set']}>
            		<legend>주소 정보</legend>
            		<div className={classes["input-grid"]}>
	                	<AddressContainer addressState={addressState} dispatchAddress={dispatchAddress} />
	                </div>
                </fieldset>

                <fieldset className={classes['input-set']}>
            		<legend>매물 정보</legend>
                	<ProductContainer addressState={addressState} />
                </fieldset>

                <fieldset className={classes['input-set']}>
            		<legend>건물 정보</legend>
            		<div className={classes["input-grid"]}>
	                	<ProductInfoContainer addressState={addressState} />
	                </div>
                </fieldset>

                <div className={classes['button-container']}>
                	<button type='reset' onClick={resetAll}>모두 지우기</button>
                	<button type="submit">Create</button>
                </div>
            </Form>
        </div>
    );
}

export default NewSellPost;


export async function action({ request }) {
	const formData = await request.formData();
	const postData = Object.fromEntries(formData);
	console.log('form action: ', postData);
	return postData
}