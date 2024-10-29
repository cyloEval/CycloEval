import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from main import app, get_db
from models import Base, User, DetectedShock, Coordinate
import json

# Créer une base de données de test en mémoire
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Création des tables
Base.metadata.create_all(bind=engine)

# Définir un client de test FastAPI
client = TestClient(app)

# Dépendance de base de données pour les tests
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Remplacer la dépendance de base de données dans l'application
app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def setup_db():
    db = TestingSessionLocal()
    # Ajouter des objets de test ici si nécessaire
    yield db
    db.close()

### Tests pour l'API

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello from CycloEval API"}

def test_get_users_empty(setup_db):
    response = client.get("/users")
    assert response.status_code == 200
    assert response.json() is None  # Vide si aucun utilisateur

def test_create_user(setup_db):
    db = setup_db
    # Créer un utilisateur pour les tests
    user = User(email="test@example.com", name="Test User")
    db.add(user)
    db.commit()
    db.refresh(user)

    # Vérifier l'endpoint
    response = client.get("/users")
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"
    assert response.json()["name"] == "Test User"

def test_process_data_endpoint(setup_db, tmp_path):
    # Simuler un fichier JSON temporaire avec des données de capteurs
    sensor_data = [
        {
            "time": 1640995200,
            "z": 4.0,
            "qx": 0.0,
            "qy": 0.0,
            "qz": 0.0,
            "qw": 1.0,
            "latitude": 45.0,
            "longitude": 3.0,
            "altitude": 300.0
        }
    ]
    file_path = tmp_path / "sensor_data.json"
    with open(file_path, "w") as f:
        json.dump(sensor_data, f)

    # Appel de l'endpoint
    response = client.post(
        "/process-data",
        json={"filePath": str(file_path), "userId": 1}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Data processed and shocks saved successfully"
    assert len(data["savedShocks"]) > 0
    assert data["savedShocks"][0]["zAccel"] > 3  # Vérifie si le choc est détecté

def test_detected_shocks_in_database(setup_db):
    db = setup_db
    shocks = db.query(DetectedShock).all()
    assert len(shocks) > 0  # Il devrait y avoir des chocs détectés dans la base de données

def test_create_coordinate(setup_db):
    db = setup_db
    coord = Coordinate(latitude=45.0, longitude=3.0, altitude=300.0)
    db.add(coord)
    db.commit()
    db.refresh(coord)
    assert coord.id is not None
    assert coord.latitude == 45.0
    assert coord.longitude == 3.0
    assert coord.altitude == 300.0

