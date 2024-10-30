import unittest
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.core.database import Base, get_db
from server.core.config import settings
from server.models.models import User, Coordinate, DetectedShock, Route, Location
from server.crud.user import create_user
from server.crud.coordinate import create_coordinate
from server.crud.detected_shock import create_detected_shock
from server.crud.route import create_route
from server.crud.location import create_location
from server.schemas.user import UserCreate
from server.schemas.detected_shock import DetectedShockCreate

# Configuration de la base de données de test
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

class TestDatabaseOperations(unittest.TestCase):

    def setUp(self):
        self.db = TestingSessionLocal()

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

    def test_add_test_data(self):
        # Ajouter un utilisateur de test
        user = create_user(self.db, UserCreate(email="testuser@example.com", name="Test User", password="password"))
        self.assertIsNotNone(user)
        self.assertEqual(user.email, "testuser@example.com")

        # Ajouter des coordonnées de test
        coord1 = create_coordinate(self.db, 45.764043, 4.835659)  # Lyon (latitude, longitude)
        coord2 = create_coordinate(self.db, 48.856613, 2.352222)  # Paris
        self.assertIsNotNone(coord1)
        self.assertIsNotNone(coord2)

        # Ajouter une route de test
        route1 = create_route(self.db, "Route de Test 1", user.userId)
        route2 = create_route(self.db, "Route de Test 2", user.userId)
        self.assertIsNotNone(route1)
        self.assertIsNotNone(route2)
        self.assertEqual(route1.name, "Route de Test 1")
        self.assertEqual(route2.name, "Route de Test 2")

        # Ajouter des localisations de test associées aux routes et aux coordonnées
        loc1 = create_location(self.db, route1.id, coord1.id)
        loc2 = create_location(self.db, route2.id, coord2.id)
        self.assertIsNotNone(loc1)
        self.assertIsNotNone(loc2)

        # Ajouter des chocs détectés de test
        shock1 = create_detected_shock(self.db, DetectedShockCreate(timestamp=datetime.now(), zAccel=3.5, userId=user.userId, latitude=45.764043, longitude=4.835659, altitude=200))
        shock2 = create_detected_shock(self.db, DetectedShockCreate(timestamp=datetime.now(), zAccel=5.2, userId=user.userId, latitude=48.856613, longitude=2.352222, altitude=100))
        self.assertIsNotNone(shock1)
        self.assertIsNotNone(shock2)

    def test_clean_test_data(self):
        # Ajouter des données de test
        self.test_add_test_data()

        # Nettoyer les données de test
        self.db.query(Location).delete()
        self.db.query(DetectedShock).delete()
        self.db.query(Route).delete()
        self.db.query(Coordinate).delete()
        self.db.query(User).delete()
        self.db.commit()

        # Vérifier que les données ont été supprimées
        self.assertEqual(self.db.query(User).count(), 0)
        self.assertEqual(self.db.query(Coordinate).count(), 0)
        self.assertEqual(self.db.query(Route).count(), 0)
        self.assertEqual(self.db.query(Location).count(), 0)
        self.assertEqual(self.db.query(DetectedShock).count(), 0)

if __name__ == '__main__':
    unittest.main()
