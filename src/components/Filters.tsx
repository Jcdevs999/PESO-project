"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  TooltipItem,
} from "chart.js";
// import { Csdata } from "@/qcdata";
import axios from "axios";
import moment from "moment";
import { Pie, getElementAtEvent, Line } from "react-chartjs-2";
import Doughtnut from "chart.js/auto";
import { Csdata } from "@/qcdata";

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

const chartOptions = {
  plugins: {
    legend: {
      position: "right",
      align: "center",
    },
  },
};

interface DataType {
  Age: number;
  isMale: string;
  SkillsAcquired: string;
  HighestLevel: string;
  DateAdded: string;
}

const Filters = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [skillsOptions, setSkillsOptions] = useState<string[]>([
    "Academic Skills",
    "Accounting Skills",
    "Administrative Skills",
    "Advanced Computer Skills",
    "Agricultural Skills",
    "Airport Operations Manager",
    "Analytical Skills",
    "Assembly Skills",
    "Assessment and Evaluation",
    "Automotive Repair Skills",
    "Automotive Skills",
    "Baking Skills",
    "Beauty and Personal Care Skills",
    "Biology Skills",
    "Business Skills",
    "Career Development Skills",
    "Carpentry",
    "Chemical Engineering Skills",
    "Child Development Skills",
    "Classroom Management",
    "Clerical",
    "Communication Skills",
    "Community Development Skills",
    "Compliance Skills",
    "Computer Aided Design Skills",
    "Computer Literacy",
    "Computer-Aided Design Skills",
    "Construction Management",
    "Construction Skills",
    "Cosmetic and Personal Care Skills",
    "Counselling Skills",
    "Craftmanship",
    "Creative Design",
    "Creative Skills",
    "Culinary Production Skills",
    "Culinary Skills",
    "Customer Service Skills",
    "Data Management",
    "Design Skills",
    "Digital Marketing",
    "Digital Media Skills",
    "Educational Skills",
    "Electrical Skills",
    "Electronics Repair Skills",
    "Engineering Skills",
    "Entrepreneurial Skills",
    "Environmental Skills",
    "Equipment Operation",
    "Event Management Skills",
    "Facility Maintenance Skills",
    "Field Work",
    "Financial Skills",
    "Food & Beverage Skills",
    "Food Safety",
    "General Assistance",
    "General Training Skills",
    "Graphic Design Skills",
    "Health and Emergency Medical Skills",
    "Health and Safety Skills",
    "Health and Wellness Skills",
    "Health provider",
    "Healthcare Service",
    "Healthcare Skills",
    "Heavy Equipment Operation",
    "Hospitality Skills",
    "Housekeeping",
    "Human Resources",
    "HVAC Skills",
    "Interpersonal Skills",
    "Inventory Management",
    "Laborer",
    "Landscape Artist",
    "Laundry",
    "Leadership Skills",
    "Leadman",
    "Learning Skills",
    "Legal",
    "Logistics",
    "Machine Operation",
    "Maintenance Skills",
    "Management Skills",
    "Manual Labor Skills",
    "Manufacturing and Production Skills",
    "Marine Engineering",
    "Maritime Skills",
    "Marketing Skills",
    "Mason",
    "Massage Therapist",
    "Materials Engineer",
    "Mathematical Skills",
    "Meat Cutting and Processing",
    "Mechanical Engineering",
    "Mechanical Skills",
    "Medical Technology",
    "No Skill",
    "Operator",
    "Organizational Skills",
    "Paint Mixing",
    "Painter",
    "Performance Arts",
    "Performing Arts",
    "Pipeline Engineer",
    "Poultry Husbandry",
    "Presentation Skills",
    "Product Knowledge",
    "Production Knowledge",
    "Production",
    "Project Management",
    "Public Health",
    "Public Service",
    "Quality Control",
    "Regulatory Knowledge",
    "Research Skills",
    "Retail Skills",
    "Risk Assessment",
    "Safety",
    "Safety and Emergency Response Skills",
    "Seafaring Skills",
    "Security Skills",
    "Social Services",
    "Soft Skills",
    "Sports Skills",
    "Statistician",
    "Stenography Skills",
    "Strategic Skills",
    "Surveying",
    "System Analytical Skills",
    "Teaching Skills",
    "Technical Skills",
    "Technical Staff",
    "Technical Support",
    "Technician",
    "Telecommunications",
    "Therapeutical Skills",
    "Tool and Equipment Knowledge",
    "Trade Skills",
    "Transportation Skills",
    "Vocational Skills",
    "Welding",
  ]);
  const [startDate, setStartDate] = useState<string>("All");
  const [endDate, setEndDate] = useState<string>("All");
  const [gender, setGender] = useState<string>("All");
  const [ageRange, setAgeRange] = useState<{ from: number; to: number }>({
    from: 18,
    to: 85,
  });
  // const [educationalLevel, setEducationalLevel] = useState<string>("All");
  const [educationalLevel, setEducationalLevel] = useState<string[]>([
    "Elementary Level",
    "Elementary Graduate",
    "Junior High School Level",
    "Junior High School Graduate",
    "Senior High School Level",
    "Senior High School Graduate",
    "Vocational Level",
    "Vocational Graduate",
    "College Level",
    "College Graduate",
  ]);
  const [skills, setSkills] = useState<string>("All");
  const [educ, setEduc] = useState<string>("All");

  // Checkboxes state
  const [acceptAge, setAcceptAge] = useState<boolean>(false);
  const [acceptGender, setAcceptGender] = useState<boolean>(false);
  const [acceptEducational, setAcceptEducational] = useState<boolean>(false);
  const [acceptSkills, setAcceptSkills] = useState<boolean>(false); // Skills checkbox

  // Fetch data from the database (or API) on component mount

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/route");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: DataType[] = await response.json();
       
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchSkills = async () => {
  //     try {
  //       const response = await axios.get("/api/skills");
  //
  //       setSkillsOptions(response.data);
  //     } catch (error) {
  //       console.error("Error fetching skills:", error);
  //     }
  //   };
  //   fetchSkills();
  // }, []);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (
      !acceptGender &&
      !acceptAge &&
      !acceptEducational &&
      !acceptSkills &&
      (startDate === "All" || endDate === "All")
    ) {
      return data;
    }

    return (
      data.filter((item) => {
        const genderMatch =
          !acceptGender || gender === "All" || item.isMale === gender;
        const ageMatch =
          !acceptAge || (item.Age >= ageRange.from && item.Age <= ageRange.to);
        const educationMatch =
          !acceptEducational ||
          educ === "All" ||
          (item.HighestLevel && item.HighestLevel.split(",").includes(educ));
        const skillsMatch =
          !acceptSkills ||
          skills === "All" ||
          (item.SkillsAcquired &&
            item.SkillsAcquired.split(",").includes(skills));
        const itemYear = item.DateAdded ? moment(item.DateAdded).year() : null;
        const startYear = startDate !== "All" ? moment(startDate).year() : null;
        const endYear = endDate !== "All" ? moment(endDate).year() : null;
        let dateMatch = true;

        if (itemYear) {
          if (startYear && !endYear) {
            dateMatch = itemYear >= startYear;
          } else if (!startYear && endYear) {
            dateMatch = itemYear <= endYear;
          } else if (startYear && endYear) {
            dateMatch = itemYear >= startYear && itemYear <= endYear;
          }
        }

       
        return (
          genderMatch && ageMatch && educationMatch && dateMatch && skillsMatch
        );
      }) || []
    );
  }, [
    data,
    gender,
    ageRange,
    educationalLevel,
    skills,
    startDate,
    endDate,
    acceptGender,
    acceptAge,
    acceptEducational,
    acceptSkills,
  ]);

  // Memoized chart data
  const chartData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return {
        datasets: [
          {
            label: "Poll",
            data: [filteredData.length], // Default placeholder value
            backgroundColor: ["#0137ad"], // Single color for total data
            borderColor: ["#000000"],
            borderWidth: 1,
          },
        ],
      };
    }

    const ageRanges = [
      { range: "18-24", count: 0 },
      { range: "25-34", count: 0 },
      { range: "35-44", count: 0 },
      { range: "45-54", count: 0 },
      { range: "55-64", count: 0 },
      { range: "65-74", count: 0 },
      { range: "75-84", count: 0 },
      { range: "85+", count: 0 },
    ];

    filteredData.forEach((item) => {
      const age = item.Age; // Replace with your actual age property
      if (age >= 18 && age <= 24) ageRanges[0].count++;
      else if (age >= 25 && age <= 34) ageRanges[1].count++;
      else if (age >= 35 && age <= 44) ageRanges[2].count++;
      else if (age >= 45 && age <= 54) ageRanges[3].count++;
      else if (age >= 55 && age <= 64) ageRanges[4].count++;
      else if (age >= 65 && age <= 74) ageRanges[5].count++;
      else if (age >= 75 && age <= 84) ageRanges[6].count++;
      else if (age >= 85) ageRanges[7].count++;
    });

    if (acceptAge) {
      return {
        // labels: ageRanges.map(range => range.range),
        datasets: [
          {
            label: `Age Distribution`,
            data: ageRanges.map((range) => range.count),
            backgroundColor: [
              "#2A78C5", // Medium Blue
              "#0137AD", // Dark Blue
              "#D01027", // Darkest Red
              "#FF6B6B", // Warm Red
              "#FF9999", // Soft Red
              "#FFB3B3", // Light Red
            ],
            borderColor: ["#000"],
            borderWidth: 1,
          },
        ],
      };
    }

    const maleCount = filteredData.filter(
      (item) => item.isMale === "Male"
    ).length;
    const femaleCount = filteredData.filter(
      (item) => item.isMale === "Female"
    ).length;

    let chartData = {
      datasets: [
        {
          label: `Poll`,
          data: [filteredData.length],
          backgroundColor: ["#0137AD"], // Single color by default
          borderColor: ["#d01027"],
          borderWidth: 1,
        },
      ],
    };

    if (acceptGender) {
      const genderChartData = {
        datasets: [
          {
            label: `${gender}`,
            data: [maleCount, femaleCount],
            backgroundColor: ["#0137ad", "#d01027"], // Blue for Male, Red for Female
            borderColor: ["#0137ad", "#d01027"],
            borderWidth: 1,
          },
        ],
      };
      if (gender === "All") {
        chartData = {
          // labels: ["Male", "Female"],
          ...genderChartData,
        };
      } else if (gender === "Male") {
        chartData = {
          // labels: ["Male"],
          datasets: [
            {
              ...genderChartData.datasets[0],
              data: [maleCount],
              backgroundColor: ["#0137ad"],
              borderColor: ["#0137ad"],
            },
          ],
        };
      } else if (gender === "Female") {
        chartData = {
          // labels: ["Female"],
          datasets: [
            {
              ...genderChartData.datasets[0],
              data: [femaleCount],
              backgroundColor: ["#d01027"],
              borderColor: ["#d01027"],
            },
          ],
        };
      }
    }

    // if (acceptEducational) {
    // const elementaryLevelCount = filteredData.filter((item) => item.HighestLevel === "Elementary Level").length;
    // const elementaryGraduateCount = filteredData.filter((item) => item.HighestLevel === "Elementary Graduate").length;
    // const juniorhighSchoolLevelCount = filteredData.filter((item) => item.HighestLevel === "Junior High School Level").length;
    // const juniorhighSchoolGraduateCount = filteredData.filter((item) => item.HighestLevel === "Junior High School Graduate").length;
    // const seniorhighSchoolLevelCount = filteredData.filter((item) => item.HighestLevel === "Senior High School Level").length;
    // const seniorhighSchoolGraduateCount = filteredData.filter((item) => item.HighestLevel === "Senior High School Graduate").length;
    // const vocationalLevelCount = filteredData.filter((item) => item.HighestLevel === "Vocational Level").length;
    // const vocationalGraduateCount = filteredData.filter((item) => item.HighestLevel === "Vocational Graduate").length;
    // const collegeLevelCount = filteredData.filter((item) => item.HighestLevel === "College Level").length;
    // const collegeGraduateCount = filteredData.filter((item) => item.HighestLevel === "College Graduate").length;
    if (acceptEducational) {
      const educCounts = educationalLevel.map((educ) => {
        const count = filteredData.reduce((acc, item) => {
          if (
            item.HighestLevel &&
            item.HighestLevel.split(",").includes(educ)
          ) {
            acc += 1;
          }
          return acc;
        }, 0);
        return count;
      });

      chartData = {
        datasets: [
          {
            label: `Poll: Educational Level`,
            data: educCounts,
            backgroundColor: [
              "#A3C6E0", // Lightest Blue
              "#7EB5E4", // Light Blue
              "#4A90E2", // Bright Blue
              "#3B8DD4", // Vivid Blue
              "#2A78C5", // Medium Blue
              "#0137AD", // Dark Blue
              "#FFB3B3", // Light Red
              "#FF9999", // Soft Red
              "#FF6B6B", // Warm Red
              "#D01027", // Darkest Red
            ],
            borderColor: [
            "#FFFFFF",
            ],
            borderWidth: 2,
          },
        ],
      };
    }

    if (acceptSkills) {
      const skillCounts = skillsOptions.map((skill) => {
        const count = filteredData.reduce((acc, item) => {
          if (
            item.SkillsAcquired &&
            item.SkillsAcquired.split(",").includes(skill)
          ) {
            acc += 1;
          }
          return acc;
        }, 0);
        return count;
      });

      chartData = {
        // labels: skillsOptions,
        datasets: [
          {
            label: `Poll: Skills`,
            data: skillCounts,
            backgroundColor: [
              "#A3C6E0", // Lightest Blue
              "#7EB5E4", // Light Blue
              "#4A90E2", // Bright Blue
              "#3B8DD4", // Vivid Blue
              "#2A78C5", // Medium Blue
              "#0137AD", // Dark Blue
              "#FFB3B3", // Light Red
              "#FF9999", // Soft Red
              "#FF6B6B", // Warm Red
              "#D01027", // Darkest Red
            ],
            borderColor: ["#FFFFFF"], // Black border for visibility
            borderWidth: 2,
          },
        ],
      };
    }
    return chartData;
  }, [
    filteredData,
    gender,
    acceptGender,
    educationalLevel,
    acceptEducational,
    skills,
    acceptSkills,
    skillsOptions,
  ]);

  // Handlers for checkboxes
  const handleAgeChecked = () => setAcceptAge(!acceptAge);
  const handleGenderChecked = () => setAcceptGender(!acceptGender);
  const handleEducationalChecked = () =>
    setAcceptEducational(!acceptEducational);
  const handleSkillsChecked = () => setAcceptSkills(!acceptSkills);
  const handleAgeRange = (key: "from" | "to", value: number) => {
    setAgeRange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="gap-5 px-5 py-5 mb-5 grid grid-cols-[500px_1fr]">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="border-gray-500 border-2 rounded-lg shadow-md hover:shadow-2xl transition-shadow flex flex-col items-end gap-5 px-5 py-5 "
        >
          <div className="w-full">
            <h1 className="text-xl font-bold">Filters</h1>
            <div>
              <div>
                <p className="font-semibold mt-8 mb-2">Date Range:</p>
                <div className="flex items-center justify-center py-2">
                  <div className="w-fit text-sm border-[1px] border-blue-400 px-2 py-1 rounded-md">
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <span className="w-[50px] border-b-[1px] border-black"></span>
                  <div className="w-fit text-sm border-[1px] border-blue-400 px-2 py-1 rounded-md">
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <p className="font-semibold mt-4">
                    Select Demographic Range:
                  </p>
                  <div className="flex flex-col gap-2 pl-[60px]">
                    <ul className="py-4 gap-0 p-12">
                      <li className="flex gap-2">
                        <input
                          type="checkbox"
                          id="age"
                          onChange={handleAgeChecked}
                        />{" "}
                        Age
                      </li>
                      <li className="flex gap-2">
                        <input
                          type="checkbox"
                          id="gender"
                          onChange={handleGenderChecked}
                        />{" "}
                        Sex
                      </li>
                      <li className="flex gap-2">
                        <input
                          type="checkbox"
                          id="educationalLevel"
                          onChange={handleEducationalChecked}
                        />
                        Educational Level
                      </li>
                      <li className="flex gap-2">
                        <input
                          type="checkbox"
                          id="gender"
                          onChange={handleSkillsChecked}
                        />{" "}
                        Skills
                      </li>
                    </ul>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-4">Age Range:</p>
                  <div className="flex pl-[60px] items-center">
                    <div className="h-[50px] w-[50px] border-[1px] border-black text-sm">
                      <input
                        type="number"
                        disabled={!acceptAge}
                        id="ageRangeFrom"
                        placeholder="0"
                        value={ageRange.from}
                        onChange={(e) =>
                          handleAgeRange("from", parseInt(e.target.value, 10))
                        }
                        className="h-full w-full text-center"
                      />
                    </div>
                    <span className="border-b-[1px] border-black w-[30px]"></span>

                    <div className="h-[50px] w-[50px] border-[1px] border-black text-sm">
                      <input
                        type="number"
                        disabled={!acceptAge}
                        id="ageRangeTo"
                        placeholder="0"
                        value={ageRange.to}
                        onChange={(e) =>
                          handleAgeRange("to", parseInt(e.target.value, 10))
                        }
                        className="h-full w-full text-center"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-4 mt-4">Sex:</p>
                    <div className="w-full pl-[60px]">
                      <div className="border-[1px] border-black rounded-md w-fit px-2 py-1 mb-4 text-sm">
                        <select
                          id="gender"
                          disabled={!acceptGender}
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value="All">All</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold mb-4">Education Level:</p>
                    <div className="w-full pl-[60px]">
                      <div className="border-[1px] border-black rounded-md w-fit px-2 py-1 text-sm">
                        <select
                          id="educationalLevel"
                          disabled={!acceptEducational}
                          value={educ}
                          onChange={(e) => setEduc(e.target.value)}
                        >
                          <option value="All">All</option>
                          <option value="Elementary Level">
                            Elementary Level
                          </option>
                          <option value="Elementary Graduate">
                            Elementary Graduate
                          </option>
                          <option value="Junior High School Level">
                            Junior High School Level
                          </option>
                          <option value="Junior High School Graduate">
                            Junior High School Graduate
                          </option>
                          <option value="Senior High School Level">
                            Senior High School Level
                          </option>
                          <option value="Senior High School Graduate">
                            Senior High School Graduate
                          </option>
                          <option value="Vocational Level">
                            Vocational Level
                          </option>
                          <option value="Vocational Graduate">
                            Vocational Graduate
                          </option>
                          <option value="College Level">College Level</option>
                          <option value="College Graduate">
                            College Graduate
                          </option>
                        </select>
                      </div>
                    </div>

                    <p className="font-semibold mb-4 mt-4">Skills:</p>
                    <div className="w-full pl-[60px]">
                      <div className="border-[1px] border-black rounded-md w-fit px-2 py-1 mb-4 text-sm">
                        <select
                          id="skills"
                          disabled={!acceptSkills}
                          value={skills}
                          onChange={(e) => {
                            setSkills(e.target.value);
                          }}
                          className="w-full"
                        >
                          <option value="All">All</option>
                          <option value="Academic Skills">
                            Academic Skills
                          </option>
                          <option value="Accounting Skills">
                            Accounting Skills
                          </option>
                          <option value="Administrative Skills">
                            Administrative Skills
                          </option>
                          <option value="Advanced Computer Skills">
                            Advanced Computer Skills
                          </option>
                          <option value="Agricultural Skills">
                            Agricultural Skills
                          </option>
                          <option value="Airport Operations Manager">
                            Airport Operations Manager
                          </option>
                          <option value="Analytical Skills">
                            Analytical Skills
                          </option>
                          <option value="Assembly Skills">
                            Assembly Skills
                          </option>
                          <option value="Assessment and Evaluation">
                            Assessment and Evaluation
                          </option>
                          <option value="Automotive Repair Skills">
                            Automotive Repair Skills
                          </option>
                          <option value="Automotive Skills">
                            Automotive Skills
                          </option>
                          <option value="Baking Skills">Baking Skills</option>
                          <option value="Beauty and Personal Care Skills">
                            Beauty and Personal Care Skills
                          </option>
                          <option value="Biology Skills">Biology Skills</option>
                          <option value="Business Skills">
                            Business Skills
                          </option>
                          <option value="Career Development Skills">
                            Career Development Skills
                          </option>
                          <option value="Carpentry">Carpentry</option>
                          <option value="Chemical Engineering Skills">
                            Chemical Engineering Skills
                          </option>
                          <option value="Child Development Skills">
                            Child Development Skills
                          </option>
                          <option value="Classroom Management">
                            Classroom Management
                          </option>
                          <option value="Clerical">Clerical</option>
                          <option value="Communication Skills">
                            Communication Skills
                          </option>
                          <option value="Community Development Skills">
                            Community Development Skills
                          </option>
                          <option value="Compliance Skills">
                            Compliance Skills
                          </option>
                          <option value="Computer Aided Design Skills">
                            Computer Aided Design Skills
                          </option>
                          <option value="Computer Literacy">
                            Computer Literacy
                          </option>
                          <option value="Computer-Aided Design Skills">
                            Computer-Aided Design Skills
                          </option>
                          <option value="Construction Management">
                            Construction Management
                          </option>
                          <option value="Construction Skills">
                            Construction Skills
                          </option>
                          <option value="Cosmetic and Personal Care Skills">
                            Cosmetic and Personal Care Skills
                          </option>
                          <option value="Counselling Skills">
                            Counselling Skills
                          </option>
                          <option value="Craftmanship">Craftmanship</option>
                          <option value="Creative Design">
                            Creative Design
                          </option>
                          <option value="Creative Skills">
                            Creative Skills
                          </option>
                          <option value="Culinary Production Skills">
                            Culinary Production Skills
                          </option>
                          <option value="Culinary Skills">
                            Culinary Skills
                          </option>
                          <option value="Customer Service Skills">
                            Customer Service Skills
                          </option>
                          <option value="Data Management">
                            Data Management
                          </option>
                          <option value="Design Skills">Design Skills</option>
                          <option value="Digital Marketing">
                            Digital Marketing
                          </option>
                          <option value="Digital Media Skills">
                            Digital Media Skills
                          </option>
                          <option value="Educational Skills">
                            Educational Skills
                          </option>
                          <option value="Electrical Skills">
                            Electrical Skills
                          </option>
                          <option value="Electronics Repair Skills">
                            Electronics Repair Skills
                          </option>
                          <option value="Engineering Skills">
                            Engineering Skills
                          </option>
                          <option value="Entrepreneurial Skills">
                            Entrepreneurial Skills
                          </option>
                          <option value="Environmental Skills">
                            Environmental Skills
                          </option>
                          <option value="Equipment Operation">
                            Equipment Operation
                          </option>
                          <option value="Event Management Skills">
                            Event Management Skills
                          </option>
                          <option value="Facility Maintenance Skills">
                            Facility Maintenance Skills
                          </option>
                          <option value="Field Work">Field Work</option>
                          <option value="Financial Skills">
                            Financial Skills
                          </option>
                          <option value="Food & Beverage Skills">
                            Food & Beverage Skills
                          </option>
                          <option value="Food Safety">Food Safety</option>
                          <option value="General Assistance">
                            General Assistance
                          </option>
                          <option value="General Training Skills">
                            General Training Skills
                          </option>
                          <option value="Graphic Design Skills">
                            Graphic Design Skills
                          </option>
                          <option value="Health and Emergency Medical Skills">
                            Health and Emergency Medical Skills
                          </option>
                          <option value="Health and Safety Skills">
                            Health and Safety Skills
                          </option>
                          <option value="Health and Wellness Skills">
                            Health and Wellness Skills
                          </option>
                          <option value="Health provider">
                            Health provider
                          </option>
                          <option value="Healthcare Service">
                            Healthcare Service
                          </option>
                          <option value="Healthcare Skills">
                            Healthcare Skills
                          </option>
                          <option value="Heavy Equipment Operation">
                            Heavy Equipment Operation
                          </option>
                          <option value="Hospitality Skills">
                            Hospitality Skills
                          </option>
                          <option value="Housekeeping">Housekeeping</option>
                          <option value="Human Resources">
                            Human Resources
                          </option>
                          <option value="HVAC Skills">HVAC Skills</option>
                          <option value="Interpersonal Skills">
                            Interpersonal Skills
                          </option>
                          <option value="Inventory Management">
                            Inventory Management
                          </option>
                          <option value="Laborer">Laborer</option>
                          <option value="Landscape Artist">
                            Landscape Artist
                          </option>
                          <option value="Laundry">Laundry</option>
                          <option value="Leadership Skills">
                            Leadership Skills
                          </option>
                          <option value="Leadman">Leadman</option>
                          <option value="Learning Skills">
                            Learning Skills
                          </option>
                          <option value="Legal">Legal</option>
                          <option value="Logistics">Logistics</option>
                          <option value="Machine Operation">
                            Machine Operation
                          </option>
                          <option value="Maintenance Skills">
                            Maintenance Skills
                          </option>
                          <option value="Management Skills">
                            Management Skills
                          </option>
                          <option value="Manual Labor Skills">
                            Manual Labor Skills
                          </option>
                          <option value="Manufacturing and Production Skills">
                            Manufacturing and Production Skills
                          </option>
                          <option value="Marine Engineering">
                            Marine Engineering
                          </option>
                          <option value="Maritime Skills">
                            Maritime Skills
                          </option>
                          <option value="Marketing Skills">
                            Marketing Skills
                          </option>
                          <option value="Mason">Mason</option>
                          <option value="Massage Therapist">
                            Massage Therapist
                          </option>
                          <option value="Materials Engineer">
                            Materials Engineer
                          </option>
                          <option value="Mathematical Skills">
                            Mathematical Skills
                          </option>
                          <option value="Meat Cutting and Processing">
                            Meat Cutting and Processing
                          </option>
                          <option value="Mechanical Engineering">
                            Mechanical Engineering
                          </option>
                          <option value="Mechanical Skills">
                            Mechanical Skills
                          </option>
                          <option value="Medical Technology">
                            Medical Technology
                          </option>
                          <option value="No Skill">No Skill</option>
                          <option value="Operator">Operator</option>
                          <option value="Organizational Skills">
                            Organizational Skills
                          </option>
                          <option value="Paint Mixing">Paint Mixing</option>
                          <option value="Painter">Painter</option>
                          <option value="Performance Arts">
                            Performance Arts
                          </option>
                          <option value="Performing Arts">
                            Performing Arts
                          </option>
                          <option value="Pipeline Engineer">
                            Pipeline Engineer
                          </option>
                          <option value="Poultry Husbandry">
                            Poultry Husbandry
                          </option>
                          <option value="Presentation Skills">
                            Presentation Skills
                          </option>
                          <option value="Product Knowledge">
                            Product Knowledge
                          </option>
                          <option value="Production Knowledge">
                            Production Knowledge
                          </option>
                          <option value="Production">Production</option>
                          <option value="Project Management">
                            Project Management
                          </option>
                          <option value="Public Health">Public Health</option>
                          <option value="Public Service">Public Service</option>
                          <option value="Quality Control">
                            Quality Control
                          </option>
                          <option value="Regulatory Knowledge">
                            Regulatory Knowledge
                          </option>
                          <option value="Research Skills">
                            Research Skills
                          </option>
                          <option value="Retail Skills">Retail Skills</option>
                          <option value="Risk Assessment">
                            Risk Assessment
                          </option>
                          <option value="Safety">Safety</option>
                          <option value="Safety and Emergency Response Skills">
                            Safety and Emergency Response Skills
                          </option>
                          <option value="Seafaring Skills">
                            Seafaring Skills
                          </option>
                          <option value="Security Skills">
                            Security Skills
                          </option>
                          <option value="Social Services">
                            Social Services
                          </option>
                          <option value="Soft Skills">Soft Skills</option>
                          <option value="Sports Skills">Sports Skills</option>
                          <option value="Statistician">Statistician</option>
                          <option value="Stenography Skills">
                            Stenography Skills
                          </option>
                          <option value="Strategic Skills">
                            Strategic Skills
                          </option>
                          <option value="Surveying">Surveying</option>
                          <option value="System Analytical Skills">
                            System Analytical Skills
                          </option>
                          <option value="Teaching Skills">
                            Teaching Skills
                          </option>
                          <option value="Technical Skills">
                            Technical Skills
                          </option>
                          <option value="Technical Staff">
                            Technical Staff
                          </option>
                          <option value="Technical Support">
                            Technical Support
                          </option>
                          <option value="Technician">Technician</option>
                          <option value="Telecommunications">
                            Telecommunications
                          </option>
                          <option value="Therapeutical Skills">
                            Therapeutical Skills
                          </option>
                          <option value="Tool and Equipment Knowledge">
                            Tool and Equipment Knowledge
                          </option>
                          <option value="Trade Skills">Trade Skills</option>
                          <option value="Transportation Skills">
                            Transportation Skills
                          </option>
                          <option value="Vocational Skills">
                            Vocational Skills
                          </option>
                          <option value="Welding">Welding</option>

                          {/* <option value="All">All Skills</option>
                          {skillsOptions.map((skill, index) => (
                            <option key={index} value={skill}>
                              {skill}
                            </option>
                          ))} */}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
          {/* <div>
            <button
              className="bg-gray-700 px-5 py-2 rounded-md text-white"
              type="submit"
            >
              Submit
            </button>
          </div> */}
        </form>
        <div className="border-gray-500 border-2 rounded-lg shadow-md hover:shadow-2xl transition-shadow flex flex-col items-start gap-5 px-5 py-5 ">
          <div className="min-w-[200px] min-h-[300px] flex flex-col items-center w-full justify-center h-full">
            <div className="w-[600px] h-[600px] chart-container">
              <Pie data={chartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
