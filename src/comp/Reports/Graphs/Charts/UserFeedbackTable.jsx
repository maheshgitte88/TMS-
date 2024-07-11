import React, { useEffect, useState } from "react";

const UserFeedbackTable = ({ tickets }) => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [totals, setTotals] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    Total: 0,
  });

  useEffect(() => {
    if (tickets.length > 0) {
      const feedbackCounts = {};
      const totalsCount = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        Total: 0,
      };

      tickets.forEach((ticket) => {
        const { claim_UserName, ResolutionFeedback } = ticket;
        if (ResolutionFeedback != null) {
        // Ensure claim_UserName exists in feedbackCounts
        if (!feedbackCounts[claim_UserName]) {
          feedbackCounts[claim_UserName] = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            Total: 0,
          };
        }

        // Increment count for specific ResolutionFeedback
        feedbackCounts[claim_UserName][ResolutionFeedback]++;
        feedbackCounts[claim_UserName].Total++;

        // Update totals count
        totalsCount[ResolutionFeedback]++;
        totalsCount.Total++;
      }
      });

      // Convert feedbackCounts object to array for easier rendering
      const feedbackDataArray = Object.keys(feedbackCounts).map((userName) => ({
        claim_UserName: userName,
        ...feedbackCounts[userName],
      }));

      setFeedbackData(feedbackDataArray);
      setTotals(totalsCount);
    }
  }, [tickets]);

  return (
    <div>
      {/* <p className="text font-semibold mb-2 text-xs">User Feedback Counts</p> */}
      <table className="table-auto w-full border-collapse border border-gray-200 text-xs">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200 bg-red-200">
            <th className="border border-gray-300 ">users</th>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Total"].map(
              (feedback, index) => (
                <th key={index} className="border border-gray-300">{feedback}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {feedbackData.map((user, index) => (
            <tr key={index} className="border-b border-gray-200 bg-slate-50 text-center">
              <td className="border border-gray-300">{user.claim_UserName}</td>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Total"].map(
                (feedback, idx) => (
                  <td key={idx} className="border border-gray-300">{user[feedback]}</td>
                )
              )}
            </tr>
          ))}
          <tr className="bg-gray-100 border-t border-gray-200 text-center bg-red-200">
            <td className="font-semibold border border-gray-300">Total</td>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Total"].map(
              (feedback, index) => (
                <td key={index} className="font-semibold border border-gray-300">{totals[feedback]}</td>
              )
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserFeedbackTable;
