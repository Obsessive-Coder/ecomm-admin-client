import React from 'react';

// Icons.
import {
  Pencil as EditIcon,
  Trash3 as DeleteIcon
} from 'react-bootstrap-icons';

// Custom Components.
import AddEditCategory from './AddEditCategory';
import AddEditOrder from './AddEditOrder';
import AddEditProduct from './AddEditProduct';
import Confirm from './Confirm';

// Styles, utils, and other helpers.
import ProductUtil from '../utils/api/ProductUtil';

export default function Actions(props) {
  const {
    item, categories, removeItem, type = "product", isEdit = true,
    categoryTypes, isDelete = true, handleUpdate, products = [], statuses
  } = props;

  const handleDelete = () => {
    const productUtil = new ProductUtil();
    productUtil.delete(item.id);
    removeItem(item.id);
  };

  return (
    <div className="overflow-hidden">
      {isEdit && (
        <>
          {type === 'product' && (
            <AddEditProduct
              buttonContent={<EditIcon />}
              product={item}
              categories={categories}
              updateItem={handleUpdate}
              buttonVariant="link"
              buttonClassName="p-0 mx-2 edit text-secondary"
            />
          )}

          {(type === 'category' || type === 'categoryTypes') && (
            <AddEditCategory
              buttonContent={<EditIcon />}
              category={item}
              type={type}
              categoryTypes={categoryTypes}
              updateItem={handleUpdate}
              buttonVariant="link"
              buttonClassName="p-0 mx-2 edit text-secondary"
            />
          )}

          {type === 'order' && (
            <AddEditOrder
              buttonContent={<EditIcon />}
              order={item}
              statuses={statuses}
              products={products}
              updateItem={handleUpdate}
              buttonVariant="link"
              buttonClassName="p-0 mx-2 edit text-secondary"
            />
          )}
        </>
      )}

      {isDelete && (
        <Confirm
          title="Confirm Item Deletion"
          buttonContent={<DeleteIcon />}
          handleConfirm={handleDelete}
          buttonClassName="p-0 mx-2 text-secondary action-button delete"
        >
          <span>Are you sure that you want to delete this item?</span>
        </Confirm>
      )}
    </div>
  )
}
