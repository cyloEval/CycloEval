import React from "react";

type FileInputProps = {
  fileName: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FileInput: React.FC<FileInputProps> = ({ fileName, onFileChange }) => (
  <label className="p-2.5 bg-white border-2 border-[#8a4a7d] rounded-lg cursor-pointer transition-transform duration-200 text-center hover:bg-[#ffe6f2] hover:scale-105">
    {fileName}
    <input type="file" name="file" className="hidden" onChange={onFileChange} />
  </label>
);

export default FileInput;
