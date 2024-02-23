import React, { useContext, useState, useEffect } from 'react'

const PlaylistContext = React.createContext()
const localUserKey = 'jamPlaylist'

// manages & makes available current playlist data state
export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([])

  // clear playlist from local storage
  const deleteLocalPlaylist = () => {
    localStorage.removeItem(localUserKey)
    setPlaylist([])
  }

  // set playlist to local storage
  const setLocalPlaylist = (updatedPlaylist) => {
    localStorage.setItem(localUserKey, JSON.stringify(updatedPlaylist))
  }

  // get playlist from local storage
  const getLocalPlaylist = () => {
    const currentPlaylistStr = localStorage.getItem(localUserKey)
    if (!currentPlaylistStr) return null

    const currentPlaylist = JSON.parse(currentPlaylistStr)

    return currentPlaylist
  }

  // add track to playlist
  const insertTrack = (track) => {
    setPlaylist((prevState) => {
      const updatedList = [...prevState, track]
      setLocalPlaylist(updatedList)
      return updatedList
    })
  }

  // remove track from playlist
  const removeTrack = (id) => {
    const updatedList = playlist.filter((track) => track.id !== id)
    setLocalPlaylist(updatedList)
    setPlaylist(updatedList)
  }

  // on initial load, get local playlist and set state
  useEffect(() => {
    const currentLocalPlaylist = getLocalPlaylist()
    if (currentLocalPlaylist?.length > 0) setPlaylist(currentLocalPlaylist)
  }, [])

  return (
    <PlaylistContext.Provider
      value={{
        playlist,
        setPlaylist,
        insertTrack,
        removeTrack,
        deleteLocalPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  )
}

export const usePlaylist = () => {
  const {
    playlist,
    setPlaylist,
    insertTrack,
    removeTrack,
    deleteLocalPlaylist,
  } = useContext(PlaylistContext)
  return {
    playlist,
    setPlaylist,
    insertTrack,
    removeTrack,
    deleteLocalPlaylist,
  }
}
