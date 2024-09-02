import { RouteObject } from 'react-router-dom'
import App from './App'
import Home from './home'
import QuickNote from './quickNote'
import Board from './board'

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
        path: 'quick-note',
        element: <QuickNote />
      },
      {
        path: 'board',
        element: <Board />
      }
    ]
  }
]