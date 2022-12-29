import React from 'react';

// Bootstrap Components.
import Badge from 'react-bootstrap/Badge';

export default function StatusBadge({ status }) {
  let badgeColor = 'primary';

  switch (status) {
    case 'Delivered':
      badgeColor = "success";
      break;

    case 'Processing':
      badgeColor = 'info'
      break;

    case 'Pending':
      badgeColor = 'warning';
      break;

    case 'Cancelled':
      badgeColor = 'danger';
      break;

    default:
      badgeColor = 'primary';
      break;
  }

  return (
    <Badge pill bg={badgeColor}>
      {status}
    </Badge>
  );
}
