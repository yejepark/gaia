import { useEffect } from 'react';

import classes from './Hamburger.module.css';

function Hamburger({ changed }) {
	const btnClass = classes.container + ' ' + (changed ? classes.change : '');
	
	return (
	<div className={btnClass}>
		<div className={classes["bar1"]}></div>
		<div className={classes["bar2"]}></div>
		<div className={classes["bar3"]}></div>
	</div>
	);
}

export default Hamburger;