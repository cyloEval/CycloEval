from fastapi import FastAPI
from server.api.routes import router as api_router
from server.core.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
