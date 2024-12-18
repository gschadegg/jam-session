import { renderHook, act, waitFor} from "@testing-library/react";

import {validTracks, invalidTrack, mockAPISearchResponse} from './dataMocks';

import { NotificationProvider } from './../hooks/useNotification.jsx';
import {usePlaylist, PlaylistProvider} from "../hooks/usePlaylist";
import { useSearchData, SearchDataProvider } from "../hooks/useSearchData";
import { SpotifyAuthProvider } from './../hooks/useSpotifyAuth.jsx';


describe(('Testing insertTrack'), () =>{
  let result

  beforeEach(async () => {
    const wrapper = ({children}) => {
      return <PlaylistProvider> 
        {children}
      </PlaylistProvider>;
    }
    const {result: hookResult} = renderHook(() => usePlaylist(), {wrapper})
    result = hookResult

    await act(async () => {
      result.current.setPlaylist([])
    })
  })

  //TC-026
  test('add valid track to playlist', async () => {
    expect( result.current.playlist).toEqual([])

    await act(async () => {
      result.current.insertTrack(validTracks.track1)
    })

    await waitFor(() =>expect(result.current.playlist.length).toEqual(1))

  })

  //TC-027
  test('add invalid track object to playlist', async() => {  
    await act(async () => {
      result.current.insertTrack(invalidTrack)
    })

    await waitFor(() => expect(result.current.playlist.length).toEqual(0))
  
  })

  //TC-028
  test('add empty object to playlist', async() => { 
    await act(async () => {
      result.current.insertTrack({})
    })

    await waitFor(() => expect(result.current.playlist.length).toEqual(0))
  
  })

  //TC-029
  test('add null to playlist', async() => { 
 
    await act(async () => {
      result.current.insertTrack(null)
    })

    await waitFor(() => expect(result.current.playlist.length).toEqual(0))
  
  })

  //TC-030
  test('add valid track to playlist that doesn\'t exist', async() => { 
    await act(async () => {
      result.current.setPlaylist(null)
    })

    await waitFor(() => expect(result.current.playlist).toBe(null))

    await waitFor(() => expect(() => result.current.insertTrack(validTracks.track1)).toThrow(TypeError))
  
  })

  //TC-031
  test('add valid track to playlist that already has content', async() => { 
    await act(async () => {
      result.current.setPlaylist([validTracks.track1])
    })

    await waitFor(() => expect(result.current.playlist.length).toEqual(1))

    await act(async () => {
      result.current.insertTrack(validTracks.track2)
    })

    await waitFor(() => expect(result.current.playlist.length).toEqual(2))  
  })
})


describe(('Testing removeTrack'), () =>{
  let result
  
  beforeEach(async () => {
    const wrapper = ({children}) => {
      return <PlaylistProvider> 
        {children}
      </PlaylistProvider>;
    }

  
    const {result: hookResult} = renderHook(() => usePlaylist(), {wrapper})
    result = hookResult

    await act(async () => {
      result.current.setPlaylist([validTracks.track1, validTracks.track2, validTracks.track3])
    })
  })

  //TC-032
  test('remove valid playlist track from playlist', async () => {

    expect( result.current.playlist.length).toEqual(3)

    await act(async () => {
      result.current.removeTrack(1)
    })

    await waitFor(() => expect(result.current.playlist.length).toEqual(2))

  })

  //TC-033
  test('remove non-existing track id from playlist', async () => {

    expect( result.current.playlist.length).toEqual(3)

    await act(async () => {
      result.current.removeTrack(22)
    })

    await waitFor(() => expect(result.current.playlist.length).toEqual(3))
  })

  //TC-034
  test('remove null as id from playlist', async () => {

    expect( result.current.playlist.length).toEqual(3)

    await act(async () => {
      result.current.removeTrack(null)
    })

    await waitFor(() => expect(result.current.playlist.length).toEqual(3))
  })

  //TC-035
  test('remove negative number as id from playlist', async () => {

    expect( result.current.playlist.length).toEqual(3)

    await act(async () => {
      result.current.removeTrack(-5)
    })

    await waitFor(() => expect(result.current.playlist.length).toEqual(3))
  })

  //TC-037
  test('remove track id from an empty playlist', async () => {
    await act(async () => {
      result.current.setPlaylist([])
    })

    expect( result.current.playlist.length).toEqual(0)

    await act(async () => {
      result.current.removeTrack(1)
    })

    await waitFor(() => expect(result.current.playlist.length).toEqual(0))
  })

})


