import React, { useContext, useState } from 'react'

const PlaylistContext = React.createContext()

// manages & makes available current playlist data state
export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState(null)

  return (
    <PlaylistContext.Provider value={{ playlist, setPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  )
}

export const usePlaylist = () => {
  const {} = useContext(PlaylistContext)
  return {}
}
