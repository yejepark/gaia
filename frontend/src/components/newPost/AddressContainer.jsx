import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import parentClasses from '../../pages/NewSellPost.module.css';

import AddressInput from './AddressInput';
import DropDownInputForm from '../menu/DropDownInputForm';
import MultipleChoiceForm from '../menu/MultipleChoiceForm';

import { ItemContainer } from '../../pages/NewSellPost';

const isRequired = {required: '필수 입력 항목입니다.'};

function TopEl() {
    const { register, formState: { errors } } = useFormContext();
    const error = errors.address?.top;
    return (<>
        <div>
            <input {...register('address.legal')} type='hidden' />
            <input {...register('address.road')} type='hidden' />
            <input {...register('lnglat')} type='hidden'/>
        </div>
        <div className={parentClasses['input-subcontainer']}>
            <input 
                {...register('address.top', isRequired)}
                type="text"  
                className={parentClasses["input-value"] + ' focusable'}
                placeholder='직접입력' 
                autoComplete="off"
            />
            {error && <span className={'error-message'}> {error.message} </span>}
        </div>
    </>);
}


function DongEl({ addressState, dispatchAddress }) {

    const dongNms = addressState.data.brTitle.map((item, idx) => {
        const dongNm = item.bldNm === item.dongNm ? ' ' : item.dongNm;
        return {
            text: (item.bldNm + ' ' + dongNm).trim(),
            value: item.bldNm + '|' + dongNm,
            key: item.bldNm + '-' + dongNm + '-' + idx,
        };
    }).filter((item) => item.text.trim().length > 0);

    dongNms.sort(function(a, b) { return ('' + a.value).localeCompare(b.value); });

    const dongEl = (
        <ItemContainer title='동 명칭'>
            <DropDownInputForm
                name='address.dongName'
                values={dongNms}
                options={{
                    placeholder: "직접입력",
                    withoutPipe: true,
                    setCustomValue: (bldAndDong) => {
                        const [bldName, dongName] = bldAndDong.split('|');
                        dispatchAddress({ type: 'UPDATE_DONGNAME', payload: {bldName, dongName} });
                    },
                }}
            />
        </ItemContainer>
    );

    return <> { dongNms.length > 0 && dongEl } </>;
}


function FloorEl({ addressState, dispatchAddress }) {
    const { register, setValue } = useFormContext();
    const entireBuilding = useWatch({ name: 'floors.entireBuilding' });
    const pickedFloors = useWatch({ name: 'floors.picked' });
    const productType = useWatch({ name: 'productType' });

    useEffect(() => {
        if (productType === 'building' || productType === 'industrial') {
            setValue('floors.entireBuilding', true);
        }
    }, [productType, setValue]);

    const brTitle = addressState.data.brTitle[addressState.brTitleIdx]

    const ugrndFlrKeys = Array.from({ length: brTitle.ugrndFlrCnt }, (x, i) => -(i + 1));
    const grndFlrKeys = Array.from({ length: brTitle.grndFlrCnt }, (x, i) => i + 1);
    const flrKeys = grndFlrKeys.concat(ugrndFlrKeys);
    const floorMap = Object.fromEntries(flrKeys.map(k => {
        if (k < 0) return ['B' + `${-k}`.padStart(3, '0'), `지하${-k}층`];
        return ['A' + `${k}`.padStart(3, '0'), `${k}층`];
    }));

    const oneOrLessFloor = pickedFloors.length === 1;

    const rules = entireBuilding ? {} : {validate: val => val.length > 0 || '1개 이상의 층을 고르세요.'};
    return (
        <div className={parentClasses['input-subflex-row']}>
            <label className={parentClasses['input-checkbox']}>
                <input type="checkbox" {...register('floors.entireBuilding')} />
                <div>건물 전체</div>
            </label>
            {brTitle && !entireBuilding &&
                <div style={{height: '2rem'}}>
                    <MultipleChoiceForm name='floors.picked' choiceMap={floorMap} defaultBtnLabel='층 선택' notActive={true} rules={rules}/>
                </div>
            }
            {brTitle && !entireBuilding && oneOrLessFloor &&
                <div style={{width: '10rem'}}>
                    <div className={parentClasses['input-with-unit']}>
                        <input {...register('address.hoName')} type='text' className={parentClasses["input-value"] + ' focusable'} />
                        <div className={parentClasses.unit}>호</div>
                    </div>
                </div>
            }
        </div>
    );
}


function AddressContainer({ addressState, dispatchAddress }) {
    const { register } = useFormContext();

    console.log('in AddressContainer')

    const hasAddressData = addressState.data ? Object.keys(addressState.data).length > 0 : null;

    let brTitle;
    if (addressState.data && addressState.data.brTitle.length > 0) {
        brTitle = addressState.data.brTitle[addressState.brTitleIdx];
    }

    const searchBtn = (
        <ItemContainer title='주소' required={true}>
            <AddressInput addressState={addressState} dispatchAddress={dispatchAddress} />
        </ItemContainer>
    );

    const floorEl = (
        <ItemContainer title=''>
            {brTitle && <FloorEl addressState={addressState} dispatchAddress={dispatchAddress} />}
        </ItemContainer>
    );

    const detailEl = (
        <ItemContainer title='상세주소'>
            <input {...register('address.detail')} 
                type='text' 
                className={parentClasses["input-value"] + ' focusable'} 
                style={{width: '100%', fontSize: '.9rem'}}
            />
        </ItemContainer>
    );

    return (<>
        {searchBtn}
        {hasAddressData && <TopEl />}
        {hasAddressData && <DongEl addressState={addressState} dispatchAddress={dispatchAddress} />}
        {hasAddressData && floorEl}
        {hasAddressData && detailEl}
    </>)
}

export default AddressContainer;