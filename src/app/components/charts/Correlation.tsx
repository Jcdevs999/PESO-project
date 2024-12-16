"use client";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const Correlation = () => {
  const [series] = useState([
    {
      name: "Age",
      data: [1.0, 0, 0, 0, 0, 0],
    },
    {
      name: "Gender",
      data: [0.0, 1.0, 0, 0, 0, 0],
    },
    {
      name: "Educational Attainment",
      data: [-0.1, 0.0, 1.0, 0, 0, 0],
    },
    {
      name: "Skills",
      data: [0, 0, 0, 1.0, 0, 0],
    },
    {
      name: "Unemployment",
      data: [0.0, -1.0, 0.0, 0, 1.0, 0],
    },
    {
      name: "Economic Growth",
      data: [0, 0, 0, 0, 0, 1.0],
    },
  ]);

  const [options] = useState({
    chart: {
      height: 350,
      type: "heatmap" as const,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            { from: -0.5, to: -0.1, name: "negligible", color: "#F8D1CD" },
            { from: -1.0, to: -0.6, name: "low", color: "#F0A8AB" },
            { from: 0.0, to: 0.0, name: "no correlation", color: "#FFFAF0" },
            { from: 0.1, to: 0.5, name: "high", color: "#E15566" },
            { from: 0.6, to: 1.0, name: "extreme", color: "#DA2C43" },
          ],
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { width: 1 },
    xaxis: { categories: ["Age", "Gender", "Educational Attainment", "Skills", "Unemployment", "Economic Growth"] },
  });

  return <ReactApexChart options={options} series={series} type="heatmap" height={350} />;
};

export default Correlation;
