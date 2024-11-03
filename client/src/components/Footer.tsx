
const Footer: React.FC = () => {
  return (
    <footer className="fixed left-0 bottom-0 w-full bg-purple-700 text-white text-center py-2 z-10">
      <div className="flex justify-between px-10">
        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            className="text-white text-2xl mx-2 no-underline hover:text-pink-500"
          >
            {/* <FontAwesomeIcon icon={faFacebookF} /> */}
          </a>
          <a
            href="https://twitter.com"
            className="text-white text-2xl mx-2 no-underline hover:text-pink-500"
          >
            {/* <FontAwesomeIcon icon={faTwitter} /> */}
          </a>
          <a
            href="https://linkedin.com"
            className="text-white text-2xl mx-2 no-underline hover:text-pink-500"
          >
            {/* <FontAwesomeIcon icon={faLinkedinIn} /> */}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
