import React, { useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

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
    const playlistID = uuidv4()
    const newTrack = { ...track, playlistID: playlistID }

    setPlaylist((prevState) => {
      const updatedList = [...prevState, newTrack]
      setLocalPlaylist(updatedList)
      return updatedList
    })
  }

  // remove track from playlist
  const removeTrack = (playlistID) => {
    const updatedList = playlist.filter(
      (track) => track.playlistID !== playlistID
    )
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
