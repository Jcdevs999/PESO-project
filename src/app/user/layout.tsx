"use client";

import React, { useState } from "react";
import Link from "next/link";
import LoginPage from "../login/page";
import Searchbar from "@/components/Searchbar";
import { UserProvider } from "@/context/qwert";
import Image from "next/image";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navbarButton, setNavbarButton] = useState({
    home: false,
    forecasts: false,
    news: false,
    about: false,
  });

  const user = false;
  return (
    <div>
      <div className="h-12 text-white p-3 flex items-center justify-between bg-qc-blue border-b-white uppercase md:h-24 lg:px-20 xl:px-10">
        {/* LEFT LINKS */}
        <Link href="/user">
          <img
            src="/pics/qc_logo.png"
            alt="Quezon City logo"
            width={100}
            height={100}
          />
        </Link>
        <div className="flex items-left ml-14 gap-20 flex-row w-full">
          <Link
            href="/user"
            className="transition-all duration-300 transform hover:scale-110 hover:text-gray-300"
          >
            Home
          </Link>
          {/* <Link
            href="/user/forecast"
            className="transition-all duration-300 transform hover:scale-110 hover:text-gray-300"
          >
            Forecast
          </Link> */}
          {/* <Link href="/user/news">News</Link> */}
          <Link
            href="/user/about"
            className="transition-all duration-300 transform hover:scale-110 hover:text-gray-300"
          >
            About
          </Link>
        </div>
        {/* MOBILE MENU */}
        <div className="md:hidden">
          <div>
            <LoginPage />
          </div>
        </div>
        <Link href="/admindb/">
          <Image
            className="p-1 border-2 rounded-full bg-white border-black"
            src="/adminfolder/admin-moderator.png"
            height={50}
            width={50}
            alt=""
          />
        </Link>
      </div>
      <UserProvider>
        <div className="">
          <>{children}</>
        </div>
      </UserProvider>

      <div>
        <div className="md:h-20 lg:p-20 xl:p-36 bg-qc-blue border-b-gray-200 text-white items-center justify-items-left grid grid-rows-3 grid-flow-col gap-8">
          <Link className="absolute -ml-20" href="/user">
            <img
              src="/pics/qc_logo.png"
              alt="Quezon City logo"
              width="150"
              height="150"
              className="transition-transform transform hover:scale-105 hover:rotate-3"
            />
          </Link>
          <Link
            className="absolute ml-20 mb-10 transition-all duration-300 hover:scale-110 hover:text-gray-300"
            href="https://www.facebook.com/QCGov"
            target="_blank"
          >
            <img
              src="/pics/facebook_logo.png"
              alt="Facebook logo"
              width="65"
              height="65"
              className="transition-transform transform hover:scale-110"
            />
          </Link>
          <Link
            className="absolute ml-20 mt-20 transition-all duration-300 hover:scale-110 hover:text-gray-300"
            href="https://www.youtube.com/quezoncitygovernment"
            target="_blank"
          >
            <img
              src="/pics/youtube_logo.png"
              alt="Youtube logo"
              width="65"
              height="65"
              className="transition-transform transform hover:scale-110"
            />
          </Link>
          <Link
            className="absolute ml-40 mb-10 transition-all duration-300 hover:scale-110 hover:text-gray-300"
            href="https://x.com/qcgov"
            target="_blank"
          >
            <img
              src="/pics/x_logo.png"
              alt="X logo"
              width="60"
              height="60"
              className="transition-transform transform hover:scale-110"
            />
          </Link>
          <div className="items-center justify-items-left grid grid-rows-4 grid-flow-col pt-0 pl-96 gap-1 font-semibold text-md uppercase">
            <Link
              href="/user"
              className="transition-all duration-300 hover:scale-110 hover:text-gray-300"
            >
              Home
            </Link>
            <Link
              href="/user/forecast"
              className="transition-all duration-300 hover:scale-110 hover:text-gray-300"
            >
              Forecasts
            </Link>
            {/* <Link href="/user/news" className="transition-all duration-300 hover:scale-110 hover:text-gray-300">
      News
    </Link> */}
            <Link
              href="/user/about"
              className="transition-all duration-300 hover:scale-110 hover:text-gray-300"
            >
              About Us
            </Link>
            {/* <Link href="/" className="transition-all duration-300 hover:scale-110 hover:text-gray-300">
      Acknowledgements
    </Link>
    <Link href="/" className="transition-all duration-300 hover:scale-110 hover:text-gray-300">
      Disclaimer
    </Link>
    <Link href="/" className="transition-all duration-300 hover:scale-110 hover:text-gray-300">
      Privacy Policy
    </Link> */}
            Contact Us: 8988-4242 | locals: 8435-8437
            <Link
              href="https://quezoncity.gov.ph/departments/public-employment-service-office/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="transition-all duration-300 hover:text-gray-300">
                PESO@quezoncity.gov.ph
              </p>
            </Link>
            <Link
              href="https://quezoncity.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="transition-all duration-300 hover:text-gray-300">
                QuezonCity.gov.ph
              </p>
            </Link>
          </div>
        </div>
        <div className="h-12 md:h-24 p-4 lg:p-20 xl:p-30 bg-qc-red text-white flex items-center justify-between">
          <p className="text-center justify-center flex-1 transition-all duration-300 hover:text-gray-300">
            Forecasting Economic Growth in Quezon City | Created in 2024 <br />
            Copyright © 2024 | Public Employment Service Office
          </p>
        </div>
      </div>
    </div>
  );
}
