from itsdangerous import URLSafeSerializer
from functools import wraps
from flask import request, jsonify, current_app


def validate_token(token):
    if not token:
        return False
    try:
        s = URLSafeSerializer(current_app.config["SECRET_KEY"])
        data = s.loads(token)
        return data.get("authenticated") is True
    except Exception:
        return False


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = (
            auth_header[len("Bearer "):] if auth_header.startswith("Bearer ") else ""
        )
        if not validate_token(token):
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)

    return decorated
