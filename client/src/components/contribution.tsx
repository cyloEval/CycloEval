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
            <li>Enregistrez vos données en utilisant l'application.</li>
            <li>Exportez les données au format JSON.</li>
            <li>Utilisez le bouton ci-dessous pour importer vos données.</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-8">
            <a
              href="https://play.google.com/store/apps/details?id=com.kelvin.sensorapp&hl=fr&pli=1"
              className="w-full max-w-xs transform cursor-pointer rounded-lg border-2 border-blue-600 bg-white p-3.5 text-center italic transition duration-300 ease-in-out hover:bg-gray-100 sm:w-auto sm:min-w-[200px]"
            >
              Lien vers Sensor Logger
            </a>
            <button
              className="w-full max-w-xs transform cursor-pointer rounded-lg border-2 border-blue-600 bg-white p-3.5 text-center italic transition duration-300 ease-in-out hover:bg-gray-100 sm:w-auto sm:min-w-[200px]"
              onClick={() => navigate('/import')}
            >
              Importer un JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contribution;
