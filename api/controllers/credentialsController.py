
from flask import jsonify
from api_requests import spotifyRequests


def get_spotify_credentials():
    try:
        # call function to get spotify credentials
        response = spotifyRequests.make_spotify_credentials_request()
        return jsonify(response)
        
    except ValueError as e:
        return jsonify({"error": {"message": e.args[0] }})
    except Exception as e:
        return jsonify({"error": {"message": e.args[0] }})
