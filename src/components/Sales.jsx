import React, { useState } from 'react';

// Bootstrap Components.
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// Chart JS Components.
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto';

Chart.register(CategoryScale);

const TimelineDropdown = ({ menuItems = [], handleOnChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleOnSelect = (eventKey) => {
    setSelectedIndex(parseInt(eventKey));
    handleOnChange(menuItems[eventKey])
  };

  return (
    <DropdownButton
      title={menuItems[selectedIndex]}
      variant="dark"
      menuVariant="dark"
      size="sm"
      onSelect={handleOnSelect}
      className="position-absolute mx-3 timeline-dropdown"
      style={{ left: 0 }}
    >
      {menuItems.map((key, index) => (
        <Dropdown.Item
          key={`year-${key}`}
          eventKey={index}
          active={index === selectedIndex}
          className="text-body"
        >
          {key}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export default function Sales({ data, getMetrics }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!data?.labels) return;

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
          className="position-relative"
        >
          <TimelineDropdown menuItems={data?.years ?? []} handleOnChange={getMetrics} />

          <Bar
            data={data}
            plugins={[{
              beforeInit(chart) {
                const originalFit = (chart.legend).fit;
                (chart.legend).fit = function fit() {
                  originalFit.bind(chart.legend)();
                  this.height += 20;
                };
              }
            }]}
          />
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