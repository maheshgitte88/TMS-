import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClosedTickets,
  fetchResolvedTickets,
  getUserCreatedTicket,
  moveUsersTicketToResolved,
  moveUsersTicketToClosed,
  updateStudentTicketsArray,
} from "../../reduxToolkit/features/TicketSlice";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import Close from "../Tables/Reply/Close";
import { toast } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner";

function LeadTransfer() {
  const socket = useMemo(() => io("https://tmsfinalserver.onrender.com"), []);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [LeadForm, setLeadForm] = useState(false);

  const [attchedfiles, setAttchedfiles] = useState(null);
  const [description, setDescription] = useState("");
  const [leadId, setLeadId] = useState("");
  const [queryCategories, setQueryCategories] = useState([]);
  const [querySubcategories, setQuerySubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [ticketResTimeInMinutes, setTicketResTimeInMinutes] = useState(0);

  const [allDepartments, setAllDepartments] = useState([]);
  const [filteredSubDepartments, setFilteredSubDepartments] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  const [selectedGenDepartment, setSelectedGenDepartment] = useState("");
  const [selectedGenSubDepartment, setSelectedGenSubDepartment] = useState("");
  const [selectedGenCategory, setSelectedGenCategory] = useState("");
  const [selectedGenSubcategory, setSelectedGenSubcategory] = useState("");
  const [timeInMinutes, setTimeInMinutes] = useState("");

  const [attendees, setAttendees] = useState([]);
  const [ccMarksForLead, setCMarkForLead] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showSection, setShowSection] = useState(false);

  const [loadings, setLoadings] = useState(false);

  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [resolvedCurrentPage, setResolvedCurrentPage] = useState(1);
  const [closedCurrentPage, setClosedCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  const handleAttendeeChange = (e) => {
    const { value, checked } = e.target;
    setCMarkForLead((ccMarksForLead) => {
      const newccMarksForLead = checked
        ? [...ccMarksForLead, value]
        : ccMarksForLead.filter((attendee) => attendee !== value);
      return newccMarksForLead;
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAttendees = attendees.filter((attendee) =>
    attendee.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(
    selectedGenDepartment,
    selectedGenSubDepartment,
    selectedGenCategory,
    selectedGenSubcategory,
    timeInMinutes,
    ccMarksForLead,
    41
  );

  useEffect(() => {
    const fetchQueryData = async () => {
      try {
        const response = await axios.get(
          "https://tmsfinalserver.onrender.com/api/mis-hierarchy"
        );
        setQueryCategories(response.data);
      } catch (error) {
        console.error("Error fetching query data:", error);
      }
    };

    fetchQueryData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        console.log(decoded, 19);

        const response = await axios.get(
          "https://tmsfinalserver.onrender.com/api/all-hierarchy"
        );
        const resData = response.data;
        console.log(resData, 110);

        // Filter out SubDepartments with SubDepartmentID 6
        const filteredData = resData.map((department) => {
          return {
            ...department,
            SubDepartments: department.SubDepartments.filter(
              (subDept) => subDept.SubDepartmentID !== decoded.SubDepartmentID
            ),
          };
        });
        console.log(filteredData, 120);

        setAllDepartments(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const fetchAttendees = async () => {
      try {
        const response = await axios.get(
          "https://tmsfinalserver.onrender.com/api/allEmployess"
        );
        const employees = response.data.Employees.map(
          (employee) => employee.user_Email
        );
        setAttendees(employees);
      } catch (error) {
        console.error("Error fetching attendees:", error);
      }
    };

    fetchAttendees();
  }, []);

  const token = localStorage.getItem("token");

  const decoded = jwtDecode(token);
  console.log(decoded, 19);

  const { userInfo } = useSelector((state) => state.user);
  const { UserTickets, closedTickets, resolvedTickets, loading } = useSelector(
    (state) => state.UserTickets
  );

  const [formData, setFormData] = useState({});

  const dispatch = useDispatch();
  const joinedRooms = useRef(new Set());

  useEffect(() => {
    if (UserTickets && UserTickets.length > 0) {
      UserTickets.forEach((ticket) => {
        if (!joinedRooms.current.has(ticket.TicketID)) {
          socket.emit("userUpdatedticketRoom", ticket.TicketID);
          joinedRooms.current.add(ticket.TicketID);
        }
      });
    }
  }, [UserTickets]);
  
  useEffect(() => {
    if (UserTickets && UserTickets.length > 0) {
      UserTickets.forEach((ticket) => {
        if (!joinedRooms.current.has(ticket.TicketID)) {
          socket.emit("userUpdatedticketRoom", ticket.TicketID);
          joinedRooms.current.add(ticket.TicketID);
        }
      });
    }
  }, [UserTickets]);


  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      AttachmentUrl: e.target.files,
    });
    setAttchedfiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadings(true);

    try {
      const currentTime = new Date();
      const currentDay = new Date();

      const ticketType = getTicketType(currentTime, currentDay);

      let updatedAttachmentUrls = [];
      if (attchedfiles && attchedfiles.length > 0) {
        for (const file of attchedfiles) {
          const formData = new FormData();
          formData.append("files", file);

          const response = await axios.post(
            "https://tmsfinalserver.onrender.com/api/img-save",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(response, 2332);
          updatedAttachmentUrls.push(response.data.data);
        }
      }

      if (selectedGenDepartment) {
        // socket.emit("joinDepaTicketRoom", selectedGenSubDepartment);
        const roomId = Number(selectedGenSubDepartment);
        socket.emit("joinDepaTicketRoom", roomId);

        const formDataToSend = {
          Description: description,
          AssignedToDepartmentID: selectedGenDepartment,
          AssignedToSubDepartmentID: selectedGenSubDepartment,
          // LeadId: leadId,
          Querycategory: selectedGenCategory,
          QuerySubcategory: selectedGenSubcategory,
          TicketResTimeInMinutes: timeInMinutes,
          TicketType: ticketType,
          Status: "Pending",
          AttachmentUrl: updatedAttachmentUrls,
          user_id: userInfo.user_id,
        };

        socket.emit("createTicket", {
          AssignedToSubDepartmentID: roomId,
          formData: formDataToSend,
        });
        console.log(formDataToSend, 149);
        toast.success(`Ticket create successfully..!`);

        // dispatch(createTicket(formDataToSend));
      } else {
        const formDataToSend = {
          Description: description,
          AssignedToDepartmentID: 1,
          AssignedToSubDepartmentID: 4,
          LeadId: leadId,
          Querycategory: selectedCategory,
          QuerySubcategory: selectedSubcategory,
          TicketResTimeInMinutes: ticketResTimeInMinutes,
          TicketType: ticketType,
          Status: "Pending",
          CreatedCCMark: ccMarksForLead,
          AttachmentUrl: updatedAttachmentUrls,
          user_id: userInfo.user_id,
        };

        socket.emit("createTicket", {
          AssignedToSubDepartmentID: 4,
          formData: formDataToSend,
        });
        // console.log(formDataToSend, 170);
        toast.success(`Ticket create successfully..!`);

        // dispatch(createTicket(formDataToSend));
      }
      setLeadForm(false);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setLoadings(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      const user_id = userInfo.user_id;
      dispatch(getUserCreatedTicket({ user_id: user_id }));
    }
  }, [userInfo]);

  useEffect(() => {
    socket.on("updatedDeptTicketChat", (data) => {
      console.log("Ticket created successfully:", data);
      dispatch(updateStudentTicketsArray(data));
    });

    socket.emit("joinDepaTicketRoom", 4);

    socket.on("userUpdatedticketReciverd", (data) => {
      console.log("Ticket update Received:", data);
      console.log(data.Status, data.Status === "Resolved", 302);
      if (data.Status === "Resolved") {
        console.log(data.Status, 304);
        dispatch(moveUsersTicketToResolved(data));
        setSelectedTicket(data);
      } else if (data.Status === "Closed") {
        console.log(data.Status, 308);
        dispatch(moveUsersTicketToClosed(data));
        setSelectedTicket(data);
      }
      toast.info(`Ticket id: ${data.TicketID} updated successfully..!`);
      setSelectedTicket(data);
    });
    // socket.emit("updatedticketRoom", selectedGenSubDepartment);

    socket.on("ticketCreationError", (error) => {
      console.error("Ticket creation error:", error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  function formatDateTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
  }
  function getTicketType(currentTime, currentDay) {
    const currentTimeIST = new Date(
      currentTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const hours = currentTimeIST.getHours();
    const day = currentDay.getDay(); // Sunday is 0, Monday is 1, ..., Saturday is 6

    if (hours >= 10 && hours < 17 && day >= 1 && day <= 5) {
      return "normal"; // Ticket created between 10 am to 5 pm on weekdays
    } else {
      return "OverNight"; // Ticket created after 5 pm or before 10 am, or on weekends
    }
  }

  const handleTicketClick = async (ticket) => {
    setSelectedTicket(ticket);
  };
  const formGenralShow = () => {
    setShowForm(!showForm);
    setLeadForm(false);
  };

  const formLeadShow = () => {
    setLeadForm(!LeadForm);
    setShowForm(false);
  };

  const handleCategoryChangeLead = (event) => {
    const categoryName = event.target.value;
    setSelectedCategory(categoryName);

    // Filter subcategories based on selected category
    const subcategories =
      queryCategories.find(
        (category) => category.QueryCategoryName === categoryName
      )?.QuerySubcategories || [];
    setQuerySubcategories(subcategories);
    setSelectedSubcategory(""); // Reset subcategory selection
    setTicketResTimeInMinutes(0); // Reset time in minutes
  };

  const handleSubcategoryChangeLead = (event) => {
    const subcategoryName = event.target.value;
    const subcategory = querySubcategories.find(
      (sub) => sub.QuerySubcategoryName === subcategoryName
    );
    setSelectedSubcategory(subcategoryName);
    setTicketResTimeInMinutes(subcategory?.TimeInMinutes || 0);
  };

  const handleDepartmentChange = (event) => {
    const selectedDepartmentId = event.target.value;
    setSelectedGenDepartment(selectedDepartmentId);
    setSelectedGenSubDepartment("");
    setSelectedGenCategory("");
    setSelectedGenSubcategory("");
    setTimeInMinutes("");

    const selectedDepartment = allDepartments.find(
      (dept) => dept.DepartmentID === parseInt(selectedDepartmentId)
    );
    setFilteredSubDepartments(selectedDepartment?.SubDepartments || []);
    setFilteredCategories(selectedDepartment?.QueryCategories || []);
  };

  const handleSubDepartmentChange = (event) => {
    const selectedSubDepartmentId = event.target.value;
    setSelectedGenSubDepartment(selectedSubDepartmentId);
    setSelectedGenCategory("");
    setSelectedGenSubcategory("");
    setTimeInMinutes("");

    const selectedSubDepartment = filteredSubDepartments.find(
      (subDept) => subDept.SubDepartmentID === parseInt(selectedSubDepartmentId)
    );
    setFilteredCategories(selectedSubDepartment?.QueryCategories || []);
  };

  const handleCategoryChange = (event) => {
    const selectedCategoryName = event.target.value;
    setSelectedGenCategory(selectedCategoryName);
    setSelectedGenSubcategory("");
    setTimeInMinutes("");

    const selectedCategory = filteredCategories.find(
      (cat) => cat.QueryCategoryName === selectedCategoryName
    );
    setFilteredSubCategories(selectedCategory?.QuerySubcategories || []);
  };

  const handleSubCategoryChange = (event) => {
    const selectedSubCategoryName = event.target.value;
    setSelectedGenSubcategory(selectedSubCategoryName);

    const selectedSubCategory = filteredSubCategories.find(
      (subCat) => subCat.QuerySubcategoryName === selectedSubCategoryName
    );
    setTimeInMinutes(selectedSubCategory?.TimeInMinutes || "");
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

  useEffect(() => {
    dispatch(
      fetchClosedTickets({
        user_id: decoded.user_id,
      })
    );
  }, []);

  useEffect(() => {
    dispatch(
      fetchResolvedTickets({
        user_id: decoded.user_id,
      })
    );
  }, []);

  const getPaginatedTickets = (tickets, currentPage, ticketsPerPage) => {
    const startIndex = (currentPage - 1) * ticketsPerPage;
    const endIndex = startIndex + ticketsPerPage;
    return tickets.slice(startIndex, endIndex);
  };

  const renderPaginationButtons = (tickets, currentPage, setCurrentPage) => {
    const totalPages = Math.ceil(tickets.length / ticketsPerPage);
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center my-4">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`mx-1 px-3 py-1 border rounded ${
            currentPage === index + 1
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border-blue-500"
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
    );
  };

  const renderTable = (tickets, currentPage, setCurrentPage) => {
    const paginatedTickets = getPaginatedTickets(
      tickets,
      currentPage,
      ticketsPerPage
    );

    return (
      <>
        {tickets.length > 0 ? (
          <>
          <div className="bg-white p-1 mt-2">
          <h6 className="text-center text-2xl font-bold text-gray-700 my-1">
              Tickets raised by me{" "}
              <span className={`${getStatusClass(tickets[0].Status)}`}>
                {tickets[0].Status}
              </span>
            </h6>

            <div className="table-container">
              <table
                className={`custom-table ${
                  selectedTicket ? "selected-table" : ""
                }`}
              >
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Type</th>
                    <th>Query</th>
                    <th>Status</th>
                    <th>Desc</th>
                    <th>Res Desc</th>
                    <th>Close Desc</th>
                    <th>Feedback</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTickets.map((ticket) => (
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
                      <td>{ticket.ResolutionDescription}</td>
                      <td>{ticket.CloseDescription ? <>{ticket.CloseDescription}</> :<>Not closed</>}</td>
                      <td>{ticket.ResolutionFeedback ? <>{ticket.ResolutionFeedback}</> :<>Not Provide</>}</td>
                      <td>{formatDateTime(ticket.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderPaginationButtons(tickets, currentPage, setCurrentPage)}
            </div>

          </div>
           
          </>
        ) : (
          <h1 className="text-center text-2xl font-bold text-gray-700 my-4">
            You Don't Have These Tickets
          </h1>
        )}
      </>
    );
  };

  return (
    <div className="container mx-auto p-1 flex flex-col sm:flex-row text-sm">
      <div className="sm:w-full">
        <div className="container mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-2">
            <div
              className={`bg-red-200 p-4 rounded shadow flex justify-around hover:bg-red-400 cursor-pointer`}
            >
              <div>
                <strong>Ticket</strong>
                <h5 className="font-semibold">{UserTickets.length}</h5>
              </div>
            </div>

            <div
              className={`bg-green-200 p-4 rounded shadow flex justify-around hover:bg-green-400 cursor-pointer`}
            >
              <div>
                <strong>Closed</strong>
                <h5 className="font-semibold">{closedTickets.length}</h5>
              </div>
            </div>

            <div
              className={`bg-blue-200 p-4 rounded shadow flex justify-around hover:bg-blue-400 cursor-pointer`}
            >
              <div>
                <strong>Resolved</strong>
                <h5 className="font-semibold">{resolvedTickets.length}</h5>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            {decoded.DepartmentID === 4 ? (
              <>
                <button
                  onClick={formLeadShow}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                >
                  {LeadForm ? "Hide Form" : "Lead Transfer"}
                </button>

                <button
                  onClick={formGenralShow}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                >
                  {showForm ? "Hide Form" : "Generate Ticket"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={formGenralShow}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                >
                  {showForm ? "Hide Form" : "Generate Ticket"}
                </button>
              </>
            )}
          </div>

          {LeadForm && (
            <div className="max-w-2xl mx-auto p-2 bg-white rounded shadow-md">
              {/* <h6 className="text-xl text-blue-600 mb-2">Generate Ticket</h6> */}
              <form onSubmit={handleSubmit}>
                <div className="flex justify-between space-x-4">
                  <div className="flex-1">
                    {/* <label className="block text-gray-700">
                      Query Category:
                    </label> */}
                    <select
                      value={selectedCategory}
                      onChange={handleCategoryChangeLead}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                      <option value="">Select Category</option>
                      {queryCategories.map((category) => (
                        <option
                          key={category.QueryCategoryID}
                          value={category.QueryCategoryName}
                        >
                          {category.QueryCategoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedCategory && (
                    <div className="flex-1">
                      <select
                        value={selectedSubcategory}
                        onChange={handleSubcategoryChangeLead}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      >
                        <option value="">Select Subcategory</option>
                        {querySubcategories.map((subcategory) => (
                          <option
                            key={subcategory.QuerySubCategoryID}
                            value={subcategory.QuerySubcategoryName}
                          >
                            {subcategory.QuerySubcategoryName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="mb-2">
                  <input
                    id="leadId"
                    name="leadId"
                    value={leadId}
                    onChange={(e) => setLeadId(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Lead Id"
                  />
                </div>

                <div className="mb-2">
                  <textarea
                    id="description"
                    name="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 p-5 w-full border-dashed border-4 border-indigo-300 rounded-md focus:outline-none focus:ring focus:border-blue-600"
                    placeholder="Enter a brief description"
                    required
                  />
                </div>
                <div className="mb-4">
                  <div
                    onClick={() => setShowSection(!showSection)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    {showSection ? "Not Need To add CC" : "Add in Cc"}
                  </div>
                  {showSection && (
                    <>
                      {ccMarksForLead.length > 0 ? (
                        <>
                          <label className="block text-gray-700">
                            Added in Cc
                          </label>
                          <textarea
                            value={ccMarksForLead.join(", ")}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                          />
                        </>
                      ) : (
                        <></>
                      )}

                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Search attendees..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          className="w-full px-3 py-2 mb-2 border border-gray-300 rounded"
                        />
                      </div>

                      <div className="w-full px-3 py-2 border border-gray-300 rounded h-20 overflow-y-scroll">
                        {filteredAttendees.map((attendee, index) => (
                          <div key={index}>
                            <input
                              type="checkbox"
                              id={`attendee-${index}`}
                              value={attendee}
                              onChange={handleAttendeeChange}
                              checked={ccMarksForLead.includes(attendee)}
                            />
                            <label
                              htmlFor={`attendee-${index}`}
                              className="ml-2"
                            >
                              {attendee}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="mb-2">
                  <input
                    type="file"
                    id="files"
                    name="files"
                    onChange={handleFileChange}
                    className="mt-1 p-1 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    accept=".jpg, .jpeg, .png, .gif, .pdf"
                    multiple
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted file types: .jpg, .jpeg, .png, .gif, .pdf
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loadings}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {loadings ? (
                    <>
                      <div className="flex justify-between">
                        <LoadingSpinner /> Createting...
                      </div>
                    </>
                  ) : (
                    "Create Ticket"
                  )}
                </button>
              </form>
            </div>
          )}

          {showForm && (
            <>
              <div className="max-w-2xl mx-auto p-2 bg-white rounded shadow-md">
                {/* <h6 className="text-xl text-blue-600 mb-2">Generate Ticket</h6> */}

                <form onSubmit={handleSubmit}>
                  <div className="flex justify-between space-x-4">
                    <div className="flex-1">
                      <label className="block text-gray-700">Department:</label>
                      <select
                        value={selectedGenDepartment}
                        onChange={handleDepartmentChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      >
                        <option value="">Select Department</option>
                        {allDepartments.map((department) => (
                          <option
                            key={department.DepartmentID}
                            value={department.DepartmentID}
                          >
                            {department.DepartmentName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedGenDepartment && (
                      <div className="flex-1">
                        <label className="block text-gray-700">
                          Sub Department:
                        </label>
                        <select
                          value={selectedGenSubDepartment}
                          onChange={handleSubDepartmentChange}
                          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                          <option value="">Select Sub Department</option>
                          {filteredSubDepartments.map((subDepartment) => (
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
                  </div>

                  {selectedGenSubDepartment && (
                    <div className="flex justify-between space-x-4">
                      <div className="flex-1">
                        <label className="block text-gray-700">
                          Query Category:
                        </label>
                        <select
                          value={selectedGenCategory}
                          onChange={handleCategoryChange}
                          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                          <option value="">Select Query Category</option>
                          {filteredCategories.map((category) => (
                            <option
                              key={category.QueryCategoryID}
                              value={category.QueryCategoryName}
                            >
                              {category.QueryCategoryName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedGenCategory && (
                        <div className="flex-1">
                          <label className="block text-gray-700">
                            Query Subcategory:
                          </label>
                          <select
                            value={selectedGenSubcategory}
                            onChange={handleSubCategoryChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          >
                            <option value="">Select Query Subcategory</option>
                            {filteredSubCategories.map((subCategory) => (
                              <option
                                key={subCategory.QuerySubCategoryID}
                                value={subCategory.QuerySubcategoryName}
                              >
                                {subCategory.QuerySubcategoryName}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedGenSubcategory && (
                    <div>
                      <label className="block text-gray-700">
                        Resolution Time in Minutes:
                      </label>
                      <input
                        type="text"
                        value={timeInMinutes}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                      />
                    </div>
                  )}

                  <div className="mb-2">
                    <textarea
                      id="description"
                      name="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="mt-1 p-5 w-full border-dashed border-4 border-indigo-300 rounded-md focus:outline-none focus:ring focus:border-blue-600"
                      placeholder="Enter a brief description"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="file"
                      id="files"
                      name="files"
                      onChange={handleFileChange}
                      className="mt-1 p-1 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      accept=".jpg, .jpeg, .png, .gif, .pdf"
                      multiple
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Accepted file types: .jpg, .jpeg, .png, .gif, .pdf
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loadings}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {loadings ? (
                      <>
                        <div className="flex justify-between">
                          <LoadingSpinner /> Createting...
                        </div>
                      </>
                    ) : (
                      "Create Ticket"
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
        {UserTickets.length > 0 ? (
          <>
            <h6 className="font-semibold mb-2">Tickets raised by me</h6>

            <div className="table-container">
              <table
                className={`custom-table ${
                  selectedTicket ? "selected-table" : ""
                }`}
              >
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                    <th>Location</th>
                    <th>From</th>
                    <th>To Depat</th>
                    <th>Time To solve</th>
                  </tr>
                </thead>

                <tbody>
                  {getPaginatedTickets(
                    UserTickets,
                    userCurrentPage,
                    ticketsPerPage
                  ).map((ticket) => (
                    <tr
                      key={ticket.TicketID}
                      onClick={() => handleTicketClick(ticket)}
                      className={`cursor-pointer ${
                        selectedTicket === ticket ? "selected-row" : ""
                      }`}
                    >
                      <td>{ticket.TicketID}</td>
                      <td>
                        <span className={getStatusClass(ticket.Status)}>
                          {ticket.Status}
                        </span>
                      </td>
                      <td>{formatDateTime(ticket.createdAt)}</td>
                      <td>{ticket.from_User.location}</td>
                      <td>{ticket.from_User.user_Name}</td>
                      <td>{ticket.AssignedToDepartment.DepartmentName}</td>
                      <td>{ticket.TicketResTimeInMinutes} m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderPaginationButtons(
                UserTickets,
                userCurrentPage,
                setUserCurrentPage
              )}
            </div>
          </>
        ) : (
          <></>
        )}

        <div>
          {!loading ? (
            <>
              {renderTable(
                resolvedTickets,
                resolvedCurrentPage,
                setResolvedCurrentPage
              )}
              {renderTable(
                closedTickets,
                closedCurrentPage,
                setClosedCurrentPage
              )}
            </>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>

      {/* Right Column */}
      {selectedTicket ? (
        <>
          <div className="sm:w-full ms-2">
            <div className="bg-white rounded-lg shadow-md p-2 overflow-y-auto w-full">
              <div className="flex bg-white justify-between border p-1">
                <div className="text-blue-600">
                  Ticket Id: {selectedTicket.TicketID}
                </div>
                <button onClick={() => handleTicketClick()} type="button">
                  ✖
                </button>
              </div>
              <div className="mb-4">
                <div className="flex justify-between">
                  <p className="text-gray-700 mb-2">
                    <b>Status:</b>{" "}
                    <span className={getStatusClass(selectedTicket.Status)}>
                      {selectedTicket.Status}
                    </span>
                  </p>
                  <p className="text-gray-700 mb-2">
                    <b>Recived Time:</b>{" "}
                    <span>{formatDateTime(selectedTicket.createdAt)}</span>
                  </p>
                </div>

                <div className="flex justify-between">
                  <p className="text-gray-700 mb-2">
                    <b>Recived Time:</b>{" "}
                    <span>{formatDateTime(selectedTicket.createdAt)}</span>
                  </p>
                  <p className="text-gray-700 mb-2">
                    <b>Reg No:</b>{" "}
                    <span>{selectedTicket.from_User.user_reg_no}</span>
                  </p>
                </div>

                <div className="flex justify-between">
                  <p className="text-gray-700 mb-2">
                    <b>Email:</b>{" "}
                    <span>{selectedTicket.from_User.user_Email}</span>
                  </p>
                  <p className="text-gray-700 mb-2">
                    <b>Mobile:</b>{" "}
                    <span>{selectedTicket.from_User.user_Mobile}</span>
                  </p>
                </div>

                <p className="text-gray-700 mb-4 border border-indigo-600 p-4 rounded-md">
                  <div className="flex justify-between">
                    <span>
                      <b>Ticket From:</b> {selectedTicket.from_User.user_Name}
                    </span>
                    <span>
                      <b>Department:</b>{" "}
                      {selectedTicket.from_User.Department.DepartmentName}
                    </span>
                  </div>
                  <br />
                  <div className="border-2 py-5 px-1">
                    {selectedTicket.Description}
                  </div>
                  {selectedTicket.AttachmentUrl.length > 0 ? (
                    <>
                      <div className="mt-2 flex justify-between">
                        <b>Attachments:</b>
                        {selectedTicket.AttachmentUrl.map((urlArray, index) => (
                          <a
                            key={index}
                            href={urlArray[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mb-2 text-blue-500 underline"
                          >
                            Doc {index + 1}
                          </a>
                        ))}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {selectedTicket.CreatedCCMark ? (
                    <>
                      <div className="mt-2 flex flex-wrap border-2 p-2">
                        <span>
                          <b>CC Marks:</b>
                        </span>
                        {selectedTicket.CreatedCCMark.map((email, index) => (
                          <span
                            key={index}
                            className="px-1 py-1 bg-gray-200 rounded"
                          >
                            {email}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  <br />
                  <b>Time & Date:</b> {formatDateTime(selectedTicket.createdAt)}
                </p>

                {selectedTicket.claim_User &&
                  selectedTicket.ResolutionDescription && (
                    <div className="text-gray-700 mb-4 border border-indigo-600 p-4 rounded-md">
                      <div className="flex justify-between">
                        <span>
                          <b>Admin:</b> {selectedTicket.claim_User.user_Name}
                        </span>
                        <span>
                          <b>From:</b>
                          {selectedTicket.claim_User.Department.DepartmentName}
                        </span>
                      </div>
                      <div className="border-2 py-5 px-1">
                        {selectedTicket.ResolutionDescription}
                      </div>
                      {selectedTicket.ResolvedAttachmentUrl.length > 0 ? (
                        <>
                          <div className="mt-2 flex justify-between">
                            <b>Attachments:</b>
                            {selectedTicket.ResolvedAttachmentUrl.map(
                              (urlArray, index) => (
                                <a
                                  key={index}
                                  href={urlArray[0]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block mb-2 text-blue-500 underline"
                                >
                                  Doc {index + 1}
                                </a>
                              )
                            )}
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                      {selectedTicket.ResolvedCCMark ? (
                        <>
                          <div className="mt-2 flex flex-wrap border-2 p-2">
                            <span>
                              <b>CC Marks:</b>
                            </span>
                            {selectedTicket.ResolvedCCMark.map(
                              (email, index) => (
                                <span
                                  key={index}
                                  className="px-1 py-1 bg-gray-200 rounded"
                                >
                                  {email}
                                </span>
                              )
                            )}
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                      <br />
                      <b>Time & Date:</b>{" "}
                      {formatDateTime(selectedTicket.Resolution_Timestamp)}
                    </div>
                  )}

                {selectedTicket.transferredClaimUser && (
                  <div className="text-gray-700 mb-4 border border-indigo-600 p-4 rounded-md">
                    <div className="flex justify-between">
                      <span>
                        <b>Transfer To Department:</b>{" "}
                        {
                          selectedTicket.transferredClaimUser.Department
                            .DepartmentName
                        }
                      </span>
                      <span>
                        <b>Admin:</b>{" "}
                        {selectedTicket.transferredClaimUser.user_Name}
                      </span>
                      <span>
                        <b>From:</b>{" "}
                        {
                          selectedTicket.transferredClaimUser.Department
                            .DepartmentName
                        }
                      </span>
                    </div>
                    <div className="border-2 py-5 px-1">
                      {selectedTicket.TransferDescription}
                    </div>
                    {selectedTicket.TransferdAttachmentUrl.length > 0 ? (
                      <>
                        <div className="mt-2 flex justify-between">
                          <b>Attachments:</b>
                          {selectedTicket.TransferdAttachmentUrl.map(
                            (urlArray, index) => (
                              <a
                                key={index}
                                href={urlArray[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mb-2 text-blue-500 underline"
                              >
                                Doc {index + 1}
                              </a>
                            )
                          )}
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    <br />
                    <b>Time & Date:</b>{" "}
                    {formatDateTime(selectedTicket.Resolution_Timestamp)}
                  </div>
                )}

                {selectedTicket.Status === "Resolved" ? (
                  <Close TicketData={selectedTicket} />
                ) : selectedTicket.Status === "Closed" ? (
                  <div className="text-gray-700 mb-4 border border-indigo-600 p-4 rounded-md">
                    <div className="flex justify-between">
                      <span>
                        <b>Closed with:</b> {selectedTicket.from_User.user_Name}
                      </span>
                      <span>
                        <b>Department:</b>{" "}
                        {selectedTicket.from_User.Department.DepartmentName}
                      </span>
                    </div>
                    <br />

                    <div className="border-2 py-5 px-1">
                      {selectedTicket.CloseDescription}
                    </div>

                    <br />

                    <div className="flex justify-between">
                      <span>
                        <b>Time & Date:</b>{" "}
                        {formatDateTime(selectedTicket.closed_Timestamp)}
                      </span>
                      <span>
                        <b>Rating:</b> {selectedTicket.ResolutionFeedback}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default LeadTransfer;
