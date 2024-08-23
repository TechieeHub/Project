// // MultiLineChart.js
// import React from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// // Transform your data to include all the required fields
// const transformData = (data) => {
//   return data.map(item => ({
//     "Account ID": item["Account ID"],
//     "EODBalance-14Aug": parseFloat(item["EODBalance-14Aug"].replace(/[^\d.-]/g, '')),
//     "EODBalance-15Aug": parseFloat(item["EODBalance-15Aug"].replace(/[^\d.-]/g, '')),
//     "EODBalance-16Aug": parseFloat(item["EODBalance-16Aug"].replace(/[^\d.-]/g, '')),
//     "EODBalance-17Aug": parseFloat(item["EODBalance-17Aug"].replace(/[^\d.-]/g, '')),
//     "EODBalance-18Aug": parseFloat(item["EODBalance-18Aug"].replace(/[^\d.-]/g, '')),
//     "Projected Balance": item["Projected Balance"],
//     "5-Day average": item["5-Day average"]
//   }));
// };

// const ChartComponent = ({ data }) => {

 
//   const transformedData = transformData(data);

//   // Create lines for each balance field
//   const lines = [
//     { key: "EODBalance-14Aug", color: "#8884d8" },
//     { key: "EODBalance-15Aug", color: "#82ca9d" },
//     { key: "EODBalance-16Aug", color: "#ffc658" },
//     { key: "EODBalance-17Aug", color: "#ff7300" },
//     { key: "EODBalance-18Aug", color: "#413ea0" },
//     { key: "Projected Balance", color: "#d0ed57" },
//     { key: "5-Day average", color: "#ff6f6f" }
//   ].map(line => (
//     <Line
//       key={line.key}
//       type="monotone"
//       dataKey={line.key}
//       stroke={line.color}
//       dot={false}
//     />
//   ));

//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <LineChart data={transformedData}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="Account ID" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         {lines}
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };

// export default ChartComponent;

// MultiLineChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Transform your data to include all the required fields
// const transformData = (data) => {
//   return data.map(item => ({
//     "Account ID": item["Account ID"],
//     "EODBalance-14Aug": parseFloat(item["EODBalance-14Aug"]?.replace(/[^\d.-]/g, '')),
//     "EODBalance-15Aug": parseFloat(item["EODBalance-15Aug"]?.replace(/[^\d.-]/g, '')),
//     "EODBalance-16Aug": parseFloat(item["EODBalance-16Aug"]?.replace(/[^\d.-]/g, '')),
//     "EODBalance-17Aug": parseFloat(item["EODBalance-17Aug"]?.replace(/[^\d.-]/g, '')),
//     "EODBalance-18Aug": parseFloat(item["EODBalance-18Aug"]?.replace(/[^\d.-]/g, '')),
//     "Projected Balance": item["Projected Balance"],
//     "5-Day average": item["5-Day average"]
//   }));
// };

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
      <LineChart data={transformedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Account ID" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Legend verticalAlign="top" />

        {/* Lines for EOD Balances */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="EODBalance-14Aug"
          stroke="#8884d8"
          dot={false}
          strokeWidth={2}
          strokeDasharray="5 5"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="EODBalance-15Aug"
          stroke="#82ca9d"
          dot={false}
          strokeWidth={2}
          strokeDasharray="5 5"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="EODBalance-16Aug"
          stroke="#ffc658"
          dot={false}
          strokeWidth={2}
          strokeDasharray="3 3"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="EODBalance-17Aug"
          stroke="#ff7300"
          dot={false}
          strokeWidth={2}
          strokeDasharray="3 3"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="EODBalance-18Aug"
          stroke="#413ea0"
          dot={false}
          strokeWidth={2}
          strokeDasharray="1 1"
        />

        {/* Lines for Projected Balance and 5-Day Average */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="Projected Balance"
          stroke="#d0ed57"
          dot={false}
          strokeWidth={2}
          strokeDasharray="1 1"
        />
        <Line
          yAxisId="right"
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

