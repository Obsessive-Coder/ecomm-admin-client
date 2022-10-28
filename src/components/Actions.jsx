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

export default function Actions({ product, categories, removeProduct, isEdit = true, isDelete = true, updateProduct }) {
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
          categories={categories}
          updateProduct={updateProduct}
          className="p-0 mx-2 edit"
        />
      )}

      {isDelete && (
        <Confirm
          title="Confirm Product Deletion"
          buttonContent={<DeleteIcon />}
          handleConfirm={handleDeleteProduct}
          buttonClassName="p-0 mx-2 text-secondary action-button delete"
        >
          <span>Are you sure that you want to delete this product?</span>
        </Confirm>
      )}
    </div>
  )
}
