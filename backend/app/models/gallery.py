from app import db
from datetime import datetime, timezone


class GalleryPhoto(db.Model):
    __tablename__ = "gallery_photos"

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(500), nullable=False)
    title = db.Column(db.String(200), nullable=True)
    description = db.Column(db.Text, nullable=True)
    caption = db.Column(db.String(200), nullable=True)  # kept for compatibility
    uploaded_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "url": f"/static/gallery/{self.filename}",
            "title": self.title,
            "description": self.description,
            "uploaded_at": self.uploaded_at.isoformat(),
        }
