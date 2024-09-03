import { RouteObject } from 'react-router-dom'
import App from './App'
import Home from './home'
import Board from './board'
import Settings from './views/settings'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App/>,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'board',
        element: <Board />
      },
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  }
]