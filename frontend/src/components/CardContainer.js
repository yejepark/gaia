import CardItem from './CardItem';

import classes from './CardContainer.module.css';

function CardContainer({ assets }) {

    let cards = assets.map((data, dataIdx) =>
        <CardItem key={dataIdx} data={data} />
    );

    return (
        <div className={classes['card-container']}>
			{cards}
		</div>
    )
}

export default CardContainer;