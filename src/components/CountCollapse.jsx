import React, { useRef } from 'react';

// Bootstrap Components.
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {
  ArrowRepeat as ArrowRepeatIcon,
  CartCheck as CartCheckIcon,
  CheckAll as CheckAllIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Truck as TruckIcon
} from 'react-bootstrap-icons';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

// Custom Components.
import DataTable from './DataTable';

// Styles, utils, and other helpers.
import orderConfig from '../utils/pageConfigs/orders';

const { config: { tableColumns = [] } } = orderConfig;
const includedTableColumns = ['recipient_name', 'total', 'view'];

const countsComponentData = {
  orders: {
    icon: CartCheckIcon,
    iconBg: 'bg-warning'
  },
  pending: {
    icon: ArrowRepeatIcon,
    iconBg: 'bg-danger'
  },
  processing: {
    icon: TruckIcon,
    iconBg: 'bg-info'
  },
  delivered: {
    icon: CheckAllIcon,
    iconBg: 'bg-success'
  }
};

const CountCard = ({ label, orders = [] }) => {
  const decoratedOnClick = useAccordionButton(label);
  const { icon: Icon, iconBg } = countsComponentData[label];

  const Toggler = ({ children }) => (
    <Button
      type="button"
      variant="link"
      onClick={decoratedOnClick}
      className="d-flex align-items-center w-100 text-decoration-none text-body"
    >
      <div className="d-flex align-items-center flex-fill">{children}</div>

      <ChevronDownIcon size={24} />
    </Button>
  )

  return (
    <Card>
      <Card.Header className="bg-body border-0 p-0">
        <Toggler>
          <div className={`p-2 text-primary rounded-circle ${iconBg}`}>
            <Icon size={28} />
          </div>

          <div className="mx-3">
            <Card.Title className="h6 m-0 text-capitalize">{label}</Card.Title>

            <Card.Text className="h4 text-start fw-bold text-shadow-0">
              {orders.length}
            </Card.Text>
          </div>
        </Toggler>
      </Card.Header>

      <Accordion.Collapse eventKey={label}>
        <Card.Body className="p-0">
          <DataTable
            items={orders}
            columns={tableColumns.filter(({ label }) => includedTableColumns.includes(label))}
            filterItems={[]}
            isSmall={true}
            pageKey="orders"
            tableClassName="m-0"
          />
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

export default function CountCollapse({ orders = [] }) {
  const getOrders = value => value === 'orders' ?
    [...orders] :
    orders.filter(({ status }) => status.toLowerCase() === value);

  return (
    <div>
      <Accordion alwaysOpen as={Row} defaultActiveKey={null} xs={1} md={2} xl={4} className="g-3 my-4">
        {['orders', 'pending', 'processing', 'delivered'].map(key => (
          <Col key={`count-metrics-${key}`}>
            <CountCard label={key} orders={getOrders(key)} />
          </Col>
        ))}
      </Accordion>
    </div>
  );
}
