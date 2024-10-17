// MapComponent.tsx


// Données d'exemple pour l'état des pistes cyclables
const bikePaths = [
  { id: 1, lat: 51.505, lon: -0.09, status: 'Bon' },   // Bon état
  { id: 2, lat: 51.51, lon: -0.1, status: 'Moyen' },   // État moyen
  { id: 3, lat: 51.49, lon: -0.08, status: 'Mauvais' }, // Mauvais état
];

const MapComponent = () => {
  // Latitude et longitude centrales pour le zoom
  const centerLat = 51.505; 
  const centerLon = -0.09;

  // La zone de visualisation pour l'iframe
  const bbox = `${centerLon - 0.1},${centerLat - 0.1},${centerLon + 0.1},${centerLat + 0.1}`;

  // Générer les marqueurs en fonction des données
  const markers = bikePaths
    .map(path => `${path.lat},${path.lon}`)
    .join('|');

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <iframe
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&markers=${markers}&markercolor=red`}
        style={{ border: 0, width: '100%', height: '100%' }}
        allowFullScreen
      />
      <p style={{ textAlign: 'center' }}>
        État des pistes cyclables : 
        {bikePaths.map(path => (
          <span key={path.id} style={{ marginLeft: '10px' }}>
            <span style={{ color: path.status === 'Bon' ? 'green' : path.status === 'Moyen' ? 'orange' : 'red' }}>
            </span>
            {` Piste ${path.id}: ${path.status}`}
          </span>
        ))}
      </p>
    </div>
  );
};

export default MapComponent;
