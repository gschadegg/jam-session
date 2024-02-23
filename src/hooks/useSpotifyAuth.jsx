import React, { useContext, useState } from 'react'

const SpotifyAuthContext = React.createContext()

// manages & makes available spotify authentication state
export const SpotifyAuthProvider = ({ children }) => {
  const [spotifyAuth, setSpotifyAuth] = useState('')

  return (
    <SpotifyAuthContext.Provider value={{ spotifyAuth, setSpotifyAuth }}>
      {children}
    </SpotifyAuthContext.Provider>
  )
}

export const useSpotifyAuth = () => {
  const { spotifyAuth, setSpotifyAuth } = useContext(SpotifyAuthContext)
  return { spotifyAuth, setSpotifyAuth }
}
