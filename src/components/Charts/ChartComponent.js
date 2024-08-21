import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Charts',
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 2,
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const ChartComponent = () => {
  return (
    <>
      <h2>Charts</h2>
      <div style={{ width: '700px' ,height:'400px'}}> 
        <Bar data={data} options={options} 
        width={700} height={400}
         />
      </div>
    </>
  );
};

export default ChartComponent;
