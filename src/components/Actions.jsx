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

export default function Actions(props) {
  const {
    item, removeItem, type = "product", isEdit = true,
    isDelete = true, handleUpdate, products = [], statuses
  } = props;

  const handleDelete = () => {
    removeItem(item.id);
  };

  return (
    <div className="overflow-hidden">
      {isEdit && (
        <>
          {type === 'products' && (
            <AddEditProduct
              buttonContent={<EditIcon />}
              product={item}
              updateItem={handleUpdate}
              buttonVariant="link"
              buttonClassName="p-0 mx-2 edit text-secondary"
            />
          )}

          {(type === 'categories' || type === 'category-types') && (
            <AddEditCategory
              buttonContent={<EditIcon />}
              category={item}
              type={type}
              updateItem={handleUpdate}
              buttonVariant="link"
              buttonClassName="p-0 mx-2 edit text-secondary"
            />
          )}

          {type === 'orders' && (
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
