import React, { useState, useEffect } from "react";
import axios from "axios";
import { utils, writeFile } from "xlsx";

function Reports() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tickets, setTickets] = useState([]);
  const [Status, setStatus] = useState("");

  useEffect(() => {
    // Fetch departments on component mount
    axios
      .get("http://localhost:2000/api/departmentsforreport")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the departments!", error);
      });
  }, []);
  console.log(departments, "selectedDepartment", selectedDepartment, 23);
  const fetchTickets = () => {
    axios
      .get("http://localhost:2000/api/reports", {
        params: {
          departmentId: selectedDepartment,
          startDate: startDate,
          endDate: endDate,
          Status: Status,
        },
      })
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the tickets!", error);
      });
  };

  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(tickets);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Tickets");
    writeFile(workbook, "TicketsData.xlsx");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Ticket System</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Department
          </label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Select a department</option>
            {departments.map((department) => (
              <option
                key={department.DepartmentID}
                value={department.DepartmentID}
              >
                {department.DepartmentName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Status
          </label>
          <select
            id="Status"
            name="Status"
            onChange={(e) => setStatus(e.target.value)}
            value={Status}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            required
          >
            <option value="">all</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        onClick={fetchTickets}
      >
        Show Tickets
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={exportToExcel}
      >
        Export to Excel
      </button>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Tickets</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ticket ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resolution Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resolution Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket.TicketID}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {ticket.TicketID}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {ticket.Description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{ticket.Status}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(ticket.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {ticket.Resolution_Timestamp
                    ? new Date(ticket.Resolution_Timestamp).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
