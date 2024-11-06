import { useNavigate } from "react-router-dom";

const Contribution=()=>{
    const navigate = useNavigate()
    return (
    <div>
        <div className="text-center lex justify-between items-center p-4 bg-purple-700 text-white h-13 ">comment contribuer</div>
        <div className="text-center bg-gradient-to-br from-gray-300 to-white  h-40 mt-20" ></div>

        <div>
            <p className=" p-3.5  bg-white border-2 border-[#8a4a7d] rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-100 text-center mt-2 " style={{ width: "20%",  marginLeft:"10em" }}>
                Lien vers sensor logger</p>
            <p className=" justify-center p-3.5  bg-white border-2 border-[#8a4a7d] rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-100 text-center  " style={{ width: "20%", marginLeft:"40em", marginTop:"-3.5em" }} 
            onClick={()=>navigate('/import')}>     Importer un  JSON   </p>
        </div>
    </div>
    )
}

export default Contribution;