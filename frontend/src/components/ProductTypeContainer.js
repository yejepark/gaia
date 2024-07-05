import classes from './ProductTypeContainer.module.css';

import SingleChoice from './SingleChoice';

const tradeTypeMap = {
    sell: '매매',
    jeonse: '전세',
    lease: '월세',
    shortLease: '단기임대'
}

const sanggaTypeMap = {
    danjiMall: "단지내상가", 
    normalMall: "일반상가",
    complexMall: "복합상가"
};

const officeTypeMap = {
    largeOffice: "대형사무실",
    smallOffice: "중소형사무실",
    officetel: "오피스텔"
};

const factoryTypeMap = {
    factory: "공장", 
    storage: "창고", 
    otherFactory: "기타시설"
};

const buildingTypeMap = {
    building: "빌딩", 
    commercialBuilding: "상업시설", 
    leisureBuilding: "레저/스포츠/위락", 
    specialBuilding: "특수시설", 
    otherBuilding: "기타빌딩"
};
const lodgingTypeMap = {
    inn: "여관/모텔", 
    condo: "콘도", 
    pension: "펜션", 
    otherLodging: "기타"
};

const typeToSubTypeMap = {
    sangga: sanggaTypeMap,
    office: officeTypeMap,
    factory: factoryTypeMap,
    intIndCenter: null,
    building: buildingTypeMap,
    sanggaBuilding: null,
    lodging: lodgingTypeMap
};

const productTypeMap = {
    sangga: '상가점포',
    office: '사무실',
    factory: '공장/창고',
    intIndCenter: '지삭산업센터',
    // land: '토지/임야',
    building: '빌딩/건물',
    sanggaBuilding: '상가건물',
    lodging: '숙박/콘도',   
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

function ProductTypeContainer({ tradeType, setTradeType, productType, setProductType, productSubType, setProductSubType }) {

    let tradeTypeEl = (
        <ItemContainer title='거래유형'>
            <SingleChoice
                chosen={tradeType} setChosen={setTradeType} choiceMap={tradeTypeMap}
                btnLabel='선택하기' name='tradeType'
            />
        </ItemContainer>
    );
    
    let productTypeEl = (
        <ItemContainer title='대분류'>
           <SingleChoice
                chosen={productType} setChosen={setProductType} choiceMap={productTypeMap}
                btnLabel='선택하기' name='productType'
            />
        </ItemContainer>
    );

    let chosenTypeMap = productType && typeToSubTypeMap[productType];

    let productSubTypeEl = chosenTypeMap && (
        <ItemContainer title='소분류'>
            <SingleChoice
                chosen={productSubType} setChosen={setProductSubType} choiceMap={chosenTypeMap} 
                btnLabel='선택하기' name='productSubType'
            />
        </ItemContainer>
    );
        
    return (
        <div className={classes["input-grid"]}>
            {tradeTypeEl}
            {productTypeEl}
            {productSubTypeEl}
        </div>
    );
}

export default ProductTypeContainer;