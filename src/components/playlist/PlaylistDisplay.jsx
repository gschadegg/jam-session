import { usePlaylist } from '../../hooks/usePlaylist'
import Track from './Track'

const PlaylistDisplay = () => {
  const { playlist, deleteLocalPlaylist } = usePlaylist()

  return (
    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      <li className="w-full text-gray-900 font-bold text-lg mb-4 flex flex-row items-center justify-between">
        Current Playlist
        <button
          onClick={deleteLocalPlaylist}
          className="btn btn-outline btn-neutral btn-xs"
        >
          Clear List
        </button>
      </li>
      {playlist.map((track) => (
        <Track track={track} />
      ))}
    </ul>
  )
}

export default PlaylistDisplay
