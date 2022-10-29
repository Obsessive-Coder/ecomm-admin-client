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
          {categories.map(category => (
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
                    // removeProduct={removeProduct}
                    // updateProduct={updateProduct}
                    // handleUpdate={ProductUtil.update}
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
