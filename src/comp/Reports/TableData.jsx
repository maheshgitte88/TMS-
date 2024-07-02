import React from "react";

function TableData({ tData }) {
  return (
    <>
      <h2 className="text font-bold">Tickets</h2>
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
          {tData.map((ticket) => (
            <tr key={ticket.TicketID}>
              <td className="px-6 py-4 whitespace-nowrap">{ticket.TicketID}</td>
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
    </>
  );
}

export default TableData;
