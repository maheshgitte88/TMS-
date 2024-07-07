// UserFeedbackTable.js
import React, { useEffect, useState } from "react";

const UserFeedbackTable = ({ tickets }) => {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    if (tickets.length > 0) {
      const feedbackCounts = {};
      tickets.forEach((ticket) => {
        const { claim_UserName, ResolutionFeedback } = ticket;

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
      <h2>User Feedback Counts</h2>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th>claim_UserName</th>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Total"].map(
              (feedback, index) => (
                <th key={index}>{feedback}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {feedbackData.map((user, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td>{user.claim_UserName}</td>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Total"].map(
                (feedback, idx) => (
                  <td key={idx}>{user[feedback]}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserFeedbackTable;
