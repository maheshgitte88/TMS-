import React, { useState, useEffect } from "react";
import axios from "axios";
import { utils, writeFile } from "xlsx";
import TableData from "./TableData";
import ItTms from "./Graphs/ItTms";

function Reports() {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  // Format dates to YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split("T")[0];

  const defaultStartDate = formatDate(sevenDaysAgo);
  const defaultEndDate = formatDate(today);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSubDepartment, setSelectedSubDepartment] = useState("");
  const [subDepartments, setSubDepartments] = useState([]);
  const [departments, setDepartments] = useState([]);
  // const [selectedDepartment, setSelectedDepartment] = useState("");
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [tickets, setTickets] = useState([]);
  const [Status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [queryType, setQueryType] = useState("");

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

  const fetchTickets = () => {
    axios
      .get("http://localhost:2000/api/reports", {
        params: {
          departmentId: selectedDepartment,
          startDate: startDate,
          endDate: endDate,
          Status: Status,
          location: location,
          ticketType: ticketType,
          queryType: queryType,
        },
      })
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the tickets!", error);
      });
  };

  useEffect(() => {
    fetchTickets();
  }, [
    Status,
    startDate,
    endDate,
    selectedDepartment,
    location,
    ticketType,
    queryType,
  ]);
  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(tickets);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Tickets");
    writeFile(workbook, "TicketsData.xlsx");
  };
  useEffect(() => {
    const department = departments.find(
      (dept) => dept.DepartmentID === parseInt(selectedDepartment)
    );
    setSubDepartments(department ? department.SubDepartments : []);
    setSelectedSubDepartment("");
  }, [selectedDepartment]);
  console.log(tickets, departments, 50);
  return (
    <div className="container mx-auto p-2">
      <h1 className="text font-bold mb-1">Ticket System</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-4">
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Department</option>
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

        {subDepartments.length > 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              SubDepartment
            </label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedSubDepartment}
              onChange={(e) => setSelectedSubDepartment(e.target.value)}
            >
              <option value="">Select a subdepartment</option>
              {subDepartments.map((subDepartment) => (
                <option
                  key={subDepartment.SubDepartmentID}
                  value={subDepartment.SubDepartmentID}
                >
                  {subDepartment.SubDepartmentName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* <div className="mb-1">
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
        </div> */}
        <div className="mb-1">
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
        <div className="mb-1">
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
        <div className="mb-1">
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
            <option value="">Status</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700">
            location
          </label>
          <select
            id="location"
            name="location"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            required
          >
            <option value="">location</option>
            <option value="Alandi">Alandi</option>
            <option value="Banner">Banner</option>
            {/* <option value="Closed">Closed</option> */}
          </select>
        </div>
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Ticket Type
          </label>
          <select
            id="ticketType"
            name="ticketType"
            onChange={(e) => setTicketType(e.target.value)}
            value={ticketType}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            required
          >
            <option value="">TicketType</option>
            <option value="normal">Normal</option>
            <option value="OverNight">OverNight</option>
            <option value="Weekend">Weekend</option>
          </select>
        </div>
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700">
            QueryType
          </label>
          <select
            id="queryType"
            name="queryType"
            onChange={(e) => setQueryType(e.target.value)}
            value={queryType}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            required
          >
            <option value="">QueryType</option>
            <option value="Transaction">Transaction</option>
            <option value="Issue">Issue</option>
          </select>
        </div>
        {/* <button
          className="bg-green-500 text-white px-2 py-2 rounded"
          onClick={exportToExcel}
        >
          Export to Excel
        </button> */}
      </div>

      <div className="mx-1 my-1">
        <ItTms  tData={tickets} />
      </div>
      {/* <button
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        onClick={fetchTickets}
      >
        Show Tickets
      </button> */}

      <div className="mt-2">
        <TableData tData={tickets} />
      </div>
    </div>
  );
}

export default Reports;
