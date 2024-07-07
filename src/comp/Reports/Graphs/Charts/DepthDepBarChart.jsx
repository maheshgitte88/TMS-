// BarChart.js
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from 'highcharts/modules/drilldown';

// Initialize the drilldown module
drilldown(Highcharts);

const DepthDepBarChart = ({ tickets }) => {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (tickets.length > 0) {

        const departmentCounts = {};
        const subDepartmentCounts = {};

        tickets.forEach(ticket => {
          const { AssignedToDepartmentName, AssignedToSubDepartmentName } = ticket;

          if (!departmentCounts[AssignedToDepartmentName]) {
            departmentCounts[AssignedToDepartmentName] = 0;
            subDepartmentCounts[AssignedToDepartmentName] = {};
          }

          departmentCounts[AssignedToDepartmentName]++;

          if (!subDepartmentCounts[AssignedToDepartmentName][AssignedToSubDepartmentName]) {
            subDepartmentCounts[AssignedToDepartmentName][AssignedToSubDepartmentName] = 0;
          }

          subDepartmentCounts[AssignedToDepartmentName][AssignedToSubDepartmentName]++;
        });

        // Prepare data for the chart
        const categories = Object.keys(departmentCounts);
        const seriesData = categories.map(department => ({
          name: department,
          y: departmentCounts[department],
          drilldown: department,
        }));

        const drilldownSeries = categories.map(department => ({
          name: department,
          id: department,
          data: Object.entries(subDepartmentCounts[department]).map(([subDept, count]) => [
            subDept,
            count,
          ]),
        }));

        setChartOptions({
          chart: {
            type: 'column',
          },
          title: {
            text: 'Ticket Counts by Department and Sub-Department',
          },
          xAxis: {
            type: 'category',
            title: {
              text: 'Departments',
            },
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Ticket Count',
            },
          },
          legend: {
            enabled: false,
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                format: '{point.y}',
              },
            },
          },
          tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>',
          },
          series: [
            {
              name: 'Departments',
              colorByPoint: true,
              data: seriesData,
            },
          ],
          drilldown: {
            series: drilldownSeries,
          },
        });
        
     }
  }, [tickets]);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default DepthDepBarChart;
