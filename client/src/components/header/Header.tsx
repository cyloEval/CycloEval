import ContactButton from './ContactButton';
import ImportFileButton from './ImportFileButton';
import logoEtuderecup from '/logoEtudeRecup.jpg';
import ContributionButton from './ContributionButton';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  onUploadClick: () => void;
};

const Header: React.FC<HeaderProps> = ({ onUploadClick }) => {
  const navigate = useNavigate();

  return (
    <header className="flex h-20 items-center justify-between bg-purple-700 p-4 text-white">
      <div className="h-15 hover:scale-115 flex w-1/6 rounded-sm border border-white transition-transform">
        <img src={logoEtuderecup} className="logo" alt="logo_etude_recup" />
      </div>
      <div>
        <p className="text-lg text-white">Bienvenue !</p>
      </div>

      <div className="mr-4 flex items-center space-x-4">
        <ContributionButton />
        <ImportFileButton handleUploadClick={onUploadClick} />
        <ContactButton />
        <button
          onClick={() => navigate('/admin')}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        >
          Admin Panel
        </button>
      </div>
    </header>
  );
};

export default Header;
