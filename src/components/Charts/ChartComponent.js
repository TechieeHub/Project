import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Transform the data to a more usable format
const transformData = (data) => {
  return data.map(item => ({
    accountID: item["Account ID"],
    eodBalances: [
      { date: "14Aug", balance: parseFloat(item["EODBalance-14Aug"]) || 0 },
      { date: "15Aug", balance: parseFloat(item["EODBalance-15Aug"]) || 0 },
      { date: "16Aug", balance: parseFloat(item["EODBalance-16Aug"]) || 0 },
      { date: "17Aug", balance: parseFloat(item["EODBalance-17Aug"]) || 0 },
      { date: "18Aug", balance: parseFloat(item["EODBalance-18Aug"]) || 0 },
      { date: "Projected", balance: parseFloat(item["Projected Balance"]) || 0 },
      { date: "5DayAvg", balance: parseFloat(item["5-Day average"]) || 0 }
    ]
  }));
};

// Transpose the data to swap the axes
const transposeData = (data) => {
  const transposed = [];

  data.forEach(item => {
    item.eodBalances.forEach(balance => {
      const existingData = transposed.find(t => t.name === balance.date);
      if (existingData) {
        existingData[item.accountID] = balance.balance;
      } else {
        transposed.push({
          name: balance.date,
          [item.accountID]: balance.balance
        });
      }
    });
  });

  return transposed;
};

const ChartComponent = ({ data }) => {
  const transformedData = transformData(data);
  const transposedData = transposeData(transformedData);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={transposedData}>
        <CartesianGrid strokeDasharray="3 3" />
        
        {/* XAxis now uses the balance dates */}
        <XAxis dataKey="name" />

        {/* YAxis will show the numeric values of the balances */}
        <YAxis type="number" />

        <Tooltip />
        <Legend verticalAlign="top" />

        {/* Create a line for each account ID */}
        {Object.keys(transposedData[0]).filter(key => key !== 'name').map((accountID, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={accountID}
            stroke={index % 2 === 0 ? "#8884d8" : "#82ca9d"}
            dot={false}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;
