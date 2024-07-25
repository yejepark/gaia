import classes from './ApplyButton.module.css';

function ApplyButton({ clickHandler }) {
	return (
		<div className={classes['apply-button-container']}>
            <div className={classes['apply-button'] + ' focusable'} onClick={clickHandler} tabIndex='0'>적용</div>
		</div>
	)
}

export default ApplyButton;