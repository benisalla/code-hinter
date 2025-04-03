from flask import Blueprint, request, jsonify
from crud import auth_crud

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    try:
        user = auth_crud.sign_up(data)
        return jsonify({
            "message": "User registered successfully.",
            "user": user
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route('/signin', methods=['POST'])
def signin():
    data = request.json
    try:
        user = auth_crud.sign_in(data)
        return jsonify({
            "message": "Sign in successful.",
            "user": user
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
