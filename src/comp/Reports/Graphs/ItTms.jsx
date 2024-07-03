import React from "react";
import DrilldownPieChart from "./Charts/DrilldownPieChart";
import PieChart from "./Charts/PieChart";

export default function ItTms({ tData }) {
  const getMinutesDifference = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return (endDate - startDate) / 1000 / 60; // Convert milliseconds to minutes
  };

  // Function to calculate average TAT
  const calculateAverageTAT = (tickets) => {
    const resolvedTickets = tickets.filter(
      (ticket) => ticket.Resolution_Timestamp !== null
    );

    if (resolvedTickets.length === 0) {
      return 0; // No resolved tickets
    }

    const totalTAT = resolvedTickets.reduce((total, ticket) => {
      const tat = getMinutesDifference(
        ticket.createdAt,
        ticket.Resolution_Timestamp
      );
      return total + tat;
    }, 0);

    return totalTAT / resolvedTickets.length;
  };

  const calculateActualAverageTAT = (tickets) => {
    const resolvedTickets = tickets.filter(
      (ticket) => ticket.Resolution_Timestamp !== null
    );

    if (resolvedTickets.length === 0) {
      return 0; // No resolved tickets
    }

    const totalTAT = resolvedTickets.reduce((total, ticket) => {
      const Actualtat = ticket.actualTAT;
      return total + Actualtat;
    }, 0);

    return totalTAT / resolvedTickets.length;
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          className={`bg-red-200 p-5 justify-around rounded shadow cursor-pointer`}
        >
          <strong>Total Ticket count</strong>
          <h5 className="font-semibold">{tData.length}</h5>
        </div>

        <div
          className={`bg-green-200 p-5 flex justify-around rounded shadow cursor-pointer`}
        >
          <div>
            <strong>Avg of TAT (min)</strong>
            <h5 className="font-semibold">
              {calculateAverageTAT(tData).toFixed(3)}
            </h5>
          </div>
        </div>

        <div
          className={`bg-blue-200 p-5 justify-around rounded shadow cursor-pointer`}
        >
          <div>
            <strong>Avg of Actual TAT (min)</strong>
            <h5 className="font-semibold">
              {calculateActualAverageTAT(tData).toFixed(3)}
            </h5>
          </div>
        </div>

        <div
          className={`bg-yellow-200 p-5 flex justify-around rounded shadow cursor-pointer`}
        ></div>
      </div>
      <DrilldownPieChart />
      <PieChart />
    </>
  );
}
