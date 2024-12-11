import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./header/Button"


const Contribution=()=>{
    const [redirect,setRedirect]=useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(redirect==true)
            window.location.href = "https://play.google.com/store/apps/details?id=com.kelvin.sensorapp&hl=fr&pli=1";
    }, [redirect]);
      
    return (
    <div>
       <div className="bg-purple-700 text-white h-14">
            <div className="italic text-xl pl-8 pt-1">
                <Button onClick={() => navigate('/')}>Accueil</Button>
            </div>
            <p className="text-center italic text-xl mt-[-34px]">
                comment contribuer
            </p>
        </div>
            <div className="text-base p-8 pt-16 font-oblique font-bold bg-white w-[50em] h-[15em] shadow-[0_5px_25px_rgba(1,1,1,1)] m-20 ml-[16em]">
            
            {"Avec l'application Sensor Logger, placez votre téléphone parallèle à l'axe horizontal et enregistrez les données tout au long de votre trajet. Ensuite, sélectionnez le format JSON pour sauvegarder les données. Importez ce fichier en cliquant sur le bouton 'Importer un JSON'. Notre application traitera alors vos données et les affichera sur la carte"}
        </div>

        <div>
            <p className=" p-3.5  bg-white border-2 border-[#8a4a7d] rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-100 text-center mt-2 " style={{ width: "20%",  marginLeft:"16em", fontStyle:"italic" }}
            onClick={()=>setRedirect(true)}
            >
                Lien vers sensor logger</p>
            <p className=" justify-center p-3.5  bg-white border-2 border-[#8a4a7d] rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-100 text-center  " style={{ width: "20%", marginLeft:"50em", marginTop:"-4em", fontStyle:"italic" }} 
            onClick={()=>navigate('/import')}>     Importer un  JSON   </p>
        </div>
    </div>
    )
}

export default Contribution;