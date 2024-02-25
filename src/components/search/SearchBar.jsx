import { useState } from 'react'
import { useSpotifyAuth } from '../../hooks/useSpotifyAuth'
import { useSearchData } from '../../hooks/useSearchData'

// Search controls component
const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const { spotifyAuth } = useSpotifyAuth()
  const { submitSearch } = useSearchData()

  const handleSearch = () => {
    submitSearch(query, type)
    setQuery('')
    setType('')
  }

  return (
    <div className="join">
      <div>
        <div>
          <input
            className="input input-bordered join-item"
            placeholder="Search"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
        </div>
      </div>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="select select-bordered join-item"
      >
        <option defaultValue value="">
          All
        </option>
        <option value="Artist">Artist</option>
        <option value="Track">Track</option>
      </select>
      <div className="indicator">
        <button
          onClick={handleSearch}
          className="btn join-item"
          disabled={!spotifyAuth || query === ''}
        >
          {spotifyAuth ? (
            'Search'
          ) : (
            <>
              <span className="loading loading-spinner"></span>
              Loading Credentials
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default SearchBar
