import TrackItem from './result-items/TrackItem'
import { useSearchData } from '../../hooks/useSearchData'

import ArtistItem from './result-items/ArtistItem'

// Display for Search results
const SearchDisplay = () => {
  const { searchData, currentQuery } = useSearchData()
  if (!searchData) return <p></p>

  let artistsList
  let tracksList
  if (searchData.hasOwnProperty('tracks'))
    tracksList = searchData?.tracks.items.map((item) => (
      <TrackItem key={item.id} track={item} />
    ))

  if (searchData.hasOwnProperty('artists'))
    artistsList = searchData?.artists.items.map((item) => (
      <ArtistItem key={item.id} artist={item} />
    ))

  return (
    <article className="p-6 w-full">
      <h2 className="text-center text-gray-600">
        Search Results for {currentQuery?.type && currentQuery.type} "
        {currentQuery.q}"
      </h2>
      {artistsList && (
        <div className="flex flex-row py-8 w-full justify-center items-start flex-wrap">
          {artistsList}
        </div>
      )}
      {tracksList}
    </article>
  )
}

export default SearchDisplay
