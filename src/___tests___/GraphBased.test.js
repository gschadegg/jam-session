import { renderHook, act, waitFor, screen} from "@testing-library/react";
import {validTracks, validArtists} from './dataMocks';

import SearchDisplay from "../components/search/SearchDisplay.jsx";

import { NotificationProvider } from './../hooks/useNotification.jsx'
import {PlaylistProvider} from "../hooks/usePlaylist";
import { useSearchData, SearchDataProvider } from "../hooks/useSearchData";
import { SpotifyAuthProvider } from './../hooks/useSpotifyAuth.jsx'


describe(('Testing SearchDisplay Call Graph'), () =>{
    let result
    let Wrapper
    afterEach(async () => {
        await act(async () => {
          result.current.setSearchData(null)
        })
    });

    beforeEach(async () => {
        Wrapper = ({children}) => {
            return (
                <SpotifyAuthProvider>
                    <NotificationProvider>
                    <SearchDataProvider>
                        <PlaylistProvider>
                            {children}
                            <SearchDisplay />
                        </PlaylistProvider>
                    </SearchDataProvider>
                    </NotificationProvider>
                </SpotifyAuthProvider>
            )
        }
        const {result: hookResult} = renderHook(() => useSearchData(), {wrapper: Wrapper})
        result = hookResult
    })

    // test case: [1,2,4,5,7,8,9,8,10]; potential input: searchData= tracks: [], artists: [artistObj]
    test('renders 1 artist item', async () => {
        await act(async () => {
            result.current.setSearchData({artists: {"items": [validArtists.artist1]}})
        })
        await waitFor(() =>expect(result.current.searchData).toHaveProperty('artists'))

        const artists = await screen.queryAllByTestId('Search Artist Item')

        await waitFor(() =>{          
            expect(artists).toHaveLength(1)
            expect(artists[0][Object.keys(artists[0])[0]].elementType).toEqual('button')
        })
    
    })
    
    // test case: [1,2,4,5,7,8,10]; potential input: searchData=  tracks: [], artists: []
    test('renders 0 artist items and 0 track items from existing empty lists', async () => {
        await act(async () => {
            result.current.setSearchData({artists: {"items": []}, tracks: {"items": []}})
        })
        await waitFor(() =>{
            expect(result.current.searchData).toHaveProperty('tracks')
            expect(result.current.searchData).toHaveProperty('artists')
        })

        const artists = await screen.queryAllByTestId('Search Artist Item')
        const tracks = await screen.queryAllByTestId('Search Track Item')

        await waitFor(() =>{          
            expect(artists).toHaveLength(0)
            expect(tracks).toHaveLength(0)
        })
    
    })

    // test case: [1,2,4,5,7,10]; potential input: searchData=  searchData = tracks: []
    test('renders 0 track items from empty existing list', async () => {
        await act(async () => {
            result.current.setSearchData({tracks: {"items": []}})
        })
        await waitFor(() =>{
            expect(result.current.searchData).toHaveProperty('tracks')
            expect(result.current.searchData).not.toHaveProperty('artists')
        })

        const tracks = await screen.queryAllByTestId('Search Track Item')

        await waitFor(() =>{          
            expect(tracks).toHaveLength(0)
        })
    })

    // test case: [1,2,4,7,8,10]; potential input: searchData=  searchData = artists: []
    test('renders 0 artist items from empty existing list', async () => {
        await act(async () => {
            result.current.setSearchData({artists: {"items": []}})
        })
        await waitFor(() =>{
            expect(result.current.searchData).not.toHaveProperty('tracks')
            expect(result.current.searchData).toHaveProperty('artists')
        })

        const artists = await screen.queryAllByTestId('Search Artist Item')

        await waitFor(() =>{          
            expect(artists).toHaveLength(0)
        })
    })

    // test case: [1,2,4,7,10]; potential input: searchData= {}
    test('renders 0 items with empty searchData Object', async () => {
        await act(async () => {
            result.current.setSearchData({})
        })
        await waitFor(() =>{
            expect(result.current.searchData).not.toHaveProperty('tracks')
            expect(result.current.searchData).not.toHaveProperty('artists')
        })

        const artists = await screen.queryAllByTestId('Search Artist Item')
        const tracks = await screen.queryAllByTestId('Search Track Item')

        await waitFor(() =>{          
            expect(artists).toHaveLength(0)
            expect(tracks).toHaveLength(0)
        })
    })

    // test case: [1,2,4,5,6,5,7,8,9,8,10]; potential input: searchData= tracks: [trackObj], artists: [artistObj]
    test('renders 1 track item and 1 artist item', async () => {
        await act(async () => {
            result.current.setSearchData({artists: {"items": [validArtists.artist1]}, tracks: {"items": [validTracks.track1]}})
        })
        await waitFor(() =>{
            expect(result.current.searchData).toHaveProperty('tracks')
            expect(result.current.searchData).toHaveProperty('artists')
        })

        const artists = await screen.queryAllByTestId('Search Artist Item')
        const tracks = await screen.queryAllByTestId('Search Track Item')

        await waitFor(() =>{          
            expect(artists).toHaveLength(1)
            expect(tracks).toHaveLength(1)
            expect(artists[0][Object.keys(artists[0])[0]].elementType).toEqual('button')
            expect(tracks[0][Object.keys(tracks[0])[0]].elementType).toEqual('div')
        })
    })

     // test case: [1,2,4,5,6,5,7,10]; potential input: searchData= tracks: [trackObj]
     test('renders 1 track items and 0 artists(no list)', async () => {
        await act(async () => {
            result.current.setSearchData({tracks: {"items": [validTracks.track1]}})
        })
        await waitFor(() =>{
            expect(result.current.searchData).toHaveProperty('tracks')
            expect(result.current.searchData).not.toHaveProperty('artists')
        })

        const artists = await screen.queryAllByTestId('Search Artist Item')
        const tracks = await screen.queryAllByTestId('Search Track Item')

        await waitFor(() =>{          
            expect(artists).toHaveLength(0)
            expect(tracks).toHaveLength(1)
            expect(tracks[0][Object.keys(tracks[0])[0]].elementType).toEqual('div')
        })
    })

    // test case: [1,2,4,5,6,5,6,5,7,8,10]; potential input: searchData= tracks: [trackObj, trackObj ], artists: []
    test('renders 2 track items and 0 artists(empty list)', async () => {
        await act(async () => {
            result.current.setSearchData({tracks: {"items": [validTracks.track1, validTracks.track2]}, artists: {"items": []}})
        })
        await waitFor(() =>{
            expect(result.current.searchData).toHaveProperty('tracks')
            expect(result.current.searchData).toHaveProperty('artists')
        })

        const artists = await screen.queryAllByTestId('Search Artist Item')
        const tracks = await screen.queryAllByTestId('Search Track Item')

        await waitFor(() =>{          
            expect(artists).toHaveLength(0)
            expect(tracks).toHaveLength(2)
            tracks.forEach((track, idex)=>{
                expect(track[Object.keys(tracks[idex])[0]].elementType).toEqual('div') 
            })
        })
    })

    // test case: [1,2,3]; potential input: searchData=  null 
    test('renders 0 items with searchData set to null', async () => {
        await act(async () => {
            result.current.setSearchData(null)
        })

        const artists = await screen.queryAllByTestId('Search Artist Item')
        const tracks = await screen.queryAllByTestId('Search Track Item')

        await waitFor(() =>{          
            expect(artists).toHaveLength(0)
            expect(tracks).toHaveLength(0)
        })
    })

     // test case: [1,2,4,7,8,9,8,9,8,10]; potential input: searchData= artists: [artistObj, artistObj]
    test('renders 2 artist items and 0 track(no list)', async () => {
        await act(async () => {
            result.current.setSearchData({artists: {"items": [validArtists.artist1, validArtists.artist2]}})
        })
        await waitFor(() =>{
            expect(result.current.searchData).not.toHaveProperty('tracks')
            expect(result.current.searchData).toHaveProperty('artists')
        })

        const artists = await screen.queryAllByTestId('Search Artist Item')
        const tracks = await screen.queryAllByTestId('Search Track Item')

        await waitFor(() =>{          
            expect(tracks).toHaveLength(0)
            expect(artists).toHaveLength(2)
            artists.forEach((artist, idex)=>{
                expect(artist[Object.keys(artists[idex])[0]].elementType).toEqual('button') 
            })
        })
    })
})