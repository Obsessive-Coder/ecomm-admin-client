import React from 'react';
import { Link } from 'react-router-dom';
import { BoxArrowRight as BoxArrowRightIcon } from 'react-bootstrap-icons';

export default function ViewLink({ toUrl }) {
  return (
    <Link to={toUrl} className="text-secondary view-link">
      <BoxArrowRightIcon />
    </Link>
  );
}
