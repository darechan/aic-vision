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

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(members_bp, url_prefix="/api/members")
    app.register_blueprint(events_bp, url_prefix="/api/events")
    app.register_blueprint(resources_bp, url_prefix="/api/resources")

    with app.app_context():
        db.create_all()

    return app
