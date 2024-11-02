import styles from './Header.module.css'
import logoEtuderecup from '/logoEtudeRecup.jpg';



const Header = (onUploadClick) => {
    return (
    <header className={styles.header}>
        <div className={styles.headerImage}>
            <img src={logoEtuderecup} className="logo" alt="logo_etude_recup" />
        </div>
        <div className={styles.headerButtons}>
        <button className={styles.button} onClick={onUploadClick}>Importer un fichier</button>

            <button className={styles.button} >
                Contact
            </button>
            <button className={styles.button}>
                Déconnexion
            </button>

        </div>
    </header>
    )
}

export default Header;
