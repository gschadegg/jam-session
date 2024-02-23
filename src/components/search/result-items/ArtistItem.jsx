import { useSearchData } from '../../../hooks/useSearchData'

const ArtistItem = ({ artist }) => {
  const { submitSearch } = useSearchData()

  return (
    <button
      onClick={() => submitSearch(artist?.name, 'Track')}
      className="flex flex-col text-center justify-center items-center p-2 mx-2 max-w-32 hover:bg-gray-100 rounded cursor-pointer"
    >
      <div className="avatar">
        <div className="w-24 rounded-full">
          <img
            src={`${artist?.images[2]?.url}`}
            height={`${artist?.images[2]?.height}`}
            width={`${artist?.images[2]?.width}`}
            title={artist?.name}
          />
        </div>
      </div>
      <p className="py-2 text-gray-900 leading-none text-sm">{artist?.name}</p>
    </button>
  )
}

export default ArtistItem
