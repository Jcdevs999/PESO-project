"use client";

import React, { ChangeEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LoginPage from "@/app/login/page";
import Searchbar from "./Searchbar";

const Navb = () => {
  const user = false;
  return (
    <div className="h-12 text-white p-3 flex items-center justify-between bg-gray-700 border-b-2 border-b-black uppercase md:h-24 lg:px-20 xl:px-40">
      {/* LEFT LINKS */}
      <div className="hidden md:flex gap-16">
        <Link href="/">Home</Link>
        <Link href="/forecast">Forecast</Link>
        {/* <Link href="/news">News</Link> */}
        <Link href="/about">About</Link>
      </div>
      {/* MOBILE MENU */}
      <div className="md:hidden">
        <div>
          <LoginPage />
        </div>
      </div>
      {/* RIGHT LINKS */}
      <div>
        <Searchbar />
      </div>
    </div>
  );
};

export default Navb;
