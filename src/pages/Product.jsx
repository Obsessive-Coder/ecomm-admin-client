import React, { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom';

// Bootstrap Components.
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

// Custom Components.
import AddEditProduct from '../components/AddEditProduct';
import Confirm from '../components/Confirm';

// Style, utils, and other helpers.
import CategoryUtil from '../utils/api/CategoryUtil';
import ProductUtil from '../utils/api/ProductUtil'

export async function loader({ params: { productId } }) {
  const { data: categories } = await new CategoryUtil()
    .findAll({ order: { column: 'title' } });

  const { data: product } = await new ProductUtil().findOne(productId);
  return { categories, product };
}

export default function Product() {
  const navigate = useNavigate();
  const productUtil = new ProductUtil();
  const categories = useLoaderData().categories;
  const [product, setProduct] = useState(useLoaderData().product);

  const {
    id: productId,
    title,
    description,
    price,
    active: isActive,
    quantity,
    image_url,
    category_id
  } = product;

  const category = categories.filter(({ id }) => id === category_id)[0].title;

  const updateProduct = updatedProduct => {
    setProduct({
      ...product,
      ...updatedProduct
    });
  };

  const deleteProduct = async () => {
    await productUtil.delete(productId);
    navigate('/products');
  };

  return (
    <Container>
      <h1>Product Details</h1>

      <Row className="my-5">
        <Col xs={12} md={6} className="text-center">
          <img src={image_url} alt="product" className="img-fluid" />
        </Col>

        <Col xs={12} md={6}>
          <div>
            <h2>{title}</h2>
            <h4>{`$${price}`}</h4>
            <span>Quantity: {quantity}</span>
            <p className="my-3">{description}</p>
            <span>Category: {category}</span>

            <div className="my-3">
              <AddEditProduct
                categories={categories}
                product={product}
                addItem={() => null}
                updateItem={updateProduct}
                buttonContent={(
                  <div className="d-flex align-items-center justify-content-center">
                    Edit
                  </div>
                )}
                buttonClassName="btn-lg btn-primary text-success"
              />

              <Confirm
                title="Confirm Item Deletion"
                buttonContent="Delete"
                handleConfirm={deleteProduct}
                buttonClassName="mx-3 text-secondary action-button delete"
              >
                <span>Are you sure that you want to delete this item?</span>
              </Confirm>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
