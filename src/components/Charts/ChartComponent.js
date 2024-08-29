import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Transform the data to a more usable format
const transformData = (data) => {
  return data.map(item => ({
    accountID: item["Account ID"],
    eodBalances: [
      { date: "EODBalance-14Aug", balance: parseFloat(item["EODBalance-14Aug"]) || 0 },
      { date: "EODBalance-15Aug", balance: parseFloat(item["EODBalance-15Aug"]) || 0 },
      { date: "EODBalance-16Aug", balance: parseFloat(item["EODBalance-16Aug"]) || 0 },
      { date: "EODBalance-17Aug", balance: parseFloat(item["EODBalance-17Aug"]) || 0 },
      { date: "EODBalance-18Aug", balance: parseFloat(item["EODBalance-18Aug"]) || 0 },
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

// Generate a color palette
const generateColorPalette = (numColors) => {
  const colors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#413ea0",
    "#d0ed57", "#ff6f6f", "#7b68ee", "#32cd32", "#dc143c"
  ];
  return colors.slice(0, numColors);
};

const ChartComponent = ({ data }) => {
  const transformedData = transformData(data);
  const transposedData = transposeData(transformedData);

  // Generate a color for each account ID
  const accountIDs = Object.keys(transposedData[0]).filter(key => key !== 'name');
  const colors = generateColorPalette(accountIDs.length);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={transposedData}>
        {/* Remove the CartesianGrid component to remove grid lines */}
        
        {/* XAxis now uses the balance dates */}
        <XAxis dataKey="name" />

        {/* YAxis will show the numeric values of the balances */}
        <YAxis type="number" />

        <Tooltip />
        <Legend verticalAlign="top" />

        {/* Create a line for each account ID with a unique color */}
        {accountIDs.map((accountID, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={accountID}
            stroke={colors[index]}
            dot={false}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;
