import { ConfigProvider, theme } from 'antd'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import './main.css'
import { routes } from './routes'

const { darkAlgorithm } = theme
const router = createHashRouter(routes)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider theme={{ algorithm: [darkAlgorithm] }}>
    <RouterProvider router={router} />
  </ConfigProvider>
)
