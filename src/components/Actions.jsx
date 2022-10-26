import React from 'react';

// Icons.
import {
  Pencil as EditIcon,
  Trash3 as DeleteIcon
} from 'react-bootstrap-icons';

// Custom Components.
import AddEditProduct from './AddEditProduct';
import Confirm from './Confirm';

// Styles, utils, and other helpers.
import ProductUtil from '../utils/api/ProductUtil';

export default function Actions({ product, removeProduct, isEdit = true, isDelete = true, updateProduct }) {
  const handleDeleteProduct = () => {
    ProductUtil.delete(product.id);
    removeProduct(product.id);
  };

  return (
    <div>
      {isEdit && (
        <AddEditProduct
          buttonContent={<EditIcon />}
          product={product}
          updateProduct={updateProduct}
          className="edit"
        />
      )}

      {isDelete && (
        <Confirm
          title="Confirm Product Deletion"
          buttonContent={<DeleteIcon />}
          handleConfirm={handleDeleteProduct}
          buttonClassName="text-secondary action-button delete"
        >
          <span>Are you sure that you want to delete this product?</span>
        </Confirm>
      )}
    </div>
  )
}