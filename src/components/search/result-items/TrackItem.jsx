import { usePlaylist } from '../../../hooks/usePlaylist'

// display track search result item
const TrackItem = ({ track }) => {
  const { insertTrack } = usePlaylist()

  return (
    <div
      data-testid={`Search Track Item`}
      className="w-full max-w-full flex py-1 hover:bg-gray-100"
      id={track?.id}
    >
      <div
        className="h-auto w-48 flex-none bg-cover rounded-t rounded-t-none rounded-l text-center overflow-hidden"
        style={{
          backgroundImage: `url('${track?.album?.images[1].url}')`,
        }}
        title={track?.album?.name}
      ></div>
      <div className="flex-1 text-left border-r border-b border-l border-gray-400 border-l-0 lg:border-t border-gray-400 bg-white rounded-b rounded-b-none rounded-r p-4 flex flex-col justify-between leading-normal">
        <div className="items-start">
          <div className="text-gray-900 font-bold text-xl mb-2 flex">
            <span className="flex-1">{track?.name}</span>
            <button
              onClick={() => insertTrack(track)}
              className="btn btn-outline btn-neutral btn-sm"
            >
              Add
            </button>
          </div>
          {track?.artists && track?.artists[0] && (
            <div className="flex items-center">
              <div className="text-sm">
                <p className="text-gray-900 leading-none">
                  <span className="text-gray-600">Artist: </span>
                  {track?.artists[0]?.name}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrackItem
