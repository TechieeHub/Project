import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registering the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Helper function to clean and parse balance strings
const parseBalance = (balanceString) => {
  if (!balanceString) return 0;
  return parseFloat(balanceString.replace(/[^0-9.-]+/g, ""));
};

// Transforming the data to a more usable format
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

// Generating a color palette
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

  // Generating a color for each account ID
  const accountIDs = Object.keys(transposedData[0]).filter(key => key !== 'name');
  const colors = generateColorPalette(accountIDs.length);

  // Preparing data for Chart.js
  const chartData = {
    labels: transposedData.map(item => item.name),
    datasets: accountIDs.map((accountID, index) => ({
      label: accountID,
      data: transposedData.map(item => item[accountID]),
      backgroundColor: colors[index],
    }))
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Account Balances',
      },
    },
    maintainAspectRatio: false, // This allows the chart to fill the container
  };

  return (
    <div style={{ width: '100%', height: '700px' }}> {/* Increase the height here */}
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
