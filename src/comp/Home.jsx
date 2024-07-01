import React from "react";
import AdminTicket from "./Tables/AdminTicket";
import DepartmentsTickets from "./Tables/DepartmentsTickets";
import { jwtDecode } from "jwt-decode";
import GoogleCalendar from "./GoogleCalendar";

function Home() {
  const token = localStorage.getItem("token");

  const decoded = jwtDecode(token);
  console.log(decoded)

  return (
    <>
      {" "}
      <div className="container mx-auto flex flex-col sm:flex-row text-sm">
        <div className="sm:w-full">
          {decoded.DepartmentID === 2 ? (
            <>
              <AdminTicket />
            </>
          ) : (
            <>
              <DepartmentsTickets />
            </>
          )}

          <GoogleCalendar email={decoded.user_Email} />
        </div>
      </div>
    </>
  );
}

export default Home;
