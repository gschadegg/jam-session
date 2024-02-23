from flask import jsonify, request
from api_requests import spotifyRequests

import json


class SearchType:
    artist = 'artist'
    track = 'track'

def make_multi_requests(*args):
    res = {}

    # make request to spotify api search endpoint for 'artist' type
    spotify_artist_request = spotifyRequests.make_search_request('artist', *args)
    # if there is an error in api response, return as is 
    if 'error' in spotify_artist_request:
        return spotify_artist_request

    # make request to spotify api search endpoint for 'track' type
    spotify_track_request = spotifyRequests.make_search_request('track', *args)
    # if there is an error in api response, return as is  
    if 'error' in spotify_track_request:
        return spotify_track_request

    # if reseponse from api has no error, setup both lists in single data object
    res['data'] = {}
    res['data']['artists'] = spotify_artist_request['artists']    
    res['data']['tracks'] = spotify_track_request['tracks']

    return res


def general_search():
    try:
        # return error if the request does not include bearer token in header
        if not bool(request.headers['Authorization']):
            raise ValueError('Authentication token is required')
        
        auth_token = request.headers['Authorization']

        # build response
        response = {}

        # check there is q included in request params
        if not 'q' in request.args:
            #if no query then return an error that there should be at least a query
            raise ValueError('Search query is required')

        query = request.args.get('q').strip()

        # check if query is valid text
        if not bool(query):
            # if query was empty return an error that the query was invalid
            raise ValueError('Invalid search query')
            
            
        # check if user selected specific type of search
        if 'type' in request.args:
            search_type = request.args.get('type').strip().lower()

            # check search type provided is valid, track or artist
            if hasattr(SearchType(), str(search_type)):
                # call function to search spotify for specific type
                spotify_request = spotifyRequests.make_search_request(search_type, query, auth_token)
                response['data'] = spotify_request
            else:
                # if search type is not valid, call function to search spotify for both types
                response = make_multi_requests(query, auth_token, 20)
        else:
            # if search type is not provided, call function to search spotify for both types
            response = make_multi_requests(query, auth_token, 20)

        return jsonify(response)
        
    except ValueError as e:
        return jsonify({"error": {"message": e.args[0] }})
    except Exception as e:
        return jsonify({"error": {"message": e.args[0] }})
