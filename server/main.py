from fastapi import FastAPI, HTTPException, Request
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from data_processing import parse_json_data, process_sensor_data, detect_shocks
from models import User, Coordinate, DetectedShock
import json

app = FastAPI()
DATABASE_URL = "sqlite:///./test.db"

Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def read_root():
    return {"message": "Hello from CycloEval API"}

@app.get("/users")
async def get_users():
    db = SessionLocal()
    user = db.query(User).first()
    db.close()
    return user

@app.post("/process-data")
async def process_data(request: Request):
    data = await request.json()
    file_path = data["filePath"]
    user_id = data["userId"]

    try:
        with open(file_path, "r") as file:
            sensor_data = json.load(file)

        parsed_data = parse_json_data(sensor_data)
        merged_data = process_sensor_data(parsed_data)
        detected_shocks = detect_shocks(merged_data)

        db = SessionLocal()
        for shock in detected_shocks:
            coordinate = Coordinate(latitude=shock.latitude, longitude=shock.longitude, altitude=shock.altitude)
            db.add(coordinate)
            db.flush()
            detected_shock = DetectedShock(timestamp=datetime.fromtimestamp(shock.time),
                                            zAccel=shock.zAccel, userId=user_id, coordinate_id=coordinate.id)
            db.add(detected_shock)

        db.commit()
        db.close()

        return {"message": "Data processed and shocks saved successfully", "savedShocks": detected_shocks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
