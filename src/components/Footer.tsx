import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <div>
      <div className="md:h-20 lg:p-20 xl:p-36 bg-gray-700 border-b-4 border-b-gray-200 text-white items-center justify-items-left grid grid-rows-3 grid-flow-col gap-8">
        <div className="items-center justify-items-left grid grid-rows-4 grid-flow-col pt-0 pl-96 gap-1 font-semibold text-xl">
          <Link href="/home" className="">
            Home
          </Link>
          <Link href="/forecast" className="">
            Forecasts
          </Link>
          <Link href="/news" className="">
            News
          </Link>
          <span></span>
          <Link href="/about" className="">
            About Us
          </Link>
          <Link href="/" className="">
            Acknowledgements
          </Link>
          <Link href="/" className="">
            Disclaimer
          </Link>
          <Link href="/" className="">
            Privacy Policy
          </Link>
          <Link href="/" className=" ">
            Contact Us
          </Link>
          <p className="">example@gmail.com</p>
        </div>
      </div>
      <div className="h-12 md:h-24 p-4 lg:p-20 xl:p-30 bg-gray-700  text-white flex items-center justify-between">
        <p className="text-center justify-center flex-1">
          Forecasting Unemployment Rate for Economic Growth in Quezon City |
          Created in 2024 <br /> Copyright © 2024 Name / Organization Name
        </p>
      </div>
    </div>
  );
};

export default Footer;
