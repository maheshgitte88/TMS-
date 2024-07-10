import React from "react";
import DrilldownPieChart from "./Charts/DrilldownPieChart";
import PieChart from "./Charts/PieChart";
import PieChartForHoursSlab from "./Charts/PieChartForHoursSlab";
import UserNpsTable from "./Charts/UserNpsTable";
import BarChartTicketStatus from "./Charts/BarChartTicketStatus";
import UserFeedbackTable from "./Charts/UserFeedbackTable";
import DepthDepBarChart from "./Charts/DepthDepBarChart";
import BarChartCateSub from "./Charts/BarChartCateSub";

export default function ItTms({
  tData,
  averageActualTAT,
  averageActualTATOrg,
}) {
  return (
    <>
      <div className="flex justify-between gap-1">
        <div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols- lg:grid-cols-3 mb-2 gap-3">

            <div className="bg-red-200 p-5 justify-around rounded shadow cursor-pointer gap-1">
              <strong>Total Ticket count</strong>
              <h6 className="font-bold text-4xl">{tData.length}</h6>
            </div>

            <div className="bg-green-200 p-5 flex justify-around rounded shadow cursor-pointer gap-1">
              <div>
                <strong>Avg Actual TAT (min)</strong>
                <h5 className="font-semibold text-3xl">
                  {averageActualTAT.toFixed(3)}
                </h5>
              </div>
            </div>

            <div className="bg-blue-200 p-5 justify-around rounded shadow cursor-pointer gap-1">
              <div>
                <strong>Avg of TAT (min)</strong>
                <h5 className="font-semibold text-3xl">
                  {averageActualTATOrg.toFixed(3)}
                </h5>
              </div>
            </div>

          </div>
          <PieChart tData={tData} />
        </div>

        <div className="w-1/3">
          <PieChartForHoursSlab tData={tData} />
          <BarChartTicketStatus tData={tData} />
        </div>
      </div>

      <DrilldownPieChart />
      <PieChart tData={tData} />
      {/* <PieChartForHoursSlab tData={tData} /> */}

      <UserNpsTable tData={tData} />
      {/* <BarChartTicketStatus tData={tData} /> */}
      <UserFeedbackTable tickets={tData} />
      <DepthDepBarChart tickets={tData} />
      <BarChartCateSub tickets={tData} />
    </>
  );
}
