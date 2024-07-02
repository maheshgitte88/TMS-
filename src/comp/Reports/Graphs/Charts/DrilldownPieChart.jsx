import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from "highcharts/modules/drilldown";

// Initialize the drilldown module
drilldown(Highcharts);

const DrilldownPieChart = () => {
  const [options, setOptions] = useState({
    chart: {
      type: "pie",
    },
    title: {
      text: "Highcharts Pie Chart with Drilldown",
    },
    accessibility: {
      announceNewData: {
        enabled: true,
      },
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.y:.1f}%",
        },
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
    },
    series: [
      {
        name: "Departments",
        colorByPoint: true,
        data: [
          {
            name: "IT",
            y: 30,
            drilldown: "IT",
          },
          {
            name: "Support",
            y: 20,
            drilldown: "Support",
          },
          {
            name: "HR",
            y: 10,
            drilldown: "HR",
          },
          {
            name: "Sales",
            y: 15,
            drilldown: "Sales",
          },
          {
            name: "Student",
            y: 25,
            drilldown: "Student",
          },
        ],
      },
    ],
    drilldown: {
      series: [
        {
          name: "IT",
          id: "IT",
          data: [
            ["Hardware Support", 10],
            ["App Support", 20],
            ["LMS", 30],
            ["MIS", 40],
          ],
        },
        {
          name: "Support",
          id: "Support",
          data: [["RM", 100]],
        },
        {
          name: "HR",
          id: "HR",
          data: [["HRMITSDE", 100]],
        },
        {
          name: "Sales",
          id: "Sales",
          data: [
            ["Counselor", 25],
            ["Team Leader", 25],
            ["Team Manager", 25],
            ["Manager", 25],
          ],
        },
        {
          name: "Student",
          id: "Student",
          data: [["Student SDE", 100]],
        },
      ],
    },
  });

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default DrilldownPieChart;
