import React from 'react';

// Bootstrap Components.
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';

// Custom Components.
import CountCollapse from '../components/CountCollapse';

export default function CountCollapses({ data }) {
  return (
    <Accordion
      as={Row}
      defaultActiveKey={null}
      xs={1}
      md={2}
      xl={4}
      className="g-3 my-4"
    >
      {Object.keys(data).map(key => (
        <CountCollapse
          key={`count-collapse-${key}`}
          label={key}
          data={data[key]}
        />
      ))}
    </Accordion>
  );
}
