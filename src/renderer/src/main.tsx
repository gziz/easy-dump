import { ConfigProvider, theme } from 'antd'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Board from './board'
import Home from './home'
import './main.css'
import QuickNote from './quickNote'
const { darkAlgorithm } = theme
const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'quick-note',
        element: <QuickNote />
      },
      {
        path: 'board',
        element: <Board />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider theme={{ algorithm: [darkAlgorithm] }}>
    <RouterProvider router={router} />
  </ConfigProvider>
)
