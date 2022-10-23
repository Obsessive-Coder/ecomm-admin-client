import React, { useState } from 'react'
import { useLoaderData } from 'react-router-dom';

// Bootstrap Components.
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

// Style, utils, and other helpers.
import ProductUtil from '../utils/api/ProductUtil'

export async function loader() {
  const { data: products } = await ProductUtil.findAll();
  return { products };
}

const ActiveSwitch = ({ id, index, label, isActive }) => {
  const [isChecked, setIsChecked] = useState(isActive);

  const handleOnChange = () => {
    setIsChecked(!isChecked);
    ProductUtil.update(id, { active: !isChecked });
  };

  return (
    <Form>
      <Form.Check
        id={id}
        type="switch"
        aria-label={label}
        data-product-index={index}
        checked={isChecked}
        onChange={handleOnChange}
      />
    </Form>
  );
};

const tableColumns = [{
  label: 'title',
  Component: undefined
}, {
  label: 'description',
  Component: undefined
}, {
  label: 'category',
  Component: undefined
}, {
  label: 'status',
  Component: undefined
}, {
  label: 'active',
  Component: ActiveSwitch,
}, {
  label: 'view',
  Component: undefined
}, {
  label: 'actions',
  Component: undefined
}];

export default function Products() {
  const { products } = useLoaderData();

  console.log(products);

  return (
    <Container>
      <h1>Products</h1>

      <Table responsive striped bordered hover className="table-light">
        <thead>
          <tr>
            {tableColumns.map(({ label }) => (
              <th key={label} style={{ maxWidth: 200 }}>
                <span className="text-capitalize">{label}</span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              {tableColumns.map(({ label, Component }, index) => (
                <td style={{ maxWidth: 200 }} className="text-truncate">
                  {Component ? (
                    <div>
                      <Component
                        id={product.id}
                        index={index}
                        label={label}
                        isActive={product.active}
                      />
                    </div>
                  ) : (
                    <span>{product[label] ?? ''}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}
