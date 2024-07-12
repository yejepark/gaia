import { useEffect, useReducer } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

import classes from './NewSellPost.module.css';

import ProductTypeContainer from '../components/ProductTypeContainer';
import AddressContainer from '../components/AddressContainer';
import ProductContainer from '../components/ProductContainer';
import ProductInfoContainer from '../components/ProductInfoContainer';

import DropDownInputForm from '../components/DropDownInputForm';

export function ItemContainer({ children, title, isSubEl }) {
    let titleClass = isSubEl ? classes['input-subtitle'] : classes["input-title"];
    let containerClass = isSubEl ? classes['input-subcontainer'] : classes['input-container'];
    return [
        <div key={1} className={titleClass}>{title}</div>,
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

const getDefaultValues = () => {
    const today = new Date();
    let thisYear = today.getFullYear();
    let thisMonth = today.getMonth() + 1;
    let thisDay = today.getDate();

    return {
        tradeType: '',
        productType: '',
        productSubType: '',
        topAddress: '',
        addressDetail: '',
        hoName: '',
        floors: [],
        mainPurpose: '',
        ugrndFlrCnt: 0,
        grndFlrCnt: 1,
        hoCnt: 0,
        hhldCnt: 0,
        fmlyCnt: 0,
        indrAutoUtcnt: 0,
        indrMechUtcnt: 0,
        oudrAutoUtcnt: 0,
        oudrMechUtcnt: 0,
        rideUseElvtCnt: 0,
        emgenUseElvtCnt: 0,
        useAprDay: { Y: thisYear, M: thisMonth, D: thisDay },
        platArea: 0,
        archArea: 0,
        totArea: 0,
        tradePrice: 0,
        deposit: 0,
        monthlyRent: 0,
        premium: { operation: 0, facility: 0, location: 0 },
        income: { revenue: 0, cogs: 0, wage: 0, utilityCost: 0, manageCost: 0, profit: 0 },
        moveInDay: { Y: thisYear, M: thisMonth, D: thisDay },
        loan: { percentage: 0 },
        ...getSavedData(),
    };
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
        let data = action.payload;
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

        let nextState = {
            ...state,
            dongName,
            bldName,
            brTitleIdx
        }
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


// Auto Fill Product Info ------------------------------------------
function clickFillProductInfo(addressState, setValue) {
    if (addressState.data && addressState.data.brTitle && addressState.data.brTitle.length > 0) {
        let brTitle = addressState.data.brTitle[addressState.brTitleIdx];
        let toSet = {
            mainPurpose: 'mainPurpsCdNm',
            ugrndFlrCnt: 'ugrndFlrCnt',
            grndFlrCnt: 'grndFlrCnt',
            hoCnt: 'hoCnt',
            hhldCnt: 'hhldCnt',
            fmlyCnt: 'fmlyCnt',
            indrAutoUtcnt: 'indrAutoUtcnt',
            indrMechUtcnt: 'indrMechUtcnt',
            oudrAutoUtcnt: 'oudrAutoUtcnt',
            oudrMechUtcnt: 'oudrMechUtcnt',
            rideUseElvtCnt: 'rideUseElvtCnt',
            emgenUseElvtCnt: 'emgenUseElvtCnt',
            strctCdNm: 'strctCdNm',
        };
        for (const [k, v] of Object.entries(toSet)) {
            setValue(k, brTitle[v]);
        }

        let useAprDay = brTitle['useAprDay'];
        setValue('useAprDay', {
            Y: Number(useAprDay.slice(0, 4)),
            M: Number(useAprDay.slice(4, 6)),
            D: Number(useAprDay.slice(6, 8)),
        });

        setValue('districtType', addressState.districtType);

        let platArea = brTitle.platArea ? Number(brTitle.platArea) : 0;
        let archArea = brTitle.archArea ? Number(brTitle.archArea) : 0;
        let totArea = brTitle.vlRatEstmTotArea ? Number(brTitle.vlRatEstmTotArea) : 0;

        setValue('platArea', platArea.toFixed(1));
        setValue('archArea', archArea.toFixed(1));
        setValue('totArea', totArea.toFixed(1));
    }
}


export function ValuesToElementsForm({ values }) {
    const { register, formState : { errors } } = useFormContext();

    return values.map((item, idx) => {
        if (item.subtitle) {
            return <div key={idx} className={classes['input-subtitle']}>{item.subtitle}</div>;
        } else if (Object.keys(item).includes('calculated')) {
            return ( 
                <div key={idx} className={classes['input-subcontainer'] + ' ' + classes['input-with-unit']}>
                    <input type='text' 
                        value={item.calculated ? item.calculated : 0} 
                        className={classes["input-value"] + ' not-focusable'} 
                        readOnly
                    />
                    <div className={classes.unit}>{item.unit}</div>
                </div>
            );
        } else if (item.name) {
            let error;
            let names = item.name.split('.');
            if (errors[names[0]]) {
                error = names.length === 1 ? errors[names[0]] : errors[names[0]][names[1]];
            }
            return (
                <div key={idx} className={classes['input-subcontainer']}>
                    <div className={'subflex-col-inner'}>
                        <div className={classes['input-with-unit']}>
                            <input type='text'
                                className={classes["input-value"] + ' focusable'} 
                                autoComplete='off'
                                {...register(item.name, item.options)} 
                            />
                            <div className={classes.unit}>{item.unit}</div>
                        </div>
                        {error && <span className={'error-message'}> {error.message} </span>}
                    </div>
                </div>
            );
        } else {
        	return <div key={idx}></div>
        }
    });
}


export function ValuesToDropDownForm({ title, values, isSubEl, name }) {
    return (
        <ItemContainer title={title} isSubEl={isSubEl}>
            <DropDownInputForm
                name={name}
                values={values} 
                options={{
                    placeholder: "직접입력",
                    custumClass: classes['dropdown-container'],
                }}
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
    // console.log('savedValues : ', getSavedData());
    // console.log('defaultValues :', getDefaultValues());
    const methods = useForm({ defaultValues: getDefaultValues(), });

    const { register, watch, handleSubmit, getValues, setValue, reset, formState: { errors }, } = methods;

    // -------------------------------------------------------------    
    function resetAll(event) {
        dispatchAddress({ type: 'RESET' });
        reset();
        // sessionStorage.setItem('addressDetail', '');
        // sessionStorage.setItem('hoName', '');
    }

    const onSubmit = (data) => {
        console.log('(in onSubmit) data: ', data);
    }

    usePersistForm({ value: JSON.stringify(getValues()), storageKey: FORM_DATA_KEY });

    renderCount++;

    return (
        <div className={classes["body-container"]}> 
        	<FormProvider {...methods}>
	        	<form onSubmit={handleSubmit(onSubmit)} className={classes['main-container']}>
                    <div> Render count: {renderCount} </div>
	            	<fieldset className={classes['input-set']}>
	            		<legend>매물 종류</legend>
	                	<ProductTypeContainer />
		            </fieldset>

		            <fieldset className={classes['input-set']}>
	            		<legend>주소 정보</legend>
	            		<div className={classes["input-grid"]}>
		                	<AddressContainer
		                		addressState={addressState} dispatchAddress={dispatchAddress}
		                		register={register} watch={watch} />
		                </div>
	                </fieldset>

	                <fieldset className={classes['input-set']}>
	            		<legend>매물 정보</legend>
	                	<ProductContainer addressState={addressState} />
	                </fieldset>

	                { watch('topAddress') &&
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
		            		<div className={classes["input-grid"]}>
			                	<ProductInfoContainer addressState={addressState} />
			                </div>
		                </fieldset>
		            }

	                <div className={classes['button-container']}>
	                	<button type='reset' onClick={resetAll}>모두 지우기</button>
	                	<button type="submit">Create</button>
	                </div>
	            </form>
            </FormProvider>
            {/*<button type='button' onClick={handleSubmit((d) => console.log(d))}> Save </button>*/}
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