import classes from './ApplyButton.module.css';

function ApplyButton({ clickHandler }) {
	return (
		<div className={classes['apply-button-container']}>
            <div className={classes['apply-button']} onClick={clickHandler}>적용</div>
		</div>
	)
}

export default ApplyButton;