import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";

highchartsMore(Highcharts);

const SemiCircleChart = ({ percentage }) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    const chartOptions = {
      chart: {
        type: "pie",
        marginTop: -400,
        padding: 1,
        // height: "70%",
      },
      title: {
        text: "NPS",
        style: {
          fontSize: "12px",
        },
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          center: ["50%", "75%"],
          size: "110%",
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: [
        {
          type: "pie",
          innerSize: "50%",
          data: [
            {
              name: `${percentage}%`,
              y: percentage,
              color: "#00aaff",
            },
            {
              name: 100 - percentage,
              y: 100 - percentage,
              color: "#eeeeee",
            },
          ],
        },
      ],
      tooltip: {
        enabled: false,
      },
    };

    setOptions(chartOptions);
  }, [percentage]);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default SemiCircleChart;
