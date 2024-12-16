"use client";

import { Csdata } from "@/qcdata";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import React, { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  scales,
  Colors,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Colors
);

const data = [
  {
    name: "GDP Growth Rate",
    data: [0.5, 2.2, 3.9, 35050, 3425],
  },
  {
    name: "GDP Annual Growth Rate",
    data: [0.7, 2.3, 3.8, 38100, 4178],
  },
  {
    name: "Unemployment Rate",
    data: [2.8, 5.4, 4.8, 28478, 3248],
  },
];

const headers = [
  "Actual",
  "January-March",
  "April-June",
  "July-September",
  "October-December",
];

const page = () => {
  const [filterDate, setFilterDate] = useState("");

  // const selectedMonth = data.find(item => item.data === selectedPeriod)
  return (
    <div>
      <div className="h-12 p-7 bg-gray-300 text-black px-16 flex items-center  font-bold text-xl border-b-2 border-b-black">
        <h2>Quezon City Forecasts</h2>
      </div>
      <div>
        <div className="container mx-auto p-4">
          <div className="flex justify-end mt-5">
            <select
              className="w-fit text-sm border-[2px] border-black p-2 rounded-md flex items-left place-self-start"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="">Date Filter</option>
              <option value="January-March">January - March</option>
              <option value="April-June">April - June</option>
              <option value="July-September">July - September</option>
              <option value="October-December">October - December</option>
            </select>
          </div>

          <div className="flex mt-4">
            <div className="w-1/2 pr-4">
              <h2 className="text-xl font-bold text-center w-full border-black border">
                Overview
              </h2>
              <table className="w-full border-collapse text-md ">
                <thead>
                  <tr>
                    <th className="border border-black px-2 py-1"></th>
                    {headers.map((header) => (
                      <th
                        key={header}
                        className="border text-sm border-black px-2 py-1"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.name}>
                      <td className="border border-black px-2 py-1">
                        {row.name}
                      </td>
                      {row.data.map((value, index) => (
                        <td
                          key={index}
                          className="border border-black px-2 py-1"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-20 text-sm border-[2px] border-black px-4 py-4 rounded-md min-w-[120px] min-h-[390px]">
                <h2 className="text-xl font-bold mb-8 flex flex-col">
                  Analysis
                </h2>
                <p className="text-black text-sm">
                The predicted economic growth in Quezon City is influenced by unemployment rates and a range of 
                demographic factors, such as education level, age, gender, and skills. A multi-linear regression 
                analysis shows how these variables interact to shape the city's economic future. For example, 
                higher unemployment rates typically have a negative impact on economic growth, while higher 
                educational attainment and advanced skill sets tend to correlate with lower unemployment and 
                improved economic conditions. The analysis may show that as educational and skill levels improve, 
                unemployment decreases, which in turn drives positive economic growth. Additionally, factors like 
                age and gender may have varying degrees of influence, highlighting which groups are most affected 
                by employment challenges. By identifying these relationships, the system offers valuable insights 
                for policymakers to implement targeted strategies that can reduce unemployment and enhance the 
                city's economic trajectory.
                </p>
              </div>
            </div>
            <div className="min-w-[100px] text-sm border-[2px] border-black px-4 py-4 rounded-md ">
              <h3 className="text-xl text-center font-bold mb-10 flex flex-col">
                Predicted economic growth influenced by unemployment rates and
                demographic factors.
              </h3>
              <div className="min-w-[200px] min-h-[200px] flex flex-col w-full items-center h-full">
                <div className="w-[500px] h-[500px] ">
                  <Doughnut
                    data={{
                      labels: [
                        "District 1",
                        "District 2",
                        "District 3",
                        "District 4",
                        "District 5",
                        "District 6",
                      ],
                      datasets: [
                        {
                          label: " Unemployed",
                          data: [2648, 468, 726, 820, 960, 426],
                          backgroundColor: [
                            "#257180",
                            "#F2E5BF",
                            "#FD8B51",
                            "#CB6040",
                            "#A5B68D",
                            "#ECDFCC",
                          ],
                          borderColor: [
                            "#257180",
                            "#F2E5BF",
                            "#FD8B51",
                            "#CB6040",
                            "#A5B68D",
                            "#ECDFCC",
                          ],
                          borderWidth: 1,
                        },
                        {
                          label: "Employed",
                          data: [1212, 1526, 360, 780, 626, 1290],
                          backgroundColor: [
                            "#254336",
                            "#6B8A7A",
                            "#B7B597",
                            "#DAD3BE",
                            "#795757",
                            "#8D493A",
                          ],
                          borderColor: [
                            "#254336",
                            "#6B8A7A",
                            "#B7B597",
                            "#DAD3BE",
                            "#795757",
                            "#8D493A",
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            padding: 10,
                          },
                        },
                      },
                      animation: {
                        duration: 2000, // animation duration in milliseconds
                        easing: "easeInOutQuart", // animation easing function
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="mt-6 text-xs border-[2px] border-black px-4 py-4 rounded-md  w-1/2 h-fit">
              <h3 className="text-xl font-bold mb-16 text-center">
                Comparison of unemployment rates across different demographic
                groups.
              </h3>
              <div className="min-w-[200px] min-h-[300px] flex flex-col items-center w-full h-full">
                <div className="w-[500px] h-[472px]">
                  <Bar
                    data={{
                      labels: [
                        "District 1",
                        "District 2",
                        "District 3",
                        "District 4",
                        "District 5",
                        "District 6",
                      ],
                      datasets: [
                        {
                          label: " Unemployed",
                          data: [2648, 468, 726, 820, 960, 320],
                          backgroundColor: [
                            "#257180",
                            "#F2E5BF",
                            "#FD8B51",
                            "#CB6040",
                            "#A5B68D",
                            "#ECDFCC",
                          ],
                          borderColor: [
                            "#257180",
                            "#F2E5BF",
                            "#FD8B51",
                            "#CB6040",
                            "#A5B68D",
                            "#ECDFCC",
                          ],
                          borderWidth: 1,
                        },
                        {
                          label: "Employed",
                          data: [1212, 1526, 360, 780, 626, 926],
                          backgroundColor: [
                            "#257180",
                            "#F2E5BF",
                            "#FD8B51",
                            "#CB6040",
                            "#A5B68D",
                            "#ECDFCC",
                          ],
                          borderColor: [
                            "#257180",
                            "#F2E5BF",
                            "#FD8B51",
                            "#CB6040",
                            "#A5B68D",
                            "#ECDFCC",
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            padding: 10,
                          },
                        },
                      },
                      animation: {
                        duration: 2000, // animation duration in milliseconds
                        easing: "easeInOutQuart", // animation easing function
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 text-xs border-[2px] border-black px-4 py-4 rounded-md  w-1/2 h-fit">
              <h3 className="text-xl font-bold mb-16 text-center">
                Confidence Interval
              </h3>
              <div className="min-w-[200px] min-h-[300px] flex flex-col items-center w-full h-full">
                <div className="w-[500px] h-[500px]">
                  <Bar
                    data={{
                      labels: [
                        "District 1",
                        "District 2",
                        "District 3",
                        "District 4",
                        "District 5",
                        "District 6",
                      ],
                      datasets: [
                        {
                          label: " Unemployed",
                          data: [1260, 468, 726, 820, 960, 345, 681],
                          backgroundColor: [
                            "#257180",
                            "#F2E5BF",
                            "#FD8B51",
                            "#CB6040",
                            "#A5B68D",
                            "#ECDFCC",
                          ],
                          borderColor: [
                            "#257180",
                            "#F2E5BF",
                            "#FD8B51",
                            "#CB6040",
                            "#A5B68D",
                            "#ECDFCC",
                          ],
                          borderWidth: 1,
                        },
                        {
                          label: "Employed",
                          data: [2648, 1526, 360, 780, 626, 1356, 1229],
                          backgroundColor: [
                            "#257180",
                            "#F2E5BF",
                            "#FD8B51",
                            "#CB6040",
                            "#A5B68D",
                            "#ECDFCC",
                          ],
                          borderColor: [
                            "#257180",
                            "#F2E5BF",
                            "#FD8B51",
                            "#CB6040",
                            "#A5B68D",
                            "#ECDFCC",
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            padding: 10,
                          },
                        },
                      },
                      animation: {
                        duration: 2000, // animation duration in milliseconds
                        easing: "easeInOutQuart", // animation easing function
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
