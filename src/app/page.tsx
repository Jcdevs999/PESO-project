import Filters from "@/components/Filters";
import Latestnews from "@/components/Latestnews";
import Legends from "@/components/Legends";
import Title from "@/components/Title";
import Image from "next/image";
// import LoginPage from "./login/page";
import UserPage from "./user/page";
import RootLayout from "./user/layout"; 
import { Routes, Route } from "react-router-dom";

export default function Home() {
  return (
    <RootLayout>
          <UserPage />
    </RootLayout>
  );
}