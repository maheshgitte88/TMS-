import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClosedTickets,
  fetchResolvedTickets,
  getUserCreatedTicket,
  moveUsersTicketToClosed,
  moveUsersTicketToResolved,
  updateForStudentTicket,
  updateStudentTicketsArray,
} from "../../reduxToolkit/features/TicketSlice";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import Close from "../Tables/Reply/Close";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";

const currentTime = new Date();
const currentDay = new Date();
function StudentTicket() {
  const socket = useMemo(() => io("https://13.235.240.117:2000"), []);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [attchedfiles, setAttchedfiles] = useState(null);
  const [description, setDescription] = useState("");

  const [loadings, setLoadings] = useState(false);
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [resolvedCurrentPage, setResolvedCurrentPage] = useState(1);
  const [closedCurrentPage, setClosedCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  const token = localStorage.getItem("token");

  const decoded = jwtDecode(token);
  console.log(decoded, 19);

  const { userInfo } = useSelector((state) => state.user);
  const { UserTickets, closedTickets, resolvedTickets, loading } = useSelector(
    (state) => state.UserTickets
  );

  const [formData, setFormData] = useState({
    TicketType: getTicketType(currentTime, currentDay),
    Status: "Pending",
    Description: "",
    TicketResTimeInMinutes: 60,
    AssignedToDepartmentID: 2,
    AssignedToSubDepartmentID: 5,
    // files: null, // Change to null for initial state
    user_id: decoded.user_id,
  });

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
            "https://13.235.240.117:2000/api/img-save",
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

      // Create form data to be sent to the server
      const formDataToSend = {
        Description: description,
        AssignedToDepartmentID: 2,
        AssignedToSubDepartmentID: 5,
        TicketResTimeInMinutes: 60,
        TicketType: ticketType,
        Status: "Pending",
        AttachmentUrl: updatedAttachmentUrls,
        user_id: userInfo.user_id,
      };

      socket.emit("createTicket", {
        AssignedToSubDepartmentID: 5,
        formData: formDataToSend,
      });

      // dispatch(createTicket(formDataToSend));

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

    socket.emit("joinDepaTicketRoom", 5);

    socket.on("userUpdatedticketReciverd", (data) => {
      if (data.Status === "Resolved") {
        console.log(data.Status, 304);
        dispatch(moveUsersTicketToResolved(data));
        setSelectedTicket(data);
      } else if (data.Status === "Closed") {
        console.log(data.Status, 308);
        dispatch(moveUsersTicketToClosed(data));
        setSelectedTicket(data);
      } else if (data.Status === "Pending") {
        console.log(data.Status, 308);
        dispatch(updateForStudentTicket(data));
        setSelectedTicket(data);
      }
      toast.info(`Ticket id: ${data.TicketID} updated successfully..!`);
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

  const handleTicketClick = async (ticket) => {
    setSelectedTicket(ticket);
  };
  const formGenralShow = () => {
    setShowForm(!showForm);
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
              <h6 className="text-center text-2xl font-bold text-gray-700 my-4">
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
                      <th>Description</th>
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
                        <td>
                          {ticket.CloseDescription ? (
                            <>{ticket.CloseDescription}</>
                          ) : (
                            <>Not closed</>
                          )}
                        </td>
                        <td>
                          {ticket.ResolutionFeedback ? (
                            <>{ticket.ResolutionFeedback}</>
                          ) : (
                            <>Not Provide</>
                          )}
                        </td>
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
              onClick={fetchClosedTickets}
              className={`bg-green-200 p-4 rounded shadow flex justify-around hover:bg-green-400 cursor-pointer`}
            >
              <div>
                <strong>Closed</strong>
                <h5 className="font-semibold">{closedTickets.length}</h5>
              </div>
            </div>

            <div
              onClick={fetchResolvedTickets}
              className={`bg-blue-200 p-4 rounded shadow flex justify-around hover:bg-blue-400 cursor-pointer`}
            >
              <div>
                <strong>Resolved</strong>
                <h5 className="font-semibold">{resolvedTickets.length}</h5>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={formGenralShow}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
            >
              {showForm ? "Hide Form" : "Generate Ticket"}
            </button>
          </div>

          {showForm && (
            <div className="max-w-2xl mx-auto p-2 bg-white rounded shadow-md">
              <h6 className="text-xl text-blue-600 mb-2">Generate Ticket</h6>
              <div className="flex justify-between">
                <div className="mb-4">
                  <input
                    id="leadId"
                    name="LeadId"
                    defaultValue={userInfo.user_reg_no}
                    type="text"
                    className="mt-1 p-1 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Enter Lead ID"
                  />
                </div>
                <div className="mb-4">
                  <input
                    id="leadId"
                    name="LeadId"
                    defaultValue={userInfo.user_Name}
                    type="text"
                    className="mt-1 p-1 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Enter Lead ID"
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit}>
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
                      {" "}
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
              <div className="flex bg-white justify-between border-2 p-1">
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
                      <strong>{selectedTicket.Status}</strong>
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
                      <br />
                      <b>Time & Date:</b>{" "}
                      {formatDateTime(selectedTicket.Resolution_Timestamp)}
                    </div>
                  )}

                {selectedTicket.TransferDescription && (
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
                    {selectedTicket.TransferdAttachmentUrl != null ? (
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

export default StudentTicket;
