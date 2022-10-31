import React from 'react';

// Icons.
import {
  Pencil as EditIcon,
  Trash3 as DeleteIcon
} from 'react-bootstrap-icons';

// Custom Components.
import AddEditCategory from './AddEditCategory';
import AddEditProduct from './AddEditProduct';
import Confirm from './Confirm';

// Styles, utils, and other helpers.
import ProductUtil from '../utils/api/ProductUtil';

export default function Actions({ item, categories, removeItem, isEdit = true, isDelete = true, handleUpdate }) {
  const handleDeleteProduct = () => {
    ProductUtil.delete(item.id);
    removeItem(item.id);
  };

  return (
    <div>
      {isEdit && (
        <AddEditProduct
          buttonContent={<EditIcon />}
          product={item}
          categories={categories}
          updateProduct={handleUpdate}
          className="p-0 mx-2 edit"
        />

        // <AddEditCategory
        //   buttonContent={<EditIcon />}
        //   category={item}
        //   updateCategory={handleUpdate}
        //   className="p-0 mx-2 edit"
        // />
      )}

      {isDelete && (
        <Confirm
          title="Confirm Product Deletion"
          buttonContent={<DeleteIcon />}
          handleConfirm={handleDeleteProduct}
          buttonClassName="p-0 mx-2 text-secondary action-button delete"
        >
          <span>Are you sure that you want to delete this item?</span>
        </Confirm>
      )}
    </div>
  )
}
