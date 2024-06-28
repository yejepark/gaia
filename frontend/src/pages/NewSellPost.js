import { useEffect, useState, useReducer } from 'react';

import classes from './NewSellPost.module.css';

import SingleChoice from '../components/SingleChoice';
import DropDownInput from '../components/DropDownInput';

import AddressContainer from '../components/AddressContainer';
import ProductTypeContainer from '../components/ProductTypeContainer';
import ProductInfoContainer from '../components/ProductInfoContainer';


const initialAddressState = {
	data: null,
	dongName: '',
	brTitleIdx: '0',
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
		let nextState = {
			...initialAddressState,
			data: action.payload,
		};
		if (nextState.data && sessionStorage) sessionStorage.setItem('addressState', JSON.stringify(nextState));
		return nextState;
	}

	if (action.type === 'UPDATE_DONGNAME') {
		let dongName = action.payload;
		let brTitleIdx;
		for (let [idx, item] of Object.entries(state.data.brTitle)) {
            if (item['dongNm'] === dongName) {
                brTitleIdx = idx;
            	break;
            }
        }
        let nextState = { 
        	...state,
			dongName,
			brTitleIdx,
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
            <div className={classes["main-container"]}>
                <ProductTypeContainer
                    productType={productType} setProductType={setProductType}
                    productSubType={productSubType} setProductSubType={setProductSubType}
                />
                <AddressContainer addressState={addressState} dispatchAddress={dispatchAddress} />
                <ProductInfoContainer addressState={addressState} />
                <button onClick={resetAll}>모두 지우기</button>
            </div>
        </div>
    );
}

export default NewSellPost;