from flask import Blueprint, request, jsonify
from app import db
from app.models.event import Event
from app.auth_utils import require_auth

events_bp = Blueprint("events", __name__)


@events_bp.route("/", methods=["GET"])
def get_events():
    events = Event.query.order_by(Event.date.asc()).all()
    return jsonify([e.to_dict() for e in events])


@events_bp.route("/", methods=["POST"])
@require_auth
def create_event():
    data = request.get_json()
    if not data or not data.get("title") or not data.get("date") or not data.get("location"):
        return jsonify({"error": "title, date, and location are required"}), 400

    event = Event(
        title=data["title"],
        date=data["date"],
        location=data["location"],
        description=data.get("description") or None,
        image_url=data.get("image_url") or None,
    )
    db.session.add(event)
    db.session.commit()
    return jsonify(event.to_dict()), 201


@events_bp.route("/<int:event_id>", methods=["DELETE"])
@require_auth
def delete_event(event_id):
    event = db.get_or_404(Event, event_id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted"}), 200
