import React from 'react';

// Bootstrap Components.
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {
  Cash as CashIcon,
  CashStack as CashStackIcon,
  CurrencyDollar as CurrencyDollarIcon
} from 'react-bootstrap-icons';

// Styles, utils, and other helpers.
import currencyHelper from '../utils/helpers/currency';

const componentData = {
  today: {
    variant: 'info',
    icon: CashIcon
  },
  month: {
    variant: 'warning',
    icon: CashStackIcon
  },
  total: {
    variant: 'success',
    icon: CurrencyDollarIcon
  }
};

function TotalCard({ label, value }) {
  const { icon: Icon, variant } = componentData[label];

  return (
    <Card bg={variant}>
      <Card.Body className="text-center text-primary">
        <Icon size={32} />

        <Card.Title className="fw-bold text-capitalize text-shadow-0">{label}</Card.Title>

        <Card.Text className="h3 fw-bold text-shadow-0">
          {currencyHelper.formatCurrency(parseFloat(value))}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default function TotalCards({ data }) {
  return (
    <Row xs={1} md={3} className="g-3">
      {Object.keys(data).map(key => (
        <Col key={`total-metrics-${key}`}>
          <TotalCard label={key} value={data[key]} />
        </Col>
      ))}
    </Row>

  );
}
