"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LayoutItem } from "@/types/index";
import { Bar, Line, Scatter } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import * as tf from "@tensorflow/tfjs";
import ReactDOM from "react-dom";
import ChartLoadingState from "./ChartLoadingState";
import ReactApexChart from "react-apexcharts";
import { BubbleDataPoint, ChartData, Point } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
  ScatterController,
  LineController,
  PointElement,
  ChartType,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
  ScatterController,
  LineController,
  PointElement,
);

interface ApexChartState {
  series: {
    name: string;
    data: number[];
  }[];
  options: {
    chart: {
      height: number;
      type: "heatmap"; // specify the type as 'heatmap'
    };
    plotOptions: {
      heatmap: {
        shadeIntensity: number;
        radius: number;
        useFillColorAsStroke: boolean;
        colorScale: {
          ranges: {
            from: number;
            to: number;
            name: string;
            color: string;
          }[];
        };
      };
    };
    dataLabels: {
      enabled: boolean;
    };
    stroke: {
      width: number;
    };
    title: {
      text: string;
    };
  };
}

interface GDPData {
  year: string;
  actualGDP: number;
}

  const admindbPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isGDPLoading, setIsGDPLoading] = useState(true);
  const [isEducationLoading, setIsEducationLoading] = useState(true);
  const [isAgeLoading, setIsAgeLoading] = useState(true);
    const [unemploymentChartData, setUnemploymentChartData] = useState<ChartData>({
    labels: ["2024", "2025", "2026"], // Update this dynamically if needed
    datasets: [
      {
        label: "Unemployment Predictions",
        data: [],
        backgroundColor: "#c0161b", 
        borderColor: "#c0161b", 
        borderWidth: 1.5,
      },
      {
        label: "Predicted GDP Growth",
        data: [],
        backgroundColor: "rgb(1, 55, 173)",
        borderColor: "rgb(1, 55, 173)",
        borderWidth: 1.5,
      },
    {
      label: "Female Unemployment Predictions",
      data: [], 
      backgroundColor: "rgb(255, 107, 107)", 
      borderColor: "rgb(255, 107, 107)",
      borderWidth: 1.5,
  },
  {
      label: "Male Unemployment Predictions",
      data: [], 
      backgroundColor: "rgb(59, 142, 211)",
      borderColor: "rgb(59, 142, 212)",
      borderWidth: 1.5,
  },
  {
      label: "Educational Attainment Predictions",
      data: [], 
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
  },

    ],
  });

  const [gdpChartData, setGdpChartData] = useState<ChartData>({
    labels: ["2024", "2025", "2026"], // Update this dynamically if needed
    datasets: [
      {
        label: "GDP Economic Growth",
        data: [],
        backgroundColor: "rgba(192, 22, 27, 0.2)",
        borderColor: "rgba(192, 22, 27, 1)",
        borderWidth: 1,
      },
      {
        label: "Predicted GDP Growth",
        data: [],
        backgroundColor: "rgba(1, 55, 173, 0.2)",
        borderColor: "rgba(1, 55, 173, 1)",
        borderWidth: 1,
      },
    ],
  });

  interface AgeGroup {
    ageRange: string;
    totalUnemployed: number;
  }

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch total unemployed and labor force
      const response = await axios.get("/api/laborforce");
      const latestData = response.data[0]; // Assuming the last entry is the most recent year
      const totalUnemployed = latestData.totalUnemployed; 
      const totalLaborForce = latestData.totalLF; 
      const unemploymentRate = latestData.unemploy_Rate / 100; // Convert to decimal
      const unemploymentRateValues = latestData.unemploy_Rate; 

      // Fetch historical unemployment data
      const trainingResponse = await axios.get("/api/nojob");
      const trainUnemployed = trainingResponse.data.unemployed; 
      const trainYears = trainingResponse.data.years; 

      // // Fetch gender data
      const genderResponse = await axios.get("/api/genderData");
      const genderData = genderResponse.data;



      // Fetch educational attainment data
      const educationalResponse = await axios.get("/api/educData");
      const educationalData = educationalResponse.data;



       // Fetch age data
       const ageResponse = await axios.get("/api/age");
       const ageData: AgeGroup[] = ageResponse.data;

      // Fetch GDP data
      const gdpResponse = await axios.get("/api/gdp");
      const gdpYears = gdpResponse.data.years; 
      const gdpValues = gdpResponse.data.values; 

      // Normalization
      const maxYear = Math.max(...trainYears);
      const minYear = Math.min(...trainYears);
      const normalizedTrainYears = trainYears.map(
        (year: number) => (year - minYear) / (maxYear - minYear)
      );

      const maxUnemployed = Math.max(...trainUnemployed);
      const minUnemployed = Math.min(...trainUnemployed);
      const normalizedTrainUnemployed = trainUnemployed.map(
        (unemployed: number) => (unemployed - minUnemployed) / (maxUnemployed - minUnemployed)
      );

      const maxGdpValue = Math.max(...gdpValues);
      const minGdpValue = Math.min(...gdpValues);
      const normalizedGdpValues = gdpValues.map(
        (value: number) => (value - minGdpValue) / (maxGdpValue - minGdpValue)
      );

      // Create tensors
      const trainYearsTensor = tf.tensor(normalizedTrainYears, [normalizedTrainYears.length, 1]);
      const trainUnemployedTensor = tf.tensor(normalizedTrainUnemployed, [normalizedTrainUnemployed.length, 1]);

      // TensorFlow Model with L2 Regularization (Ridge Regression)
      const model = tf.sequential();
      model.add(tf.layers.dense({
          units: 64,
          inputShape: [1],
          activation: 'relu',
      }));
      model.add(tf.layers.dense({
          units: 32,
          activation: 'relu',
      }));
      model.add(tf.layers.dense({
          units: 1,
          activation: 'linear',
      }));
      model.compile({
        optimizer: tf.train.adam(),
        loss: "meanAbsoluteError",
      });

      // Train the model
      await model.fit(trainYearsTensor, trainUnemployedTensor, { epochs: 200 });

      // Predicting future years (2024, 2025, 2026)
      const futureYears = [2024, 2025, 2026];
      const normalizedFutureYears = futureYears.map(
        (year) => (year - minYear) / (maxYear - minYear)
      );
      const predictions = model.predict(
        tf.tensor(normalizedFutureYears, [normalizedFutureYears.length, 1])
      ) as tf.Tensor;

      // Denormalize predictions
      const denormalizedPredictions = Array.from(predictions.dataSync()).map((value) => {
        const denormalizedValue =
          value * (maxUnemployed - minUnemployed) + minUnemployed;
        return Math.round(denormalizedValue); 
      });

      // GDP Growth Calculation based on unemployment predictions
      const baseGDP = gdpValues[gdpValues.length - 1]; 
      const coefficient = 1.0 - unemploymentRate; 

      const gdpGrowthData = denormalizedPredictions.map((unemployed) => {
        if (totalLaborForce === 0) {
          console.error("Total Labor Force is zero. Cannot calculate unemployment rate.");
          return baseGDP; 
        }

        const adjustedUnemploymentRate = unemployed / totalLaborForce; 
        const gdp = baseGDP * (1 - (adjustedUnemploymentRate * coefficient));
        return gdp > 0 ? gdp : 0; 
      });

      // Calculate male and female unemployment predictions
      const maleUnemploymentPredictions = denormalizedPredictions.map(
        (totalPrediction) => Math.round(totalPrediction * 0.25) // Assuming male unemployment is 50% of total
      );
      const femaleUnemploymentPredictions = denormalizedPredictions.map(
        (totalPrediction) => Math.round(totalPrediction * 0.75) // Assuming female unemployment is 50% of total
      );

      // Calculate the total unemployment prediction (male + female)
      const totalUnemploymentPredictions = maleUnemploymentPredictions.map(
        (male, index) => male + femaleUnemploymentPredictions[index]
      );

       // Modified educational attainment unemployment predictions
       const educationalUnemploymentRate = {
        Vocational: educationalData.find((item: { educationalAttainment: string; }) => item.educationalAttainment === "Vocational Level")?.totalUnemployed / totalUnemployed || 0,
        College: educationalData.find((item: { educationalAttainment: string; }) => item.educationalAttainment === "College Level")?.totalUnemployed / totalUnemployed || 0,
        HighSchool: educationalData.find((item: { educationalAttainment: string; }) => item.educationalAttainment === "High School Level")?.totalUnemployed / totalUnemployed || 0,
    };

    // Ensure educational rates sum to 1
    const totalEducRate = educationalUnemploymentRate.Vocational + 
                        educationalUnemploymentRate.College + 
                        educationalUnemploymentRate.HighSchool;
    if (totalEducRate !== 0) {
        educationalUnemploymentRate.Vocational /= totalEducRate;
        educationalUnemploymentRate.College /= totalEducRate;
        educationalUnemploymentRate.HighSchool /= totalEducRate;
    }

    const educationalPredictions = denormalizedPredictions.map((totalUnemployed) => ({
        Vocational: totalUnemployed * educationalUnemploymentRate.Vocational,
        College: totalUnemployed * educationalUnemploymentRate.College,
        HighSchool: totalUnemployed * educationalUnemploymentRate.HighSchool,
    }));

  // Calculate age group unemployment rates
  const ageGroupRates = {
    '15-24': (ageData.find(item => item.ageRange === "15-24")?.totalUnemployed ?? 0) / totalUnemployed || 0,
    '25-34': (ageData.find(item => item.ageRange === "25-34")?.totalUnemployed ?? 0) / totalUnemployed || 0,
    '35-44': (ageData.find(item => item.ageRange === "35-44")?.totalUnemployed ?? 0) / totalUnemployed || 0,
    '45plus': (ageData.find(item => item.ageRange === "45+")?.totalUnemployed ?? 0) / totalUnemployed || 0,
};

