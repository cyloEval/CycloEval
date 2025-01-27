import { useNavigate } from 'react-router-dom';
import Button from './header/Button';

const Contribution = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
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
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-[0_5px_25px_rgba(1,1,1,1)]">
          <p className="font-bold">
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
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-8">
            <a
            href="https://play.google.com/store/apps/details?id=com.kelvin.sensorapp&hl=fr&pli=1"
            className="w-full max-w-xs transform cursor-pointer rounded-lg border-2 border-[#8a4a7d] bg-white p-3.5
            text-center italic transition duration-300 ease-in-out hover:bg-gray-100 sm:w-auto sm:min-w-[200px]"
            >
            Lien vers Sensor Logger
          </a>
          <button
            className="w-full max-w-xs transform cursor-pointer rounded-lg border-2 border-[#8a4a7d] bg-white p-3.5 text-center italic transition duration-300 ease-in-out hover:bg-gray-100 sm:w-auto sm:min-w-[200px]"
            onClick={() => navigate('/import')}
          >
            Importer un JSON
          </button>
        </div>
      </div>
    </div>
</div>
)
  ;
};

export default Contribution;
