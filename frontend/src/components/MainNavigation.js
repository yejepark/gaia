import { NavLink } from 'react-router-dom';

import { FaHouse } from "react-icons/fa6";

function MainNavigation() {
	return (
		<nav className="main-nav">
			<ul>
				<li>
					<NavLink end to="/">홈</NavLink>
				</li>
				<li>
					<NavLink end to="/posts">매물</NavLink>
				</li>
			</ul>
			<FaHouse size={40}/>
			<ul>
				<li>
					<NavLink end to='/account'>내계정</NavLink>
				</li>
			</ul>
		</nav>
	);
}

export default MainNavigation;