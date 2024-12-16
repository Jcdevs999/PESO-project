"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

type filterState = {
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
};

const Newspage = () => {
  const [filterState, setFilterState] = useState<filterState>({
    dateRange: {
      startDate: null,
      endDate: null,
    },
  });

  const handleDateRangeChange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setFilterState((prev) => ({
      ...prev,
      dateRange: { startDate, endDate },
    }));
  };

  const [news, setNews] = useState<any>([]);

  const filterData = news?.filter((item: any) => item.urlToImage !== null);
  //(news);
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
    <div>
      <div className="h-12 p-7 bg-gray-300 text-black px-16 flex items-center  font-bold text-2xl border-b-2 border-b-black">
        <h2>News</h2>
      </div>
      <div>
        <div className="px-16 pt-10 pb-10 flex flex-col gap-3 font-bold text-xl">
          <p>Recent News</p>
          <div className="grid grid-rows-3 grid-flow-col gap-4 items-center">
            {filterData.slice(0, 6).map((data: any, index: number) => (
              <div key={index}>
                <div className="flex gap-10 pt-6">
                  <div className="h-full min-w-[250px]">
                    <Image
                      src={data.urlToImage}
                      height={250}
                      width={250}
                      alt="img"
                    />
                  </div>
                  <div className="flex flex-col gap-3 max-w-[50ch]">
                    <p className="font-semibold text-sm ">{data.title}</p>
                    <p className="text-sm text-ellipsis line-clamp-3">
                      {data.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="flex py-4 pt-8">
              <div className="w-fit text-xs border-[1px] border-black px-2 py-2 rounded-md">
                <input
                  className="outline-none"
                  type="date"
                  id="startDate"
                  value={filterState.dateRange.startDate
                    ?.toISOString()
                    .slice(0, 10)}
                  onChange={(e) =>
                    handleDateRangeChange(
                      new Date(e.target.value),
                      filterState.dateRange.startDate
                    )
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid grid-rows-2 grid-flow-col gap-4 items-center">
            {filterData.slice(20, 26).map((data: any, index: number) => (
              <div key={index}>
                <div className="flex gap-8 pt-6">
                  <div className="flex items-center justify-center h-[100px] min-w-[150px]">
                    <Image
                      className="w-full h-full"
                      src={data.urlToImage}
                      height={100}
                      width={100}
                      alt="img"
                    />
                  </div>
                  <div className="flex flex-col gap-3 max-w-[50ch]">
                    <p className="font-bold text-sm ">{data.title}</p>
                    <p className="pt-2 text-xs font-semibold text-ellipsis line-clamp-2">
                      {data.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newspage;
