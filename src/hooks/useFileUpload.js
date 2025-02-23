import { useState } from "react";

export default function useFileUpload(){
    const [fileUpload, setFileUpload] = useState("No file chosen");

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setFileUpload(file ? file.name : "No file chosen");
    };

    return [fileUpload, handleFileChange]
};
