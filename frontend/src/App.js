// import logo from './logo.svg';
// import './App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './pages/Root';
import Welcome from './pages/Welcome'
import PostsLayout, {loader as postsLoader} from './pages/PostsLayout';
import Account from './pages/Account';
import Login from './pages/Login';
import NewSellPost, {action as newSellPostAction } from './pages/NewSellPost';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Welcome /> },
      {
        path: '/posts',
        id: 'posts',
        element: <PostsLayout />,
        loader: postsLoader,
      },
      { 
        path: '/account',
        id: 'account',
        element: <Account />,
      },
      { 
        path: '/login',
        id: 'login',
        element: <Login />,
      },
      { 
        path: '/newSellPost',
        id: 'newSellPost',
        element: <NewSellPost />,
        action: newSellPostAction
      },
      { 
        path: '/newAgentPost',
        id: 'newAgentPost',
        element: <NewSellPost />,
        action: newSellPostAction
      }
    ],
  }
])

function App() {
    return <RouterProvider router={router} />;
}

export default App;