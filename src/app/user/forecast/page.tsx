"use client";

import React, { SetStateAction } from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LayoutItem } from "@/types/index";
import { Bar, Line, Scatter } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import * as tf from "@tensorflow/tfjs";
import ReactDOM from "react-dom";
import ReactApexChart from "react-apexcharts";
import { BubbleDataPoint, ChartData, Filler, Point } from "chart.js";

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
  scales,
  Colors,
} from "chart.js";
import axios from "axios";
import { ApexOptions } from "apexcharts";
import { config } from "dotenv";

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
  Colors,
  Filler
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

interface ConfidenceInterval {
    mean: number;
    lower: number;
    upper: number;
}

interface ConfidenceIntervals {
    unemploymentInterval: ConfidenceInterval;
    gdpInterval: ConfidenceInterval;
}

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
  "2020 - 2021",
  "2021 - 2022",
  "2022 - 2023",
];

const gdpp =[
  "6.2",
  "11.9",
  "9.9",
]

const page = () => {
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
      backgroundColor: "rgb(59, 142, 212)",
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

        // // Age group datasets
        // {
        //   label: "15-24 years",
        //   data: [],
        //   backgroundColor: "rgba(255, 99, 132, 0.2)",
        //   borderColor: "rgba(255, 99, 132, 1)",
        //   borderWidth: 1,
        // },
        // {
        //   label: "25-34 years",
        //   data: [],
        //   backgroundColor: "rgba(75, 192, 192, 0.2)",
        //   borderColor: "rgba(75, 192, 192, 1)",
        //   borderWidth: 1,
        // },
        // {
        //   label: "35-44 years",
        //   data: [],
        //   backgroundColor: "rgba(255, 205, 86, 0.2)",
        //   borderColor: "rgba(255, 205, 86, 1)",
        //   borderWidth: 1,
        // },
        // {
        //   label: "45+ years",
        //   data: [],
        //   backgroundColor: "rgba(54, 162, 235, 0.2)",
        //   borderColor: "rgba(54, 162, 235, 1)",
        //   borderWidth: 1,
        // },

    ],
  });

  const [gdpChartData, setGdpChartData] = useState<ChartData>({
    labels: ["2024", "2025", "2026"], // Update this dynamically if needed
    datasets: [
      {
        label: "Predicted GDP Growth",
        data: [],
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
      {
        label: "Actual GDP",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  });

  interface AgeGroup {
    ageRange: string;
    totalUnemployed: number;
  }

  const fetchData = async () => {
    try {
      // Fetch total unemployed and labor force
      const response = await axios.get("/api/laborforce");
      const latestData = response.data[0]; // Assuming the last entry is the most recent year
      const totalUnemployed = latestData.totalUnemployed; 
      const totalLaborForce = latestData.totalLF; 
      const unemploymentRate = latestData.unemploy_Rate / 100; // Convert to decimal

      // Fetch historical unemployment data
      const trainingResponse = await axios.get("/api/nojob");
      const trainUnemployed = trainingResponse.data.unemployed; 
      const trainYears = trainingResponse.data.years; 

      // // Fetch gender data
      // const genderResponse = await axios.get("/api/genderData");
      // const genderData = genderResponse.data;


        const genderResponse = await axios.get("/api/genderData");
        const genderData = genderResponse.data;

        // // Process data for male and female unemployment
        // const maleUnemployedData = genderData.map((data: any) =>
        //   data.maleUnemployed
        // );
        // const femaleUnemployedData = genderData.map((data: any) =>
        //   data.femaleUnemployed
        // );
        // const years = genderData.map((data: any) => data.year);

      // Get total unemployed for each gender
      // const GendertotalUnemployed = {
      //     Female: genderData.find((item: { isMale: string; }) => item.isMale === "Female")?.totalUnemployed || 0,
      //     Male: genderData.find((item: { isMale: string; }) => item.isMale === "Male")?.totalUnemployed || 0,
      // };

      // // Combine female and male totals
      // const combinedUnemployed = GendertotalUnemployed.Female + GendertotalUnemployed.Male;

      // Fetch educational attainment data
      const educationalResponse = await axios.get("/api/educData");
      const educationalData = educationalResponse.data;

      // Process the fetched educational data and create a dataset for the chart
      // const educationalAttainmentData = [
      //     educationalData.find((item: { educationalAttainment: string; }) => item.educationalAttainment === "Elementary Level")?.totalUnemployed || 0,
      //     educationalData.find((item: { educationalAttainment: string; }) => item.educationalAttainment === "Elementary Graduate")?.totalUnemployed || 0,
      //     educationalData.find((item: { educationalAttainment: string; }) => item.educationalAttainment === "Junior High School Level")?.totalUnemployed || 0,
      //     educationalData.find((item: { educationalAttainment: string; }) => item.educationalAttainment === "Junior High School Graduate")?.totalUnemployed || 0,
      //     educationalData.find((item: { educationalAttainment: string; }) => item.educationalAttainment === "Senior High School Level")?.totalUnemployed || 0,
      //     educationalData.find((item: { educationalAttainment: string; }) => item.educationalAttainment === "Senior High School Graduate")?.totalUnemployed || 0,
      //     educationalData.find((item: { educationalAttainment: string; }) => item.educationalAttainment === "Vocational Level")?.totalUnemployed || 0,
      //     educationalData.find((item: { educationalAttainment: string; }) => item.educationalAttainment === "Vocational Graduate")?.totalUnemployed || 0,
      //     educationalData.find((item: { educationalAttainment: string; }) => item.educationalAttainment === "College Level")?.totalUnemployed || 0,
      //     educationalData.find((item: { educationalAttainment: string; }) => item.educationalAttainment === "College Graduate")?.totalUnemployed || 0,
      // ];

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
      //     {
      //     ...prev.datasets[2], // Female unemployment predictions dataset
      //     data: [
      //         GendertotalUnemployed.Female,                // 2024 data
      //         GendertotalUnemployed.Female * 1.1,          // Prediction for 2025 (10% increase)
      //         GendertotalUnemployed.Female * 1.2           // Prediction for 2026 (20% increase)
      //     ],
      // },
      // {
      //     ...prev.datasets[3], // Male unemployment predictions dataset
      //     data: [
      //         GendertotalUnemployed.Male,                  // 2024 data
      //         GendertotalUnemployed.Male * 1.1,            // Prediction for 2025 (10% increase)
      //         GendertotalUnemployed.Male * 1.2             // Prediction for 2026 (20% increase)
      //     ],
      //   }

          {
            ...prev.datasets[2], // Male Unemployment Predictions dataset
            data: femaleUnemploymentPredictions,
          },
          {
            ...prev.datasets[3], // Female Unemployment Predictions dataset
            data: maleUnemploymentPredictions,
          },        
        //   {
        //     ...prev.datasets[2], // Gender unemployment predictions dataset
        //     data: [
        //       combinedUnemployed,                // 2024 data
        //       combinedUnemployed * 1.1,          // Prediction for 2025 (example: 10% increase)
        //       combinedUnemployed * 1.2           // Prediction for 2026 (example: 20% increase)
        //     ],
        // },
        {
            ...prev.datasets[4], // Educational attainment predictions dataset
            data:educationalPredictions.map(pred => 
              pred.Vocational + pred.HighSchool + pred.College
            ), // Educational attainment unemployment data
        },

      //   {
      //     ...prev.datasets[5], 
      //     data: ageGroupPredictions.map(pred => pred['15-24']),
      // },
      // {
      //     ...prev.datasets[6], 
      //     data: ageGroupPredictions.map(pred => pred['25-34']),
      // },
      // {
      //     ...prev.datasets[7], 
      //     data: ageGroupPredictions.map(pred => pred['35-44']),
      // },
      // {
      //     ...prev.datasets[8], 
      //     data: ageGroupPredictions.map(pred => pred['45plus']),
      // },
      
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
        ],
      }));

      // Return the GDP growth data for further use if needed
      return gdpGrowthData; 
    } catch (error) {
      console.error("Error fetching data", error);
      return [];
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  // Heatmap

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
        name: "Gender",
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
        categories: ["Age","Gender","Educational Attainment", "Skills", "Unemployment","Economic Growth"],
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
  
const [gdpData, setGdpData] = useState<{ years: string[]; values: number[] }>({ years: [], values: [] });
const [confidenceInterval, setConfidenceInterval] = useState<ConfidenceInterval | null>(null);

  useEffect(() => {
    const fetchGDPData = async () => {
      try {
        const gdpRes = await axios.get('/api/gdp');
        console.log("GDP Data:", gdpRes.data);

        if (!gdpRes.data.years || !gdpRes.data.values) {
          console.error("Data format issue. Please check the API response format.");
          return;
        }

        setGdpData(gdpRes.data);
        const interval = calculateConfidenceInterval(gdpRes.data.values);
        setConfidenceInterval(interval);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchGDPData();
  }, []);

  const calculateConfidenceInterval = (values: number[], confidenceLevel = 0.95) => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const zScore = getZScore(confidenceLevel);
    const marginOfError = zScore * (stdDev / Math.sqrt(values.length));
    return { mean, lower: mean - marginOfError, upper: mean + marginOfError };
  };

  const getZScore = (confidenceLevel: number) => {
    const zScores: { [key: string]: number } = { "0.9": 1.645, "0.95": 1.96, "0.99": 2.576 };
    return zScores[confidenceLevel.toFixed(2)] || 1.96; // default to 0.95 if not found
  };

  const data = {
    labels: gdpData.years,
    datasets: [
      {
        label: "GDP Mean",
        data: confidenceInterval ? Array(gdpData.years.length).fill(confidenceInterval.mean) : [],
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "GDP Upper",
        data: confidenceInterval ? Array(gdpData.years.length).fill(confidenceInterval.upper) : [],
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
        fill: "+1",
      },
      {
        label: "GDP Lower",
        data: confidenceInterval ? Array(gdpData.years.length).fill(confidenceInterval.lower) : [],
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
        fill: "-1",
      },
    ],
  };



  return (
    <div>
      <div className="h-12 p-7 bg-qc-red text-white uppercase px-16 flex items-center text-md border-b-2">
        <h2>Quezon City Forecast</h2>
      </div>
      <div>
        <div className="container mx-auto p-4">
          <div className="flex justify-end mt-5">
            {/* <select
              className="w-fit text-sm border-[2px] border-black p-2 rounded-md flex items-left place-self-start"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="">Date Filter</option>
              <option value="January-March">January - March</option>
              <option value="April-June">April - June</option>
              <option value="July-September">July - September</option>
              <option value="October-December">October - December</option>
            </select> */}
          </div>

          <div className="flex mt-4">
            <div className="w-1/2 pr-4">
              {/* <h2 className="text-xl font-bold text-center w-full border-black border">
                Overview
              </h2> */}
              {/* <table className="w-full border-collapse text-md ">
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
                  {data.map((row: { name: boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | React.Key | null | undefined; data: any[]; }) => (
                    <tr key={row.name}>
                      <td className="border border-black px-2 py-1">
                        {row.name}
                      </td>
                      {row.data.map((value: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined, index: React.Key | null | undefined) => (
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
              </table> */}
              <div className="mt-20 text-sm border-[2px] border-black px-4 py-4 rounded-md min-w-[120px] min-h-[390px]">
                <h2 className="text-l font-bold mb-8 flex flex-col">
                  Comparison of unemployment rates across different demographic
                  groups.
                </h2>
                {/* Heatmap */}
                <ApexChart />
              </div>
            </div>
            <div className="min-w-[100px] text-sm border-[2px] border-black px-4 py-4 rounded-md ">
              <h3 className="text-xl text-center font-bold mb-10 flex flex-col">
                Predicted economic growth influenced by unemployment rates and
                demographic factors.
              </h3>
              <div className="min-w-[200px] min-h-[200px] flex flex-col w-full items-center h-full">
                <div className="w-full h-[500px] ">
                  {/* Stacked Area Line Graph */}
                  <Line data={unemploymentChartData as ChartData<"line", (number | [number, number] | Point | BubbleDataPoint | null)[], unknown>} 
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
                }}/>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="mt-6 text-xs border-[2px] border-black px-4 py-4 rounded-md  w-1/2 h-fit">
              <h3 className="text-xl font-bold mb-16 text-center">
                Actual vs. Predicted
              </h3>
              <div className="min-w-[200px] min-h-[300px] flex flex-col items-center w-full h-full">
                <div className="w-full h-[472px]">

                <img
              src="/adminfolder/actual-vs-predict.png"
              height={800}
              width={800}
              alt=""
            />
                  {/* Line Graph
                  <Line
                    data={gdpChartData as ChartData<"line", (number | [number, number] | Point | BubbleDataPoint | null)[], unknown>}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: 'Actual vs Predicted GDP',
                        },
                      },
                    }}
                  /> */}
                </div>
              </div>
            </div>
            <div className="mt-6 text-xs border-[2px] border-black px-4 py-4 rounded-md  w-1/2 h-fit">
              <h3 className="text-xl font-bold mb-16 text-center">
                Confidence Interval
              </h3>
              <div className="min-w-[200px] min-h-[300px] flex flex-col items-center w-full h-full">
                <div className="w-full h-[500px]">
                  {/* Stack Area Graph */}
                  <Line data={data}
                    options= {{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: "Confidence Intervals for GDP",
                        },
                        tooltip: {
                          mode: "index" as const,
                        },
                      },
                      interaction: {
                        mode: "nearest" as const,
                        axis: "x",
                        intersect: false,
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: "Year",
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: "Values",
                          },
                        },
                      },
                    }}/>
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

