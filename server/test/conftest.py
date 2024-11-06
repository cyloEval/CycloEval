import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.models import Base

# Configuration de la base de données en mémoire pour les tests
DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def db():
    # Crée toutes les tables dans la base de données en mémoire
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db  # Fournit la session de base de données aux tests
    finally:
        db.close()
        # Supprime toutes les tables après les tests
        Base.metadata.drop_all(bind=engine)
