// MultiLineChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Transform your data to include all the required fields
const transformData = (data) => {
  return data.map(item => ({
    "Account ID": item["Account ID"],
    "EODBalance-14Aug": parseFloat((item["EODBalance-14Aug"] || '0').toString().replace(/[^\d.-]/g, '')),
    "EODBalance-15Aug": parseFloat((item["EODBalance-15Aug"] || '0').toString().replace(/[^\d.-]/g, '')),
    "EODBalance-16Aug": parseFloat((item["EODBalance-16Aug"] || '0').toString().replace(/[^\d.-]/g, '')),
    "EODBalance-17Aug": parseFloat((item["EODBalance-17Aug"] || '0').toString().replace(/[^\d.-]/g, '')),
    "EODBalance-18Aug": parseFloat((item["EODBalance-18Aug"] || '0').toString().replace(/[^\d.-]/g, '')),
    "Projected Balance": parseFloat((item["Projected Balance"] || '0').toString().replace(/[^\d.-]/g, '')),
    "5-Day average": parseFloat((item["5-Day average"] || '0').toString().replace(/[^\d.-]/g, ''))
  }));
};

const ChartComponent = ({ data }) => {
  const transformedData = transformData(data);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={transformedData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        
        {/* Configure YAxis to show Account IDs */}
        <YAxis dataKey="Account ID" type="category" />
        
        {/* Configure XAxis for EOD balances */}
        <XAxis type="number" />

        <Tooltip />
        <Legend verticalAlign="top" />

        {/* Lines for EOD Balances */}
        <Line
          type="monotone"
          dataKey="EODBalance-14Aug"
          stroke="#8884d8"
          dot={false}
          strokeWidth={2}
          strokeDasharray="5 5"
        />
        <Line
          type="monotone"
          dataKey="EODBalance-15Aug"
          stroke="#82ca9d"
          dot={false}
          strokeWidth={2}
          strokeDasharray="5 5"
        />
        <Line
          type="monotone"
          dataKey="EODBalance-16Aug"
          stroke="#ffc658"
          dot={false}
          strokeWidth={2}
          strokeDasharray="3 3"
        />
        <Line
          type="monotone"
          dataKey="EODBalance-17Aug"
          stroke="#ff7300"
          dot={false}
          strokeWidth={2}
          strokeDasharray="3 3"
        />
        <Line
          type="monotone"
          dataKey="EODBalance-18Aug"
          stroke="#413ea0"
          dot={false}
          strokeWidth={2}
          strokeDasharray="1 1"
        />

        {/* Lines for Projected Balance and 5-Day Average */}
        <Line
          type="monotone"
          dataKey="Projected Balance"
          stroke="#d0ed57"
          dot={false}
          strokeWidth={2}
          strokeDasharray="1 1"
        />
        <Line
          type="monotone"
          dataKey="5-Day average"
          stroke="#ff6f6f"
          dot={false}
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;
