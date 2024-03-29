import { NavLink } from 'react-router-dom';

// import { FaHouse } from "react-icons/fa6";

function MainNavigation() {
	return (
		<>
		<nav className="main-nav">
			<ul>
				<li>
					<NavLink end to="/">홈</NavLink>
				</li>
				<li>
					<NavLink end to="/posts">매물</NavLink>
				</li>
			</ul>
			<ul>
				<li>
					<NavLink end to='/newidea'>아이디어작성</NavLink>
				</li>
				<li>
					<NavLink end to='/newprod'>매물작성</NavLink>
				</li>
				<li>
					<NavLink end to='/account'>내계정</NavLink>
				</li>
			</ul>
		</nav>
		</>
	);
}

export default MainNavigation;