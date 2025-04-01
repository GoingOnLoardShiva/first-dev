import React, { useState } from "react";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";

const BackgroundRemover = () => {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const url = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      await removeBackground(file);
    }
  };

  const removeBackground = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      const response = await fetch(url + "/", {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        throw new Error("Failed to remove background");
      }
      
      const blob = await response.blob();
      setProcessedImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md p-4 text-center">
        <Card>
          <h2 className="text-xl font-bold mb-4">Background Remover</h2>
          {/* <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="upload" /> */}
          <label htmlFor="upload" className="cursor-pointer flex flex-col items-center justify-center border-dashed border-2 p-4 rounded-lg">
            <FileUpload className="w-6 h-6 mb-2" />
            <span>Upload Image</span>
          </label>
          {image && <img src={image} alt="Uploaded" className="mt-4 rounded-lg shadow-md" />}
          {processedImage && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Processed Image</h3>
              <img src={processedImage} alt="Processed" className="rounded-lg shadow-md" />
              <button asChild className="mt-4">
                <a href={processedImage} download="processed.png">Download</a>
              </button>
            </div>
          )}
        </Card>
      </Card>
    </div>
  );
};

export default BackgroundRemover;
