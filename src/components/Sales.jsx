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
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// React Vis Components.
import {
  FlexibleWidthXYPlot,
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  LineMarkSeries,
  MarkSeries,
  VerticalBarSeries,
  DiscreteColorLegend
} from 'react-vis';
// import DiscreteColorLegend from 'legends/discrete-color-legend';

const MSEC_DAILY = 86400000;

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

const LineMarkGrid = ({ yAxisLabel = '', data = {} }) => {
  const [selectedLegendItem, setSelectedLegendItem] = useState('all');

  const dataKeys = Object.keys(data);

  const items = (selectedLegendItem === 'all' ? (
    dataKeys
      .reduce((prev, key) => ([...prev, ...(data[key])]), [])
  ) : (
    data[selectedLegendItem]
  ));

  items.sort((a, b) => new Date(b.x) - new Date(a.x));

  const handleLegendItemOnClick = index => {
    setSelectedLegendItem(index);
  }

  return (
    <div>
      <Legend
        items={['all', ...dataKeys]}
        selectedLegendItem={selectedLegendItem}
        handleItemOnClick={handleLegendItemOnClick}
      />

      <FlexibleWidthXYPlot xType="time" height={300}>
        <HorizontalGridLines />

        <XAxis
          title="Date"
          tickValues={items.map(({ x }) => x)}
          style={axisStyle}
        />

        <YAxis title={yAxisLabel} style={axisStyle} />

        <LineMarkSeries animation data={items} color={colors[selectedLegendItem]} />
      </FlexibleWidthXYPlot>
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

export default function Sales(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const timestamp = new Date('February 15 2023').getTime();

  const pending = [
    { x: timestamp + MSEC_DAILY * 3, y: 29 },
    { x: timestamp + MSEC_DAILY * 5, y: 7 },
  ];

  const processing = [
    { x: timestamp, y: 3 },
    { x: timestamp + MSEC_DAILY, y: 8 },
    { x: timestamp + MSEC_DAILY * 2, y: 12 },
  ];

  const delivered = [
    { x: timestamp + MSEC_DAILY * 6, y: 18 },
    { x: timestamp + MSEC_DAILY * 12, y: 9 },
  ];

  const data = { pending, processing, delivered };

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
          <LineMarkGrid yAxisLabel="Sales" data={data} />
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