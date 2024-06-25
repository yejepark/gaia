import DropDownInput from '../components/DropDownInput';

const buildingUsages = [
    "단독주택", "공동주택", "제1종근린생활시설", "제2종근린생활시설",
    "문화및집회시설", "종교시설", "판매시설", "운수시설", "의료시설",
    "교육연구시설", "노유자시설", "수련시설", "운동시설", "업무시설",
    "숙박시설", "위락시설", "공장", "창고시설", "위험물저장및처리시설",
    "자동차관련시설", "동.식물관련시설", "분뇨.쓰레기처리시설",
    "교정및군사시설", "방송통신시설", "발전시설", "묘지관련시설", "관광휴게시설",
    "가설건축물", "장례식장", "미등기건물", "그밖에토지의정착물"
];

function ProductInfoContainer({  addressData, mainPurpose, setMainPurpose }) {
    let hasAddressData = Object.keys(addressData).length > 0;

    let addressMainPurposeEl;

    if (hasAddressData) {

        addressMainPurposeEl = (
            <>
                <div className={"input-title"}>건축물 주용도</div>
                <DropDownInput
                    localValue={mainPurpose} setLocalValue={setMainPurpose} 
                    values={buildingUsages} 
                    options={{
                        placeholder: "직접입력",
                        custumClass: 'main-purpose-input',
                    }}
                />
            </>
        )    
    }
    
    return (
        <div className="input-grid">
                {addressMainPurposeEl}
        </div>
    );
}

export default ProductInfoContainer;