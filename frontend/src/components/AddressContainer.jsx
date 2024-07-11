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

    let dongNms = addressState.data.brTitle.map((item, idx) => {
        let dongNm = item.bldNm === item.dongNm ? ' ' : item.dongNm;
        return {
            text: (item.bldNm + ' ' + dongNm).trim(),
            value: item.bldNm + '|' + dongNm,
            key: item.bldNm + '-' + dongNm + '-' + idx,
        };
    }).filter((item) => item.text.trim().length > 0);

    dongNms.sort(function(a, b) { return ('' + a.value).localeCompare(b.value); });

    let dongEl = (
        <ItemContainer title='동 명칭'>
            <DropDownInputForm
                name='dongName'
                values={dongNms}
                options={{
                    placeholder: "직접입력",
                    custumClass: parentClasses['dropdown-container'],
                }}
                setCustomValue={(bldAndDong) => {
                    let [bldName, dongName] = bldAndDong.split('|');
                    dispatchAddress({ type: 'UPDATE_DONGNAME', payload: {bldName, dongName} });
                }}
                withoutPipe={true}
            />
        </ItemContainer>
    );

    return <> { dongNms.length > 0 && dongEl } </>;
}


function FloorEl({ addressState, dispatchAddress }) {
    let brTitle = addressState.data.brTitle[addressState.brTitleIdx]

    let ugrndFlrKeys = Array.from({ length: brTitle.ugrndFlrCnt }, (x, i) => -(i + 1));
    let grndFlrKeys = Array.from({ length: brTitle.grndFlrCnt }, (x, i) => i + 1);
    let flrKeys = grndFlrKeys.concat(ugrndFlrKeys);
    let floorMap = Object.fromEntries(flrKeys.map(k => {
        if (k < 0) return ['B' + `${-k}`.padStart(3, '0'), `지하${-k}층`];
        return ['A' + `${k}`.padStart(3, '0'), `${k}층`];
    }));

    return (
        <ItemContainer title='층 선택' isSubEl={true}>
            <MultipleChoiceForm name='floors' choiceMap={floorMap} defaultBtnLabel='' notActive={true} />
        </ItemContainer>
    );
}


function AddressContainer({ addressState, dispatchAddress, register, watch }) {
    // console.log('in AddressContainer')

    let hasAddressData = addressState.data ? Object.keys(addressState.data).length > 0 : null;

    let brTitle;
    if (addressState.data && addressState.data.brTitle.length > 0) {
        brTitle = addressState.data.brTitle[addressState.brTitleIdx];
    }

    let searchBtn = (
        <ItemContainer title='주소'>
            <AddressInput addressState={addressState} dispatchAddress={dispatchAddress} />
        </ItemContainer>
    );

    let hoEl = (
        <ItemContainer title='호 명칭' isSubEl={true}>
            <div className={parentClasses['input-with-unit']}>
                <input {...register('hoName')} type='text' className={parentClasses["input-value"] + ' focusable'} />
                <div className={parentClasses.unit}>호</div>
            </div>
        </ItemContainer>
    );

    let oneOrLessFloor = watch('floors').length === 1;
    let midEl = (
        <ItemContainer>
            <div className={parentClasses['input-subgrid']}>
                {brTitle && <FloorEl addressState={addressState} dispatchAddress={dispatchAddress} />}
                {brTitle && oneOrLessFloor && hoEl}                
            </div>
        </ItemContainer>
    );

    let detailEl = (
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