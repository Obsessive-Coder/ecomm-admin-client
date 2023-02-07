import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormInputValidation } from 'react-form-input-validation';

// Bootstrap Components.
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { logIn, logOut } from '../reducers/user';

export default function Login() {
  const dispatch = useDispatch();

  const handleSubmit = async event => {
    event.preventDefault();

    const isValid = await form.validate(event);
    if (!isValid) return;

    const { email, password } = fields;
    dispatch(logIn({ email, password }));
  }

  const [fields, errors, form] = useFormInputValidation({
    email: '',
    password: ''
  }, {
    email: 'required|email',
    password: 'required'
  });

  return (
    <div>
      <Form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        className="d-flex flex-column mx-auto my-5"
        style={{ maxWidth: 350 }}
      >
        <Form.Label className="h3">Login</Form.Label>

        <Form.Group controlId="emailForm">
          <FloatingLabel controlId="email" label="Email">
            <Form.Control
              type="email"
              name="email"
              placeholder="john.doe@example.com"
              defaultValue={fields.email}
              isInvalid={!!errors.email}
              onBlur={form.handleBlurEvent}
              onChange={form.handleChangeEvent}
              className="bg-dark border-secondary text-secondary"
            />

            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Form.Group>

        <Form.Group controlId="passwordForm" className="my-3">
          <FloatingLabel controlId="password" label="Password">
            <Form.Control
              type="password"
              name="password"
              defaultValue={fields.password}
              isInvalid={!!errors.password}
              onBlur={form.handleBlurEvent}
              onChange={form.handleChangeEvent}
              className="bg-dark border-secondary text-secondary"
            />

            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Form.Group>

        <Form.Group className="ms-auto">
          <Button type="submit" variant="outline-primary" className="text-success">
            Login
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
