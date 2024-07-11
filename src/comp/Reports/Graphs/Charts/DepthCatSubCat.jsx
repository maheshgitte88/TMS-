import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// import Highcharts3D from "highcharts/highcharts-3d";

// Initialize the Highcharts 3D module
// Highcharts3D(Highcharts);

const DepthCatSubCat = ({ tickets }) => {
  const [categoryOptions, setCategoryOptions] = useState({});
  const [subCategoryOptions, setSubCategoryOptions] = useState({});

  useEffect(() => {
    if (tickets.length > 0) {
      // Process the data
      const categoryCounts = {};
      const subCategoryCounts = {};

      tickets.forEach((ticket) => {
        const { Querycategory, QuerySubcategory } = ticket;
        if (Querycategory != null && QuerySubcategory != null) {
          if (!categoryCounts[Querycategory]) {
            categoryCounts[Querycategory] = 0;
          }
          categoryCounts[Querycategory]++;

          if (!subCategoryCounts[QuerySubcategory]) {
            subCategoryCounts[QuerySubcategory] = 0;
          }
          subCategoryCounts[QuerySubcategory]++;
        }
      });

      // Prepare data for the category chart
      const categoryData = Object.keys(categoryCounts)
        .map((category) => ({
          name: category,
          y: categoryCounts[category],
        }))
        .sort((a, b) => b.y - a.y); // Sort data from highest to lowest

      setCategoryOptions({
        chart: {
          type: "bar",
          style: {
            fontSize: "12px",
            fontWeight: "bold",
          },
          //   options3d: {
          //     enabled: true,
          //     alpha: 15,
          //     beta: 15,
          //     depth: 50,
          //   },
        },
        title: {
          text: "Ticket Counts by Query Category",
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
            depth: 25,
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
            data: categoryData,
          },
        ],
      });

      // Prepare data for the subcategory chart
      const subCategoryData = Object.keys(subCategoryCounts)
        .map((subCategory) => ({
          name: subCategory,
          y: subCategoryCounts[subCategory],
        }))
        .sort((a, b) => b.y - a.y); // Sort data from highest to lowest

      setSubCategoryOptions({
        chart: {
          type: "bar",
          style: {
            fontSize: "12px",
            fontWeight: "bold",
          },
          //   options3d: {
          //     enabled: true,
          //     alpha: 15,
          //     beta: 15,
          //     depth: 50,
          //   },
        },
        title: {
          text: "Ticket Counts by Query Subcategory",
        },
        xAxis: {
          type: "category",
          title: {
            text: "Query Subcategories",
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
            depth: 25,
          },
        },
        tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat:
            '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>',
        },
        series: [
          {
            name: "Query Subcategories",
            colorByPoint: true,
            data: subCategoryData,
          },
        ],
      });
    }
  }, [tickets]);

  return (
    <div className="flex justify-between gap-2">
      <div className="w-1/2">
        <HighchartsReact highcharts={Highcharts} options={categoryOptions} />
      </div>
      <div className="w-1/2">
        <HighchartsReact highcharts={Highcharts} options={subCategoryOptions} />
      </div>
    </div>
  );
};

export default DepthCatSubCat;
