// PieChart.js
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const UserNpsTable = ({ tData }) => {
  const [userData, setUserData] = useState([]);
  const [options, setOptions] = useState({
    chart: {
      type: "pie",
      style: {
        fontSize: '11px',
      }
    },
    title: {
      text: "User Feedback",
      style: {
        fontSize: '12px',
      }
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
            "<b>{point.name}</b>: {point.percentage:.1f}% ({point.count} tickets, NPS: {point.averageFeedback})",
        },
      },
    },
    series: [
      {
        name: "Users",
        colorByPoint: true,
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (tData.length > 0) {
      const userFeedback = tData.reduce((acc, ticket) => {
        if (ticket.ResolutionFeedback && ticket.claim_UserName) {
          if (!acc[ticket.claim_UserName]) {
            acc[ticket.claim_UserName] = {
              count: 0,
              totalTickets: 0,
              totalFeedback: 0,
            };
          }
          acc[ticket.claim_UserName].count += 1;
          acc[ticket.claim_UserName].totalTickets += 1;
          acc[ticket.claim_UserName].totalFeedback += Number(
            ticket.ResolutionFeedback
          );
        }
        return acc;
      }, {});

      const data = Object.keys(userFeedback).map((user) => ({
        name: user,
        y: (userFeedback[user].count / tData.length) * 100,
        count: userFeedback[user].count,
        averageFeedback:
          (
            userFeedback[user].totalFeedback / userFeedback[user].totalTickets
          ).toFixed(2) * 10,
      }));
      setUserData(data);
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

  console.log(options);

  return (
    <div>
    <div className="flex mt-1 gap-1">
      <div className="w-1/2">
        <p className="text font-bold mb-2">Ticket Analysis</p>
        <div className="overflow-y-auto" style={{ display: 'flex', justifyContent: 'center', height: '250px' }}>
          <HighchartsReact  highcharts={Highcharts} options={options} />
        </div>
      </div>
      <div className="w-1/2">
        <p className="text font-bold mb-2">Ticket Details</p>
        <div className="h-64 overflow-y-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="border-r border-gray-200 px-4 py-2">Name</th>
                <th className="border-r border-gray-200 px-4 py-2">NPS Count</th>
                <th className="border-r border-gray-200 px-4 py-2">Avg of NPS</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((ticket) => (
                <tr key={ticket.name} className="border-b border-gray-200">
                  <td className="border-r border-gray-200 px-4 py-2">{ticket.name}</td>
                  <td className="border-r border-gray-200 px-4 py-2">{ticket.count}</td>
                  <td className="border-r border-gray-200 px-4 py-2">{ticket.averageFeedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  

  );
};

export default UserNpsTable;
