import { useState } from "react";
import { serverurl } from "../../exportapp";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const renderTable = (
  tickets,
  currentPage,
  ticketsPerPage,
  handlePageChange,
  selectedTicket,
  handleTicketClick
) => {
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);

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
      <div className="table-container">
        {tickets.length > 0 ? (
          <>
            <h6 className="text-center text-2xl font-bold text-gray-700 my-4">
              Tickets{" "}
              <span className={`${getStatusClass(tickets[0].Status)}`}>
                {tickets[0].Status}
              </span>{" "}
              by me
            </h6>
            <table
              className={`custom-table ${
                selectedTicket ? "selected-table" : ""
              }`}
            >
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Ticket Type</th>
                  <th>Ticket Query</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {currentTickets.map((ticket) => (
                  <tr
                    key={ticket.TicketID}
                    onClick={() => handleTicketClick(ticket)}
                    className={`cursor-pointer ${
                      selectedTicket === ticket ? "selected-row" : ""
                    }`}
                  >
                    <td>{ticket.TicketID}</td>
                    <td>{ticket.TicketType}</td>
                    <td>{ticket.TicketQuery}</td>
                    <td>
                      <span className={getStatusClass(ticket.Status)}>
                        {ticket.Status}
                      </span>
                    </td>
                    <td>{ticket.Description}</td>
                    <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                    <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination flex justify-center mt-4">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages).keys()].map((number) => (
                <button
                  key={number + 1}
                  onClick={() => handlePageChange(number + 1)}
                  className={`px-3 py-1 mx-1 ${
                    currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
                  } rounded`}
                >
                  {number + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Last
              </button>
            </div>
          </>
        ) : (
          <>
            {" "}
            <h1 className="text-center text-2xl font-bold text-gray-700 my-4">
              You Don't Have These Tickets
            </h1>{" "}
          </>
        )}
      </div>
    </>
  );
};

const TicketTable = ({ handleTicketClick, selectedTicket }) => {
  const [activeTab, setActiveTab] = useState("closed");
  const [currentPage, setCurrentPage] = useState(1);
  const [closedTickets, setClosedTickets] = useState([]);
  const [resolvedTickets, setResolvedTickets] = useState([]);
  const ticketsPerPage = 10;
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const fetchClosedTickets = async () => {
    try {
      const response = await axios.get(
        `${serverurl}/api/emp-ticket/Closed/${decoded.user_id}`
      );
      setClosedTickets(response.data.tickets);
      setActiveTab("closed");
    } catch (error) {
      console.error("Error fetching closed tickets:", error);
    }
  };

  const fetchResolvedTickets = async () => {
    try {
      const response = await axios.get(
        `${serverurl}/api/emp-ticket/resolved/${decoded.user_id}`
      );
      setResolvedTickets(response.data.tickets);
      setActiveTab("resolved");
    } catch (error) {
      console.error("Error fetching resolved tickets:", error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => {
            fetchClosedTickets();
            setActiveTab("closed");
            setCurrentPage(1);
          }}
          className="bg-teal-200 p-4 rounded shadow hover:bg-teal-400 cursor-pointer"
        >
          Closed {closedTickets.length}
        </div>
        <div
          onClick={() => {
            fetchResolvedTickets();
            setActiveTab("resolved");
            setCurrentPage(1);
          }}
          className="bg-gray-200 p-4 rounded shadow hover:bg-gray-400 cursor-pointer"
        >
          Resolved {resolvedTickets.length}
        </div>
      </div>

      {activeTab === "closed" &&
        renderTable(
          closedTickets,
          currentPage,
          ticketsPerPage,
          handlePageChange,
          selectedTicket,
          handleTicketClick
        )}
      {activeTab === "resolved" &&
        renderTable(
          resolvedTickets,
          currentPage,
          ticketsPerPage,
          handlePageChange,
          selectedTicket,
          handleTicketClick
        )}
    </div>
  );
};

export default TicketTable;
