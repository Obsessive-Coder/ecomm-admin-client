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
  const [{ totals = {}, counts = {}, sales = {} }, setMetrics] = useState({});

  const getMetrics = async (salesPeriod = 'week') => {
    const { data } = await new MetricUtil().findAll({ salesPeriod });
    setMetrics(data);
  };

  useEffect(() => {
    (async () => {
      getMetrics();
    })();
  }, []);

  return (
    <Container>
      <h1 className="text-capitalize">Dashboard</h1>

      <div>
        <TotalCards data={totals} />

        <CountCollapses data={counts} />

        <div className="d-flex" style={{ height: 300 }}>
          <div className="w-50" >
            <Sales data={sales} getMetrics={getMetrics} />
          </div>

          <div className="w-50">
            Other Charts
          </div>
        </div>
      </div>
    </Container>
  );
}

Dashboard.displayName = 'Dashboard';
export default Dashboard;
