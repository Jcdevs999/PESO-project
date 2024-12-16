"use client";

import { news } from "@/types";
import { error } from "console";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Article from "./Article";

const SearchPage = () => {
  const [newsData, setNewsData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const search = searchParams ? searchParams.get("q") : null;

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://newsapi.org/v2/everything?q=${search}&apiKey=ff4d356650cf48c0bd58a0575e13ee06",
          { signal }
        );
        const responseToJson = await response.json();
        const randomArticle: news[] = responseToJson?.articles;
        const filterArticles = randomArticle.filter(
          (article) => article?.source.id !== null
        );
        setLoading(false);
        setNewsData(filterArticles);
      } catch (error) {
        if (typeof error == "object" && error !== null) {
          console.error(error.toString());
        } else {
          //("Unexpected error", error);
        }
      }
      getNews();

      return () => {
        controller.abort();
      };
    };
  }, [search]);

  return (
    <div className="w-[700px]">
      {loading ? (
        <p>Loading ...</p>
      ) : (
        <>
          {newsData.map((article: news, idx: number) => (
            <div key={`${article?.title}-${idx}`}>
              <Article data={article} />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SearchPage;
