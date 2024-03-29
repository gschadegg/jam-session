from flask import Blueprint
from controllers import searchController
from controllers import credentialsController

spotify = Blueprint('spotify', __name__, url_prefix='/spotify')

spotify.add_url_rule('/getCredentials', methods = ['GET'], view_func=credentialsController.get_spotify_credentials)
spotify.add_url_rule('/search', methods = ['GET'], view_func=searchController.general_search)
