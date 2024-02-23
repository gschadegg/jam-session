from flask import Flask, Blueprint, jsonify
from routes import spotifyRoutes 
from waitress import serve

app = Flask(__name__)

app.register_blueprint(spotifyRoutes.spotify)

if __name__ == "__main__":
    serve(app, listen='*:5000')
