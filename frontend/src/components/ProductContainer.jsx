import { useState } from 'react';

import SingleChoice from './SingleChoice';

import parentClasses from '../pages/NewSellPost.module.css';

import { ItemContainer } from '../pages/NewSellPost';

function NumberInput({ title, name, unit }) {
	let savedNum = sessionStorage.getItem(name);
	let [num, setNum] = useState(savedNum ? savedNum : '0');

	function textChangeHandler(event) {
        let newText = event.target.value
        let newNum = parseInt(newText);

        if (!newNum) return;

        if (newText.length === 0) {
        	setNum('');
        	sessionStorage.setItem(name, '');
        }

        if (newNum >= 0) {
        	setNum(newText);
        	sessionStorage.setItem(name, newNum);	
        }
    }
	
	return (
		<ItemContainer title={title}>
			<input type='text' name={name} value={num} onChange={textChangeHandler} autoComplete='off'/>
		</ItemContainer>
	);
}

function ProductContainer({ addressState }) {

	return (
            <div className={parentClasses["input-grid"]}>
            	<NumberInput title='매매가' name='tradePrice' unit='만원' />
            	{/*<div className={parentClasses["input-title"]}>매매가</div> 
            	<div></div>*/}
            	<div className={parentClasses["input-title"]}>보증금</div> 
            	<div></div>
            	<div className={parentClasses["input-title"]}>월세가</div> 
            	<div></div>
            	<div className={parentClasses["input-title"]}>권리금</div> 
            	<div>영업권리금, 시설권리금, 바닥권리금, [협의가능], [무권리]</div>
            	<div className={parentClasses["input-title"]}>관리비</div> 
            	<div></div>
            	<div className={parentClasses["input-title"]}>비용</div> 
            	<div>재료비, 인건비, 공과금, 기타경비</div>
            	<div className={parentClasses["input-title"]}>융자여부</div> 
            	<div>표시안함, 융자없음, 시세대비 30%미만, 시세대비 30%이상</div>            	
            	<div className={parentClasses["input-title"]}>입주가능일</div> 
            	<div>입주일지정, [초순, 중순, 하순], [협의가능]</div>
            	<div className={parentClasses["input-title"]}>면적</div> 
            	<div>계약면적, 전용면적</div>
            	<div className={parentClasses["input-title"]}>방향</div> 
            	<div>동, 서, 남, 북, 남동, 남서, 북동, 북서 (주된 출입구 기준)</div>
            	<div className={parentClasses["input-title"]}>주차가능여부</div> 
            	<div>가능, 불가능</div>
            	<div className={parentClasses["input-title"]}>현재업종 (현재용도)</div> 
            	<div></div>
            	<div className={parentClasses["input-title"]}>추천업종 (추천용도)</div> 
            	<div></div>
            	<div className={parentClasses["input-title"]}>매물 특징</div> 
            	<div>40글자</div>
            	<div className={parentClasses["input-title"]}>매물 설명</div> 
            	<div>1000글자</div>
            </div>
	);
}

export default ProductContainer;