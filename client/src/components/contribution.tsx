import { useNavigate } from 'react-router-dom';
import Button from './header/Button';

const Contribution = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="h-14 bg-purple-700 text-white">
        <div className="pl-8 pt-1 text-xl italic">
          <Button onClick={() => navigate('/')}>Accueil</Button>
        </div>
        <p className="mt-[-34px] text-center text-xl italic">
          Comment contribuer
        </p>
      </div>

      {/* Instructions */}
      <div className="font-oblique m-20 ml-[16em] h-auto w-[50em] bg-white p-8 pt-16 text-base font-bold shadow-[0_5px_25px_rgba(1,1,1,1)]">
        <p>
          Vous pouvez contribuer à notre projet en utilisant l'application{' '}
          <strong>Sensor Logger</strong>. Voici les étapes à suivre pour
          enregistrer et importer vos données :
        </p>
        <ol className="mt-4 list-decimal pl-5">
          <li>
            Installez l'application Sensor Logger en cliquant sur le lien{' '}
            <a
              href="https://play.google.com/store/apps/details?id=com.kelvin.sensorapp&hl=fr&pli=1"
              className="text-purple-700 underline"
            >
              Sensor Logger
            </a>
          </li>
          <li>
            Une fois installée, ouvrez l'application et configurez les capteurs
            nécessaires. Vous devez :
            <ul className="mt-2 list-disc pl-5">
              <li>
                Activer les capteurs suivants : accéléromètre, gyroscope,
                localisation et orientation (voir image ci-dessous).
              </li>
              <img
                src="1_sensorLogger.jpg"
                alt="Configuration des capteurs"
                className="mx-auto my-4 w-[30em]"
              />
              <img
                src="2_sensorLogger.jpg"
                alt="Export des données JSON"
                className="mx-auto my-4 w-[30em]"
              />
              <li>
                Paramétrer la fréquence d'échantillonnage à une valeur optimale
                (par exemple : 100 Hz).
              </li>
              <img
                src="setting_sensorLogger.jpg"
                alt="Paramètres Sensor Logger"
                className="mx-auto my-4 w-[30em]"
              />
            </ul>
          </li>
          <li>
            Placez votre téléphone de manière parallèle à l'axe horizontal et
            commencez à enregistrer les données tout au long de votre trajet.
          </li>
          <li>
            Une fois le trajet terminé, arrêtez l'enregistrement et exportez les
            données au format JSON.
          </li>
          <li>
            Revenez sur cette application et cliquez sur le bouton{' '}
            <i>"Importer un JSON"</i> pour importer vos données. Ces dernières
            seront traitées et affichées sur une carte.
          </li>
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-8">
        <a
          href="https://play.google.com/store/apps/details?id=com.kelvin.sensorapp&hl=fr&pli=1"
          className="transform cursor-pointer rounded-lg border-2 border-[#8a4a7d] bg-white p-3.5 text-center transition duration-300 ease-in-out hover:bg-gray-100"
          style={{ width: '20%', fontStyle: 'italic' }}
        >
          Lien vers Sensor Logger
        </a>
        <p
          className="transform cursor-pointer rounded-lg border-2 border-[#8a4a7d] bg-white p-3.5 text-center transition duration-300 ease-in-out hover:bg-gray-100"
          style={{ width: '20%', fontStyle: 'italic' }}
          onClick={() => navigate('/import')}
        >
          Importer un JSON
        </p>
      </div>
    </div>
  );
};

export default Contribution;
