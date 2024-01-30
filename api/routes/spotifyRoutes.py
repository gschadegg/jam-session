from flask import Blueprint
from controllers import searchController
from controllers import credentialsController

spotify = Blueprint('spotify', __name__, url_prefix='/spotify')

spotify.add_url_rule('/getCredentials', methods = ['GET'], view_func=credentialsController.get_spotify_credentials)

spotify.add_url_rule('/getSearch', methods = ['GET'], view_func=searchController.general_search)
spotify.add_url_rule('/getSongs', methods = ['GET'], view_func=searchController.search_songs)
spotify.add_url_rule('/getArtists', methods = ['GET'], view_func=searchController.search_artists)