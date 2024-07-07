import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function PieChartForHoursSlab({ tData }) {
  const [options, setOptions] = useState({
    chart: {
      type: "pie",
    },
    title: {
      text: "Ticket Resolution Time Distribution",
    },
    tooltip: {
      pointFormat:
        "{series.name}: <b>{point.percentage:.1f}%</b> ({point.count} tickets)",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format:
            "<b>{point.name}</b>: {point.percentage:.1f}% ({point.count} tickets)",
        },
      },
    },
    series: [
      {
        name: "Resolution Time",
        colorByPoint: true,
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (tData.length > 0) {
      const totalTickets = tData.length;

      const resolutionCounts = tData.reduce((acc, ticket) => {
        let category;
        if (ticket.actualTAT <= 60) {
          category = "Solved in 1 hour";
        } else if (ticket.actualTAT <= 120) {
          category = "Solved in 2 hours";
        } else if (ticket.actualTAT <= 180) {
          category = "Solved in 3 hours";
        } else if (ticket.actualTAT <= 240) {
          category = "Solved in 4 hours";
        } else if (ticket.actualTAT <= 300) {
          category = "Solved in 5 hours";
        } else {
          category = "Solved in more than 5 hours";
        }
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const data = Object.keys(resolutionCounts).map((category) => ({
        name: category,
        y: (resolutionCounts[category] / totalTickets) * 100,
        count: resolutionCounts[category],
      }));

      setOptions((prevOptions) => ({
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
}

export default PieChartForHoursSlab;
