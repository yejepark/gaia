import classes from './UpDown.module.css';

function UpDown({ up = false }) {
    let classStr = classes.arrow;
    if (up) {classStr = classStr + ' ' + classes.up;}

    return (
        <div className={classes['arrow-container']}>
            <i className={classStr}></i>
        </div>
    );
}

export default UpDown;