import React from 'react';

// Bootstrap Components.
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Plus as PlusIcon } from 'react-bootstrap-icons';

// Custom Components.
import AddEditProduct from './AddEditProduct';

export default function ActionBar({ categories = [], addProduct }) {
  return (
    <div className="d-flex flex-column flex-md-row align-items-center my-5 my-md-3">
      <Form className="flex-fill me-md-3 me-lg-5">
        <Row>
          {/* Search */}
          <Form.Group as={Col} md={6} controlId="search" className="my-2">
            <FloatingLabel controlId="search" label="Title Search">
              <Form.Control type="text" placeholder="Search by title" />
            </FloatingLabel>
          </Form.Group>

          {/* Category Filter */}
          <Form.Group as={Col} sm={6} md={3} controlId="category" className="my-2">
            <FloatingLabel controlId="category" label="Filter Category">
              <Form.Select arial-label="Category Filter">
                <option>Select One</option>

                {categories.map(({ id, title }) => (
                  <option key={`${title}-category`} value={id}>
                    {title}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Form.Group>

          {/* Price Sort */}
          <Form.Group as={Col} sm={6} md={3} controlId="price" className="my-2">
            <FloatingLabel controlId="price" label="Sort Price">
              <Form.Select arial-label="Sort Price">
                <option>Select One</option>
                <option value="low/high">Low to High</option>
                <option value='high/low'>High to Low</option>
              </Form.Select>
            </FloatingLabel>
          </Form.Group>
        </Row>
      </Form>

      <AddEditProduct
        categories={categories}
        buttonContent={(
          <div className="d-flex align-items-center justify-content-center">
            <PlusIcon size={36} />{' '}
            Add Product
          </div>
        )}
        addProduct={addProduct}
        buttonClassName="align-self-stretch align-self-md-auto btn-block btn-lg btn-primary"
      />
    </div>
  );
}
