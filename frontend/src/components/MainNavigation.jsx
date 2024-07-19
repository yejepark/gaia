import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import SearchContainer from './SearchContainer';
import Hamburger from './Hamburger';
import { useWindowDimensions } from '../utilities/customHooks';

import classes from './MainNavigation.module.css';

function LogoEl({ customClass }) {
	return (
		<NavLink end to="/">
			<div className={customClass}>
				Sky Real{/*L<sup>3</sup>*/}
			</div>
		</NavLink>
	);
}

function UserButton() {
	return (
		<div style={{width: '1.2rem', height: '1.2rem'}}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
	    		<path fill="#000000" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
			</svg>
    	</div>
    );
}
	
function MainNavigation() {

	const [dialogOpen, setDialogOpen] = useState(false);

	function btnClickHandler(e) {
        setDialogOpen((isOpen) => { return !isOpen; });
    }

    const dialogOpenClass = dialogOpen ? '' : 'hidden';

	const currentRoute = useLocation();
	const showSearch = currentRoute.pathname === '/posts';

	const { height, width } = useWindowDimensions();

	useEffect(() => {
		if (dialogOpen) {
			btnClickHandler();
		}
	}, [width]);

	const leftItems = [
		{ link: '/posts', text: '부동산 찾기' },
		{ link: '/posts', text: '중개사 찾기' },
	];

	const rightItems = [
		{ link: '/newidea', text: '블로그 작성' },
		{ link: '/newSellPost', text: '매물 작성' },
		{ link: '/account', text: '내 계정'}
	];

	const allItems = leftItems.concat(rightItems);

	return (
		<>
			<nav className={classes["main-nav"] + ' ' + classes['wide-screen']}>
				<ul className={classes.left}>
					{leftItems.map((item, idx) => <li key={idx}> <NavLink end to={item.link}>{item.text}</NavLink> </li>)}
				</ul>
				
				<LogoEl customClass={classes.logo} />
				
				<ul className={classes.right}>
					{rightItems.map((item, idx) => <li key={idx}> <NavLink end to={item.link}>{item.text}</NavLink> </li>)}
				</ul>
			</nav>

			<nav className={classes["main-nav"] + ' ' + classes['narrow-screen']}>
				<div className={classes.leftBtn} onClick={btnClickHandler}> <Hamburger changed={dialogOpen} /> </div>
				{ showSearch ? <SearchContainer /> : <LogoEl customClass={classes.logo} /> }
				<div className={classes.rightBtn}> <UserButton /> </div>
			</nav>

			<div className={'positional-container'}>
				<ol className={classes['dialog-menu'] + ' ' + dialogOpenClass}>
					{allItems.map((item, idx) =>
						<li key={idx} onClick={btnClickHandler} onResize={btnClickHandler} className='alive-btn focusable'> 
							<NavLink end to={item.link}>{item.text}</NavLink> 
						</li>
					)}
				</ol>
			</div>
		</>
	);
}

export default MainNavigation;