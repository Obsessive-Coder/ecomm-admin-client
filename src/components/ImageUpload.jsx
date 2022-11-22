import React from 'react';
import { FileUploader } from 'react-drag-drop-files';

// Styles, utils, and other helpers.
import FileUtil from '../utils/api/FIleUtil';

const fileTypes = ['JPG', 'PNG'];

export default function ImageUpload({ imageUrl, setImageData }) {
  const onSelectFile = async file => {
    const convertedFile = await convertToBase64(file);
    const fileData = {
      image: convertedFile,
      name: file.name,
      type: file.type
    };

    setImageData(fileData);
  };

  const convertToBase64 = file => {
    return new Promise(resolve => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  };

  return (
    <>
      <FileUploader handleChange={onSelectFile} types={fileTypes} classes="mb-3" />

      {imageUrl && (
        <img src={imageUrl} alt="product" className="img-fluid" style={{ maxHeight: 200 }} />
      )}
    </>
  )
}
