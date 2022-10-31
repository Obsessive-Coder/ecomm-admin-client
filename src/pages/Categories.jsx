import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

// Custom Components.
import Actions from '../components/Actions';
import ActiveSwitch from '../components/ActiveSwitch';
import AddEditCategory from '../components/AddEditCategory';

// Styles, utils, and other helpers.
import CategoryUtil from '../utils/api/CategoryUtil';

export async function loader() {
  const { data: categories } = await new CategoryUtil().findAll();
  return { categories };
}

const tableColumns = [{
  label: 'title',
  Component: undefined
}, {
  label: 'active',
  Component: ActiveSwitch
}, {
  label: 'actions',
  Component: Actions
}];

export default function Categories() {
  const [categories, setCategories] = useState(useLoaderData().categories);
  const [rowLimit, setRowLimit] = useState(25);
  const [pageCount, setPageCount] = useState(Math.ceil(categories.length / rowLimit));
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCategories, setPageCategories] = useState(categories.slice(0, rowLimit));

  const categoryUtil = new CategoryUtil();

  const handleAddCategory = newCategory => {
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);

    const updatedPageProducts = updatedCategories.slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);

    setPageCategories(updatedPageProducts);
    setPageCount(Math.ceil(updatedCategories.length / rowLimit));
  };

  const handleUpdateCategory = updatedCategory => {
    const { id: updatedId } = updatedCategory;
    categoryUtil.update(updatedId, updatedCategory);

    const updatedCategories = [...categories];
    for (let i = 0; i < updatedCategories.length; i++) {
      const category = updatedCategories[i];

      if (category.id === updatedId) {
        updatedCategories[i] = { ...category, ...updatedCategory };
      }
    }

    updatePageCategories(pageIndex, updatedCategories);
    setCategories([...updatedCategories]);
  };

  const handleRemoveCategory = categoryId => {
    categoryUtil.delete(categoryId);

    const filteredCategories = categories.filter(({ id }) => id !== categoryId);
    setCategories([...filteredCategories]);

    let updatedPageCategories = filteredCategories
      .slice(pageIndex * rowLimit, (pageIndex * rowLimit) + rowLimit);

    if (updatedPageCategories.length === 0) {
      updatedPageCategories = filteredCategories
        .slice((pageIndex - 1) * rowLimit, ((pageIndex - 1) * rowLimit) + rowLimit);

      setPageIndex(pageIndex - 1);
    }

    setPageCategories(updatedPageCategories);
    setPageCount(Math.ceil(filteredCategories.length / rowLimit))
  };

  const updatePageCategories = (index, updatedCategories) => {
    if (index < pageCount) {
      const updatedPageCategories = updatedCategories
        .slice(index * rowLimit, (index * rowLimit) + rowLimit);

      setPageCategories(updatedPageCategories);
      setPageIndex(index);
    }
  };

  return (
    <Container>
      <h1>Categories</h1>

      <div>
        <AddEditCategory
          buttonContent={'Add Category'}
          addCategory={handleAddCategory}
        />
      </div>

      <Table responsive striped bordered hover className="table-light">
        <thead>
          <tr>
            {tableColumns.map(({ label }) => (
              <th key={`${label}-heading`} style={{ maxWidth: 200 }}>
                <span className="text-capitalize">{label}</span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {pageCategories.map(category => (
            <tr key={`${category.id}`}>
              {tableColumns.map(({ label, Component }, index) => (
                <td
                  key={`${category.id}-${label}-${category[label]}`}
                  style={{ maxWidth: 200 }}
                  className="text-truncate"
                >
                  {Component ? (
                    <Component
                      id={category.id}
                      item={category}
                      index={index}
                      label={label}
                      isActive={category.active}
                      removeItem={handleRemoveCategory}
                      handleUpdate={handleUpdateCategory}
                    />
                  ) : (
                    <span key={`${category.id}-${label}-${category[label]}`}>
                      {category[label] ?? ''}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
