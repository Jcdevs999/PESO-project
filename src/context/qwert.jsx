"use client";

import React, { createContext, useContext, useState } from "react";
import Navb from "@/types";
import Footer from "@/components/Footer";

const SearchContext = createContext();

export const UserProvider = ({ children }) => {
  const [searchInput, setSearchInput] = useState();
  return (
    <SearchContext.Provider value={{ searchInput, setSearchInput }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a UserProvider");
  }
  return context;
};
