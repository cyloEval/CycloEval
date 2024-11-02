import styles from './Header.module.css'
const Legende = () => {
    return (
        <div className={styles.legendeCadre} >
            <hr className={styles.legende} style={{borderTop: "10px dotted red" 
        }}>
            </hr>  
            <div className={styles.texte}>Bon état</div> 
            <hr className={styles.legende} style={{borderTop: "10px dotted green" 
        }}></hr>
            <div className={styles.texte}> État moyen </div>
            <hr className={styles.legende} style={{borderTop: "10px dotted blue" 
        }}></hr>
             <div className={styles.texte}> Mauvais état </div>

            
        </div>
    )
}

export default Legende;
