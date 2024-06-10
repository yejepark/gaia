import { NavLink } from 'react-router-dom';

import classes from './MainNavigation.module.css';

function MainNavigation() {
	return (
		<>
		<nav className={classes["main-nav"]}>
			<ul className={classes.left}>
				<li>
					<NavLink end to="/posts">상업용부동산찾기</NavLink>
				</li>
				<li>
					<NavLink end to="/posts">중개사찾기</NavLink>
				</li>
			</ul>
			<ul>
				<NavLink end to="/">
					<div className={classes.logo}>L<sup>3</sup></div>
				</NavLink>
			</ul>
			<ul className={classes.right}>
				<li>
					<NavLink end to='/newidea'>블로그작성</NavLink>
				</li>
				<li>
					<NavLink end to='/newprod'>중개사매물작성</NavLink>
				</li>
				<li>
					<NavLink end to='/newprod'>직거래매물작성</NavLink>
				</li>
				<li>
					<NavLink end to='/account'>내계정</NavLink>
				</li>
				<li>
					<NavLink end to='/login'>로그인</NavLink>
				</li>
			</ul>
		</nav>
		</>
	);
}

export default MainNavigation;