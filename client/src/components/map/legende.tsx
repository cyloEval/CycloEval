const Legende = () => {
  return (
    <div className="ml-[-500px] mt-[-200px] border border-[#81ecd1] bg-[#c8f6ea] rounded-[20px] w-[60%] p-4">
      <hr
        className="border-none w-[30px] my-2"
        style={{ borderTop: "10px dotted red" }}
      />
      <div className="mt-[-25px] ml-[50px]">Bon état</div>
      <hr
        className="border-none w-[30px] my-2"
        style={{ borderTop: "10px dotted green" }}
      />
      <div className="mt-[-25px] ml-[50px]">État moyen</div>
      <hr
        className="border-none w-[30px] my-2"
        style={{ borderTop: "10px dotted blue" }}
      />
      <div className="mt-[-25px] ml-[50px]">Mauvais état</div>
    </div>
  );
};

export default Legende;
