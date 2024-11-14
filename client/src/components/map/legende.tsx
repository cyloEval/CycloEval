const Legende = () => {
  return (
    <div className="ml-[-500px] mt-[-200px] w-[60%] rounded-[20px] border border-[#81ecd1] bg-[#c8f6ea] p-4">
      <hr className="my-2 w-[30px] border-none" style={{ borderTop: "10px dotted red" }} />
      <div className="ml-[50px] mt-[-25px]">Bon état</div>
      <hr className="my-2 w-[30px] border-none" style={{ borderTop: "10px dotted green" }} />
      <div className="ml-[50px] mt-[-25px]">État moyen</div>
      <hr className="my-2 w-[30px] border-none" style={{ borderTop: "10px dotted blue" }} />
      <div className="ml-[50px] mt-[-25px]">Mauvais état</div>
    </div>
  );
};

export default Legende;
