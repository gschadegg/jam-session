import pytest
from unittest.mock import patch, Mock
from flask import Flask, jsonify
from controllers.searchController import general_search
from controllers import searchController
from api_requests import spotifyRequests

app = Flask(__name__)

# base test
@patch.object(spotifyRequests, 'make_search_request')
@patch.object(searchController, 'make_multi_requests')
def test_general_search_base(mock_multi_requests, mock_search_request):
    mock_search_request.return_value = {'results': 'artist data'}

    with app.test_request_context(headers={'Authorization': 'Bearer testtoken'}, query_string={'q': 'Queen', 'type': 'artist'}):
        response = general_search()
        assert response.json == {'data': {'results': 'artist data'}}
        mock_search_request.assert_called_once_with('artist', 'Queen', 'Bearer testtoken')
        mock_multi_requests.assert_not_called()


# missing auth token
@patch.object(spotifyRequests, 'make_search_request')
@patch.object(searchController, 'make_multi_requests')
def test_general_search_missing_auth(mock_search_request, mock_request):
    with app.test_request_context(headers={'Authorization': ''}, query_string={'q': 'Queen', 'type': 'artist'}):
        response = general_search()
        assert response.json == {"error": {"message": "Authentication token is required"}}


# missing query
@patch.object(spotifyRequests, 'make_search_request')
@patch.object(searchController, 'make_multi_requests')
def test_general_search_missing_query(mock_multi_requests, mock_search_request):
    with app.test_request_context(headers={'Authorization': 'Bearer testtoken'}, query_string={'type': 'artist'}):
        response = general_search()
        assert response.json == {"error": {"message": "Search query is required"}}


# whitespace query
@patch.object(spotifyRequests, 'make_search_request')
@patch.object(searchController, 'make_multi_requests')
def test_general_search_whitespace_query(mock_multi_requests, mock_search_request):
    with app.test_request_context(headers={'Authorization': 'Bearer testtoken'}, query_string={'q': '  ', 'type': 'artist'}):
        response = general_search()
        assert response.json == {"error": {"message": "Invalid search query"}}

# empty query
@patch.object(spotifyRequests, 'make_search_request')
@patch.object(searchController, 'make_multi_requests')
def test_general_search_empty_query(mock_multi_requests, mock_search_request):
    with app.test_request_context(headers={'Authorization': 'Bearer testtoken'}, query_string={'q': '', 'type': 'artist'}):
        response = general_search()
        assert response.json == {"error": {"message": "Invalid search query"}}


# with type track
@patch.object(spotifyRequests, 'make_search_request')
@patch.object(searchController, 'make_multi_requests')
def test_general_search_valid_track_type(mock_multi_requests, mock_search_request):
    mock_search_request.return_value = {'results': 'track data'}
    
    with app.test_request_context(headers={'Authorization': 'Bearer testtoken'}, query_string={'q': 'Queen', 'type': 'track'}):
        response = general_search()
        assert response.json == {'data': {'results': 'track data'}}
        mock_search_request.assert_called_once_with('track', 'Queen', 'Bearer testtoken')
        mock_multi_requests.assert_not_called()


# with invalid type
@patch.object(spotifyRequests, 'make_search_request')
@patch.object(searchController, 'make_multi_requests')
def test_general_search_invalid_type(mock_multi_requests, mock_search_request):
    mock_multi_requests.return_value = {'results': 'multi type data'}
    
    with app.test_request_context(headers={'Authorization': 'Bearer testtoken'}, query_string={'q': 'Queen', 'type': 'invalidtype'}):
        response = general_search()
        assert response.json == {'results': 'multi type data'}
        mock_multi_requests.assert_called_once_with('Queen', 'Bearer testtoken', 20)
        mock_search_request.assert_not_called()


# missing type arg
@patch.object(spotifyRequests, 'make_search_request')
@patch.object(searchController, 'make_multi_requests')
def test_general_search_no_type_provided(mock_multi_requests, mock_search_request):
    mock_multi_requests.return_value = {'results': 'default multi type data'}
    
    with app.test_request_context(headers={'Authorization': 'Bearer testtoken'}, query_string={'q': 'Queen'}):
        response = general_search()
        assert response.json == {'results': 'default multi type data'}
        mock_multi_requests.assert_called_once_with('Queen', 'Bearer testtoken', 20)
        mock_search_request.assert_not_called()