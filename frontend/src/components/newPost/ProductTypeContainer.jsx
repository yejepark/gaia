import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import classes from './ProductTypeContainer.module.css';

import SingleChoiceForm from '../menu/SingleChoiceForm';

export const tradeTypeMap = {
    lease: '임대',
    sale: '매매',
    shortLease: '단기임대'
}

const commercialTypeMap = {
    community: "단지내상가",
    complex: "복합상가",
    general: "일반상가",
    // neigbhor: '근린상가',
    // central: '중심상가',
    // underground: '지하상가',
    // theme: '테마상가',
    // mall: '쇼핑몰',
    // residential: '상가주택',
    // intIndCenter: '지식산업센터 지원상가',
    // other: "기타상가",
};

const officeTypeMap = {
    large: "대형사무실",
    midSmall: "중소형사무실",
    // soho: '소호사무실',
    officetel: "오피스텔",
    // coworking: '공유오피스',
    // virtual: '가상오피스',
    // other: '기타업무시설',
};

const industrialTypeMap = {
    factory: '공장',
    storage: '창고',
    other: '기타',
    // factory: "일반공장", 
    // heavyFactory: '중공업공장',
    // storage: "일반창고", 
    // selfStorage: '공유창고',
    // refrigeration: '냉동창고',
    // distribution: '물류센터',
    // terminal: '트럭터미널',
    // research: '연구시설',
    // dataCenter: '데이터센터',
    // other: "기타산업시설"
};

const buildingTypeMap = {
    building: "빌딩", 
    // commercial: "상업시설", 
    leisure: "레저/스포츠/위락", 
    special: "특수시설", 
    other: "기타"
};

// const lodgingTypeMap = {
//     hotel: '호텔',
//     motel: "여관/모텔", 
//     condo: "콘도", 
//     pension: "펜션", 
//     other: "기타"
// };

const typeToSubTypeMap = {
    commercial: commercialTypeMap,
    office: officeTypeMap,
    industrial: industrialTypeMap,
    intIndCenter: null,
    building: buildingTypeMap,
    // sanggaBuilding: null,
    lodging: null,
};

export const productTypeMap = {
    commercial: '상가',
    office: '사무실',
    industrial: '공장/창고',
    intIndCenter: '지식산업센터',
    // land: '토지/임야',
    lodging: '숙박/콘도',
    building: '빌딩/건물',
    // sanggaBuilding: '상가건물',
    // etc: '기타'
};

function ItemContainer({ children, title }) {
    return (
        <div className={classes['input-item']}>
            <div className={classes["input-title"]}>{title}</div> 
            <div className={classes['input-container']}>{children}</div>
        </div>
    );
}

const isRequired = {required: '필수 선택 항목입니다.'};

function ProductTypeContainer() {

    const { setValue } = useFormContext();

    const tradeTypeEl = (
        <ItemContainer title='거래유형' isSubEl={true}>
            <SingleChoiceForm name='tradeType' choiceMap={tradeTypeMap} btnLabel='선택하기' options={isRequired}/>
        </ItemContainer>
    );
    
    const productTypeEl = (
        <ItemContainer title='대분류'>
            <SingleChoiceForm name='productType' choiceMap={productTypeMap} btnLabel='선택하기' options={isRequired}/>
        </ItemContainer>
    );

    const productType = useWatch({ name: 'productType' });
    const productSubType = useWatch({ name: 'productSubType' });
    const chosenTypeMap = productType && typeToSubTypeMap[productType];

    // console.log('--', productType)

    const productSubTypeEl = chosenTypeMap && (
        <ItemContainer title='소분류'>
            <SingleChoiceForm name='productSubType' choiceMap={chosenTypeMap} btnLabel='선택하기' options={isRequired}/>
        </ItemContainer>
    );

    useEffect(() => {
        if (!typeToSubTypeMap[productType] || !Object.keys(typeToSubTypeMap[productType]).includes(productSubType)) {
            setValue('productSubType', '');    
        }
    }, [productType, productSubType, setValue]);
        
    return (
        <div className={classes["input-grid"]}>
            {tradeTypeEl}
            {productTypeEl}
            {productSubTypeEl}
        </div>
    );
}

export default ProductTypeContainer;