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
      { date: "EODBalance-14Aug", balance: parseBalance(item["EODBalance-14Aug"]) },
      { date: "EODBalance-15Aug", balance: parseBalance(item["EODBalance-15Aug"]) },
      { date: "EODBalance-16Aug", balance: parseBalance(item["EODBalance-16Aug"]) },
      { date: "EODBalance-17Aug", balance: parseBalance(item["EODBalance-17Aug"]) },
      { date: "EODBalance-18Aug", balance: parseBalance(item["EODBalance-18Aug"]) },
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

const ChartComponent = ({ data }) => {
  const transformedData = transformData(data);
  const transposedData = transposeData(transformedData);

  const [selectedDataset, setSelectedDataset] = useState(null);

  if (!transposedData.length) {
    return <div>No data available for charting.</div>;
  }

  // Generating a color for each account ID
  const accountIDs = Object.keys(transposedData[0]).filter(key => key !== 'name');
  const colors = generateColorPalette(accountIDs.length);

  // Preparing data for Chart.js
  const chartData = {
    labels: transposedData.map(item => item.name),
    datasets: [
      ...accountIDs.map((accountID, index) => ({
        label: accountID,
        data: transposedData.map(item => item[accountID]),
        backgroundColor: colors[index], // Use generated color palette
        type: 'bar',
        order: 3,  // Bars are rendered first
        hidden: selectedDataset !== null && selectedDataset !== accountID, // Hide other datasets when one is selected
      })),
      {
        label: 'Projected',
        data: transformedData.map(item => item.projected),
        borderColor: '#FF0000', // Explicit color for the line
        backgroundColor: 'rgba(255, 0, 0, 0.1)',  // Subtle fill for better visualization
        fill: true,
        type: 'line',
        yAxisID: 'y-axis-2',
        tension: 0.4,  // Adding some curvature to the line
        pointRadius: 5,  // Increase point size for better visibility
        pointHoverRadius: 7,  // Increase point hover size
        order: 1,  // Lines are rendered above bars
        z: 10,  // Ensure this dataset is on top
      },
      {
        label: '5-Day Average',
        data: transformedData.map(item => item.avg5Day),
        borderColor: '#0000FF', // Explicit color for the line
        backgroundColor: 'rgba(0, 0, 255, 0.1)',  // Subtle fill for better visualization
        fill: true,
        type: 'line',
        yAxisID: 'y-axis-2',
        tension: 0.4,  // Adding some curvature to the line
        pointRadius: 5,  // Increase point size for better visibility
        pointHoverRadius: 7,  // Increase point hover size
        order: 2,  // Lines are rendered above bars
        z: 10,  // Ensure this dataset is on top
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
        text: 'Account Balances',
      },
      tooltip: {
        mode: 'index',
        intersect: false, // Ensure that hovering works for both bars and lines
        callbacks: {
          label: (tooltipItem) => {
            let label = tooltipItem.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += tooltipItem.raw.toLocaleString();  // Format the number with commas
            return label;
          }
        }
      }
    },
    maintainAspectRatio: false, // This allows the chart to fill the container
    scales: {
      y: {
        beginAtZero: true,
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Balance'
        },
      },
      'y-axis-2': {
        beginAtZero: true,
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Trend'
        },
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
    onClick: (e, activeElements) => {
      if (activeElements.length > 0) {
        const datasetIndex = activeElements[0].datasetIndex;
        const clickedDatasetLabel = chartData.datasets[datasetIndex].label;
  
        if (selectedDataset === clickedDatasetLabel) {
          setSelectedDataset(null); // Unselect if the same dataset is clicked again
        } else {
          setSelectedDataset(clickedDatasetLabel); // Select the clicked dataset
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
