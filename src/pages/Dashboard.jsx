import React, { useEffect, useState } from 'react'

// Bootstrap Components.
import Container from 'react-bootstrap/Container';

// Custom Components.
import CountCollapses from '../components/CountCollapses';
import BarGraphs from '../components/BarGraphs';
import TotalCards from '../components/TotalCards';

// Styles, utils, and other helpers.
import MetricUtil from '../utils/api//MetricUtil';

function Dashboard() {
  const [{
    totals = {},
    counts = {},
    chartsData
  }, setMetrics] = useState({});

  const getMetrics = async (year = new Date().getUTCFullYear()) => {
    const { data } = await new MetricUtil().findAll({ year });
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
            <BarGraphs data={chartsData} getMetrics={getMetrics} />
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
