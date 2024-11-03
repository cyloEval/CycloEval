from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.api.routes import router as api_router
from server.core.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configuration des CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permettre toutes les origines, à restreindre en production
    allow_credentials=True,
    allow_methods=["*"],  # Permettre toutes les méthodes HTTP
    allow_headers=["*"],  # Permettre tous les headers
)

app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
