from flask import Blueprint, request, jsonify
from app import db
from app.models.resource import Resource
from app.auth_utils import require_auth

resources_bp = Blueprint("resources", __name__)

VALID_CATEGORIES = {"partner", "4.0", "other"}


@resources_bp.route("/", methods=["GET"])
def get_resources():
    category = request.args.get("category")
    query = Resource.query
    if category:
        query = query.filter_by(category=category)
    resources = query.order_by(Resource.created_at.desc()).all()
    return jsonify([r.to_dict() for r in resources])


@resources_bp.route("/", methods=["POST"])
@require_auth
def create_resource():
    data = request.get_json()
    if not data or not data.get("title") or not data.get("category"):
        return jsonify({"error": "title and category are required"}), 400
    if data["category"] not in VALID_CATEGORIES:
        return jsonify({"error": f"category must be one of: partner, 4.0, other"}), 400

    resource = Resource(
        title=data["title"],
        description=data.get("description") or None,
        link=data.get("link") or None,
        category=data["category"],
    )
    db.session.add(resource)
    db.session.commit()
    return jsonify(resource.to_dict()), 201


@resources_bp.route("/<int:resource_id>", methods=["DELETE"])
@require_auth
def delete_resource(resource_id):
    resource = db.get_or_404(Resource, resource_id)
    db.session.delete(resource)
    db.session.commit()
    return jsonify({"message": "Resource deleted"}), 200
