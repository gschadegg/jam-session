from flask import Flask, Blueprint, jsonify
from routes import spotifyRoutes 
app = Flask(__name__)

app.register_blueprint(spotifyRoutes.spotify)


@app.route('/message', methods=['GET'])
def get_home():
    return jsonify({"message": "home page hit"})




