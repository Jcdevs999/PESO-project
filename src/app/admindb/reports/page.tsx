"use client";

import React, { useState } from "react";

const ReportPage = () => {
  const [value, setValue] = useState("10:00 AM");

  const onChange = (timeValue: any) => {
    setValue(timeValue);
  };

  return (
    <div className="">
      <div className="flex flex-col items-center  rounded-lg w-full ">
        <p className="self-start pb-14 font-semibold text-xl">Reports</p>
        <div className="w-[70vw] flex flex-col h-[300px] border-2 border-black">
          <p className="h-10"></p>
          <div className="flex border-t-2 border-black h-full">
            <div className="w-full flex flex-col border-r-2 border-black h-full">
              <div className="text-center border-b-2 border-black font-semibold h-10 p-1 ">
                Select Report Content
              </div>
              <div className="flex items-center justify-center w-full h-full">
                <ul className="">
                  <li>
                    <label className="flex items-center ">
                      <input
                        type="checkbox"
                        className="form-checkbox text-primary"
                      />
                      <span className="ml-2 text-muted-foreground text-sm">
                        Data Summary
                      </span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox text-primary"
                      />
                      <span className="ml-2 text-muted-foreground text-sm">
                        Visualizations
                      </span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full flex flex-col border-r-2 border-black">
              <div className="text-center text-md  border-b-2 border-black font-semibold h-10 p-1">
                <p>Select Report Format</p>
              </div>
              <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="border-2 border-black rounded-lg p-1 text-sm w-fit px-2 py-1 ">
                  <select className=" w-full text-sm ">
                    <option disabled selected>
                      Report Format
                    </option>
                    <option>PDF</option>
                    <option>Word</option>
                    <option>HTML</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col border-r-2 border-black">
              <div className="text-center border-b-2 border-black h-10 p-1"></div>
              <ul className="flex flex-col items-center justify-center h-full w-full">
                <button className="border-[2px] border-black px-4 text-sm py-1 rounded-lg">
                  Generate Report
                </button>
              </ul>
            </div>
            <div className="w-full flex flex-col ">
              <div className="text-center border-b-2 border-black h-10 p-1"></div>
              <div className="flex flex-col items-center justify-center h-full w-full">
                <div className=" ">
                  <button className="border-[2px] border-black px-4 text-sm py-1 rounded-lg">
                    Download Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center  rounded-lg w-full  mt-10">
        <p className="self-start pb-14 font-semibold text-xl">
          Schedule Reports
        </p>
        <div className="w-[70vw]  flex flex-col h-[300px] border-2 border-black">
          <p className="h-10"></p>
          <div className="flex border-t-2 border-black h-full">
            <div className="w-full flex flex-col border-r-2 border-black">
              <div className="text-center border-b-2 border-black h-10 font-semibold p-1">
                Frequency
              </div>
              <ul className="flex flex-col items-center justify-center h-full w-full">
                <div className="border-2 border-black rounded-lg p-1 text-sm w-fit px-2 py-1 focus:outline-none ">
                  <select className=" w-full text-sm ">
                    <option disabled selected>
                      Scheduled Frequency
                    </option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </ul>
            </div>
            <div className="w-full flex flex-col border-r-2 border-black">
              <div className="text-center border-b-2 border-black h-10 font-semibold p-1">
                Schedule Time
              </div>
              <div className="flex flex-col items-center justify-center h-full w-full">
                <input
                  type="time"
                  id="time"
                  name="time"
                  className=" py-1 px-1 border-black border-2 rounded-md bg-input text-primary focus:outline-none focus:ring focus:ring-primary w-fit text-sm"
                />
              </div>
            </div>
            <div className="w-full flex flex-col border-r-2 border-black">
              <div className="text-center border-b-2 border-black h-10 font-semibold p-1">
                Recipient
              </div>
              <ul className="flex flex-col items-center justify-center h-full w-full">
                <div className="border-2 border-black rounded-lg p-1 text-sm w-fit px-2 py-1 focus:outline-none ">
                  <select className=" w-full text-sm ">
                    <option disabled selected>
                      Select User
                    </option>
                    <option>User1</option>
                    <option>User2</option>
                    <option>User3</option>
                  </select>
                </div>
              </ul>
            </div>
            <div className="w-full flex flex-col ">
              <div className="text-center border-b-2 border-black h-10 font-semibold p-1"></div>
              <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <div className=" ">
                    <button className="border-[2px] border-black px-4 text-sm py-1 rounded-lg">
                      Activate Schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
