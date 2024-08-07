import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { utils, writeFile } from "xlsx";
import TableData from "./TableData";
import ItTms from "./Graphs/ItTms";
import DepthDepBarChart from "./Graphs/Charts/DepthDepBarChart";
import DepthCatSubCat from "./Graphs/Charts/DepthCatSubCat";
import { serverurl } from "../../exportapp";

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
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [queryTypes, setQueryTypes] = useState([]);
  const [idelBechmark, setIdelBechmark] = useState([]);
  const [averageActualTAT, setAverageActualTAT] = useState(0);
  const [averageActualTATOrg, setaverageActualTATOrg] = useState(0);

  useEffect(() => {
    // Fetch departments on component mount
    axios
      .get(`${serverurl}/api/departmentsforreport`)
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the departments!", error);
      });
  }, []);

  const fetchTickets = () => {
    axios
      .get(`${serverurl}/api/reports`, {
        params: {
          departmentIds: selectedDepartments.map((d) => d.value),
          subDepartmentIds: selectedSubDepartments.map((d) => d.value),
          startDate: startDate,
          endDate: endDate,
          statuses: statuses.map((s) => s.value),
          locations: locations.map((l) => l.value),
          ticketTypes: ticketTypes.map((t) => t.value),
          queryTypes: queryTypes.map((q) => q.value),
          idelBechmark: idelBechmark.map((x) => x.value),
          claim_UserName: users.map((x) => x.value),
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
    idelBechmark,
    users,
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

  useEffect(() => {
    // Extract unique claim_UserName values, excluding null values
    const uniqueUsers = [
      ...new Set(
        tickets
          .map((ticket) => ticket.claim_UserName)
          .filter((userName) => userName !== null)
      ),
    ];

    // Format options for the select component
    const userOptions = uniqueUsers.map((user) => ({
      value: user,
      label: user,
    }));

    setAllUsers(userOptions);
  }, [tickets]);

  return (
    <div className="container mx-auto p-1 bg-gray-200">
      {/* <h1 className="text font-bold mb-1">Ticket System</h1> */}
      <div className=""></div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-2 mb-4">
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

        {subDepartments.length > 1 && (
          <div className="mb-1">
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
        {!subDepartments.length && (
          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Download Data
            </label>
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-2">
        <div className="lg:col-span-1 lg:row-span-4">
          {subDepartments.length > 1 && (
            <div className="mb-1">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={exportToExcel}
              >
                exportToExcel
              </button>
            </div>
          )}
          <div className="mb-10">
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

          <div className="mb-10">
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
              // menuIsOpen={true}
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Idel Benchmark
            </label>
            <Select
              isMulti
              options={[
                { value: "<0 %", label: "<0 %" },
                { value: "1% to 20%", label: "1% to 20%" },
                { value: "21% to 50%", label: "21% to 50%" },
                { value: "51% to 80%", label: "51% to 80%" },
                { value: "81% to above", label: "81% to above" },
              ]}
              value={idelBechmark}
              onChange={setIdelBechmark}
              menuIsOpen={true}
            />
          </div>

          <div className="mb-2 mt-20 pt-20" style={{ marginTop: "190px" }}>
            <label className="block text-sm font-medium text-gray-700">
              Select Users
            </label>
            <Select
              isMulti
              options={allUsers}
              value={users}
              onChange={setUsers}
              menuIsOpen={true}
            />
          </div>

          <div
            className="bg-red-200 p-5 flex justify-around rounded shadow cursor-pointer"
            style={{ marginTop: "395px" }}
          >
            <strong>Total Ticket count </strong> <br />
            <h6 className="font-bold text-4xl">{tickets.length}</h6>
          </div>
        </div>

        <div className="lg:col-span-5 lg:row-span-4">
          <ItTms
            tData={tickets}
            averageActualTAT={averageActualTAT}
            averageActualTATOrg={averageActualTATOrg}
          />
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <div className="w-1/3">
          <DepthDepBarChart tickets={tickets} />
        </div>
        <div className="w-2/3">
          <DepthCatSubCat tickets={tickets} />
        </div>
      </div>

      <div className="my-4">
        <TableData tData={tickets} />
      </div>
    </div>
  );
}

export default Reports;

{
  /* <button
className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
onClick={exportToExcel}
>
exportToExcel
</button> */
}

{
  /* <div className="mt-2"><TableData tData={tickets} /></div> */
}
