// import logo from './logo.svg';
// import './App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './pages/Root';
import Welcome from './pages/Welcome'
import PostsLayout, { loader as postsLoader } from './pages/PostsLayout';
import Account from './pages/Account';
import Login from './pages/Login';
// import NewSellPost, { action as newSellPostAction } from './pages/NewSellPost';
import NewSellPost from './pages/NewSellPost';

const router = createBrowserRouter([{
    path: '/',
    element: <Root />,
    children: [
        { index: true, element: <Welcome /> },
        {
            path: 'posts/',
            children: [
                {   
                    index: true,
                    id: 'postsRoot',
                    loader: postsLoader, 
                    element: <PostsLayout />,
                },
                { 
                    path: 'location/:location/:queryState?', 
                    id: 'postsLocatedChild',
                    loader: postsLoader,
                    element: <PostsLayout />,
                },
                { 
                    path: ':queryState', 
                    id: 'postsChild',
                    loader: postsLoader,
                    element: <PostsLayout />,
                },
            ],
            // action: async ({ request }) => {
            //     const formData = await request.formData();
            //     const postData = Object.fromEntries(formData);
            //     console.log('in action', postData)
            //     console.log('in action', request)
            //     return null;
            // },
            // shouldRevalidate: ({ currentUrl, formData }) => {
            //     console.log('in shouldRevalidate', currentUrl, formData)
            //     return true
            // }
        },
        { path: 'account', element: <Account /> },
        { path: 'login', element: <Login /> },
        { path: 'newSellPost', element: <NewSellPost /> },
        { path: 'newAgentPost', element: <NewSellPost /> },
    ],
}])

function App() {
    return <RouterProvider router={router} />;
}

export default App;