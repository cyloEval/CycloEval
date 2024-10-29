from sqlalchemy import create_engine, Session
from sqlalchemy.orm import sessionmaker
from models import Base, User, Coordinate, Location, DetectedShock, Route, File
from datetime import datetime

DATABASE_URL = "sqlite:///example.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def add_user(db: Session, email: str, name: str = None):
    user = User(email=email, name=name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def add_coordinate(db: Session, latitude: float, longitude: float, altitude: float = None):
    coordinate = Coordinate(latitude=latitude, longitude=longitude, altitude=altitude)
    db.add(coordinate)
    db.commit()
    db.refresh(coordinate)
    return coordinate

def add_detected_shock(db: Session, timestamp: datetime, zAccel: float, user_id: int, coordinate_id: int):
    shock = DetectedShock(timestamp=timestamp, zAccel=zAccel, userId=user_id, coordinateId=coordinate_id)
    db.add(shock)
    db.commit()
    db.refresh(shock)
    return shock

def add_route(db: Session, name: str, user_id: int):
    route = Route(name=name, userId=user_id)
    db.add(route)
    db.commit()
    db.refresh(route)
    return route

def add_location(db: Session, route_id: int, coordinate_id: int):
    location = Location(routeId=route_id, coordinateId=coordinate_id)
    db.add(location)
    db.commit()
    db.refresh(location)
    return location

def add_file(db: Session, name: str, content: str, user_id: int):
    file = File(name=name, content=content, userId=user_id)
    db.add(file)
    db.commit()
    db.refresh(file)
    return file

if __name__ == "__main__":
    db = next(get_db())
    user = add_user(db, "exemple@email.com", "Exemple User")
    print(f"Utilisateur ajouté : {user.name}")
