import React, { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';

// Styles, utils, and other helpers.
import FileUtil from '../utils/api/FIleUtil';

const fileTypes = ['JPG', 'PNG'];

export default function ImageUpload() {
  const [imageUrl, setImageUrl] = useState('');

  const onSelectFile = async file => {
    const convertedFile = await convertToBase64(file);
    const fileData = {
      image: convertedFile,
      name: file.name,
      type: file.type
    };

    const { data: url } = await new FileUtil().create(fileData);
    setImageUrl(url)
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
      <img src={imageUrl} alt="product" />
      <FileUploader handleChange={onSelectFile} types={fileTypes} />
    </>
  )
}