// "use client";

// import { Csdata } from "@/qcdata";
// import { Bar, Doughnut, Line } from "react-chartjs-2";
// import { Chart } from "chart.js/auto";
// import React, { useEffect, useState } from "react";
// import Correlation from "../../components/charts/Correlation";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   BarElement,
//   Scales,
//   Colors,
// } from "chart.js";
// import axios from "axios";

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   BarElement,
//   Colors
// );

// const data = [
//   {
//     name: "GDP Growth Rate",
//     data: [0.5, 2.2, 3.9, 35050, 3425],
//   },
//   {
//     name: "GDP Annual Growth Rate",
//     data: [0.7, 2.3, 3.8, 38100, 4178],
//   },
//   {
//     name: "Unemployment Rate",
//     data: [2.8, 5.4, 4.8, 28478, 3248],
//   },
// ];

// const headers = [
//   "Actual",
//   "January-March",
//   "April-June",
//   "July-September",
//   "October-December",
// ];

// const page = () => {
//   const [filterDate, setFilterDate] = useState("");

//   // const selectedMonth = data.find(item => item.data === selectedPeriod)
//   return (
//     <div>
//       <div className="h-12 p-7 bg-qc-red text-white px-16 flex items-center uppercase text-md border-b-2 border-white">
//         <h2>Quezon City Forecast</h2>
//       </div>
//       <div>
//         <div className="container mx-auto p-4">
//           {/* <div className="flex justify-end mt-5">
//             <select
//               className="w-fit text-sm border-[2px] border-black p-2 rounded-md flex items-left place-self-start"
//               // value={filterDate}
//               onChange={(e) => setFilterDate(e.target.value)}
//             >
//               <option value="">Date Filter</option>
//               <option value="January-March">January - March</option>
//               <option value="April-June">April - June</option>
//               <option value="July-September">July - September</option>
//               <option value="October-December">October - December</option>
//             </select>
//           </div> */}

