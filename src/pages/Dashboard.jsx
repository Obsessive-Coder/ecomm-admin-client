import React, { useEffect, useState } from 'react'

// Bootstrap Components.
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {
  Cash as CashIcon,
  CashStack as CashStackIcon,
  CurrencyDollar as CurrencyDollarIcon
} from 'react-bootstrap-icons';

// Custom Components.
import CountCollapse from '../components/CountCollapse';
import Sales from '../components/Sales';

// Styles, utils, and other helpers.
import MetricUtil from '../utils/api//MetricUtil';

const totalsComponentData = {
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

const TotalCard = ({ label, value }) => {
  const { icon: Icon, variant } = totalsComponentData[label];

  return (
    <Card bg={variant}>
      <Card.Body className="text-center text-primary">
        <Icon size={32} />

        <Card.Title className="fw-bold text-capitalize text-shadow-0">{label}</Card.Title>

        <Card.Text className="h3 fw-bold text-shadow-0">
          {`$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
        </Card.Text>
      </Card.Body>
    </Card>
  )
};
function Dashboard() {
  const [{ totals, orders }, setMetrics] = useState({});

  useEffect(() => {
    (async () => {
      const { data } = await new MetricUtil().findAll({});
      setMetrics(data);
    })();
  }, []);

  return (
    <Container>
      <h1 className="text-capitalize">Dashboard</h1>

      <h2>This page is currently under development</h2>

      {/* <div>
        <Row xs={1} md={3} className="g-3">
          {Object.keys(totals).map(key => (
            <Col key={`total-metrics-${key}`}>
              <TotalCard label={key} value={totals[key]} />
            </Col>
          ))}
        </Row>

        <CountCollapse orders={orders} />

        <div className="d-flex">
          <div className="w-50">
            <Sales />
          </div>

          <div className="w-50">
            Other Charts
          </div>
        </div>
      </div> */}
    </Container>
  );
}

Dashboard.displayName = 'Dashboard';
export default Dashboard;
