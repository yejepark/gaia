import { useEffect, useReducer } from 'react';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { intToUnitStr } from '../utilities/methods';

import classes from './NewSellPost.module.css';

import ProductTypeContainer from '../components/newPost/ProductTypeContainer';
import AddressContainer from '../components/newPost/AddressContainer';
import ProductContainer from '../components/newPost/ProductContainer';
import ProductInfoContainer from '../components/newPost/ProductInfoContainer';

import DropDownInputForm from '../components/menu/DropDownInputForm';

export function ItemContainer({ children, title, isSubEl, required }) {
    const titleClass = isSubEl ? classes['input-subtitle'] : classes["input-title"];
    const containerClass = isSubEl ? classes['input-subcontainer'] : classes['input-container'];
    return [
        <div key={1} className={titleClass}>
            {title}
            {required ? <span className='required'>*</span> : null}
        </div>,
        <div key={2} className={containerClass}>{children}</div>
    ];
}

// Form Data Persistence ------------------------------------------
const usePersistForm = ({ value, storageKey }) => {
    useEffect(() => {
        sessionStorage.setItem(storageKey, value);
    }, [value, storageKey]);

    return;
};

const FORM_DATA_KEY = "app_form_local_data";

const getSavedData = () => {
    let data = sessionStorage.getItem(FORM_DATA_KEY);
    if (data) {
        try {
            data = JSON.parse(data);
            // console.log('savedData: ', data);
        } catch (err) {
            console.log(err);
        }
        return data;
    }
    return {};
}

const today = new Date();
const thisYear = today.getFullYear();
const thisMonth = today.getMonth() + 1;
const thisDay = today.getDate();
export const initialDefaultValues = {
    isAgent: false,
    tradeType: '',
    productType: '',
    productSubType: '',
    address: { top: '', dongName: '', detail: '', hoName: '', legal: '', road: '' },
    latlng: [],
    floors: { picked: [], entireBuilding: false },
    mainPurpose: '',
    flrCnt: { ugrnd: 0, grnd: 1, ugrndUnit: '층', grndUnit: '층' },
    roomCnt: { ho: 0, household: 0, family: 0, hoUnit: '개', householdUnit: '개', familyUnit: '개' },
    parkingCnt: { indrAuto: 0, indrMech: 0, oudrAuto: 0, oudrMech: 0,  
        indrAutoUnit: '대', indrMechUnit: '대', oudrAutoUnit: '대', oudrMechUnit: '대'},
    elvtCnt: { rideUse: 0, emgenUse: 0, rideUseUnit: '대', emgenUseUnit: '대'},
    useAprDay: { Y: thisYear, M: thisMonth, D: thisDay },
    area: { plat: 0, arch: 0, total: 0, platUnit: 'm2', archUnit: 'm2', totalUnit: 'm2' },
    price: { sale: 0, deposit: 0, monthlyRent: 0, saleUnit: '만원', depositUnit: '만원', monthlyRentUnit: '만원' },
    premium: {
        exist: false, negotiable: false,
        operation: 0, facility: 0, location: 0, operationUnit: '만원', facilityUnit: '만원', locationUnit: '만원', 
    },
    upkeep: { cost: 0, costUnit: '원' },
    income: { 
        operating: 'empty', expose: false, mustAcquire: false,
        revenue: 0, rent: 0, cogs: 0, wage: 0, utilityCost: 0, profit: 0,
        revenueUnit: '만원', rentUnit: '만원', cogsUnit: '만원', wageUnit: '만원', utilityCostUnit: '만원', profitUnit: '만원' },
    loan: {  exist: false, expose: false, pct: 0, pctUnit: '%' },
    moveInDay: { negotiable: false, Y: thisYear, M: thisMonth, D: thisDay },
    prodArea: { use: 0, contract: 0, useUnit: '평', contractUnit: '평' },
    parking: { available: false, count: 0, countUnit: '대' },
    businessType: { current: '', recommend: '', storeName: '' },
    usageType: { current: '', recommend: '' },
    facility: { heatingMethod: '', coolingMethod: '', heatingFuel: '', electricCap: 0, electricCapUnit: 'kW' },
    shortLease: { length: 12, negotiable: false, moreOrLess: 'more' },
}

// Address State Reducer -------------------------------------------
const initialAddressState = {
    data: null,
    dongName: '',
    bldName: '',
    brTitleIdx: '0',
    districtType: ''
}

