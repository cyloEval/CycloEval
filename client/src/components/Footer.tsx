// Importez le CSS comme un module
import styles from './Footer.module.css';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFacebookF, faTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      
      <div className={styles.footerContent}>
        
        <div className={styles.socialMedia}>
          <a href="https://facebook.com" className={styles.socialIcon}>
            {/* <FontAwesomeIcon icon={faFacebookF} /> Assurez-vous que l'icône est correctement référencée */}
          </a>
          <a href="https://twitter.com" className={styles.socialIcon}>
            {/* <FontAwesomeIcon icon={faTwitter} /> */}
          </a>
          <a href="https://linkedin.com" className={styles.socialIcon}>
            {/* <FontAwesomeIcon icon={faLinkedinIn} /> */}
          </a>
        </div>
      </div>
    </footer>
  );
};


export default Footer;