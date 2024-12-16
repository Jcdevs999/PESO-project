"use client";

import Filters from "@/components/Filters";
import Footer from "@/components/Footer";
import Latestnews from "@/components/Latestnews";
import Title from "@/components/Title";
import Navb from "@/types";
import React from "react";

const userPage = () => {
  return (
    <div>
      <div className="h-12 p-7 bg-qc-red text-white uppercase px-16 flex items-center text-md border-b-2">
        <h2>
          Home
        </h2>
      </div>
      <Latestnews />
      <Filters />
    </div>
  );
};

export default userPage;
