import { useEffect, useState } from 'react';

import SingleChoice from '../components/SingleChoice';
import AddressInput from '../components/AddressInput';

const buildingUsages = [
    "단독주택", "공동주택", "제1종 근린생활시설", "제2종 근린생활시설",
    "문화 및 집회시설", "종교시설", "판매시설", "운수시설", "의료시설",
    "교육연구시설", "노유자시설", "수련시설", "운동시설", "업무시설",
    "숙박시설", "위락시설", "공장", "창고시설", "위험물 저장 및 처리 시설",
    "자동차 관련 시설", "동물 및 식물 관련 시설", "자원순환 관련 시설",
    "교정 및 군사 시설", "방송통신시설", "묘지 관련 시설", "관광 휴게 시설",
    "장례시설", "야영장시설", "미등기건물", "그밖에 토지의 정착물"
];

const officeTypes = ["대형사무실", "중소형사무실", "오피스텔"];
const shoppingDistrictTypes = ["단지내상가", "일반상가", "복합상가"];
const factoryTypes = ["공장", "창고", "기타"];
const buildingTypes = ["빌딩", "상업시설", "레저/스포츠/위락", "특수시설", "기타"];
const lodgingTypes = ["여관/모텔", "콘도", "펜션", "기타"];

const productTypeMap = {
    sangga: '상가점포',
    office: '사무실',
    
    factory: '공장/창고',
    intIndCenter: '지삭산업센터',

    land: '토지/임야',
    
    building: '빌딩/건물',
    sanggaBuilding: '상가건물',
    lodging: '숙박/콘도',
    
    etc: '기타'
}

