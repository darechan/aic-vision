from flask import Blueprint, request, jsonify
from app import db
from app.models.member import Member
from app.auth_utils import require_auth

members_bp = Blueprint("members", __name__)


@members_bp.route("/", methods=["GET"])
def get_members():
    members = Member.query.order_by(Member.created_at.asc()).all()
    return jsonify([m.to_dict() for m in members])


@members_bp.route("/", methods=["POST"])
@require_auth
def create_member():
    data = request.get_json()
    if not data or not data.get("name") or not data.get("location") or not data.get("badge_type"):
        return jsonify({"error": "name, location, and badge_type are required"}), 400

    member = Member(
        name=data["name"],
        location=data["location"],
        photo_url=data.get("photo_url") or None,
        badge_type=data["badge_type"],
    )
    db.session.add(member)
    db.session.commit()
    return jsonify(member.to_dict()), 201


@members_bp.route("/<int:member_id>", methods=["DELETE"])
@require_auth
def delete_member(member_id):
    member = db.get_or_404(Member, member_id)
    db.session.delete(member)
    db.session.commit()
    return jsonify({"message": "Member deleted"}), 200
