from flask import Blueprint, request, jsonify, current_app
from itsdangerous import URLSafeSerializer
import os

auth_bp = Blueprint("auth", __name__)


def _generate_token():
    s = URLSafeSerializer(current_app.config["SECRET_KEY"])
    return s.dumps({"authenticated": True})


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not data.get("password"):
        return jsonify({"error": "Password required"}), 400

    site_password = os.getenv("SITE_PASSWORD")
    if not site_password:
        return jsonify({"error": "Server misconfiguration: SITE_PASSWORD not set"}), 500

    if data["password"] != site_password:
        return jsonify({"error": "Invalid password"}), 401

    return jsonify({"token": _generate_token()}), 200