function NewSellPost() {

    let storedProductType = sessionStorage.getItem('productType');
    let storedAddressData = JSON.parse(sessionStorage.getItem('addressData') || '{}');

    let [productType, setProductType] = useState(storedProductType ? storedProductType : '');
    let [addressData, setAddressData] = useState(storedAddressData ? storedAddressData : {});

    let hasAddressData = Object.keys(addressData).length > 0;
    let removeClass = hasAddressData ? '' : ' remove';
 
    function resetAll() {
        setProductType('');
        setAddressData({});
    }

    useEffect(() => {
        if (sessionStorage) {
            sessionStorage.setItem('productType', productType);
        }
    }, [productType]);

    useEffect(() => {
        if (sessionStorage) {
            sessionStorage.setItem('addressData', JSON.stringify(addressData));
        }
    }, [addressData]);
    
    return (
        <div className="body-container"> 
        <div className="main-container">
        	<div className="input-grid">
        		<div className="input-title">매물 종류</div> 
        		<div className='input-container'>
                	<SingleChoice chosen={productType} setChosen={setProductType} choiceMap={productTypeMap} btnLabel={'선택하기'}/>
            	</div>
        	</div>
			
			<div className="input-grid">
				<div className="input-title">주소</div>
				<AddressInput addressData={addressData} setAddressData={setAddressData} />
				
				<div className={"input-title" + removeClass}></div>
				<input type="text" className={"address-value" + removeClass} id='address-value' placeholder={addressData.address} />

				{/*<div className={"input-title" + removeClass}></div>
				<div>
					<input type="text" className={"address-value" + removeClass} id='address-dong' placeholder=''></input>
					동
				</div>

				<div className={"input-title" + removeClass}></div>
				<div>
					<input type="text" className={"address-value" + removeClass} id='address-level' placeholder=''></input>
					층
				</div>

				<div className={"input-title" + removeClass}></div>
				<div>
					<input type="text" className={"address-value" + removeClass} id='address-room' placeholder=''></input>
					호
				</div>*/}

				<div className={"input-title" + removeClass}>상세주소</div>
				<input type="text" className={"address-detail" + removeClass} id="address-detail" placeholder=""></input>
			</div>

			<div className="input-grid">
				<div className="input-title">건물 종류</div>
				<div></div>
				<div className="input-title">건축물</div>
				<div></div>
			</div>

			{/*
			<h1>위치/구조</h1>
			<div>
				건물명 (BrTitle: bldNm)
			</div>
			<div>
				건물 종류*
				<div>대형사무실</div>
				<div>중소형사무실</div>
				<div>오피스텔</div>
			</div>
			<div>
				건축물용도!* (BrTitle: mainPurposCdNm, etcPurps)
				{buildingUsageList.slice(0,3)}
			</div>

			<h1>거래 정보</h1>
			<div>
				거래유형*
				<div>매매</div>
				<div>전세</div>
				<div>월세</div>
				<div>단기임대</div>
			</div>
			<div>
				매매가* 만원
			</div>
			<div>
				기전세금(월세금)
				<div> 보증금 만원 </div>
				<div> 월세가 만원 </div>
			</div>
			<div>
				융자여부
				<div> 표시안함 </div>
				<div> 융자없음 </div>
				<div> 시세대비 30%미만 </div>
				<div> 시세대비 30%이상 </div>
			</div>
			<div>
				입주가능일!
				<div> 즉시입주 </div>
				<div> 입주일지정 날짜 </div>
				<div> 초순 중순 하순 </div>
				<div> 협의가능 </div>
			</div>
			<div> 
				(아싸) 권리금 : 무권리 협의가능 
				영업권리금, 시설권리금, 바닥권리금 
			</div>

			<h1>매물 정보</h1>
			<div>
				면적검수 기준*
				(1) 등기부등본 (2) 건축물대장 
				<div> 계약면적* m2 </div> 
				<div> 전용면적* m2 </div>
				<div> (공장) 건축면적 </div>
			</div>
			<div> (토지, 건물) 대지면적* m2 </div> (BrTitle: platArea)
			<div> (건물) 건축면적 m2 </div> (BrTitle: archArea)
			<div> (건물) 연면적* m2 </div> (BrTitle: totArea)
			<div> (건물) 총 점포수 개 </div> (BrTitle: hoCnt)

			<div>
				층* (FlrOulnInfo: flrNoNm, etcPurps)
				<div>해당층 / 총층 </div> (BrTitle: grndFlrcnt, ugrndFlrCnt)
			</div>
			<div>
				방향!* 
				동 서 남 북 남동 남서 북동 북서 (주된 출입구 기준)
			</div>

			<div>총 사무실수 개</div> (BrTitle: hoCnt)
			<div>총 주차대수! 대</div> (BrTitle: indrAutoUtcnt, indrMechUtcnt, oudrAutoUtcnt, oudrMechUtcnt)
			<div>세대당 주차대수! 대</div> (BrTitle: hhldCnt, fmlyCnt)
			<div>
				주차가능여부* 
				가능/불가능
			</div>
			<div> (상가) 현업종 </div>
			<div>
				(상가) 추천업종
				외식 : 주점 치킨 패스트푸드 피자 제과제빵 커피 아이스크림/빙수 음료(커피 외) 분식 기타외국식 서양식 일식 중식 한식 기타외식 
					(아싸) 한식 중식 일식/회 양식 분식 육류 주류 버거류 커피 배달전문 유흥주점
				서비스 : 교육(교과) 교육(외국어) 기타교육 PC방 반려동물관련 배달 부종산중개 세탁 숙박 스포츠관련 안경 약국 오락 운송 유아관련(교육 외) 이미용 이사 인력파견 임대 자동차관련 기타서비스
				    (아싸) 미용실 뷰티 마사지 사우나 카센터 애견미용/호텔
				도소매 : (건강)식품 농수산물 의류/패션 종합소비점 편의점 화장품 기타도소매 
					(아싸) 편의점 슈퍼마켓 청과류 정육점 의류가방 약국 문구류 액세서리 화장품 리빙가구 귀금속 가전제품 철물/자재 꽃/식물 애견용품
				예술/스포츠/시설 : (아싸) 노래방 당구장 독서실 헬스클럽 바둑기원 볼링장 무도장 음악작업 탁구장 실내골프 실내야구 풋살/축구 실내낚시 기타오락/스포츠 무인사진 코인노래방 코인빨래방
				교육/학원 : (아싸) 어린이집 학원 키즈카페 미술업 공방
				숙박 : (아싸) 호텔모텔 숙박업 캠핑장 원룸텔
				기타 : 직접입력
			</div>
			<div>
				(아싸) 테마 : 무권리, 급매, 프랜차이즈, 매출증빙, 사무실
			</div>

			<div> (공장, 지식산업센터, 건물) 현재용도 </div>
			<div> (공장, 지식산업센터, 건물) 추천용도 </div>
			<div> 
				(공장, 지식산업센터) 건축구조 (BrTitle: strctCdNm)
				철골조 슬라브 통나무 라멘조(일체식구조) 철근콘크리트 벽돌 목조 황토 스틸 조립식 경량철골 블럭조 기타
			</div>
			<div>
				(공장, 지식산업센터, 토지, 건물) 용도지역 (BrJijigu: jijiguCdNm)
				계획관리지역 근린상업지역 농림지역 보전관리지역 보전녹지지역 생산관리지역 생산녹지지역 유통상업지역 일반공업지역 일반상업지역 자연녹지지역 자연환경보전지역 전용공업지역 제1종일반주거지역 제1종전용주거지역 제2종일반주거지역 제2종전용주거지역 제3종일반주거지역 준공업지역 준주거지역 중심상업지역
			</div>
			<div>
				(공장, 지식산업센터) 사용전력
				25kw이하 25~50 50~100 100~1000 1000~10000 10000kw이상
			</div>
			<div>
				월평균 관리비!* 
				원 또는 관리비 없음
			</div>
			<div>
				(아싸) 
				재료비
				인건비
				공과금 (전기, 수도, 가스요금등을 합산)
				기타경비 (배달경비, 회계기장료, 보안시스템, 인터넷, 화재보험, 정수기, 해충방제 등 비용 합산)
			</div>
			<div>
				건축물일자구분!* 
				사용승인일 사용검사일 준공인가일 (BrTitle: useAprDay, ?, pmsDay)
				건축물일자!* 년/월/일
			</div>
			<div>
				(토지) 지목* 
				전 답 과수원 목장용지 임야 광천지 염전 대 공장용지 학교용지 주차장 주유소용지 창고용지 도로 철도용지 제방 하천 구거 유지 양어장 수도용지 공원 체육용지 유원지 종교용지 사적지 묘지 잡종지 기타교육
			</div>
			<div>
				(토지) 특징
				국토이용 도시계획 건축허가 토지거래허가 진입도로
			</div>

			<h1>시설 정보</h1>
			<div>
				난방방식
				개별난방 중앙난방 지역난방 미노출 
			</div>
			<div>
				난방연료
				도시가스 기름 전기 심야전기 태양열 LPG 열병합 지열 미노출
			</div>
			<div>
				냉방시설
				벽걸이에어컨 스탠드에어컨 천장에어컨
			</div>
			<div>
				생활시설
				침대 책상 옷장 붙방이장 식탁 소파 신발장 냉장고 세탁기 건조기 샤워부스 욕조 비데 싱크대 식기세척기 가스레인지 인덕션레인지 전자레인지 가스오븐 TV
			</div>
			<div>
				보안시설
				경비원 비디오폰 인터폰 카드키 CCTV 사설경비 현관보안 방법창
			</div>
			<div>
				기타시설
				엘리베이터 화재경보기 테라스 베란다 마당 무인택배함 (brTitle: rideUseElvtCnt, emgenUseElvtCnt)
			</div>

			<h1>상세정보</h1>
			<div> 매물특징 40글자 </div>
			<div> 
				매물설명 1000글자 
				'상가점포’, ‘상가건물’ 매물 내부에 방 및 욕실(화장실 포함)이 존재하는 경우 매물 설명 영역에 기입하세요. 
			</div>
			<div> 
				연락처노출 
				사업장번호노출 휴대폰번호노출 
			</div>

			<div> 매출 매입자료 연동 : 홈택스, 여신금융협회, 배달의민족, 요기요, 쿠팡이츠 </div>*/}

			<button onClick={resetAll}>모두 지우기</button>
		</div>
		</div>
    );
}

export default NewSellPost;