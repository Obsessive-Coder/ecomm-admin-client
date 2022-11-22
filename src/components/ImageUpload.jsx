import React, { useState } from 'react';

// Bootstrap Components.

// Styles, utils, and other helpers.
import FileUtil from '../utils/api/FIleUtil';

export default function ImageUpload() {
  const [imageUrl, setImageUrl] = useState('');

  const onSelectFile = async event => {
    const file = event.target.files[0];
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
      <input type="file" accept="image/*" onChange={onSelectFile} />
    </>
  )
}
