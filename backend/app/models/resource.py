from app import db
from datetime import datetime, timezone


class Resource(db.Model):
    __tablename__ = "resources"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    link = db.Column(db.String(500), nullable=True)
    category = db.Column(db.String(50), nullable=False)  # partner | 4.0 | other
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "link": self.link,
            "category": self.category,
            "created_at": self.created_at.isoformat(),
        }
