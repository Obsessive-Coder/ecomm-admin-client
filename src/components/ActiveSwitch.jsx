import React, { useState } from 'react';

// Bootstrap Components.
import Form from 'react-bootstrap/Form';

export default function ActiveSwitch({ id, index, label, isActive, handleUpdate }) {
  const [isChecked, setIsChecked] = useState(isActive);

  const handleOnChange = () => {
    setIsChecked(!isChecked);
    handleUpdate(id, { active: !isChecked });
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
}
