import { FormProvider } from 'react-hook-form';

import CardItem from './CardItem';
import DropDownInputForm from './menu/DropDownInputForm';

import classes from './CardContainer.module.css';

function CardContainer({ assets, tradeType }) {
    // console.log('in CardContainer')

    const sortValues = ['최신순', '오래된순'].concat(
        tradeType !== 'sale' ? ['월세순', '월세역순', '권리금순', '권리금역순'] : ['가격순', '가격역순']).concat(
        ['면적순', '면적역순']);

    const cards = assets.map((data, dataIdx) =>
        <CardItem key={dataIdx} data={data} />
    );

    return (<>
        <header className={classes['container-header']}>
            <div className={classes.title}>임대 물건 목록</div>
            <div className={classes.result}>
                <div className={classes.count}>조회 결과: <span>{cards.length}개</span></div>
                <DropDownInputForm name={'sort'} values={sortValues} 
                    options={{ 
                        readOnly: true,
                        customClass: classes['sort-button']
                    }}
                />
            </div>
        </header>
        <div className={classes['card-container']}>
			{cards}
		</div>
    </>)
}

export default CardContainer;