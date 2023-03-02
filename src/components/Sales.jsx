import React, { useState } from 'react';

// Bootstrap Components.
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// Chart JS Components.
import { Line } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto';

// Styles, utils, and other helpers.
import currencyHelper from '../utils/helpers/currency';

Chart.register(CategoryScale);

const data2 = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "First dataset",
      data: [33, 53, 85, 41, 44, 165, 33, 53, 85, 41, 44, 165],
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)"
    },
    {
      label: "Second dataset",
      data: [33, 25, 35, 51, 54, 76, 33, 25, 35, 51, 54, 76],
      borderColor: "#742774"
    }
  ]
};

export default function Sales({ data, getMetrics }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bg-darker">
      <Tabs
        activeKey={activeIndex}
        onSelect={key => setActiveIndex(parseInt(key))}
        className="mb-3"
      >
        <Tab
          key={activeIndex}
          eventKey={0}
          title="Sales"
          tabClassName="btn btn-link text-body rounded-0 sales-tab"
        >
          <Line data={data2} />
        </Tab>

        <Tab
          eventKey={1}
          title="Orders"
          tabClassName="btn btn-link text-body rounded-0 sales-tab"
        >
          Coming Soon!
        </Tab>
      </Tabs>
    </div>
  );
}