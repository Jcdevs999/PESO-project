"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

import { useSearch } from "@/context/qwert";
import axios from "axios";

const SearchPage = () => {
  const { searchInput, setSearchInput } = useSearch();
  const [newsData, setNewsData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const search = searchParams ? searchParams.get("q") : null;

  const [searchNews, setSearchNews] = useState<any[]>([]);
  //   useEffect(() => {
  //     const controller = new AbortController();
  //     const signal = controller.signal;

  //     const getNews = async () => {
  //       try {
  //         setLoading(true);
  //         const response = await axios.get(
  //           "https://newsapi.org/v2/everything?q=education&apiKey=ff4d356650cf48c0bd58a0575e13ee06"
  //         );
  //         const responseToJson = await response.json();
  //         const randomArticle: news[] = responseToJson?.articles;
  //         const filterArticles = randomArticle.filter(
  //           (article) => article?.source.id !== null
  //         );
  //         setLoading(false);
  //         setNewsData(filterArticles);
  //       } catch (error) {
  //         if (typeof error == "object" && error !== null) {
  //           console.error(error.toString());
  //         } else {
  //           //("Unexpected error", error);
  //         }
  //       }
  //       getNews();

  //       return () => {
  //         controller.abort();
  //       };
  //     };
  //   }, [search]);
  useEffect(() => {
    const getNewsUnder = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=${searchInput}&apiKey=ff4d356650cf48c0bd58a0575e13ee06`
        );
        setSearchNews(response.data.articles);
      } catch (error) {}
    };
    getNewsUnder();
  }, [searchInput]);

  return (
    <div>
      <div className="grid grid-rows-2 grid-flow-col gap-4 items-center">
        {loading ? (
          <p>Loading ...</p>
        ) : (
          <>
            {searchNews?.slice(10, 20).map((item: any) => (
              <div key={item.id} className="items-center w-full h-full">
                <div className="flex gap-10 pt-6 m-24">
                  <img
                    src={item.urlToImage}
                    height={250}
                    width={250}
                    alt="img"
                  />
                </div>
                <div className="flex flex-col gap-3 max-w-[25ch]">
                  <p className="font-semibold text-xl ">{item.title}</p>
                  <p className="text-sm text-ellipsis line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
