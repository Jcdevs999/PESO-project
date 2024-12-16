"use client";

import React, { useState } from "react";
import Link from "next/link";
import LoginPage from "../login/page";
import Searchbar from "@/components/Searchbar";
import { UserProvider } from "@/context/qwert";
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
    

    <div >
      <div className="h-12 text-white p-3 flex items-center justify-between bg-qc-blue border-b-2 border-b-white uppercase md:h-24 lg:px-20 xl:px-10">
        {/* LEFT LINKS */}

       <Link href="/user" ><img src="/pics/qc_logo.png" alt="Quezon City logo" width="80" height="80"/></Link>
        <div className="flex items-left ml-14 gap-20 flex-row w-full">
          <Link href="/user">Home</Link>
          <Link href="/user/forecast">Forecast</Link>
          {/* <Link href="/user/news">News</Link> */}
          <Link href="/user/about">About</Link>
        </div>
        {/* MOBILE MENU */}
        <div className="md:hidden">
          <div>
            <LoginPage />
          </div>
        </div>
            <Link href="/admindb/">
            <img
              className="p-1 border-2  rounded-full bg-white border-black"
              src="/adminfolder/admin-moderator.png"
              height={60}
              width={60}
              alt=""
            />
          </Link>
        {/* RIGHT LINKS */}
        {/* <div className="">
          <Searchbar />
        </div> */}
      </div>
      <UserProvider>
        <div className="">
          <>{children}</>
        </div>
      </UserProvider>
      
      <div>
        
        <div className="md:h-20 lg:p-20 xl:p-36 bg-qc-blue border-b-4 border-b-gray-200 text-white items-center justify-items-left grid grid-rows-3 grid-flow-col gap-8">
        <Link className="absolute -ml-20 " href="/user" ><img src="/pics/qc_logo.png" alt="Quezon City logo" width="150" height="150"/></Link>
        <Link className="absolute ml-20 mb-10 " href="https://www.facebook.com/QCGov" target="_blank" ><img src="/pics/facebook_logo.png" alt="Facebook logo" width="65" height="65"/></Link>
        <Link className="absolute ml-20 mt-20 " href="https://www.youtube.com/quezoncitygovernment" target="_blank" ><img src="/pics/youtube_logo.png" alt="Youtube logo" width="65" height="65"/></Link>
        <Link className="absolute ml-40 mb-10 " href="https://x.com/qcgov" target="_blank" ><img src="/pics/x_logo.png" alt="X logo" width="60" height="60"/></Link>
          <div className="items-center justify-items-left grid grid-rows-4 grid-flow-col pt-0 pl-96 gap-1 font-semibold text-md uppercase">
            <Link href="/user" className="">
              Home
            </Link>
            <Link href="/user/forecast" className="">
              Forecasts
            </Link>
            {/* <Link href="/user/news" className="">
              News
            </Link> */}
            <Link href="/user/about" className="">
              About Us
            </Link>
            {/* <Link href="/" className="">
              Acknowledgements
            </Link>
            <Link href="/" className="">
              Disclaimer
            </Link>
            <Link href="/" className="">
              Privacy Policy
            </Link> */}
              Contact Us:
              8988-4242 | locals: 8435-8437

            <Link href="https://quezoncity.gov.ph/departments/public-employment-service-office/" target="_blank" rel="noopener noreferrer">
            <p className="">PESO@quezoncity.gov.ph</p>
            </Link>
            <Link href="https://quezoncity.gov.ph/" target="_blank" rel="noopener noreferrer">
            <p className="">QuezonCity.gov.ph</p>
            </Link>
          </div>
        </div>
        <div className="h-12 md:h-24 p-4 lg:p-20 xl:p-30 bg-qc-red  text-white flex items-center justify-between">
          <p className="text-center justify-center flex-1">
            Forecasting Economic Growth in Quezon City |
            Created in 2024 <br /> Copyright © 2024 | Public Employment Service Office
          </p>
        </div>
      </div>
    </div>
  );
}

