import pytest
from unittest.mock import patch, Mock
from flask import Flask, jsonify
from requests.exceptions import HTTPError, Timeout, RequestException

from controllers.credentialsController import get_spotify_credentials
from api_requests.spotifyRequests import SpotifyException
from api_requests import spotifyRequests

app = Flask(__name__)

# base test
@patch.object(spotifyRequests, 'make_spotify_credentials_request')
def test_spotify_credentials_base(mock_make_spotify_credentials_request):
    mock_make_spotify_credentials_request.return_value = {'access_token': 'test_token', 'expires_in': 3600}
    
    with app.test_request_context():
        response = get_spotify_credentials()
        assert response.json == {'access_token': 'test_token', 'expires_in': 3600}
        mock_make_spotify_credentials_request.assert_called_once()

# invalid env credentials
@patch.object(spotifyRequests, 'make_spotify_credentials_request')
def test_spotify_credentials_invalid_credentials(mock_make_spotify_credentials_request):
    mock_make_spotify_credentials_request.side_effect = ValueError("Invalid credentials request")

    with app.test_request_context():
        response = get_spotify_credentials()
        assert response.json == {"error": {"message": "Invalid credentials request"}}
        mock_make_spotify_credentials_request.assert_called_once()

# exception from spotify
@patch.object(spotifyRequests, 'make_spotify_credentials_request')
def test_spotify_credentials_spotify_exception(mock_make_spotify_credentials_request):
    mock_make_spotify_credentials_request.side_effect = SpotifyException("invalid_client")

    with app.test_request_context():
        response = get_spotify_credentials()
        assert response.json == {"error": {"message": "invalid_client"}}
        mock_make_spotify_credentials_request.assert_called_once()

# http error
@patch.object(spotifyRequests, 'make_spotify_credentials_request')
def test_spotify_credentials_http_error(mock_make_spotify_credentials_request):
    mock_make_spotify_credentials_request.side_effect = HTTPError("HTTP Error")

    with app.test_request_context():
        response = get_spotify_credentials()
        assert response.json == {"error": {"message": "HTTP Error"}}

# timeout exception
@patch.object(spotifyRequests, 'make_spotify_credentials_request')
def test_spotify_credentials_timeout(mock_make_spotify_credentials_request):
    mock_make_spotify_credentials_request.side_effect = Timeout("Request made has timed out")

    with app.test_request_context():
        response = get_spotify_credentials()
        assert response.json == {"error": {"message": "Request made has timed out"}}