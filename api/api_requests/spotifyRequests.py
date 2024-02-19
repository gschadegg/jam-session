from flask import jsonify
from dotenv import load_dotenv
import requests
import os

load_dotenv()


# custom exception to handle errors sent from spotify api
class SpotifyException(Exception):
    pass

# reuseable decorator to handle request exceptions
def catch_exceptions(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except requests.exceptions.HTTPError as e:
            raise SystemExit(e)
        except requests.exceptions.Timeout:
            return jsonify({"error": {"message": "Request made has timed out"}})
        except requests.exceptions.RequestException as e:
            raise SystemExit(e)        
    return wrapper


@catch_exceptions
def make_spotify_credentials_request():
    try:
        # setup post request data
        request_url = 'https://accounts.spotify.com/api/token'
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        payload = { 'grant_type': 'client_credentials', 'client_secret': os.getenv("CLIENT_SECRET"), 'client_id': os.getenv("CLIENT_ID")}

        # make spotify api post request
        credentials_response = requests.post(request_url, headers=headers, data=payload).json()
        # if there is an error in api response, throw Spotify Exception
        if 'error' in credentials_response:
            raise SpotifyException(credentials_response)

        return credentials_response

    except SpotifyException as e:
        return e.args[0]


@catch_exceptions
def make_search_request(search_type, query, auth_token, limit=10, offset=0):
    try:
        # setup search get request data
        request_url = f'https://api.spotify.com/v1/search'
        headers = {'Authorization': auth_token}
        params = {
            'type': search_type,
            'q': query,
            'limit': limit,
            'offset': offset
        }

        # make spotify api get request
        search_response = requests.get(request_url, params=params, headers=headers).json()
        # if there is an error in api response, throw Spotify Exception
        if 'error' in search_response:
            raise SpotifyException(search_response)

        return search_response

    except SpotifyException as e:
        return e.args[0]