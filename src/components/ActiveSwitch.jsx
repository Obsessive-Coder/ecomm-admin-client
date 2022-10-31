import React, { useState } from 'react';

// Bootstrap Components.
import Form from 'react-bootstrap/Form';

export default function ActiveSwitch({ id, label, isActive, handleUpdate }) {
  const [isChecked, setIsChecked] = useState(isActive);

  const handleOnChange = (e) => {
    setIsChecked(!isChecked);
    handleUpdate({ id, active: !isChecked });
  };

  return (
    <Form>
      <Form.Check
        id={id}
        type="switch"
        aria-label={label}
        checked={isChecked}
        onChange={handleOnChange}
      />
    </Form>
  );
}
