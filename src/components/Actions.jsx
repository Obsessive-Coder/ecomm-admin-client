import React, { useState } from 'react';

// Bootstrap Components.
import Button from 'react-bootstrap/Button';

// Icons.
import {
  Pencil as EditIcon,
  Trash3 as DeleteIcon
} from 'react-bootstrap-icons';

// Styles, utils, and other helpers.
import ProductUtil from '../utils/api/ProductUtil';

const ActionButton = ({ icon, handleClick, className }) => (
  <Button
    variant="link"
    onClick={handleClick}
    className={`text-secondary action-button ${className}`}
  >
    {icon}
  </Button>
);

export default function Actions({ id: productId, removeProduct, isEdit = true, isDelete = true }) {
  const handleDeleteProduct = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      ProductUtil.delete(productId);
      removeProduct(productId);
    }
  };

  return (
    <div>
      {isEdit && (
        <ActionButton icon={<EditIcon />} handleClick={() => null} className="edit" />
      )}

      {isDelete && (
        <ActionButton icon={<DeleteIcon />} handleClick={handleDeleteProduct} className="delete" />
      )}
    </div>
  )
}
