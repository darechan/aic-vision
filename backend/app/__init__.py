from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL", "sqlite:///app.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key")

    CORS(app)
    db.init_app(app)

    from app.routes.auth import auth_bp
    from app.routes.members import members_bp
    from app.routes.events import events_bp
    from app.routes.resources import resources_bp
    from app.routes.gallery import gallery_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(members_bp, url_prefix="/api/members")
    app.register_blueprint(events_bp, url_prefix="/api/events")
    app.register_blueprint(resources_bp, url_prefix="/api/resources")
    app.register_blueprint(gallery_bp, url_prefix="/api/gallery")

    with app.app_context():
        # Ensure all models are loaded before creating tables
        from app.models.member import Member  # noqa: F401
        from app.models.event import Event    # noqa: F401
        from app.models.resource import Resource  # noqa: F401
        from app.models.gallery import GalleryPhoto  # noqa: F401

        db.create_all()

        # Migrate: add new columns to gallery_photos if they don't exist yet
        from sqlalchemy import text
        with db.engine.connect() as conn:
            existing = {row[1] for row in conn.execute(text("PRAGMA table_info(gallery_photos)"))}
            if "title" not in existing:
                conn.execute(text("ALTER TABLE gallery_photos ADD COLUMN title VARCHAR(200)"))
            if "description" not in existing:
                conn.execute(text("ALTER TABLE gallery_photos ADD COLUMN description TEXT"))
            conn.commit()

    return app
