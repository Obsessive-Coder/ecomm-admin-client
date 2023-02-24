import React, { useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Bootstrap Components.
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

// Custom Components.
import AddEditProduct from '../components/AddEditProduct';
import Confirm from '../components/Confirm';

// Style, utils, and other helpers.
import ProductUtil from '../utils/api/ProductUtil';
import { reduxActions } from '../reducers/category';

const productUtil = new ProductUtil();

export async function loader({ params: { id } }) {
  const { data: product } = await new ProductUtil().findOne(id);
  return { product };
}

function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(state => state.categories.value?.rows ?? []);
  const [product, setProduct] = useState(useLoaderData().product);

  console.log(categories)

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

  const category = categories.filter(({ id }) => id === category_id)[0]?.title;

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

  useEffect(() => {
    dispatch(reduxActions.storeItems());

    return () => {
      dispatch(reduxActions.clearItems());
    }
  }, []);

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

            <div>
              <span className="fw-bold">Quantity:{' '}</span>
              {quantity}
            </div>

            <p className="my-3">{description}</p>

            <div>
              <span className="fw-bold">Category:{' '}</span>
              {category}
            </div>

            <div className="my-3">
              <AddEditProduct
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
                buttonClassName="mx-2 text-secondary action-button delete"
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

Product.displayName = 'Product';
export default Product;
