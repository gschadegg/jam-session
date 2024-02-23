import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { SpotifyAuthProvider } from './hooks/useSpotifyAuth.jsx'
import { NotificationProvider } from './hooks/useNotification.jsx'
import { SearchDataProvider } from './hooks/useSearchData.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SpotifyAuthProvider>
      <NotificationProvider>
        <SearchDataProvider>
          <App />
        </SearchDataProvider>
      </NotificationProvider>
    </SpotifyAuthProvider>
  </React.StrictMode>
)