function addressStateReducer(state, action) {
    if (action.type === 'FETCH_ERROR') {
        return {
            ...state,
            error: action.payload,
        };
    }

    if (action.type === 'FETCH_SUCCESS') {
        const data = action.payload;
        // console.log('addressStateReducer:', data);

        let districtType = '';
        let brJijigu = [];
        if (data.brJijigu.length > 0) {
            brJijigu = data.brJijigu.filter(item => item['jijiguGbCd'] === '1');
            brJijigu.sort(function(a, b) { return a.jijiguCd.localeCompare(b.jijiguCd); });
            districtType = [...(new Set(brJijigu.map(item => item.jijiguCdNm)))].join(', ');
        }

        let dongName = '';
        let bldName = '';
        if (data && data.brTitle) {
            const brTitle = data.brTitle.length > 0 ? data.brTitle[0] : null;
            if (brTitle) {
                dongName = brTitle.dongNm.trim();
                bldName = brTitle.bldNm.trim();
            }
        }

        const nextState = {
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
        const bldName = action.payload.bldName.trim();
        const dongName = action.payload.dongName.trim();
        let brTitleIdx = '0';
        for (const [idx, item] of Object.entries(state.data.brTitle)) {
            if (dongName === item['dongNm'].trim() && bldName === item['bldNm'].trim()) {
                brTitleIdx = idx;
                break;
            }
        }

        const nextState = {
            ...state,
            dongName,
            bldName,
            brTitleIdx
        }
        if (nextState.data && sessionStorage) sessionStorage.setItem('addressState', JSON.stringify(nextState));
        return nextState;
    }

    if (action.type === 'RESTORE') {
        const storedState = JSON.parse(sessionStorage.getItem('addressState') || '{}');
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


// Auto Fill Product Info ------------------------------------------
function clickFillProductInfo(addressState, setValue) {
    if (addressState.data && addressState.data.brTitle && addressState.data.brTitle.length > 0) {
        const brTitle = addressState.data.brTitle[addressState.brTitleIdx];
        const toSet = {
            mainPurpose: 'mainPurpsCdNm',
            'flrCnt.ugrnd': 'ugrndFlrCnt',
            'flrCnt.grnd': 'grndFlrCnt',
            'roomCnt.ho': 'hoCnt',
            'roomCnt.household': 'hhldCnt',
            'roomCnt.family': 'fmlyCnt',
            'parkingCnt.indrAuto': 'indrAutoUtcnt',
            'parkingCnt.indrMech': 'indrMechUtcnt',
            'parkingCnt.oudrAuto': 'oudrAutoUtcnt',
            'parkingCnt.oudrMech': 'oudrMechUtcnt',
            'elvtCnt.rideUse': 'rideUseElvtCnt',
            'elvtCnt.emgenUse': 'emgenUseElvtCnt',
            strctCdNm: 'strctCdNm',
        };
        for (const [k, v] of Object.entries(toSet)) {
            setValue(k, brTitle[v]);
        }

        const useAprDay = brTitle['useAprDay'];
        setValue('useAprDay', {
            Y: Number(useAprDay.slice(0, 4)),
            M: Number(useAprDay.slice(4, 6)),
            D: Number(useAprDay.slice(6, 8)),
        });

        setValue('districtType', addressState.districtType);

        const platArea = brTitle.platArea ? Number(brTitle.platArea) : 0;
        const archArea = brTitle.archArea ? Number(brTitle.archArea) : 0;
        const totArea = brTitle.vlRatEstmTotArea ? Number(brTitle.vlRatEstmTotArea) : 0;

        setValue('area.plat', platArea.toFixed(1));
        setValue('area.arch', archArea.toFixed(1));
        setValue('area.total', totArea.toFixed(1));
    }
}

// Common Components -----------------------------------------------------
export function InputWithUnit({ name, options, onUnitClick }) {
    // console.log('****in InputWithUnit', name, renderCount)
    const { register, formState: { errors }, control } = useFormContext();
    const unit = useWatch({ control, name: name + 'Unit' });
    const value = useWatch({ control, name });

    let error;
    const names = name.split('.');
    if (errors[names[0]]) {
        error = names.length === 1 ? errors[names[0]] : errors[names[0]][names[1]];
    }
    const unitElClass = classes.unit + (onUnitClick ? ' focusable alive-btn' : '');

    const isMoneyUnit = ['원', '만원'].includes(unit);
    const moneyUnitMult = (unit === '만원') ? 10000 : 1;

    return (<>
        <div className={classes['input-with-unit']}>
            <input type='text'
                className={classes["input-value"] + ' focusable'} 
                autoComplete='off'
                {...register(name, options)} 
            />
            
            <input type='hidden' {...register(name + 'Unit')} />
            
            <div className={unitElClass} onClick={onUnitClick}>
                {unit === 'm2' ? <>m<sup>2</sup></> : unit}
            </div>
        </div>

        {isMoneyUnit && value > 0 && 
            <span className={classes['input-money-value']}>{intToUnitStr(value * moneyUnitMult)}원</span>
        }

        {error && <span className={'error-message'}> {error.message} </span>}
    </>);
}

export function CalculatedInputWithUnit({ value, unit }) {
    return (
        <div className={classes['input-with-unit']}>
            <input type='text' 
                value={value ? value : 0} 
                className={classes["input-value"] + ' not-focusable'} 
                readOnly
            />
            <div className={classes.unit}>{unit === 'm2' ? <><sup>2</sup></> : unit}</div>
        </div>
    );
}


export function onAreaUnitClick(e, name, setValue, getValues) {
    const [value, unit] = getValues([name, name + 'Unit']);
    if (unit === 'm2') {
        setValue( name + 'Unit', '평' );
        setValue( name, Number((value * 0.3025).toFixed(1)) );
    } else {
        setValue( name + 'Unit', 'm2' );
        setValue( name, Number((value * 3.3058).toFixed(1)) );
    }
}

export function ValuesToElementsForm({ values }) {

    return values.map((item, idx) => {
        if (item.subtitle) {
            return (
                <div key={idx} className={classes['input-subtitle']}>
                    {item.subtitle}
                    {item.required ? <span className='required'>*</span> : null}
                </div>
            );
        } else if (Object.keys(item).includes('calculated')) {
            return ( 
                <div key={idx} className={classes['input-subcontainer']}>
                    <CalculatedInputWithUnit value={item.calculated} unit={item.unit} />
                </div>
            );
        } else if (item.name) {
            return (
                <div key={idx} className={classes['input-subcontainer']}>
                    <InputWithUnit name={item.name} options={item.options} onUnitClick={item.onUnitClick}/>
                </div>
            );
        } else {
        	return <div key={idx}></div>
        }
    });
}


export function ValuesToDropDownForm({ title, values, isSubEl, required, name, options }) {
    return (
        <ItemContainer title={title} isSubEl={isSubEl} required={required}>
            <DropDownInputForm
                name={name}
                values={values} 
                options={options ? options : {}}
            />
        </ItemContainer>
    );
}

let renderCount = 0;

function NewSellPost() {
    console.log('NewSellPost');

    const [addressState, dispatchAddress] = useReducer(addressStateReducer, initialAddressState);
    console.log('addressState: ', addressState);

    useEffect(() => {
        console.log('restore');
        dispatchAddress({ type: "RESTORE" });
    }, [])

    // react hook form ----------------------------------------------
    const methods = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues: {...initialDefaultValues, ...getSavedData()}, 
    });

    const { register, handleSubmit, getValues, setValue, reset } = methods;

    // -------------------------------------------------------------    
    function resetAll(event) {
        dispatchAddress({ type: 'RESET' });
        sessionStorage.removeItem(FORM_DATA_KEY);
        reset(initialDefaultValues);
    }

    const onSubmit = async (data) => {
        console.log('(in onSubmit) data: ', data);
        
        const res = await fetch(
            "http://localhost:8000/sell_posts/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                mode: "cors"
            }
        );

        const recvData = await res.json();

        console.log(recvData)
    }

    usePersistForm({ value: JSON.stringify(getValues()), storageKey: FORM_DATA_KEY });

    const { pathname } = useLocation();
    useEffect(() => {
        setValue('isAgent', pathname === '/newAgentPost');
    }, [pathname, setValue]);

    renderCount++;

    return (
        <div className={classes["body-container"]}> 
        	<FormProvider {...methods}>
	        	<form onSubmit={handleSubmit(onSubmit)} className={classes['main-container']}>
                    <input type="hidden" {...register('isAgent')} />
                    <div> Render count: {renderCount} </div>
	            	<fieldset className={classes['input-set']}>
	            		<legend>매물 종류</legend>
	                	<ProductTypeContainer />
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
	            		<div className={'positional-container'}>
	            			<button 
	            				type='button' 
	            				className={'inverted-alive-btn ' + classes['floating-btn']}
	            				onClick={(e) => clickFillProductInfo(addressState, setValue) }>
	            				자동입력
	            			</button>
	            		</div>
	            		<div className={classes["input-grid"] + ' ' + classes['hline']}>
		                	<ProductInfoContainer addressState={addressState} />
		                </div>
	                </fieldset>

	                <div className={classes['button-container']}>
	                	<button type='button' onClick={resetAll}>모두 지우기</button>
	                	<button type="submit">Create</button>
	                </div>
	            </form>
            </FormProvider>
            {/*<button type='button' onClick={handleSubmit((d) => console.log(d))}> Save </button>*/}
        </div>
    );
}

export default NewSellPost;


// export async function action({ request }) {
//     const formData = await request.formData();
//     const postData = Object.fromEntries(formData);
//     console.log('form action: ', postData);
//     return postData
// }