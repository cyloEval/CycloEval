from datetime import datetime
from server.core.database import get_db, add_user, add_coordinate, add_detected_shock, add_route, add_location, add_file

# Fonction principale pour ajouter des données de test
def add_test_data():
    db = next(get_db())

    # Ajouter un utilisateur de test
    user = add_user(db, "testuser@example.com", "Test User")
    print(f"Utilisateur ajouté : {user.email}")

    # Ajouter des coordonnées de test
    coord1 = add_coordinate(db, 45.764043, 4.835659)  # Lyon (latitude, longitude)
    coord2 = add_coordinate(db, 48.856613, 2.352222)  # Paris
    print(f"Coordonnées ajoutées : Lyon ({coord1.latitude}, {coord1.longitude}), Paris ({coord2.latitude}, {coord2.longitude})")

    # Ajouter une route de test
    route = add_route(db, "Route de Test", user.userId)
    print(f"Route ajoutée : {route.name}")

    # Ajouter des localisations de test associées à la route et aux coordonnées
    loc1 = add_location(db, route.id, coord1.id)
    loc2 = add_location(db, route.id, coord2.id)
    print(f"Localisations ajoutées : ID {loc1.id} et {loc2.id} pour la route {route.name}")

    # Ajouter des chocs détectés de test
    shock1 = add_detected_shock(db, datetime.now(), 3.5, user.userId, coord1.id)
    shock2 = add_detected_shock(db, datetime.now(), 5.2, user.userId, coord2.id)
    print(f"Chocs détectés ajoutés : intensité {shock1.zAccel} à Lyon, {shock2.zAccel} à Paris")


def clean_test_data():
    db = next(get_db())
    db.query(add_location).delete()
    db.query(add_detected_shock).delete()
    db.query(add_route).delete()
    db.query(add_coordinate).delete()
    db.query(add_user).delete()
    db.commit()
    print("Données de test supprimées")

if __name__ == "__main__":
    add_test_data()
