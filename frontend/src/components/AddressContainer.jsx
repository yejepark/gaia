import { useFormContext } from 'react-hook-form';

import parentClasses from '../pages/NewSellPost.module.css';

import AddressInput from './AddressInput';
import DropDownInputForm from './DropDownInputForm';
import MultipleChoiceForm from './MultipleChoiceForm';

import { ItemContainer } from '../pages/NewSellPost';


function TopEl({ register }) {
    return (
        <ItemContainer>
            <input 
                {...register('topAddress')}
                type="text"  
                className={parentClasses["input-value"] + ' focusable'}
                placeholder='직접입력' 
                autoComplete="off"
            />
        </ItemContainer>
    );
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
                    customClass: parentClasses['dropdown-container'],
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
    const { register } = useFormContext();

    const brTitle = addressState.data.brTitle[addressState.brTitleIdx]

    const ugrndFlrKeys = Array.from({ length: brTitle.ugrndFlrCnt }, (x, i) => -(i + 1));
    const grndFlrKeys = Array.from({ length: brTitle.grndFlrCnt }, (x, i) => i + 1);
    const flrKeys = grndFlrKeys.concat(ugrndFlrKeys);
    const floorMap = Object.fromEntries(flrKeys.map(k => {
        if (k < 0) return ['B' + `${-k}`.padStart(3, '0'), `지하${-k}층`];
        return ['A' + `${k}`.padStart(3, '0'), `${k}층`];
    }));

    return (<>
            <label className={'input-checkbox'}>
                <input type="checkbox" {...register('entireBuilding')} />
                <div>건물 전체</div>
            </label>
            <MultipleChoiceForm name='floors' choiceMap={floorMap} defaultBtnLabel='층 선택' notActive={true} fitContent={true}/>
    </>);
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

    const hoEl = (
        <ItemContainer title='호 명칭' isSubEl={true}>
            <div className={parentClasses['input-with-unit']}>
                <input {...register('hoName')} type='text' className={parentClasses["input-value"] + ' focusable'} />
                <div className={parentClasses.unit}>호</div>
            </div>
        </ItemContainer>
    );

    const oneOrLessFloor = watch('floors').length === 1;
    const midEl = (
        <ItemContainer title='층 정보'>
                <div className={'subflex-row'}>
                    {brTitle && <FloorEl addressState={addressState} dispatchAddress={dispatchAddress} />}
                </div>
{/*            <div className={parentClasses['input-subgrid']}>
                {brTitle && <FloorEl addressState={addressState} dispatchAddress={dispatchAddress} />}
                {brTitle && oneOrLessFloor && hoEl}                
            </div>*/}
        </ItemContainer>
    );

    const detailEl = (
        <ItemContainer title='상세주소'>
            <input {...register('addressDetail')} type='text' className={parentClasses["input-value"] + ' focusable'} />
        </ItemContainer>
    );

    return (<>
        {searchBtn}
        {hasAddressData && <TopEl register={register} />}
        {hasAddressData && <DongEl addressState={addressState} dispatchAddress={dispatchAddress} />}
        {hasAddressData && midEl}
        {hasAddressData && detailEl}
    </>)
}

export default AddressContainer;