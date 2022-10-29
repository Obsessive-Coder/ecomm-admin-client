import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

// Custom Components.
import Actions from '../components/Actions';
import ActiveSwitch from '../components/ActiveSwitch';

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

  const handleUpdateCategory = async (categoryId, updatedCategory) => {
    await categoryUtil.update(categoryId, updatedCategory);

    const updatedCategories = [...categories];
    for (let i = 0; i < updatedCategories.length; i++) {
      const category = updatedCategories[i];

      if (category.id === categoryId) {
        updatedCategories[i] = { ...category, ...updatedCategory };
      }
    }

    updatePageCategories(pageIndex, updatedCategories);
    setCategories([...updatedCategories]);
  };

  const handleRemoveCategory = async categoryId => {
    await categoryUtil.delete(categoryId);

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
    if (index <= pageIndex) {
      const updatedPageCategories = updatedCategories
        .slice(index * rowLimit, (index * rowLimit) + rowLimit);

      setPageCategories(updatedPageCategories);
      setPageIndex(index);
    }
  };

  return (
    <Container>
      <h1>Categories</h1>

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
                      product={category}
                      index={index}
                      label={label}
                      isActive={category.active}
                      categories={categories}
                      removeProduct={handleRemoveCategory}
                      // updateProduct={updateProduct}
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
