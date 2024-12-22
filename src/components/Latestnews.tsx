"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

const Latestnews = () => {
  const [news, setNews] = useState<any>([]);

  const filterData = news?.filter((item: any) => item.urlToImage !== null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://newsapi.org/v2/everything?q=education&apiKey=ff4d356650cf48c0bd58a0575e13ee06"
        );

        setNews(response.data.articles);
      } catch (error) {
        //(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="px-16 pt-10 pb-10 flex flex-col gap-8">
      <h2 className="font-bold text-2xl">Brief Description</h2>
      <p className="text-left align-top">
        The analysis of unemployment rates is essential for understanding
        economic growth trends and informing effective policy decisions. This
        analysis employs a comprehensive data filtering system designed to
        enhance user clarity and accessibility. Users can examine critical
        variables such as age, sex, educational attainment, and skills, which
        are pivotal in assessing the multifaceted nature of unemployment. By
        filtering data based on these variables, users can identify specific
        patterns and relationships that may influence unemployment trends. This
        targeted approach allows for a more granular understanding of how
        different demographic and educational factors interact within the labor
        market. Additionally, the inclusion of the date added for each data
        entry facilitates a temporal analysis of unemployment changes over time.
        This time-based perspective enables users to observe fluctuations and
        trends in unemployment rates, providing insights into how economic
        conditions evolve. Overall, the filtering capabilities serve to empower
        users by offering a clearer view of the dataset, enabling informed
        discussions and analyses. This structured approach not only aids in
        understanding current unemployment dynamics but also supports
        forecasting efforts aimed at promoting economic growth and stability.
      </p>
      {/* <div className="flex flex-col gap-4">
        <h2 className="font-bold text-2xl pb-5">Latest News</h2>

        <div className="grid grid-rows-3 grid-flow-col gap-4 items-center">
          {filterData.slice(0, 6).map((data: any, index: number) => (
            <div key={index}>
              <div className="flex gap-10">
                <div className="h-full min-w-[250px]">
                  <Image
                    src={data.urlToImage}
                    height={250}
                    width={250}
                    alt="img"
                  />
                </div>
                <div className="flex flex-col gap-3 max-w-[50ch]">
                  <p className="font-semibold text-xl ">{data.title}</p>
                  <p className="text-sm text-ellipsis line-clamp-3">
                    {data.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Latestnews;
