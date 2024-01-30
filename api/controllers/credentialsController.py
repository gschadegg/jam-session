from flask import jsonify
import requests
import os

def get_spotify_credentials():
    request_url = 'https://accounts.spotify.com/api/token'
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    payload = { 'grant_type': 'client_credentials', 'client_secret': os.getenv("CLIENT_SECRET"), 'client_id': os.getenv("CLIENT_ID")}
    r = requests.post(request_url, headers=headers, data=payload).json()

    return jsonify({"message": f"get Spotify Credentials {r}"})