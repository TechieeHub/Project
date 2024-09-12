import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement, Colors } from 'chart.js';

// Registering the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement, Colors);

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
      { date: "EODBalance-8Sept", balance: parseBalance(item["EODBalance-8Sept"]) },
      { date: "EODBalance-9Sept", balance: parseBalance(item["EODBalance-9Sept"]) },
      { date: "EODBalance-10Sept", balance: parseBalance(item["EODBalance-10Sept"]) },
      { date: "EODBalance-11Sept", balance: parseBalance(item["EODBalance-11Sept"]) },
      { date: "EODBalance-12Sept", balance: parseBalance(item["EODBalance-12Sept"]) },
    ],
    projected: item["Projected Balance"] || 0,
    avg5Day: item["5-Day average"] || 0
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

// Generate a color palette using the default Chart.js colors
const generateColorPalette = (numColors) => {
  const baseColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#FF69B4', '#B0E0E6', '#8A2BE2'
  ];
  return baseColors.slice(0, numColors);
};
const ChartComponent = ({ data, title }) => {
  const transformedData = transformData(data);
  const transposedData = transposeData(transformedData);

  const [selectedDataset, setSelectedDataset] = useState(null);

  if (!transposedData.length) {
    return <div>No data available for charting.</div>;
  }

  const accountIDs = Object.keys(transposedData[0]).filter(key => key !== 'name');
  const colors = generateColorPalette(accountIDs.length);

  const chartData = {
    labels: transposedData.map(item => item.name),
    datasets: [
      ...accountIDs.map((accountID, index) => ({
        label: accountID,
        data: transposedData.map(item => item[accountID]),
        backgroundColor: colors[index],
        type: 'bar',
        order: 3,
        hidden: selectedDataset !== null && selectedDataset !== accountID,
      })),
      {
        label: 'Projected',
        data: transformedData.map(item => item.projected),
        borderColor: '#FF0000',
        backgroundColor: '#FF0000',
        fill: false,
        type: 'line',
        yAxisID: 'y',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        order: 1,
        z: 10,
      },
      {
        label: '5-Day Average',
        data: transformedData.map(item => item.avg5Day),
        borderColor: '#0000FF',
        backgroundColor: '#0000FF',
        fill: false,
        type: 'line',
        yAxisID: 'y',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        order: 2,
        z: 10,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title, // Dynamic title based on props
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (tooltipItem) => {
            let label = tooltipItem.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += tooltipItem.raw.toLocaleString();
            return label;
          }
        }
      }
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Balance'
        },
      }
    },
    onClick: (e, activeElements) => {
      if (activeElements.length > 0) {
        const datasetIndex = activeElements[0].datasetIndex;
        const clickedDatasetLabel = chartData.datasets[datasetIndex].label;

        if (selectedDataset === clickedDatasetLabel) {
          setSelectedDataset(null);
        } else {
          setSelectedDataset(clickedDatasetLabel);
        }
      }
    }
  };

  return (
    <div style={{ width: '90%', height: '700px', paddingBottom: "2rem" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
