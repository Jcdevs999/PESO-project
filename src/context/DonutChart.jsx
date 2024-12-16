"use client"

import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart } from 'chart.js/auto'

const DonutChart = () => {
  return (
    <div>
        <div className='w-full text-center text-2xl'>
            <p>Quezon City Chart</p>
        </div>
        <div className='min-w-[200px] min-h-[300px] flex flex-col items-center '>
            <Doughnut 
            data={{
                labels: ["A", "B", "C"],
                datasets: [
                    {
                        label: " Unemployed",
                        data: [200, 500, 800],
                    },
                    {
                        label: "Employed",
                        data: [1000, 1500, 300],
                    },

                ]
            }}
            />
        </div>
      
    </div>
  )
}

export default DonutChart
