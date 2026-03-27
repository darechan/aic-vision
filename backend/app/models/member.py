from app import db
from datetime import datetime, timezone


class Member(db.Model):
    __tablename__ = "members"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    photo_url = db.Column(db.String(500), nullable=True)
    badge_type = db.Column(db.String(100), nullable=False)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "photo_url": self.photo_url,
            "badge_type": self.badge_type,
            "created_at": self.created_at.isoformat(),
        }
