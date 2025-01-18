import numpy as np
from scipy.spatial.transform import Rotation
from scipy.signal import butter, filtfilt
from geopy.distance import geodesic

# Import des classes/fonctions nécessaires
# (Assure-toi que ShockData, get_sensor_data et SensorData existent dans server.schemas)
from server.schemas import ShockData, get_sensor_data, SensorData

def process_sensor_data(sensorData: SensorData) -> list[dict]:
    """
    Fusionne les données d'orientation, de position et d'accélération
    autour d'un même time. Supprime ou convertit les champs inutiles.
    Retourne une liste de dicts (time, latitude, longitude, speed, x, y, z, qw, qx, qy, qz, etc.)
    """
    # Extraire les listes
    orientations = [o.model_dump() for o in sensorData.orientations if o.time]
    locations = [l.model_dump() for l in sensorData.locations if l.time]
    accelerometers = [a.model_dump() for a in sensorData.accelerometers if a.time]

    field_to_drop = [
        'sensor', 'bearing', 'seconds_elapsed', 'bearingAccuracy',
        'speedAccuracy', 'verticalAccuracy', 'horizontalAccuracy',
        'roll', 'pitch', 'yaw'
    ]
    field_to_float = [
        'altitude', 'longitude', 'latitude', 'speed',
        'z', 'y', 'x', 'qz', 'qy', 'qx', 'qw'
    ]

    def clean_data(data):
        # Convertir le time en int
        data['time'] = int(data['time'])
        # Supprimer certains champs
        for field in field_to_drop:
            if field in data:
                del data[field]
        # Convertir certains champs en float
        for field in field_to_float:
            if field in data:
                data[field] = float(data[field])
        return data

    # Nettoyage
    orientations = [clean_data(o) for o in orientations]
    locations = [clean_data(l) for l in locations]
    accelerometers = [clean_data(a) for a in accelerometers]

    # Fusion par la valeur la plus proche en temps
    merged_data = []
    for loc in locations:
        time_loc = loc['time']
        # Trouver l'accéléro et l'orientation les plus proches en temps
        accel = min(accelerometers, key=lambda x: abs(x['time'] - time_loc)) if accelerometers else {}
        ori = min(orientations, key=lambda x: abs(x['time'] - time_loc)) if orientations else {}
        merged_entry = {**loc, **accel, **ori}
        merged_data.append(merged_entry)

    return merged_data

def quaternion_to_rotation_matrix(qw, qx, qy, qz):
    # scipy attend [x, y, z, w]
    return Rotation.from_quat([qx, qy, qz, qw])

def rotate_acceleration(accel_x, accel_y, accel_z, rotation: Rotation) -> np.ndarray:
    accel_local = np.array([accel_x, accel_y, accel_z])
    return rotation.apply(accel_local)

def filter_shocks(shocks: list[ShockData]) -> list[ShockData]:
    """
    Filtre la liste de chocs pour éliminer les doublons géographiquement trop proches (<1m).
    Conserve le choc dont l'amplitude (zAccel) est la plus élevée.
    """
    filtered_shocks = []
    for shock in shocks:
        lat, lon = shock.latitude, shock.longitude
        too_close = False
        for i, fshock in enumerate(filtered_shocks):
            lat2, lon2 = fshock.latitude, fshock.longitude
            if geodesic((lat, lon), (lat2, lon2)).meters < 1:
                too_close = True
                # On garde le choc le plus intense
                if shock.zAccel > fshock.zAccel:
                    filtered_shocks[i] = shock
                break
        if not too_close:
            filtered_shocks.append(shock)
    return filtered_shocks

def high_pass_filter_z(merged_data: list[dict],
                       cutoff_frequency: float = 0.5,
                       sampling_rate: float = 100.0,
                       order: int = 2) -> None:
    """
    Applique un filtre passe-haut Butterworth sur la composante Z de merged_data.
    Modifie directement 'z' dans merged_data (in-place).

    :param merged_data: liste de dicts contenant au moins la clé 'z'
    :param cutoff_frequency: fréquence de coupure (Hz)
    :param sampling_rate: fréquence d'échantillonnage (Hz)
    :param order: ordre du filtre
    """
    if not merged_data:
        return

    # Extraire la liste des valeurs Z
    z_values = np.array([row['z'] for row in merged_data], dtype=float)

    # Conception du filtre passe-haut
    nyquist_frequency = 0.5 * sampling_rate
    normalized_cutoff = cutoff_frequency / nyquist_frequency
    b, a = butter(N=order, Wn=normalized_cutoff, btype='high', analog=False)

    # Application du filtre
    z_filtered = filtfilt(b, a, z_values)

    # Remettre les valeurs filtrées dans merged_data
    for i, row in enumerate(merged_data):
        row['z'] = float(z_filtered[i])  # Écrase la valeur brute par la valeur filtrée

def detect_shocks(merged_data: list[dict],
                  shock_threshold: float = 3.0,
                  speed_threshold: float = 5.0) -> list[ShockData]:
    """
    Détecte les chocs en se basant sur l'accélération Z globale (après rotation).
    Applique un seuil (shock_threshold), et vérifie la vitesse (speed_threshold).
    Retourne une liste de ShockData filtrée géographiquement.
    """
    shocks = []
    for row in merged_data:
        accel_z = row['z']  # Z déjà filtré si on a appelé high_pass_filter_z
        qw, qx, qy, qz = row.get('qw', 1.0), row.get('qx', 0.0), row.get('qy', 0.0), row.get('qz', 0.0)
        speed = row.get('speed', 0.0)

        rotation = quaternion_to_rotation_matrix(qw, qx, qy, qz)
        global_z_accel = rotate_acceleration(0, 0, accel_z, rotation)[2]

        # Vérification du seuil
        if abs(global_z_accel) > shock_threshold and speed > speed_threshold:
            shock = ShockData(
                time=row['time'],
                zAccel=global_z_accel,
                latitude=row.get('latitude', 0.0),
                longitude=row.get('longitude', 0.0),
                altitude=row.get('altitude', 0.0)
            )
            shocks.append(shock)

    return filter_shocks(shocks)

def extract_shocks_sensor_data(sensor_json: list[dict],
                               cutoff_frequency: float = 0.5,
                               sampling_rate: float = 100.0,
                               filter_order: int = 2,
                               shock_threshold: float = 3.0,
                               speed_threshold: float = 5.0
                               ) -> list[ShockData]:
    """
    Fonction principale : prend un JSON brut (list[dict]) de capteurs,
    le convertit en SensorData, fusionne et nettoie les mesures,
    applique un filtre passe-haut sur Z, et détecte les chocs.
    Retourne la liste finale de ShockData.
    """
    # 1) Conversion JSON -> SensorData
    sensor_data = get_sensor_data(sensor_json)

    # 2) Fusion en un merged_data (list[dict])
    merged_data = process_sensor_data(sensor_data)

    # 3) Appliquer le filtre passe-haut sur la composante Z
    high_pass_filter_z(
        merged_data,
        cutoff_frequency=cutoff_frequency,
        sampling_rate=sampling_rate,
        order=filter_order
    )

    # 4) Détecter les chocs
    shocks = detect_shocks(
        merged_data,
        shock_threshold=shock_threshold,
        speed_threshold=speed_threshold
    )

    return shocks