// Normalize age group rates
const totalAgeRate = Object.values(ageGroupRates).reduce((sum, rate) => sum + rate, 0);
if (totalAgeRate !== 0) {
    Object.keys(ageGroupRates).forEach(key => {
        ageGroupRates[key as keyof typeof ageGroupRates] /= totalAgeRate;
    });
}

// Calculate age group predictions
const ageGroupPredictions = denormalizedPredictions.map(totalUnemployed => ({
    '15-24': totalUnemployed * ageGroupRates['15-24'],
    '25-34': totalUnemployed * ageGroupRates['25-34'],
    '35-44': totalUnemployed * ageGroupRates['35-44'],
    '45plus': totalUnemployed * ageGroupRates['45plus'],
}));



      // Update unemployment chart data
      setUnemploymentChartData((prev) => ({
        ...prev,
        labels: futureYears, // Update labels to future years
        datasets: [
          {
            ...prev.datasets[0],
            data: denormalizedPredictions, // Unemployed predictions for future years
          },
          {
            ...prev.datasets[1],
            data: gdpGrowthData, // Unemployed predictions for future years
          },

          {
            ...prev.datasets[2], // Male Unemployment Predictions dataset
            data: femaleUnemploymentPredictions,
          },
          {
            ...prev.datasets[3], // Female Unemployment Predictions dataset
            data: maleUnemploymentPredictions,
          },        

        {
            ...prev.datasets[4], // Educational attainment predictions dataset
            data:educationalPredictions.map(pred => 
              pred.Vocational + pred.HighSchool + pred.College
            ), // Educational attainment unemployment data
        },


        ],
      }));

      // Update GDP chart data
      setGdpChartData((prev) => ({
        ...prev,
        labels: futureYears, 
        datasets: [
          {
            ...prev.datasets[0],
            data: gdpGrowthData, 
          },
          {
            ...prev.datasets[1],
            data: gdpValues.slice(-3),
          },
          {
            ...prev.datasets[2],
            data: unemploymentRateValues,
          },
        ],
      }));

      // Return the GDP growth data for further use if needed
      return gdpGrowthData; 

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setIsLoading(false);
      return [];
    }


  };

  useEffect(() => {
    fetchData();
  }, []);

  interface DataItem{
    isMale: string;
    HighestLevel: string;
    Age: number;
  }

  const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0 });
  const [educationCounts, setEducationCounts] = useState({
    elementaryLevel: 0,
    elementaryGraduate: 0,
    juniorhighschoolLevel: 0,
    juniorhighschoolGraduate: 0,
    seniorhighschoolLevel: 0,
    seniorhighschoolGraduate: 0,
    vocationalLevel: 0,
    vocationalGraduate: 0,
    collegeLevel: 0,
    collegeGraduate: 0,
  });

  const [ageCounts, setAgeCounts] = useState({
    "18-25": 0,
    "26-40": 0,
    "41-55": 0,
    "55-70": 0,
    "71-90": 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/route'); // Fetch data from your API
        const data = response.data;

        // Count all males and females
        const genderCounts = data.reduce((acc: { male: number; female: number; }, item: DataItem) => {
          if (item.isMale === "Male") {
            acc.male++;
          } else if (item.isMale === "Female") {
            acc.female++;
          }
          return acc;
        }, { male: 0, female: 0 });

        // Count education levels
        const educationCounts = data.reduce((acc: { [key: string]: number; }, item: DataItem) => {
             if (item.HighestLevel === "Elementary Level") {
            acc.elementaryLevel++;
          } else if (item.HighestLevel === "Elementary Graduate") {
            acc.elementaryGraduate++;
          } else if (item.HighestLevel === "Junior High School Level") {
            acc.juniorhighschoolLevel++;
          } else if (item.HighestLevel === "Junior High School Graduate") {
            acc.juniorhighschoolGraduate++;
          } else if (item.HighestLevel === "Senior High School Level") {
            acc.seniorhighschoolLevel++;    
          } else if (item.HighestLevel === "Senior High School Graduate") {
            acc.seniorhighschoolGraduate++;
          } else if (item.HighestLevel === "Vocational Level") {
            acc.vocationalLevel++;  
          } else if (item.HighestLevel === "Vocational Graduate") {
            acc.vocationalGraduate++;
          } else if (item.HighestLevel === "College Level") {
            acc.collegeLevel++;
          } else if (item.HighestLevel === "College Graduate") {
            acc.collegeGraduate++;
          } 
          return acc;
        }, {
          elementaryLevel: 0,
          elementaryGraduate: 0,
          juniorhighschoolLevel: 0,
          juniorhighschoolGraduate: 0,
          seniorhighschoolLevel: 0,
          seniorhighschoolGraduate: 0,
          vocationalLevel: 0,
          vocationalGraduate: 0,
          collegeLevel: 0,
          collegeGraduate: 0,
        });

        // Count age groups
        const ageCounts = data.reduce((acc: { [key: string]: number; }, item: DataItem) => {
          const age = item.Age;
          if (age >= 18 && age <= 25) {
            acc["18-25"]++;
          } else if (age >= 26 && age <= 40) {
            acc["26-40"]++;
          } else if (age >= 41 && age <= 55) {
            acc["41-55"]++;
          } else if (age >= 55 && age <= 70) {
            acc["55-70"]++;
          } else if (age >= 71 && age <= 90) {
            acc["71-90"]++;
          }
          return acc;
        }, {
          "18-25": 0,
          "26-40": 0,
          "41-55": 0,
          "55-70": 0,
          "71-90": 0,
        });

        console.log('Gender Counts:', genderCounts); 
        console.log('Education Counts:', educationCounts); 
        console.log('Age Counts:', ageCounts); 

        setGenderCounts(genderCounts); 
        setEducationCounts(educationCounts);
        setIsEducationLoading(false); 
        setAgeCounts(ageCounts); 
        setIsAgeLoading(false);
        setIsGDPLoading(false);
        setIsLoading(false);
        
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsEducationLoading(false);
        setIsAgeLoading(false);
        setIsGDPLoading(false);
        setIsLoading(false);
      }
    };

    fetchData(); // Call the function to fetch data
  }, []);

  let chartData = educationCounts
    ? Object.entries(educationCounts).map(([label, value]) => ({
        label,
        value,
      }))
    : [];

  const chartDataDummy = educationCounts
    ? {
        labels: [
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

        ],
        datasets: [
          {
            label: `Poll`,
            data: chartData.map((item) => item.value),
            backgroundColor: [
              "#FF573380",  // Soft Orange
              "#33FF5780",  // Light Green
              "#3357FF80",  // Sky Blue
              "#FF33AA80",  // Pink
              "#FFD13380",  // Golden Yellow
              "#8D33FF80",  // Purple
              "#33FFF180",  // Cyan
              "#FF963380",  // Peach
              "#A8FF3380",  // Lime Green
              "#FF336080",  // Rosy Red
            ],
            borderColor: [
              "#FF573380",  // Soft Orange
              "#33FF5780",  // Light Green
              "#3357FF80",  // Sky Blue
              "#FF33AA80",  // Pink
              "#FFD13380",  // Golden Yellow
              "#8D33FF80",  // Purple
              "#33FFF180",  // Cyan
              "#FF963380",  // Peach
              "#A8FF3380",  // Lime Green
              "#FF336080",  // Rosy Red
            ],
          },
        ],
      }
    : {
        labels: [],
        datasets: [],
      };

  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        display: true,
      },
      font: {
        size: 14,
      },
      legend: {
        display: false,
      },
    },
  };

  const ageChartData = ageCounts
    ? {
        labels: Object.keys(ageCounts),
        datasets: [
          {
            label: "Age Range",
            data: Object.values(ageCounts),
            backgroundColor: [
              "#A3C6E0",  // Light Blue
              "#4A90E2",  // Bright Blue
              "#0137AD",  // Dark Blue
              "#FF9999",  // Soft Red
              "#D01027",  // Darkest Red
            ],
            borderColor: [
              "#A3C6E0",  // Light Blue
              "#4A90E2",  // Bright Blue
              "#0137AD",  // Dark Blue
              "#FF9999",  // Soft Red
              "#D01027",  // Darkest Red
            ],
          },
        ],
      }
    : {
        labels: [],
        datasets: [],
      };

  const ageOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        display: true,
      },
      font: {
        size: 14,
      },
      legend: {
        display: false,
      },
    },
    width: 50,
    height: 50,
  };

  const ApexChart = () => {
    const [series, setSeries] = useState([
      {
        name: "Economic Growth",
        data: [0, 0, 0, 0, 0, 1.0],
      },
      {
        name: "Unemployment",
        data: [0.0, -1.0, 0.3, 0, 1.0, 0],
      },
      {
        name: "Skills",
        data: [0, 0, 0, 1.0, 0, 0],
      },
      
  {
        name: "Educational Attainment",
        data: [-0.1, -0.3, 1.0, 0, 0, 0],
      },
      {
        name: "Sex",
        data: [0, 1.0, 0, 0, 0, 0],
      },
      {
        name: "Age",
        data: [1.0, 0, 0, 0, 0, 0],
      }, 
    ])

    const [options, setOptions] = useState({
      chart: {
        height: 350,
        type: "heatmap" as const,
        toolbar: {
          show: false,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          radius: 0,
          useFillColorAsStroke: true,
          colorScale: {
            ranges: [
              {
                from: -0.5,
                to: -0.1,
                name: "negligible",
                color: "#F8D1CD",
              },
              {
                from: -1.0,
                to: -0.6,
                name: "low",
                color: "#F0A8AB",
              },
              {
                from: 0.0,
                to: 0.0,
                name: "no correlation",
                color: "#FFFAF0",
              },
              {
                from: 0.1,
                to: 0.5,
                name: "high",
                color: "#E15566",
              },
              {
                from: 0.6,
                to: 1.0,
                name: "extreme",
                color: "#DA2C43",
              },
            ],
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 1,
      },
      xaxis: {
        categories: ["Age","Sex","Educational Attainment", "Skills", "Unemployment","Economic Growth"],
        position: 'top',
        
      }
    });

    return (
      <ReactApexChart
        options={options}
        series={series}
        type="heatmap"
        height={350}
      />
    );
  };

  return (
    <div className="flex flex-col">
      <div className="uppercase font-bold text-2xl">
        <p>Admin Dashboard</p>
      </div>
      
      <div className="flex">
        <div>
          <div className="rounded-lg border-black border-2 w-[200px] h-[150px] p-4 text-sm font-bold flex flex-col m-4 uppercase text-center bg-qc-light-blue">
            <p>Unemployed Male</p>
            <div className="mt-6 text-center font-semibold text-2xl">
            <p>{genderCounts.male.toLocaleString()}</p>
              <div className="items-center">
              </div>
            </div>
          </div>

          <div className="rounded-lg border-black border-2 w-[200px] h-[150px] p-4 text-sm font-bold flex flex-col m-4 uppercase text-center bg-qc-light-red">
            <p>Unemployed Female</p>
            <div className="mt-6 text-center font-semibold text-2xl">
              <p>{genderCounts.female.toLocaleString()}</p>
              <div className="flex items-center">
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border-black border-2 w-[550px] h-[316px] p-4 text-sm font-bold flex m-4 uppercase">
          <p>Educational Attainment</p>
          <div className="w-full h-full ">
          {isEducationLoading ? (
        <ChartLoadingState />
      ) : (
            <Doughnut data={chartDataDummy} options={options} 
            />
          )}
          </div>
        </div>
        <div>
          <div className="rounded-lg border-black border-2 w-[200px] h-[150px] p-4 text-xs font-bold flex flex-col m-4 uppercase text-center">
            <p>Economic Growth Rate</p>
            <div className="mt-6 text-center font-semibold text-2xl">
              <p>9.9%</p>
              <div className="flex items-center">
                {/* <span className="text-green-500">▲</span>
              <span className="text-red-500">▼</span> */}
              </div>
            </div>
          </div>
          <div className="rounded-lg border-black border-2 w-[200px] h-[150px] p-4 text-xs font-bold flex flex-col m-4 uppercase text-center">
            <p>Unemployment Rate</p>
            <div className="mt-6 text-center font-semibold text-2xl">
              <p>4.35%</p>
              <div className="flex items-center">
                {/* <span className="text-green-500">▲</span>
              <span className="text-red-500">▼</span> */}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border-black border-2 w-[550px] h-[316px] p-4 text-sm font-bold m-4 flex uppercase">
          <p>Age Range Unemployment</p>
          <div className="w-full h-full">
          {isAgeLoading ? (
        <ChartLoadingState />
      ) : (
            <Doughnut data={ageChartData} options={ageOptions} />
       )} </div>
        </div>
      </div>
      <div className="flex flex-col mr-6 ml-4">

        <div className="rounded-lg border-black  border-2 w-full h-[400px] p-4 text-md flex flex-col my-2">
          <h2 className="text-md font-semibold">Data Forecasting</h2>
          <p className="text-xs mb-4">Impact of Individual Factors on Unemployment</p>
          <div className="h-[300px] w-full flex justify-center">
          {isLoading ? (
          <ChartLoadingState />
        ) : (
            <Bar
                data={unemploymentChartData as ChartData<"bar", (number | [number, number] | Point | BubbleDataPoint | null)[], unknown>}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                }}
            />
        )}
          </div>
        </div>
      </div>
      <div className="flex mr-4 ml-2">
        <div className="rounded-lg border-black  border-2 w-full h-[400px] p-4 text-md flex flex-col my-2">
          <h2 className="text-md font-semibold mb-2">Correlation Matrix</h2>
          {isLoading ? (
      <ChartLoadingState />
    ) : (
          <ApexChart />
        )}
        </div>
        <div className=" rounded-lg border-black  border-2 w-1/2 h-[400px] p-4 font-semibold m-2 flex flex-col">
          <p className="text-md">Prediction Analysis</p>
          <p className="text-xs font-normal">
          GDP Economic Growth vs Unemployment Rate
          </p>
          <div className=" flex items-center w-full h-full">
          {isGDPLoading ? (
        <ChartLoadingState />
      ) : (
            <Bar
                data={gdpChartData as ChartData<"bar", (number | [number, number] | Point | BubbleDataPoint | null)[], unknown>}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'GDP Economic Growth vs Unemployment Rate',
                    },
                  },
                }}
            />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default admindbPage;
