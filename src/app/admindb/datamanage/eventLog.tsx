"use client";

import React from "react";

// Event log component
interface EventLogProps {
  events: { timestamp: string; action: string; details: string }[];
}

const EventLog: React.FC<EventLogProps> = ({ events }) => {
  return (
    <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 uppercase">Event Log</h3>
        <table className="min-w-full border-collapse border border-black rounded-lg">
          <thead>
            <tr>
              <th className="border border-black p-3 bg-blue-300 text-center uppercase">Date & Time</th>
              <th className="border border-black p-3 bg-blue-300 text-center uppercase">Action</th>
              <th className="border border-black p-3 bg-blue-300 text-center uppercase">Details</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event, index) => (
                <tr key={index}>
                  <td className="border border-black p-3 text-center">{event.timestamp}</td>
                  <td className="border border-black p-3 text-center">{event.action}</td>
                  <td className="border border-black p-3 text-center">{event.details}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="border border-black p-3 text-center">
                  No events logged
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  );
};

export default EventLog;
