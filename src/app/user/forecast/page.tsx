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

const ForecastPage = () => {
 const [unemploymentChartData, setUnemploymentChartData] = useState<ChartData>({
  labels: ["2024", "2025", "2026"],
  datasets: [
    {
      label: "Unemployment Predictions",
      data: [5.4, 5.1, 4.9],
      backgroundColor: "rgba(192, 22, 27, 0.6)",
      borderColor: "#c0161b",
      borderWidth: 1.5,
    },
    {
      label: "Predicted GDP Growth",
      data: [2.3, 2.5, 2.7],
      backgroundColor: "rgba(1, 55, 173, 0.6)",
      borderColor: "rgb(1, 55, 173)",
      borderWidth: 1.5,
    },
    {
      label: "Female Unemployment Predictions",
      data: [5.1, 5.0, 4.8],
      backgroundColor: "rgba(255, 107, 107, 0.6)",
      borderColor: "rgb(255, 107, 107)",
      borderWidth: 1.5,
    },
    {
      label: "Male Unemployment Predictions",
      data: [5.7, 5.3, 5.0],
      backgroundColor: "rgba(59, 142, 212, 0.6)",
      borderColor: "rgb(59, 142, 212)",
      borderWidth: 1.5,
    },
    {
      label: "Educational Attainment Predictions",
      data: [3.5, 3.7, 3.8],
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
    }
  );

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
      const response = await axios.get("/api/laborforce");
      const latestData = response.data[0]; 
      const totalUnemployed = latestData.totalUnemployed;
      const totalLaborForce = latestData.totalLF;
      const unemploymentRate = latestData.unemploy_Rate / 100; 

      const trainingResponse = await axios.get("/api/nojob");
      const trainUnemployed = trainingResponse.data.unemployed;
      const trainYears = trainingResponse.data.years;



      const genderResponse = await axios.get("/api/genderData");
      const genderData = genderResponse.data;

 
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
        (unemployed: number) =>
          (unemployed - minUnemployed) / (maxUnemployed - minUnemployed)
      );

      const maxGdpValue = Math.max(...gdpValues);
      const minGdpValue = Math.min(...gdpValues);
      const normalizedGdpValues = gdpValues.map(
        (value: number) => (value - minGdpValue) / (maxGdpValue - minGdpValue)
      );

      // Create tensors
      const trainYearsTensor = tf.tensor(normalizedTrainYears, [
        normalizedTrainYears.length,
        1,
      ]);
      const trainUnemployedTensor = tf.tensor(normalizedTrainUnemployed, [
        normalizedTrainUnemployed.length,
        1,
      ]);

      // TensorFlow Model with L2 Regularization (Ridge Regression)
      const model = tf.sequential();
      model.add(
        tf.layers.dense({
          units: 64,
          inputShape: [1],
          activation: "relu",
        })
      );
      model.add(
        tf.layers.dense({
          units: 32,
          activation: "relu",
        })
      );
      model.add(
        tf.layers.dense({
          units: 1,
          activation: "linear",
        })
      );
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
      const denormalizedPredictions = Array.from(predictions.dataSync()).map(
        (value) => {
          const denormalizedValue =
            value * (maxUnemployed - minUnemployed) + minUnemployed;
          return Math.round(denormalizedValue);
        }
      );

      // GDP Growth Calculation based on unemployment predictions
      const baseGDP = gdpValues[gdpValues.length - 1];
      const coefficient = 1.0 - unemploymentRate;

      const gdpGrowthData = denormalizedPredictions.map((unemployed) => {
        if (totalLaborForce === 0) {
          console.error(
            "Total Labor Force is zero. Cannot calculate unemployment rate."
          );
          return baseGDP;
        }

        const adjustedUnemploymentRate = unemployed / totalLaborForce;
        const gdp = baseGDP * (1 - adjustedUnemploymentRate * coefficient);
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
        Vocational:
          educationalData.find(
            (item: { educationalAttainment: string }) =>
              item.educationalAttainment === "Vocational Level"
          )?.totalUnemployed / totalUnemployed || 0,
        College:
          educationalData.find(
            (item: { educationalAttainment: string }) =>
              item.educationalAttainment === "College Level"
          )?.totalUnemployed / totalUnemployed || 0,
        HighSchool:
          educationalData.find(
            (item: { educationalAttainment: string }) =>
              item.educationalAttainment === "High School Level"
          )?.totalUnemployed / totalUnemployed || 0,
      };

      // Ensure educational rates sum to 1
      const totalEducRate =
        educationalUnemploymentRate.Vocational +
        educationalUnemploymentRate.College +
        educationalUnemploymentRate.HighSchool;
      if (totalEducRate !== 0) {
        educationalUnemploymentRate.Vocational /= totalEducRate;
        educationalUnemploymentRate.College /= totalEducRate;
        educationalUnemploymentRate.HighSchool /= totalEducRate;
      }

      const educationalPredictions = denormalizedPredictions.map(
        (totalUnemployed) => ({
          Vocational: totalUnemployed * educationalUnemploymentRate.Vocational,
          College: totalUnemployed * educationalUnemploymentRate.College,
          HighSchool: totalUnemployed * educationalUnemploymentRate.HighSchool,
        })
      );

      // Calculate age group unemployment rates
      const ageGroupRates = {
        "15-24":
          (ageData.find((item) => item.ageRange === "15-24")?.totalUnemployed ??
            0) / totalUnemployed || 0,
        "25-34":
          (ageData.find((item) => item.ageRange === "25-34")?.totalUnemployed ??
            0) / totalUnemployed || 0,
        "35-44":
          (ageData.find((item) => item.ageRange === "35-44")?.totalUnemployed ??
            0) / totalUnemployed || 0,
        "45plus":
          (ageData.find((item) => item.ageRange === "45+")?.totalUnemployed ??
            0) / totalUnemployed || 0,
      };

      // Normalize age group rates
      const totalAgeRate = Object.values(ageGroupRates).reduce(
        (sum, rate) => sum + rate,
        0
      );
      if (totalAgeRate !== 0) {
        Object.keys(ageGroupRates).forEach((key) => {
          ageGroupRates[key as keyof typeof ageGroupRates] /= totalAgeRate;
        });
      }

      // Calculate age group predictions
      const ageGroupPredictions = denormalizedPredictions.map(
        (totalUnemployed) => ({
          "15-24": totalUnemployed * ageGroupRates["15-24"],
          "25-34": totalUnemployed * ageGroupRates["25-34"],
          "35-44": totalUnemployed * ageGroupRates["35-44"],
          "45plus": totalUnemployed * ageGroupRates["45plus"],
        })
      );

      // Update unemployment chart data
      setUnemploymentChartData((prev) => ({
        ...prev,
        labels: futureYears, 
        datasets: [
          {
            ...prev.datasets[0],
            data: denormalizedPredictions, 
          },
          {
            ...prev.datasets[1],
            data: gdpGrowthData, 
          },


          {
            ...prev.datasets[2], 
            data: femaleUnemploymentPredictions,
          },
          {
            ...prev.datasets[3], 
            data: maleUnemploymentPredictions,
          },

          {
            ...prev.datasets[4], 
            data: educationalPredictions.map(
              (pred) => pred.Vocational + pred.HighSchool + pred.College
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
    ]);

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
                color: "#001A6E",
              },
              {
                from: -1.0,
                to: -0.6,
                name: "low",
                color: "#0B598D",
              },
              {
                from: 0.0,
                to: 0.0,
                name: "no correlation",
                color: "#F5EFE7",
              },
              {
                from: 0.1,
                to: 0.5,
                name: "high",
                color: "#08436A",
              },
              {
                from: 0.6,
                to: 1.0,
                name: "extreme",
                color: "#063250",
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
        categories: [
          "Age",
          "Gender",
          "Educational Attainment",
          "Skills",
          "Unemployment",
          "Economic Growth",
        ],
      },
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

  const [gdpData, setGdpData] = useState<{ years: string[]; values: number[] }>(
    { years: [], values: [] }
  );
  const [confidenceInterval, setConfidenceInterval] =
    useState<ConfidenceInterval | null>(null);

  useEffect(() => {
    const fetchGDPData = async () => {
      try {
        const gdpRes = await axios.get("/api/gdp");

        if (!gdpRes.data.years || !gdpRes.data.values) {
          console.error(
            "Data format issue. Please check the API response format."
          );
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

  const calculateConfidenceInterval = (
    values: number[],
    confidenceLevel = 0.95
  ) => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;
    const stdDev = Math.sqrt(variance);
    const zScore = getZScore(confidenceLevel);
    const marginOfError = zScore * (stdDev / Math.sqrt(values.length));
    return { mean, lower: mean - marginOfError, upper: mean + marginOfError };
  };

  const getZScore = (confidenceLevel: number) => {
    const zScores: { [key: string]: number } = {
      "0.9": 1.645,
      "0.95": 1.96,
      "0.99": 2.576,
    };
    return zScores[confidenceLevel.toFixed(2)] || 1.96; // default to 0.95 if not found
  };

  const data = {
    labels: gdpData.years,
    datasets: [
      {
        label: "GDP Mean",
        data:
          confidenceInterval ?
            Array(gdpData.years.length).fill(confidenceInterval.mean)
          : [],
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "GDP Upper",
        data:
          confidenceInterval ?
            Array(gdpData.years.length).fill(confidenceInterval.upper)
          : [],
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
        fill: "+1",
      },
      {
        label: "GDP Lower",
        data:
          confidenceInterval ?
            Array(gdpData.years.length).fill(confidenceInterval.lower)
          : [],
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
      <div className="w-full flex">
        <div className="w-full border border-gray-300 rounded-lg shadow-md hover:shadow-2xl transition-shadow m-4">
          <h2 className="text-lg font-bold p-4 flex flex-col">
            Comparison of unemployment rates across different demographic
            groups.
          </h2>
          <div>
            <ApexChart />
          </div>
        </div>
        <div className="w-full border border-gray-300 rounded-lg shadow-md hover:shadow-2xl transition-shadow m-4">
          <h2 className="text-lg font-bold p-4 flex flex-col">
            Predicted economic growth influenced by unemployment rates and
            demographic factors.
          </h2>
          <div className="mr-4 ml-4 mt-4 h-[300px]">
            <Line
              data={
                unemploymentChartData as ChartData<
                  "line",
                  (
                    | number
                    | [number, number]
                    | Point
                    | BubbleDataPoint
                    | null
                  )[],
                  unknown
                >
              }
              options={{
                elements: {
                  line: {
                    tension: 0.5,
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex">
        <div className="w-full border border-gray-300 rounded-lg shadow-md hover:shadow-2xl transition-shadow m-4">
          <h2 className="text-lg p-4 font-bold">Actual vs. Predicted</h2>
          <div className="w-full h-full m-6">
            <img
              src="/adminfolder/actual-vs-predict.png"
              height={800}
              width={800}
              alt=""
            />
          </div>
        </div>
        <div className="w-full border border-gray-300 rounded-lg shadow-md hover:shadow-2xl transition-shadow m-4">
          <h2 className="text-lg p-4 font-bold ">Confidence Interval</h2>
          <div className="w-full">
            <Line
              data={data}
              options={{
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
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastPage;
