import React, { useContext, useState } from 'react'
import { useNotification } from './useNotification'
import { useSpotifyAuth } from './useSpotifyAuth'
import { GET_SEARCH } from '../endpoints'

const SearchDataContext = React.createContext()

export const SearchDataProvider = ({ children }) => {
  const [searchData, setSearchData] = useState(null)
  const [currentQuery, setCurrentQuery] = useState(null)

  const { spotifyAuth } = useSpotifyAuth()
  const { setNotification } = useNotification()

  const submitSearch = async (query, type) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `${spotifyAuth.token_type} ${spotifyAuth.access_token}`,
      },
    }

    try {
      const res = await fetch(
        `${GET_SEARCH}?q=${query}${type ? `&type=${type}` : ''}`,
        options
      )

      if (!res.ok) {
        setNotification('Search failed to complete, please try again', 'error')
      }

      if (res.error) {
        setNotification(`${res.error}`, 'error')
      }

      const result = await res.json()
      setSearchData(result?.data)
      setCurrentQuery({ q: query, type: type })
    } catch (e) {
      setNotification(
        `Unknown error while trying to complete request, please try again`,
        'error'
      )
    }
  }

  return (
    <SearchDataContext.Provider
      value={{
        searchData,
        setSearchData,
        currentQuery,
        setCurrentQuery,
        submitSearch,
      }}
    >
      {children}
    </SearchDataContext.Provider>
  )
}

export const useSearchData = () => {
  const {
    searchData,
    setSearchData,
    currentQuery,
    setCurrentQuery,
    submitSearch,
  } = useContext(SearchDataContext)
  return {
    searchData,
    setSearchData,
    currentQuery,
    setCurrentQuery,
    submitSearch,
  }
}
