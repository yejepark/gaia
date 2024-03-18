// import logo from './logo.svg';
// import './App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './pages/Root';
import Welcome from './pages/Welcome'
import PostsLayout from './pages/PostsLayout';

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
      }
    ],
  }
])

function App() {
    return <RouterProvider router={router} />;
}

export default App;