describe(('Testing submitSearch'), () =>{
  let result
  let originalFetch;

  afterEach(async () => {
    global.fetch = originalFetch;
    await act(async () => {
      result.current.setSearchData(null)
    })
  });

  beforeEach(async () => {
    originalFetch = global.fetch;

    const wrapper = ({children}) => {
      return (
        <SpotifyAuthProvider>
        <NotificationProvider>
          <SearchDataProvider> 
            {children}
          </SearchDataProvider>
          </NotificationProvider>
        </SpotifyAuthProvider>
      );
    }

  
    const {result: hookResult} = renderHook(() => useSearchData(), {wrapper})
    result = hookResult

  })

  //TC-001
  test('search for artists with query', async () => {
    global.fetch = mockSearchRequest(false, true)
    
    await act(async () => {
      result.current.submitSearch('Queen', 'artist')
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(result.current.currentQuery.q).toEqual('Queen')
      expect(result.current.currentQuery.type).toEqual('artist')
      expect(result.current.searchData).toHaveProperty('artists')
      expect(result.current.searchData).not.toHaveProperty('tracks')
    })

  })

  //TC-002
  test('search for tracks with query', async () => {
    global.fetch = mockSearchRequest(true, false)
    
    await act(async () => {
      result.current.submitSearch('Queen', 'track')
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(result.current.currentQuery.q).toEqual('Queen')
      expect(result.current.currentQuery.type).toEqual('track')
      expect(result.current.searchData).toHaveProperty('tracks')
      expect(result.current.searchData).not.toHaveProperty('artists')
    })

  })

  //TC-003
  test('search for invalid type with query', async () => {
    global.fetch = mockSearchRequest(true, true )
    
    await act(async () => {
      result.current.submitSearch('Queen', 'word')
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(result.current.currentQuery.q).toEqual('Queen')
      expect(result.current.currentQuery.type).toEqual('word')
      expect(result.current.searchData).toHaveProperty('tracks')
      expect(result.current.searchData).toHaveProperty('artists')
    })

  })

  //TC-004
  test('search for artist with no query', async () => {
    global.fetch = mockSearchRequest(false, true)
    
    await act(async () => {
      result.current.submitSearch(null, 'artist')
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(result.current.currentQuery.q).toEqual(null)
      expect(result.current.currentQuery.type).toEqual('artist')
      expect(result.current.searchData).not.toHaveProperty('tracks')
      expect(result.current.searchData).toHaveProperty('artists')
    })
  })

  //TC-005
  test('search for artist with blank query', async () => {
    global.fetch = mockSearchRequest(false, false, true)
    
    await act(async () => {
      result.current.submitSearch('', 'artist')
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(result.current.currentQuery.q).toEqual('')
      expect(result.current.currentQuery.type).toEqual('artist')
      expect(result.current.searchData).not.toHaveProperty('tracks')
      expect(result.current.searchData).not.toHaveProperty('artists')
    })
  })

  //TC-006
  test('search with spaces for a query', async () => {
    global.fetch = mockSearchRequest(false, false, true)
    
    await act(async () => {
      result.current.submitSearch('   ', 'artist')
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(result.current.currentQuery.q).toEqual('   ')
      expect(result.current.currentQuery.type).toEqual('artist')
      expect(result.current.searchData).not.toHaveProperty('tracks')
      expect(result.current.searchData).not.toHaveProperty('artists')
    })
  })

  //TC-007
  test('search for a null type', async () => {
    global.fetch = mockSearchRequest(true, true)
    
    await act(async () => {
      result.current.submitSearch('Queen', null)
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(result.current.currentQuery.q).toEqual('Queen')
      expect(result.current.currentQuery.type).toEqual(null)
      expect(result.current.searchData).toHaveProperty('tracks')
      expect(result.current.searchData).toHaveProperty('artists')
    })
  })
})


function mockSearchRequest(...args) {
  return jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve(mockAPISearchResponse(...args)),
    })
  );
}
