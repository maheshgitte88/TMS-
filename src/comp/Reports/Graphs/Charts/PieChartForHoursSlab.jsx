import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function PieChartForHoursSlab({ tData, length }) {
  const [options, setOptions] = useState({
    chart: {
      type: "pie",
      marginTop: -5,
      padding:1,
      // width: 400, 
      // height: 200, 
    },
    title: {
      text: "Time Slab",
      style: {
        fontSize: '10px',
        fontWeight: 'bold'
      }
    },
    tooltip: {
      pointFormat:
        "{series.name}: <b>{point.percentage:.1f}%</b> ({point.count})",
        style: {
          fontSize: '12px'
        }
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
        // style:"200px",
        dataLabels: {
          enabled: true,
          format:
            "<b>{point.name}</b>: {point.percentage:.1f}% ({point.count})",
        },
        style: {
          fontSize: '10px'
        }
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
          category = "in 1 hr";
        } else if (ticket.actualTAT <= 120) {
          category = "in 2 hr";
        } else if (ticket.actualTAT <= 180) {
          category = "in 3 hr";
        } else if (ticket.actualTAT <= 240) {
          category = "in 4 hr";
        } else if (ticket.actualTAT <= 300) {
          category = "in 5 hr";
        } else {
          category = "> 5 hr";
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
    <div className="mb-2" style={{ display: 'flex', justifyContent: 'center', height: `${length}` }}>
      <HighchartsReact  highcharts={Highcharts} options={options} />
    </div>
  );
}

export default PieChartForHoursSlab;
