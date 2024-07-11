// PieChart.js
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PieChart = ({tData}) => {
  const [options, setOptions] = useState({
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Ticket Categories and Subcategories',
      style: {
        fontSize: '12px',
        fontWeight: 'bold'
      }
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.count} tickets)',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}% ({point.count} tickets)',
        },
      },
    },
    series: [
      {
        name: 'Categories and Subcategories',
        colorByPoint: true,
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (tData.length > 0) {
      const totalTickets = tData.length;

      const categoryCounts = tData.reduce((acc, ticket) => {
        const key = `${ticket.Querycategory} - ${ticket.QuerySubcategory}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const data = Object.keys(categoryCounts).map(category => ({
        name: category,
        y: (categoryCounts[category] / totalTickets) * 100,
        count: categoryCounts[category],
      }));

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

export default PieChart;
