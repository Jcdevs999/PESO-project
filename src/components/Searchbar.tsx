"use client";

import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import { useSearch } from "@/context/qwert";

const Searchbar = () => {
  const { searchInput, setSearchInput } = useSearch();
  const [query, setQuery] = useState("");
  const [news, setNews] = useState<any>([]);
  const [keyword, setKeyword] = useState<string>("");
  const router = useRouter();
  const searchKeyword = (e: FormEvent) => {
    e.preventDefault();
    if (!keyword) {
      router.push("/");
    } else {
      router.push(`/user/search?q=${keyword}`);
    }
  };

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

  //(searchInput);
  return (
    <div>
      <div className="flex flex-col max-w-lg mx-auto text-black">
        <form className="flex space-x-2 items-center" onSubmit={searchKeyword}>
          <input
            type="text"
            className="px-4 py-1 border-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500 rounded-lg"
            placeholder="Search"
            onChange={(e) => {
              setSearchInput(e.target.value);
              setKeyword(e.target.value);
            }}
          />
          <button className="text-3xl" type="submit">
            <BiSearch className="text-black text-xl" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Searchbar;
