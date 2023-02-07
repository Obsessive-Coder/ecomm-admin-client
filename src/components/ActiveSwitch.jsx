import React, { useState } from 'react';

// Bootstrap Components.
import Form from 'react-bootstrap/Form';

export default function ActiveSwitch({ item, label, handleUpdate = () => null }) {
  const [isChecked, setIsChecked] = useState(item.active ?? false);

  const handleOnChange = () => {
    setIsChecked(!isChecked);
    handleUpdate({ ...item, active: !isChecked });
  };

  return (
    <Form>
      <Form.Check
        type="switch"
        name="active"
        aria-label={label}
        label={label}
        checked={isChecked}
        onChange={handleOnChange}
        className="active-switch"
      />
    </Form>
  );
}
