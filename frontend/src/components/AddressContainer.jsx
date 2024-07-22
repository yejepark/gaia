import { useFormContext, useWatch } from 'react-hook-form';

import parentClasses from '../pages/NewSellPost.module.css';

import AddressInput from './AddressInput';
import DropDownInputForm from './DropDownInputForm';
import MultipleChoiceForm from './MultipleChoiceForm';

import { ItemContainer } from '../pages/NewSellPost';


function TopEl({ register }) {
    return (<>
        <div></div>
        <div className={parentClasses['input-subcontainer']}>
            <input 
                {...register('topAddress')}
                type="text"  
                className={parentClasses["input-value"] + ' focusable'}
                placeholder='직접입력' 
                autoComplete="off"
            />
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
                name='dongName'
                values={dongNms}
                options={{
                    placeholder: "직접입력",
                }}
                setCustomValue={(bldAndDong) => {
                    const [bldName, dongName] = bldAndDong.split('|');
                    dispatchAddress({ type: 'UPDATE_DONGNAME', payload: {bldName, dongName} });
                }}
                withoutPipe={true}
            />
        </ItemContainer>
    );

    return <> { dongNms.length > 0 && dongEl } </>;
}


function FloorEl({ addressState, dispatchAddress }) {
    const { register, control } = useFormContext();
    const entireBuliding = useWatch({ control, name: 'floors.entireBuilding' });
    const pickedFloors = useWatch({ control, name: 'floors.picked' });

    const brTitle = addressState.data.brTitle[addressState.brTitleIdx]

    const ugrndFlrKeys = Array.from({ length: brTitle.ugrndFlrCnt }, (x, i) => -(i + 1));
    const grndFlrKeys = Array.from({ length: brTitle.grndFlrCnt }, (x, i) => i + 1);
    const flrKeys = grndFlrKeys.concat(ugrndFlrKeys);
    const floorMap = Object.fromEntries(flrKeys.map(k => {
        if (k < 0) return ['B' + `${-k}`.padStart(3, '0'), `지하${-k}층`];
        return ['A' + `${k}`.padStart(3, '0'), `${k}층`];
    }));

    const oneOrLessFloor = pickedFloors.length === 1;
    return (
        <div className={parentClasses['input-subflex-row']}>
            <label className={parentClasses['input-checkbox']}>
                <input type="checkbox" {...register('floors.entireBuilding')} />
                <div>건물 전체</div>
            </label>
            {brTitle && !entireBuliding &&
                <div style={{height: '2rem'}}>
                    <MultipleChoiceForm name='floors.picked' choiceMap={floorMap} defaultBtnLabel='층 선택' notActive={true} />
                </div>
            }
            {brTitle && !entireBuliding && oneOrLessFloor &&
                <div style={{width: '10rem'}}>
                    <div className={parentClasses['input-with-unit']}>
                        <input {...register('hoName')} type='text' className={parentClasses["input-value"] + ' focusable'} />
                        <div className={parentClasses.unit}>호</div>
                    </div>
                </div>
            }
        </div>
    );
}


function AddressContainer({ addressState, dispatchAddress, register, watch }) {
    // console.log('in AddressContainer')

    const hasAddressData = addressState.data ? Object.keys(addressState.data).length > 0 : null;

    let brTitle;
    if (addressState.data && addressState.data.brTitle.length > 0) {
        brTitle = addressState.data.brTitle[addressState.brTitleIdx];
    }

    const searchBtn = (
        <ItemContainer title='주소'>
            <AddressInput addressState={addressState} dispatchAddress={dispatchAddress} />
        </ItemContainer>
    );

    const floorEl = (
        <ItemContainer title=''>
            <FloorEl addressState={addressState} dispatchAddress={dispatchAddress} />
        </ItemContainer>
    );

    const detailEl = (
        <ItemContainer title='상세주소'>
            <input {...register('addressDetail')} 
                type='text' 
                className={parentClasses["input-value"] + ' focusable'} 
                style={{width: '100%', fontSize: '.9rem'}}
            />
        </ItemContainer>
    );

    return (<>
        {searchBtn}
        {hasAddressData && <TopEl register={register} />}
        {hasAddressData && <DongEl addressState={addressState} dispatchAddress={dispatchAddress} />}
        {hasAddressData && floorEl}
        {hasAddressData && detailEl}
    </>)
}

export default AddressContainer;