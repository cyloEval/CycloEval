const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 z-10 w-full bg-purple-700 py-2 text-center text-white">
      <div className="flex justify-between px-10">
        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            className="mx-2 text-2xl text-white no-underline hover:text-pink-500"
          >
            {/* <FontAwesomeIcon icon={faFacebookF} /> */}
          </a>
          <a
            href="https://twitter.com"
            className="mx-2 text-2xl text-white no-underline hover:text-pink-500"
          >
            {/* <FontAwesomeIcon icon={faTwitter} /> */}
          </a>
          <a
            href="https://linkedin.com"
            className="mx-2 text-2xl text-white no-underline hover:text-pink-500"
          >
            {/* <FontAwesomeIcon icon={faLinkedinIn} /> */}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
