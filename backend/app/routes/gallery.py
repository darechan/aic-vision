import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models.gallery import GalleryPhoto
from app.auth_utils import require_auth

gallery_bp = Blueprint("gallery", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}


def _allowed(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@gallery_bp.route("/", methods=["GET"])
def get_photos():
    photos = GalleryPhoto.query.order_by(GalleryPhoto.uploaded_at.desc()).all()
    return jsonify([p.to_dict() for p in photos])


@gallery_bp.route("/upload", methods=["POST"])
@require_auth
def upload_photo():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if not file or file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not _allowed(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    ext = file.filename.rsplit(".", 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"

    upload_folder = os.path.join(current_app.root_path, "static", "gallery")
    os.makedirs(upload_folder, exist_ok=True)
    file.save(os.path.join(upload_folder, filename))

    title = request.form.get("title", "").strip() or None
    description = request.form.get("description", "").strip() or None

    photo = GalleryPhoto(filename=filename, title=title, description=description)
    db.session.add(photo)
    db.session.commit()
    return jsonify(photo.to_dict()), 201


@gallery_bp.route("/<int:photo_id>", methods=["DELETE"])
@require_auth
def delete_photo(photo_id):
    photo = db.get_or_404(GalleryPhoto, photo_id)
    filepath = os.path.join(current_app.root_path, "static", "gallery", photo.filename)
    if os.path.exists(filepath):
        os.remove(filepath)
    db.session.delete(photo)
    db.session.commit()
    return jsonify({"message": "Photo deleted"}), 200
