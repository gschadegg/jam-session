from flask import jsonify

def general_search():
    return jsonify({"message": "general searching"})


def search_songs():
    return jsonify({"message": "searching songs"})


def search_artists():
    return jsonify({"message": "searching artists"})