import React, { useEffect, useState } from "react";
import SemiCircleChart from "./SemiCircleChart";

const UserNpsDiffTable = ({ tickets }) => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [totals, setTotals] = useState({
    low: 0,
    medium: 0,
    high: 0,
    total: 0,
    difference: 0,
    division: 0,
  });

  useEffect(() => {
    if (tickets.length > 0) {
      const feedbackCounts = {};
      let totalLow = 0;
      let totalMedium = 0;
      let totalHigh = 0;

      tickets.forEach((ticket) => {
        const { claim_UserName, ResolutionFeedback } = ticket;
        if (ResolutionFeedback != null) {
          const feedback = Number(ResolutionFeedback);

          // Ensure claim_UserName exists in feedbackCounts
          if (!feedbackCounts[claim_UserName]) {
            feedbackCounts[claim_UserName] = {
              low: 0,
              medium: 0,
              high: 0,
              total: 0,
              difference: 0,
              division: 0,
            };
          }

          // Categorize feedback
          if (feedback >= 0 && feedback <= 6) {
            feedbackCounts[claim_UserName].low++;
            totalLow++;
            feedbackCounts[claim_UserName].total++;
          } else if (feedback >= 7 && feedback <= 8) {
            feedbackCounts[claim_UserName].medium++;
            totalMedium++;
            feedbackCounts[claim_UserName].total++;
          } else if (feedback >= 9 && feedback <= 10) {
            feedbackCounts[claim_UserName].high++;
            totalHigh++;
            feedbackCounts[claim_UserName].total++;
          }
        }
      });

      // Calculate difference and division for each user
      Object.keys(feedbackCounts).forEach((userName) => {
        const user = feedbackCounts[userName];
        user.difference = user.high - user.low;
        user.division = user.difference / user.total;
      });

      // Calculate totals
      const totalCount = totalLow + totalMedium + totalHigh;
      const totalDifference = totalHigh - totalLow;
      const totalDivision = totalDifference / totalCount;

      setTotals({
        low: totalLow,
        medium: totalMedium,
        high: totalHigh,
        total: totalCount,
        difference: totalDifference,
        division: totalDivision.toFixed(2),
      });

      // Convert feedbackCounts object to array for easier rendering
      const feedbackDataArray = Object.keys(feedbackCounts).map((userName) => ({
        claim_UserName: userName,
        ...feedbackCounts[userName],
      }));

      setFeedbackData(feedbackDataArray);
    }
  }, [tickets]);

  return (
    <div>
      <div className="flex justify-between gap-2">
        <div className="w-3/4">
          {/* <p className="text font-semibold mb-2 text-xs">
            User Feedback Counts
          </p> */}
          <table className="table-auto w-full border-collapse border border-gray-200 text-xs bg-slate-50">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 bg-red-200">
                <th className="border border-gray-300">users</th>
                {[
                  "0 to 6",
                  "7 to 8",
                  "9 to 10",
                  "Total",
                  "Difference",
                  "Division",
                ].map((header, index) => (
                  <th key={index} className="border border-gray-300 bg-red-200">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {feedbackData.map((user, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-center "
                >
                  <td className="border border-gray-300">
                    {user.claim_UserName}
                  </td>
                  <td className="border border-gray-300">{user.low}</td>
                  <td className="border border-gray-300">{user.medium}</td>
                  <td className="border border-gray-300">{user.high}</td>
                  <td className="border border-gray-300">{user.total}</td>
                  <td className="border border-gray-300">{user.difference}</td>
                  <td className="border border-gray-300">
                    {(user.division * 100).toFixed(2)} %
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 border-t border-gray-200 text-center bg-red-200">
                <td className="font-semibold border border-gray-300">Total</td>
                <td className="font-semibold border border-gray-300 bg-red-200">
                  {totals.low}
                </td>
                <td className="font-semibold border border-gray-300 bg-red-200">
                  {totals.medium}
                </td>
                <td className="font-semibold border border-gray-300 bg-red-200">
                  {totals.high}
                </td>
                <td className="font-semibold border border-gray-300 bg-red-200">
                  {totals.total}
                </td>
                <td className="font-semibold border border-gray-300 bg-red-200">
                  {totals.difference}
                </td>
                <td className="font-semibold border border-gray-300 bg-red-200">
                  {(totals.division * 100).toFixed(2)} %
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="w-1/4" style={{ height: "200px" }}>
          <SemiCircleChart percentage={totals.division * 100} />
        </div>
      </div>
    </div>
  );
};

export default UserNpsDiffTable;
