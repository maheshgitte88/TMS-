// BarChart.js
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const BarChartTicketStatus = ({ tData }) => {
    const [options, setOptions] = useState({
        chart: {
          type: 'column', // Use 'column' for vertical bars
          width: 300, // Set a smaller width for the chart
          height: 300,
        },
        title: {
          text: 'Ticket Status',
          style: {
            fontSize: '12px',
            fontWeight: 'bold'
          }
        },
        xAxis: {
          categories: ['Resolved', 'Closed', 'Pending'], // Adjust as per your ticket statuses
          style: {
            fontSize: '8px',
          }
        },
        yAxis: {
          title: {
            text: 'Ticket Count',
          },
          style: {
            fontSize: '8px',
          }
        },
        series: [
          {
            name: 'Tickets',
            data: [],
          },
        ],
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
              format: '{y}', // Display count on top of each bar
            },
          },
        },
      });
    

  useEffect(() => {
    if (tData.length > 0) {
      const statusCounts = {
        Resolved: 0,
        Closed: 0,
        Pending: 0,
      };

      tData.forEach(ticket => {
        if (statusCounts.hasOwnProperty(ticket.Status)) {
          statusCounts[ticket.Status]++;
        }
      });

      const data = Object.keys(statusCounts).map(status => ({
        name: status,
        y: statusCounts[status],
      }));
      console.log(data)

      setOptions(prevOptions => ({
        ...prevOptions,
        series: [
          {
            ...prevOptions.series[0],
            data: data,
          },
        ],
      }));
    }
  }, [tData]);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BarChartTicketStatus;
