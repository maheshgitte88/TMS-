import React, { useState } from "react";

const TableData = ({ tData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchClaimUser, setSearchClaimUser] = useState("");
  const [searchFromUser, setSearchFromUser] = useState("");
  const [searchTicketID, setSearchTicketID] = useState("");

  // Filter data based on search terms
  const filteredData = tData.filter(
    (ticket) =>
      (searchClaimUser === "" ||
        (ticket.claim_UserName?.toLowerCase() ?? "").includes(
          searchClaimUser.toLowerCase()
        )) &&
      (searchFromUser === "" ||
        (ticket.from_UserName?.toLowerCase() ?? "").includes(
          searchFromUser.toLowerCase()
        )) &&
      (searchTicketID === "" ||
        ticket.TicketID.toString().includes(searchTicketID))
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "text-red-600"; // Red color for empty status
      case "Resolved":
        return "text-blue-600"; // Blue color for resolved status
      case "Closed":
        return "text-green-600"; // Green color for closed status
      default:
        return "text-gray-700"; // Default color for other statuses
    }
  };

  return (
    <>
      <h2 className="text font-bold">Tickets</h2>
      <div className="mb-1">
        <input
          type="text"
          placeholder="Search Ticket ID"
          value={searchTicketID}
          onChange={(e) => setSearchTicketID(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Search From User"
          value={searchFromUser}
          onChange={(e) => setSearchFromUser(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Search Claim User"
          value={searchClaimUser}
          onChange={(e) => setSearchClaimUser(e.target.value)}
          className="border p-2"
        />
      </div>
      <table className="table-auto w-full border-collapse border border-gray-200 text-xs">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200 bg-red-200 text-center">
            <th className="border">Ticket ID</th>
            <th className="border">From User</th>
            <th className="border">Claim User</th>
            <th className="border">category</th>
            <th className="border">Subcategory</th>
            <th className="border">Query</th>
            <th className="border">Status</th>
            <th className="border">Resolution</th>
            <th className="border">Feedback</th>
            <th className="border">Created</th>
            <th className="border">Solved</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 ">
          {currentItems.map((ticket) => (
            <tr
              key={ticket.TicketID}
              className="text-center border-b border-gray-200 bg-slate-50"
            >
              <td className="py-2 border ">{ticket.TicketID}</td>
              <td className="py-2 border">{ticket.from_UserName}</td>
              <td className="py-2 border">{ticket.claim_UserName}</td>
              <td className="py-2 border">{ticket.Querycategory}</td>
              <td className="py-2 border">{ticket.QuerySubcategory}</td>
              <td className="py-2 border">{ticket.Description}</td>
              <td className="py-2 border">
                {" "}
                <span className={getStatusClass(ticket.Status)}>
                  {ticket.Status}
                </span>
              </td>
              <td className="py-2 border">{ticket.ResolutionDescription}</td>
              <td className="py-2 border">{ticket.ResolutionFeedback}</td>
              <td className="py-2 border">
                {new Date(ticket.createdAt).toLocaleString()}
              </td>
              <td className="py-2">
                {ticket.Resolution_Timestamp
                  ? new Date(ticket.Resolution_Timestamp).toLocaleString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handleClick(1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          First
        </button>
        <button
          onClick={() => handleClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Previous
        </button>
        <div>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handleClick(pageNumber)}
                className={`px-4 py-2 mx-1 rounded ${
                  currentPage === pageNumber
                    ? "bg-blue-700 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {pageNumber}
              </button>
            )
          )}
        </div>
        <button
          onClick={() => handleClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Next
        </button>
        <button
          onClick={() => handleClick(totalPages)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Last
        </button>
      </div>
    </>
  );
};

export default TableData;