//           <div className="flex mt-4">
//             <div className="w-1/2 pr-4">
//               <h2 className="text-xl font-bold text-center w-full border-black border">
//                 Overview
//               </h2>
//               <table className="w-full border-collapse text-md ">
//                 <thead>
//                   <tr>
//                     <th className="border border-black px-2 py-1"></th>
//                     {headers.map((header) => (
//                       <th
//                         key={header}
//                         className="border text-sm border-black px-2 py-1"
//                       >
//                         {header}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.map((row) => (
//                     <tr key={row.name}>
//                       <td className="border border-black px-2 py-1">
//                         {row.name}
//                       </td>
//                       {row.data.map((value, index) => (
//                         <td
//                           key={index}
//                           className="border border-black px-2 py-1"
//                         >
//                           {value}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <div className="mt-5 text-sm border-[2px] border-black px-4 py-4 rounded-md min-w-[120px] min-h-[390px]">
//                 <h2 className="text-xl font-bold mb-8 flex flex-col">
//                   Analysis
//                 </h2>
//                 <p className="text-black text-sm">
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
//                   do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
//                   do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
//                   do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
//                   do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
//                   do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
//                   do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
//                   do eiusmod tempor incididunt ut labore et dolore magna
//                   aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
//                   elit, sed do eiusmod tempor incididunt ut labore et dolore
//                   magna aliqua. Lorem ipsum dolor sit amet, consectetur
//                   adipisicing elit, sed do eiusmod tempor incididunt ut labore
//                   et dolore magna aliqua.
//                 </p>
//               </div>
//             </div>
//             <div className="min-w-[200px] text-sm border-[2px] border-black px-2 py-4 rounded-md ">
//               <h3 className="text-xl text-center font-bold mb-10 flex flex-col">
//                 Correlation Matrix
//               </h3>
           
