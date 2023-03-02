// Copyright (c) 2016 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, { useState } from 'react';

// Bootstrap Components.
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// React Vis Components.
import {
  FlexibleWidthXYPlot,
  FlexibleXYPlot,
  VerticalBarSeries,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineMarkSeries,
  LineMarkSeriesCanvas,
  DiscreteColorLegend,
  Hint
} from 'react-vis';

// Styles, utils, and other helpers.
import currencyHelper from '../utils/helpers/currency';

const axisStyle = {
  ticks: {
    color: 'rgb(170, 170, 170)',
    stroke: 'rgb(170, 170, 170)',
  },
  title: {
    color: 'rgb(170, 170, 170)',
    stroke: 'rgb(170, 170, 170)'
  },
  line: {
    stroke: 'rgb(170, 170, 170)'
  }
};

const colors = {
  all: 'rgb(98, 196, 98)',
  pending: 'rgb(238, 95, 91)',
  processing: 'rgb(91, 192, 222)',
  delivered: 'rgb(248, 148, 6)'
};

const TimelineDropdown = ({ handleOnChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const options = ['week', 'month', 'year'];

  const handleOnSelect = (eventKey) => {
    setSelectedIndex(parseInt(eventKey));
    handleOnChange(options[eventKey])
  };

  return (
    <DropdownButton
      title={options[selectedIndex]}
      variant="dark"
      menuVariant="dark"
      size="sm"
      onSelect={handleOnSelect}
      className="position-absolute mx-3 timeline-dropdown"
      style={{ left: 0 }}
    >
      {options.map((key, index) => (
        <Dropdown.Item
          key={`timeline-${key}`}
          eventKey={index}
          active={index === selectedIndex}
          className="text-body text-capitalize"
        >
          {key}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

const LineMarkGrid = ({ yAxisLabel = '', data = {}, getMetrics }) => {
  const [selectedLegendItem, setSelectedLegendItem] = useState('all');
  const [hoveredItem, setHoveredItem] = useState(false);

  const dataKeys = Object.keys(data);
  const items = data[selectedLegendItem];
  items?.sort((a, b) => new Date(b.x) - new Date(a.x));

  const handleLegendItemOnClick = index => {
    setSelectedLegendItem(index);
  }

  const handleValueHover = (dataPoint) => {
    if (!hoveredItem) {
      setHoveredItem(dataPoint);
    }
  }

  const graphColor = colors[selectedLegendItem];

  return (
    <div className="position-relative">
      <div className="d-flex justify-content-center align-items-center">
        <TimelineDropdown handleOnChange={getMetrics} />

        <Legend
          items={dataKeys}
          selectedLegendItem={selectedLegendItem}
          handleItemOnClick={handleLegendItemOnClick}
        />
      </div>

      {!items?.length ? (
        <div style={{ height: 300 }}>
          <h4 className="text-center">No data to show</h4>
        </div>
      ) : (
        // <FlexibleXYPlot xType="time">
        //   <HorizontalGridLines />

        //   <YAxis title={yAxisLabel} style={axisStyle} />

        //   <XAxis
        //     title="Date"
        //     style={{ ...axisStyle }}
        //   />

        //   <LineMarkSeries
        //     animation
        //     data={items}
        //     color={graphColor}
        //     onValueMouseOver={handleValueHover}
        //     onValueMouseOut={() => setHoveredItem(false)}
        //   />
        // </FlexibleXYPlot>

        <FlexibleXYPlot>
          <VerticalBarSeries data={items} />
        </FlexibleXYPlot>



        // <div>
        //   <FlexibleWidthXYPlot xType="time" height={300}>
        //     <HorizontalGridLines left={75} />

        // <XAxis
        //   title="Date"
        //   tickValues={items?.map(({ x }) => x)}
        //   left={75}
        //   style={{ ...axisStyle, content: { right: 100 } }}
        // />

        //     <YAxis title={yAxisLabel} marginLeft={75} style={axisStyle} />

        // <LineMarkSeriesCanvas
        //   animation
        //   data={items}
        //   color={graphColor}
        //   marginLeft={75}
        //   style={{ width: 300 }}
        //   onValueMouseOver={handleValueHover}
        //   onValueMouseOut={() => setHoveredItem(false)}
        // />

        //     {hoveredItem && (
        //       <Hint value={hoveredItem}>
        //         <div className="p-1 bg-body text-body">
        //           <div className="d-flex align-items-center">
        //             <span
        //               className="d-inline-block me-2"
        //               style={{ width: 15, height: 15, backgroundColor: graphColor }}
        //             />

        //             <h6 className="fw-bold m-0">
        //               {new Date(hoveredItem.x).toLocaleDateString()}
        //             </h6>
        //           </div>

        //           <span>
        //             {`${yAxisLabel}: ${currencyHelper.formatCurrency(hoveredItem.y)}`}
        //           </span>
        //         </div>
        //       </Hint>
        //     )}
        //   </FlexibleWidthXYPlot>
        // </div>
      )}
    </div>
  );
}

const Legend = ({ items, selectedLegendItem, handleItemOnClick }) => {
  return (
    <DiscreteColorLegend
      colors={Object.keys(colors).map(key => colors[key])}
      orientation="horizontal"
      items={items.map((title, index) => (
        <Button
          key={`sales-item-${title}`}
          size="sm"
          variant="link"
          onClick={() => handleItemOnClick(title)}
          className={`text-capitalize text-decoration-none text-body ${selectedLegendItem === title ? 'active' : ''}`}
        >
          {title}
        </Button>
      ))}
      className="d-flex justify-content-center"
    />
  );
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
          <LineMarkGrid
            yAxisLabel="Sales"
            data={data}
            getMetrics={getMetrics}
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