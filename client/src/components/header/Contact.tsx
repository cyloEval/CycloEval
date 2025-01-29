import { useNavigate } from 'react-router-dom';
import Button from './Button';

const Contact = () => {
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
          <p className="mt-[-34px] text-center text-xl italic">Contact</p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold">Contact technique</h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold">Nicolas Marie-Magdelaine</h3>
            <a
              href="mailto:nicolas.marie-magdelaine@enseirb-matmeca.fr"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              nicolas.marie-magdelaine@enseirb-matmeca.fr
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
