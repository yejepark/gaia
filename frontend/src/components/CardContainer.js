import { useEffect } from 'react';

import CardItem from './CardItem';

import classes from './CardContainer.module.css';


function UpDown() {
    return (
        <div className={classes['arrow-container']}>
            <i className={classes['arrow']}></i>
        </div>
    );
}

function CardContainer({ assets }) {

    let cards = assets.map((data, dataIdx) =>
        <CardItem key={dataIdx} data={data} />
    );

    useEffect(() => {
        let button = document.querySelector('.' + classes.sort);
        let arrowEl = button.querySelector('i');
        button.addEventListener('click', function() { arrowEl.classList.toggle(classes['up']); });
    }, []);

    return (
        <>
            <header className={classes['container-header']}>
                <div className={classes.title}>임대 물건 목록</div>
                <div className={classes.result}>
                    <div className={classes.count}>조회 결과: <span>{cards.length}개</span></div>
                    <button className={classes.sort}>최신등록순 <UpDown /></button>
                </div>
            </header>
            <div className={classes['card-container']}>
    			{cards}
    		</div>
        </>
    )
}

export default CardContainer;