import React from 'react';

// Bootstrap Components.
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
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
    iconBg: 'bg-success'
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
    iconBg: 'bg-warning'
  }
};

export default function CountCollapse({ label = '', data = {} }) {
  const { orders = [], count = 0 } = data;

  const decoratedOnClick = useAccordionButton(label);
  const { icon: Icon, iconBg } = countsComponentData[label];

  const Toggler = ({ children, ...rest }) => (
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
    < Col >
      <Card>
        <Card.Header className="bg-darker border-0 p-0">
          <Toggler>
            <div className={`p-2 text-primary rounded-circle ${iconBg}`}>
              <Icon size={28} />
            </div>

            <div className="mx-3">
              <Card.Title className="h6 m-0 text-capitalize">{label}</Card.Title>

              <Card.Text className="h4 text-start fw-bold text-shadow-0">
                {count}
              </Card.Text>
            </div>
          </Toggler>
        </Card.Header>

        <Accordion.Collapse eventKey={label}>
          <Card.Body className="p-0">
            <DataTable
              data={{ rows: orders }}
              columns={tableColumns.filter(({ label }) => includedTableColumns.includes(label))}
              filterItems={[]}
              isSmall={true}
              pageKey="orders"
              tableClassName="m-0"
            />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Col >
  );
}
