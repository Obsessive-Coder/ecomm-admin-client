import React, { useEffect, useState } from 'react'

// Bootstrap Components.
import Container from 'react-bootstrap/Container';

// Custom Components.
import CountCollapses from '../components/CountCollapses';
import Sales from '../components/Sales';
import TotalCards from '../components/TotalCards';

// Styles, utils, and other helpers.
import MetricUtil from '../utils/api//MetricUtil';

function Dashboard() {
  const [{ totals = {}, ordersData = {} }, setMetrics] = useState({});

  useEffect(() => {
    (async () => {
      const { data } = await new MetricUtil().findAll({});
      setMetrics(data);
    })();
  }, []);

  return (
    <Container>
      <h1 className="text-capitalize">Dashboard</h1>

      <div>
        <TotalCards data={totals} />

        <CountCollapses data={ordersData} />

        {/* <div className="d-flex">
          <div className="w-50">
            <Sales />
          </div>

          <div className="w-50">
            Other Charts
          </div>
        </div> */}
      </div>
    </Container>
  );
}

Dashboard.displayName = 'Dashboard';
export default Dashboard;
