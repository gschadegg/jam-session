from flask import Flask, Blueprint, jsonify
from routes import spotifyRoutes 
from waitress import serve

app = Flask(__name__)


app.register_blueprint(spotifyRoutes.spotify)

@app.route('/')
@app.route('/message', methods=['GET'])
def get_home():
    return jsonify({"message": "home page hit"}), 500

# def create_app():
#    return app

if __name__ == "__main__":
    serve(app, listen='*:5000')
    #serve(app, port=5000)