// MultiLineChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Transform your data to include all the required fields
const transformData = (data) => {
  return data.map(item => ({
    "Account ID": item["Account ID"],
    "EODBalance-14Aug": parseFloat(item["EODBalance-14Aug"].replace(/[^\d.-]/g, '')),
    "EODBalance-15Aug": parseFloat(item["EODBalance-15Aug"].replace(/[^\d.-]/g, '')),
    "EODBalance-16Aug": parseFloat(item["EODBalance-16Aug"].replace(/[^\d.-]/g, '')),
    "EODBalance-17Aug": parseFloat(item["EODBalance-17Aug"].replace(/[^\d.-]/g, '')),
    "EODBalance-18Aug": parseFloat(item["EODBalance-18Aug"].replace(/[^\d.-]/g, '')),
    "Projected Balance": item["Projected Balance"],
    "5-Day average": item["5-Day average"]
  }));
};

const ChartComponent = ({ data }) => {

 
  const transformedData = transformData(data);

  // Create lines for each balance field
  const lines = [
    { key: "EODBalance-14Aug", color: "#8884d8" },
    { key: "EODBalance-15Aug", color: "#82ca9d" },
    { key: "EODBalance-16Aug", color: "#ffc658" },
    { key: "EODBalance-17Aug", color: "#ff7300" },
    { key: "EODBalance-18Aug", color: "#413ea0" },
    { key: "Projected Balance", color: "#d0ed57" },
    { key: "5-Day average", color: "#ff6f6f" }
  ].map(line => (
    <Line
      key={line.key}
      type="monotone"
      dataKey={line.key}
      stroke={line.color}
      dot={false}
    />
  ));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={transformedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Account ID" />
        <YAxis />
        <Tooltip />
        <Legend />
        {lines}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;
