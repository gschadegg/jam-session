import { usePlaylist } from '../../hooks/usePlaylist'

// display track search result item
const Track = ({ track }) => {
  const { removeTrack } = usePlaylist()

  return (
    <li id={track.id} className=" bg-gray-200 mb-2">
      <div className="w-full flex-1 text-left flex flex-col leading-normal ">
        <div className="w-full text-gray-900 font-bold text-lg flex justify-between">
          <span className="flex-1">{track?.name}</span>
          <button
            onClick={() => removeTrack(track.playlistID)}
            className="btn btn-outline btn-neutral btn-xs"
          >
            Remove
          </button>
        </div>
        {track?.artists[0] && (
          <div className=" w-full flex items-start">
            <div className="text-sm text-gray-900 leading-none">
              <span className="text-gray-600">Artist: </span>
              {track?.artists[0]?.name}
            </div>
          </div>
        )}
      </div>
    </li>
  )
}
export default Track
