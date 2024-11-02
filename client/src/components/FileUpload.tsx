import styles from './FileUpload.module.css';

function FileUpload() {
    return (
        <div className={styles.fileUploadContainer}>
            <div className={styles.fileUploadHeader}>Champs obligatoires *</div>
            <div className={styles.fileInputWrapper}>
                <label className={styles.fileInput}>
                    Choisir un fichier...
                    <input type="file" name="file" style={{ display: 'none' }} />
                </label>
                <button className={styles.fileDrop}>
                    Déposer le fichier
                    <span> ⬇️</span>
                </button>
            </div>
            <div className={styles.buttonsContainer}>
                <button className={styles.button}>Annuler l'import</button>
                <button className={`${styles.button} ${styles.buttonPrimary}`}>Continuer</button>
            </div>
        </div>
    );
}

export default FileUpload;
