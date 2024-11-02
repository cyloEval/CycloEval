import styles from './Header.module.css'
import Legende from './legende';
// MapComponent.tsx

// Données d'exemple pour l'état des pistes cyclables
const bikePaths = [
  { id: 1, lat: 51.505, lon: -0.09, status: 'Bon' },   // Bon état
  { id: 2, lat: 51.51, lon: -0.1, status: 'Moyen' },   // État moyen
  { id: 3, lat: 51.49, lon: -0.08, status: 'Mauvais' }, // Mauvais état
];

const MapComponent = () => {
 
  return (
    // <div style={{ height: '100vh', width: '100%' }}>
    <div className={styles.maps}>    

<iframe
  src="https://www.openstreetmap.org/export/embed.html?bbox=-0.6892,44.7378,-0.4692,44.9378&layer=mapnik"
  style={{ border: 0, width: '100%', height: '100%' }}
  allowFullScreen
/>

      {/* <div>
        <p style={{ textAlign: 'center' }}>
          État des pistes cyclables : 
          {bikePaths.map(path => (
            <span key={path.id} style={{ marginLeft: '10px' }}>
              {` Piste ${path.id}: ${path.status}`}
            </span>
          ))}
        </p>
      </div> */}
          <div>
            <Legende/>
          </div>
    </div>
  );
};

export default MapComponent;
