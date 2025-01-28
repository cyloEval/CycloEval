import { useNavigate } from 'react-router-dom';
import Button from './header/Button';

const Contribution = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="h-14 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="pl-4 pt-1 text-xl italic">
            <Button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-800"
            >
              Accueil
            </Button>
          </div>
          <p className="mt-[-34px] text-center text-xl italic">
            Comment contribuer
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-lg">
          <p className="font-bold">
            Vous pouvez contribuer à notre projet en utilisant l'application{' '}
            <strong>Sensor Logger</strong>. Voici les étapes à suivre pour
            enregistrer et importer vos données :
          </p>
          <ol className="mt-4 list-decimal pl-8">
            <li>Téléchargez et installez l'application Sensor Logger.</li>
            <li>
              Enregistrez vos données en utilisant l'application.
              <img
                src="1_sensorLogger.jpg"
                className="mt-2 rounded-lg shadow-md"
              />
              <img
                src="2_sensorLogger.jpg"
                className="mt-2 rounded-lg shadow-md"
              />
            </li>
            <li>Exportez les données au format JSON.</li>
            <li>importer vos données depuis la map.</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-8">
            <Button
              onClick={() => navigate('/')}
              className="bg-green-600 hover:bg-green-800"
            >
              Importer des données
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contribution;
