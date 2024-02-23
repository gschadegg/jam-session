import { useEffect } from 'react'
import './App.css'

import SearchBar from './components/search/SearchBar'
import SearchDisplay from './components/search/SearchDisplay'
import IntroMessage from './components/IntroMessage'
import { GET_CREDENTIALS } from './endpoints'
import { useSpotifyAuth } from './hooks/useSpotifyAuth'
import { useSearchData } from './hooks/useSearchData'
import { PlaylistProvider } from './hooks/usePlaylist'
import { useNotification } from './hooks/useNotification'

function App() {
  const { setSpotifyAuth } = useSpotifyAuth()
  const { Notification, setNotification } = useNotification()
  const { searchData } = useSearchData()

  useEffect(() => {
    const getSpotifyAuth = async () => {
      try {
        const res = await fetch(GET_CREDENTIALS)
        if (!res.ok) {
          setNotification(
            'Service is currently down & could not get credentials',
            'error'
          )
        }
        const result = await res.json()
        setSpotifyAuth(result)
      } catch (e) {
        setNotification('There was an issue connecting', 'error')
      }
    }

    getSpotifyAuth()
  }, [])

  return (
    <PlaylistProvider>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col my-8">
          <section className="flex mx-8 items-center mb-8">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-primary drawer-button mr-4 lg:hidden"
            >
              Open Playlist
            </label>
            <h1 className="text-3xl font-bold text-left">JAMsession</h1>
          </section>

          <section className="items-center flex flex-col">
            {!searchData && <IntroMessage />}
            <SearchBar />
            <SearchDisplay />
          </section>
          <Notification />
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
      </div>
    </PlaylistProvider>
  )
}

export default App
