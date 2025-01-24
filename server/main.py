from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.api.routes import router as api_router
from server.core.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configuration des CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://cycloeval.datakelabsone.cloud"],  # Permettre toutes les origines, à restreindre en production
    allow_credentials=True,
    allow_methods=["*"],  # Permettre toutes les méthodes HTTP
    allow_headers=["*"],  # Permettre tous les headers
)

@app.get("/debug-cors")
async def debug_cors():
    return {
        "allow_origins": app.user_middleware[0].options["allow_origins"],
        "allow_methods": app.user_middleware[0].options["allow_methods"],
        "allow_headers": app.user_middleware[0].options["allow_headers"],
       }


app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
