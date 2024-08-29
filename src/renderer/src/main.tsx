import ReactDOM from 'react-dom/client'
import App from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import QuickNote from './quickNote';
import Home from './home';
import Board from './board';
import './main.css';
import Editor from './editor';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "quick-note",
        element: <QuickNote />,
      },
      {
        path: "board",
        element: <Board />,
      },
      {
        path: "editor",
        element: <Editor />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
)
