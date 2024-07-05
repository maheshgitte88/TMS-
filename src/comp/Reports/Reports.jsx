import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { utils, writeFile } from "xlsx";
import TableData from "./TableData";
import ItTms from "./Graphs/ItTms";

function Reports() {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const defaultStartDate = formatDate(sevenDaysAgo);
  const defaultEndDate = formatDate(today);

  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedSubDepartments, setSelectedSubDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [tickets, setTickets] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [queryTypes, setQueryTypes] = useState([]);
  const [averageActualTAT, setAverageActualTAT] = useState(0);
  const [averageActualTATOrg, setaverageActualTATOrg] = useState(0);

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
          departmentIds: selectedDepartments.map((d) => d.value),
          subDepartmentIds: selectedSubDepartments.map((d) => d.value),
          startDate: startDate,
          endDate: endDate,
          statuses: statuses.map((s) => s.value),
          locations: locations.map((l) => l.value),
          ticketTypes: ticketTypes.map((t) => t.value),
          queryTypes: queryTypes.map((q) => q.value),
        },
      })
      .then((response) => {
        // Assuming `processTickets` is an async function, handle it appropriately
        setTickets(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the tickets!", error);
      });
  };

  useEffect(() => {
    fetchTickets();
  }, [
    statuses,
    startDate,
    endDate,
    selectedDepartments,
    locations,
    ticketTypes,
    queryTypes,
    selectedSubDepartments,
  ]);

  useEffect(() => {
    const departmentIds = selectedDepartments.map((d) => d.value);
    const subDepartmentsFiltered = departments
      .filter((dept) => departmentIds.includes(dept.DepartmentID))
      .flatMap((dept) => dept.SubDepartments);
    setSubDepartments(subDepartmentsFiltered);
    setSelectedSubDepartments([]);
  }, [selectedDepartments]);

  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(tickets);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Tickets");
    writeFile(workbook, "TicketsData.xlsx");
  };

  console.log(tickets, 100);

  useEffect(() => {
    const calculateAverage = (data) => {
      // Filter the data to include only "Resolved" or "Closed" statuses
      const filteredData = data.filter(
        (ticket) => ticket.Status === "Resolved" || ticket.Status === "Closed"
      );

      // Initialize variables to accumulate sum
      let totalActualTAT = 0;
      let totalActualTATOrg = 0;

      // Iterate over each filtered ticket object
      filteredData.forEach((ticket) => {
        // Add actualTAT to totalActualTAT
        totalActualTAT += ticket.actualTAT;

        // Add actualTATOrg to totalActualTATOrg
        totalActualTATOrg += ticket.actualTATOrig;
      });

      // Calculate average actualTAT
      setAverageActualTAT(totalActualTAT / filteredData.length);

      // Calculate average actualTATOrg
      setaverageActualTATOrg(totalActualTATOrg / filteredData.length);
    };
    calculateAverage(tickets);
  }, [tickets]);

  return (
    <div className="container mx-auto p-2">
      <h1 className="text font-bold mb-1">Ticket System</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Departments
          </label>
          <Select
            isMulti
            options={departments.map((dept) => ({
              value: dept.DepartmentID,
              label: dept.DepartmentName,
            }))}
            value={selectedDepartments}
            onChange={setSelectedDepartments}
          />
        </div>

        {subDepartments.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              SubDepartments
            </label>
            <Select
              isMulti
              options={subDepartments.map((subDept) => ({
                value: subDept.SubDepartmentID,
                label: subDept.SubDepartmentName,
              }))}
              value={selectedSubDepartments}
              onChange={setSelectedSubDepartments}
            />
          </div>
        )}

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
            Statuses
          </label>
          <Select
            isMulti
            options={[
              { value: "Pending", label: "Pending" },
              { value: "Resolved", label: "Resolved" },
              { value: "Closed", label: "Closed" },
            ]}
            value={statuses}
            onChange={setStatuses}
          />
        </div>
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Locations
          </label>
          <Select
            isMulti
            options={[
              { value: "Alandi", label: "Alandi" },
              { value: "Banner", label: "Banner" },
            ]}
            value={locations}
            onChange={setLocations}
          />
        </div>
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Ticket Types
          </label>
          <Select
            isMulti
            options={[
              { value: "normal", label: "Normal" },
              { value: "OverNight", label: "OverNight" },
              { value: "Weekend", label: "Weekend" },
            ]}
            value={ticketTypes}
            onChange={setTicketTypes}
          />
        </div>
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Query Types
          </label>
          <Select
            isMulti
            options={[
              { value: "Transaction", label: "Transaction" },
              { value: "Issue", label: "Issue" },
            ]}
            value={queryTypes}
            onChange={setQueryTypes}
          />
        </div>
      </div>

      <div className="mx-1 my-1">
        <ItTms
          tData={tickets}
          averageActualTAT={averageActualTAT}
          averageActualTATOrg={averageActualTATOrg}
        />
      </div>
      {/* <button
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        onClick={fetchTickets}
      >
        Show Tickets
      </button> */}

      <div className="mt-2">{/* <TableData tData={tickets} /> */}</div>
    </div>
  );
}

export default Reports;
