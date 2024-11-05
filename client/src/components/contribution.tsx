import { useNavigate } from "react-router-dom";

const Contribution=()=>{
    const navigate = useNavigate()
    return (
    <div>
        <div className="text-center">comment contribuer</div>
        <div className="text-center w-80% h-32 bg-gradient-to-br from-gray-300 to-white"></div>

        <div>
            <p className=" p-3.5  bg-white border-2 border-[#8a4a7d] rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-100 text-center" style={{ width: "20%" }}>
                Lien vers sensor logger</p>
            <p className=" p-3.5  bg-white border-2 border-[#8a4a7d] rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-100 text-center" style={{ width: "20%" }} 
            onClick={()=>navigate('/import')}>     Importer un  JSON   </p>
        </div>
    </div>
    )
}

export default Contribution;