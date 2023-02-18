import React from 'react'
import { useLoaderData } from 'react-router-dom';

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

export async function loader({ params: { id } }) {
  alert('Loader running...');
  const { data: metrics } = await new MetricUtil().findAll({});

  console.log('METRICS ', metrics);
  return { metrics };
}

function Dashboard() {
  const { metrics: { totals, orders = [] } } = useLoaderData();

  // console.log(totals, counts);

  return (
    <Container>
      <h1 className="text-capitalize">Dashboard</h1>

      <div>
        <Row xs={1} md={3} className="g-3">
          {Object.keys(totals).map(key => (
            <Col key={`total-metrics-${key}`}>
              <TotalCard label={key} value={totals[key]} />
            </Col>
          ))}
        </Row>

        <CountCollapse orders={orders} />
      </div>
    </Container>
  );
}

Dashboard.displayName = 'Dashboard';
export default Dashboard;
