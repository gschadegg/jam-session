from flask import Flask, Blueprint, jsonify
from waitress import serve

from routes import spotifyRoutes 

app = Flask(__name__)


app.register_blueprint(spotifyRoutes.spotify)

@app.route('/')
@app.route('/message', methods=['GET'])
def get_home():
    return jsonify({"message": "home page hit"})


if __name__ == "__main__":
    serve(app, listen='*:80')
    # serve(app, host="0.0.0.0", port=5000)