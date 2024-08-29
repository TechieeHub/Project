import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
 
// Helper function to clean and parse balance strings
const parseBalance = (balanceString) => {
  if (!balanceString) return 0;
  return parseFloat(balanceString.replace(/[^0-9.-]+/g, ""));
};
 
// Transform the data to a more usable format
const transformData = (data) => {
  return data.map(item => ({
    accountID: item["Account ID"],
    eodBalances: [
      { date: "EODBalance-13Aug", balance: parseBalance(item["EODBalance-13Aug"]) },
      { date: "EODBalance-14Aug", balance: parseBalance(item["EODBalance-14Aug"]) },
 
      { date: "EODBalance-15Aug", balance: parseBalance(item["EODBalance-15Aug"]) },
      { date: "EODBalance-16Aug", balance: parseBalance(item["EODBalance-16Aug"]) },
      { date: "EODBalance-17Aug", balance: parseBalance(item["EODBalance-17Aug"]) },
      { date: "EODBalance-18Aug", balance: parseBalance(item["EODBalance-18Aug"]) },
      { date: "Projected", balance: item["Projected Balance"] || 0 },
      { date: "5DayAvg", balance: item["5-Day average"] || 0 }
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
 
  if (!transposedData.length) {
    return <div>No data available for charting.</div>;
  }
 
  // Generate a color for each account ID
  const accountIDs = Object.keys(transposedData[0]).filter(key => key !== 'name');
  const colors = generateColorPalette(accountIDs.length);
 
  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={transposedData}>
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