//                 <Correlation />
//                 <p className="text-black text-sm m-4">
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
//                   do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
//                   do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
//                   do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
//                   do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
//                   do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
//                   do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
//                   do eiusmod tempor incididunt ut labore et dolore magna
//                   aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing
//                   elit, sed do eiusmod tempor incididunt ut labore et dolore
//                   magna aliqua. Lorem ipsum dolor sit amet, consectetur
//                   adipisicing elit, sed do eiusmod tempor incididunt ut labore
//                   et dolore magna aliqua. Lorem ipsum dolor sit amet,
//                   consectetur adipisicing elit, sed do eiusmod tempor incididunt
//                   ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet,
//                   consectetur adipisicing elit, sed do eiusmod tempor incididunt
//                   ut labore et dolore magna aliqua.
//                 </p>
//                 </div>
//                 </div>

//                   {/* <Doughnut
//                     data={{
//                       labels: [
//                         "District 1",
//                         "District 2",
//                         "District 3",
//                         "District 4",
//                         "District 5",
//                         "District 6",
//                       ],
//                       datasets: [
//                         {
//                           label: " Unemployed",
//                           data: [2648, 468, 726, 820, 960, 426],
//                           backgroundColor: [
//                             "#257180",
//                             "#F2E5BF",
//                             "#FD8B51",
//                             "#CB6040",
//                             "#A5B68D",
//                             "#ECDFCC",
//                           ],
//                           borderColor: [
//                             "#257180",
//                             "#F2E5BF",
//                             "#FD8B51",
//                             "#CB6040",
//                             "#A5B68D",
//                             "#ECDFCC",
//                           ],
//                           borderWidth: 1,
//                         },
//                         {
//                           label: "Employed",
//                           data: [1212, 1526, 360, 780, 626, 1290],
//                           backgroundColor: [
//                             "#254336",
//                             "#6B8A7A",
//                             "#B7B597",
//                             "#DAD3BE",
//                             "#795757",
//                             "#8D493A",
//                           ],
//                           borderColor: [
//                             "#254336",
//                             "#6B8A7A",
//                             "#B7B597",
//                             "#DAD3BE",
//                             "#795757",
//                             "#8D493A",
//                           ],
//                           borderWidth: 1,
//                         },
//                       ],
//                     }}
//                     options={{
//                       responsive: true,
//                       maintainAspectRatio: false,
//                       plugins: {
//                         legend: {
//                           position: "bottom",
//                           labels: {
//                             padding: 10,
//                           },
//                         },
//                       },
//                       animation: {
//                         duration: 2000, // animation duration in milliseconds
//                         easing: "easeInOutQuart", // animation easing function
//                       },
//                     }}
//                   /> */}
//           <div className="flex gap-5">
//             <div className="mt-6 text-xs border-[2px] border-black px-4 py-4 rounded-md  w-1/2 h-fit">
//               <h3 className="text-xl font-bold mb-16 text-center">
//                 Comparison of unemployment rates across different demographic
//                 groups.
//               </h3>
//               <div className="min-w-[200px] min-h-[300px] flex flex-col items-center w-full h-full">
//                 <div className="w-[500px] h-[472px]">
//                   <Bar
//                     data={{
//                       labels: [
//                         "District 1",
//                         "District 2",
//                         "District 3",
//                         "District 4",
//                         "District 5",
//                         "District 6",
//                       ],
//                       datasets: [
//                         {
//                           label: " Unemployed",
//                           data: [2648, 468, 726, 820, 960, 320],
//                           backgroundColor: [
//                             "#257180",
//                             "#F2E5BF",
//                             "#FD8B51",
//                             "#CB6040",
//                             "#A5B68D",
//                             "#ECDFCC",
//                           ],
//                           borderColor: [
//                             "#257180",
//                             "#F2E5BF",
//                             "#FD8B51",
//                             "#CB6040",
//                             "#A5B68D",
//                             "#ECDFCC",
//                           ],
//                           borderWidth: 1,
//                         },
//                         {
//                           label: "Employed",
//                           data: [1212, 1526, 360, 780, 626, 926],
//                           backgroundColor: [
//                             "#257180",
//                             "#F2E5BF",
//                             "#FD8B51",
//                             "#CB6040",
//                             "#A5B68D",
//                             "#ECDFCC",
//                           ],
//                           borderColor: [
//                             "#257180",
//                             "#F2E5BF",
//                             "#FD8B51",
//                             "#CB6040",
//                             "#A5B68D",
//                             "#ECDFCC",
//                           ],
//                           borderWidth: 1,
//                         },
//                       ],
//                     }}
//                     options={{
//                       responsive: true,
//                       maintainAspectRatio: false,
//                       plugins: {
//                         legend: {
//                           position: "bottom",
//                           labels: {
//                             padding: 10,
//                           },
//                         },
//                       },
//                       animation: {
//                         duration: 2000, // animation duration in milliseconds
//                         easing: "easeInOutQuart", // animation easing function
//                       },
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="mt-6 text-xs border-[2px] border-black px-4 py-4 rounded-md  w-1/2 h-fit">
//               <h3 className="text-xl font-bold mb-16 text-center">
//                 Confidence Interval
//               </h3>
//               <div className="min-w-[200px] min-h-[300px] flex flex-col items-center w-full h-full">
//                 <div className="w-[500px] h-[500px]">
//                   <Bar
//                     data={{
//                       labels: [
//                         "District 1",
//                         "District 2",
//                         "District 3",
//                         "District 4",
//                         "District 5",
//                         "District 6",
//                       ],
//                       datasets: [
//                         {
//                           label: " Unemployed",
//                           data: [1260, 468, 726, 820, 960, 345, 681],
//                           backgroundColor: [
//                             "#257180",
//                             "#F2E5BF",
//                             "#FD8B51",
//                             "#CB6040",
//                             "#A5B68D",
//                             "#ECDFCC",
//                           ],
//                           borderColor: [
//                             "#257180",
//                             "#F2E5BF",
//                             "#FD8B51",
//                             "#CB6040",
//                             "#A5B68D",
//                             "#ECDFCC",
//                           ],
//                           borderWidth: 1,
//                         },
//                         {
//                           label: "Employed",
//                           data: [2648, 1526, 360, 780, 626, 1356, 1229],
//                           backgroundColor: [
//                             "#257180",
//                             "#F2E5BF",
//                             "#FD8B51",
//                             "#CB6040",
//                             "#A5B68D",
//                             "#ECDFCC",
//                           ],
//                           borderColor: [
//                             "#257180",
//                             "#F2E5BF",
//                             "#FD8B51",
//                             "#CB6040",
//                             "#A5B68D",
//                             "#ECDFCC",
//                           ],
//                           borderWidth: 1,
//                         },
//                       ],
//                     }}
//                     options={{
//                       responsive: true,
//                       maintainAspectRatio: false,
//                       plugins: {
//                         legend: {
//                           position: "bottom",
//                           labels: {
//                             padding: 10,
//                           },
//                         },
//                       },
//                       animation: {
//                         duration: 2000, // animation duration in milliseconds
//                         easing: "easeInOutQuart", // animation easing function
//                       },
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default page;
