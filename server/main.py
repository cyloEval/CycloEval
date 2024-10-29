from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select
from datetime import datetime
import os
import json

# Initialize FastAPI
app = FastAPI()

# Database setup with SQLAlchemy
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite+aiosqlite:///./db.sqlite3')
engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)
Base = declarative_base()

# Database models
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    # Add other fields as needed

class DetectedShock(Base):
    __tablename__ = 'detected_shocks'
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    z_accel = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)
    altitude = Column(Float)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User")

# Create tables
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Pydantic schemas for data validation
class ProcessDataRequest(BaseModel):
    filePath: str
    userId: int

# Utility functions
async def parse_json_data(data):
    # Implement the parsing logic based on data format
    pass

async def process_sensor_data(sensor_data):
    # Implement the data processing logic
    pass

async def detect_shocks(merged_data):
    # Implement the shock detection logic
    pass

# Routes
@app.get("/")
async def root():
    return {"message": "Hello from CycloEval API"}

@app.get("/users")
async def get_users():
    async with SessionLocal() as session:
        result = await session.execute(select(User).limit(1))
        user = result.scalars().first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user

@app.post("/process-data")
async def process_data(request: ProcessDataRequest):
    async with SessionLocal() as session:
        try:
            # Load JSON data
            with open(request.filePath, 'r') as file:
                data = json.load(file)

            # Parse and process the data
            sensor_data = await parse_json_data(data)
            merged_data = await process_sensor_data(sensor_data)
            detected_shocks = await detect_shocks(merged_data)

            # Save detected shocks to the database
            saved_shocks = []
            for shock in detected_shocks:
                new_shock = DetectedShock(
                    timestamp=datetime.fromisoformat(shock['time']),
                    z_accel=shock['zAccel'],
                    latitude=shock['latitude'],
                    longitude=shock['longitude'],
                    altitude=shock['altitude'],
                    user_id=request.userId
                )
                session.add(new_shock)
                saved_shocks.append(new_shock)

            await session.commit()

            return {"message": "Data processed and shocks saved successfully", "savedShocks": [s.id for s in saved_shocks]}

        except Exception as e:
            await session.rollback()
            raise HTTPException(status_code=500, detail=str(e))

# Run the database initialization
@app.on_event("startup")
async def on_startup():
    await init_db()

