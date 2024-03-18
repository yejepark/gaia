import { Outlet, useLoaderData } from 'react-router-dom';

function PostsLayout() {
	// const loadedPosts = useLoaderData();

	return (
		<div id='posts-layout'>
			<main>
				Main
			</main>
			<nav>
				Posts
			</nav>
			
		</div>
	);
}

export default PostsLayout;