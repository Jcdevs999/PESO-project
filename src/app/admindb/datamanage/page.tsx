"use client";

import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import EventLog from "./eventLog"; // Import the EventLog component

const Page = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [events, setEvents] = useState<{ timestamp: string; action: string; details: string }[]>([]);

  // Load events from localStorage when the component mounts
  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  // Save events to localStorage whenever the events array changes
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  const logEvent = (action: string, details: string) => {
    const timestamp = new Date().toLocaleString();
    const newEvent = { timestamp, action, details };
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, newEvent];
      return updatedEvents;
    });
  };

  const onSelectedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      setFileList((prevFiles) => [...prevFiles, ...Array.from(fileList)]);
      Array.from(fileList).forEach((file) =>
        logEvent("File Selected", `File name: ${file.name}`)
      );
    }
  };

  const deleteFile = (fileName: string) => {
    setFileList((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    logEvent("File Removed", `File name: ${fileName}`);
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    fileList.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setUploadStatus(result.msg || "Upload successful");
      setUploadedFiles((prevFiles) => [...prevFiles, ...fileList]);
      setFileList([]);

      fileList.forEach((file) =>
        logEvent("File Uploaded", `File name: ${file.name}`)
      );

      setTimeout(() => setUploadStatus(null), 5000);
    } catch (err) {
      console.error("Error uploading files:", err);
      setUploadStatus("Error uploading files");
      setTimeout(() => setUploadStatus(null), 5000);
    }
  };

  // Function to clear event logs
  const clearEventLogs = () => {
    setEvents([]);
    localStorage.removeItem("events");
  };

  // Function to download event logs as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text("Event Log Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    doc.text("----------------------------------------------------", 20, 35);

    let yPosition = 45;

    // Header for the event log
    doc.setFontSize(12);
    doc.text("Timestamp", 20, yPosition);
    doc.text("Action", 80, yPosition);
    doc.text("Details", 140, yPosition);
    yPosition += 10;

    doc.setDrawColor(200);
    doc.line(20, yPosition, 190, yPosition); // Draw a line below the header
    yPosition += 5;

    // Loop through events and add them to the PDF
    events.forEach((event, index) => {
      if (yPosition > 270) {
        doc.addPage(); // Add new page if the content overflows
        yPosition = 20;
      }

      doc.text(event.timestamp, 20, yPosition);
      doc.text(event.action, 80, yPosition);
      doc.text(event.details, 140, yPosition);

      yPosition += 10;
    });

    // Save the PDF to the local file system
    doc.save("event_log_report.pdf");
  };

  return (
    <div className="">
      <p className="font-bold text-2xl m-2 mb-8 uppercase">Data Management</p>
      <div className="flex w-full space-x-6">
        {/* Left Section */}
        <div className="flex flex-col w-full h-full border border-black rounded-lg p-6">
          <div className="flex-grow pb-10">
            <h3 className="text-lg font-semibold mb-4">UPLOAD FILES</h3>
            <table className="min-w-full border-collapse border border-black rounded-lg">
              <thead>
                <tr>
                  <th className="border border-black p-3 bg-blue-300 text-center text-black uppercase">
                    File Name
                  </th>
                  <th className="border border-black p-3 bg-blue-300 text-center text-black uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {fileList.length > 0 ?
                  fileList.map((file, index) => (
                    <tr key={index}>
                      <td className="border border-black p-3">{file.name}</td>
                      <td className="border border-black p-3">
                        <button
                          className="bg-red-500 text-white p-2 hover:bg-red-400"
                          onClick={() => deleteFile(file.name)}
                        >
                          REMOVE
                        </button>
                      </td>
                    </tr>
                  ))
                : <tr>
                    <td
                      colSpan={2}
                      className="border border-black rounded-lg p-3 text-center"
                    >
                      No files selected
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end">
            <div className="flex items-center">
              <input
                type="file"
                multiple
                onChange={onSelectedFile}
                accept=".csv, .xls, .xlsx"
                className="hidden"
                id="fileUpload"
              />
              <label
                htmlFor="fileUpload"
                className="bg-white border-2 border-black text-white p-2 rounded-lg cursor-pointer hover:bg-blue-600 transition"
              >
                <img
                  src="/adminfolder/open-folder.png"
                  height={35}
                  width={35}
                  alt="Upload"
                />
              </label>
              <button
                className="ml-2 bg-white border-2 border-black text-white p-2 rounded-lg hover:bg-blue-600 transition"
                onClick={uploadFiles}
              >
                <img
                  src="/adminfolder/uploadCSV.png"
                  height={35}
                  width={35}
                  alt="Upload"
                />
              </button>
            </div>
          </div>

          {uploadStatus && (
            <div
              className={`p-4 mt-12 rounded-lg text-white ${
                uploadStatus.includes("successful") ? "bg-green-500" : (
                  "bg-red-500"
                )
              }`}
            >
              {uploadStatus}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex flex-col w-full h-full">
          <div className="border border-black rounded-lg p-2 flex-grow">
            {/* EventLog Component */}
            <EventLog events={events} />

            {/* Buttons for Clearing Logs and Downloading PDF */}
            <div className="flex items-center justify-end">
              <div className="flex justify-end mr-4 mb-4 mt-5 ">
                <button
                  onClick={clearEventLogs}
                  className="bg-white border-2 border-black text-white mr-2 p-2 rounded-lg cursor-pointer hover:bg-blue-600 transition"
                >
                  <img
                    src="/adminfolder/clear.png"
                    height={35}
                    width={35}
                    alt="Clear"
                  />
                </button>
                <button
                  onClick={downloadPDF}
                  className="bg-white border-2 border-black text-white p-2 rounded-lg cursor-pointer hover:bg-blue-600 transition"
                >
                  <img
                    src="/adminfolder/download-pdf.png"
                    height={35}
                    width={35}
                    alt="Download PDF"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;