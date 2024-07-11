// BarChart.js
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from "highcharts/modules/drilldown";

// Initialize the drilldown module
drilldown(Highcharts);

const BarChartCateSub = ({ tickets }) => {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (tickets.length > 0) {
      // Process the data
      const categoryCounts = {};
      const subCategoryCounts = {};

      tickets.forEach((ticket) => {
        const { Querycategory, QuerySubcategory } = ticket;

        if (!categoryCounts[Querycategory]) {
          categoryCounts[Querycategory] = 0;
          subCategoryCounts[Querycategory] = {};
        }

        categoryCounts[Querycategory]++;

        if (!subCategoryCounts[Querycategory][QuerySubcategory]) {
          subCategoryCounts[Querycategory][QuerySubcategory] = 0;
        }

        subCategoryCounts[Querycategory][QuerySubcategory]++;
      });

      // Prepare data for the chart
      const categories = Object.keys(categoryCounts);
      const seriesData = categories.map((category) => ({
        name: category,
        y: categoryCounts[category],
        drilldown: category,
      }));

      const drilldownSeries = categories.map((category) => ({
        name: category,
        id: category,
        data: Object.entries(subCategoryCounts[category]).map(
          ([subCat, count]) => [subCat, count]
        ),
      }));

      setChartOptions({
        chart: {
          type: "bar",
          style: {
            fontSize: '12px',
            fontWeight: 'bold'
          }
        },
        title: {
          text: "Ticket Counts by Query Category and Sub-Category",

        },
        xAxis: {
          type: "category",
          title: {
            text: "Query Categories",
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: "Ticket Count",
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
              format: "{point.y}",
            },
          },
        },
        tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat:
            '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>',
        },
        series: [
          {
            name: "Query Categories",
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

export default BarChartCateSub;
