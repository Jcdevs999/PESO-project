// admindb/layout.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarButton, setSidebarButton] = useState({
    admin: false,
    datamanage: false,
    model: false,
    report: false,
    userdoc: false,
    settings: false,
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user", { withCredentials: true });
        setUsername(response.data.name);
      } catch (error) {
        console.log("Error fetching user data", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      router.push("/login");
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  return (
    <div className="z-20 grid grid-cols-[230px_1fr]">
      {/* Sidebar */}
      <div className="h-screen bg-qc-blue flex p-4 border-r-black font-semibold text-sm">
        <div className="flex items-left gap-6 flex-col w-full">
          <div className="ml-5">
            <Link href="/admindb">
              <img
                src="/pics/qc_logo.png"
                alt="Quezon City logo"
                width="150"
                height="150"
                className="transition-opacity duration-500 ease-in-out hover:opacity-80"
              />
            </Link>
          </div>

          {/* Sidebar Links with Hover Animations */}
          <Link
            className="hover:bg-slate-500 rounded-xl flex items-center gap-2 bg-slate-200 p-2 transition-all duration-300 ease-in-out transform hover:scale-105"
            href="/admindb"
          >
            <img
              src="/adminfolder/barchart.png"
              height={25}
              width={25}
              alt=""
            />
            <p className="text-sm font-semibold uppercase">Admin Dashboard</p>
          </Link>
          <Link
            className="hover:bg-slate-500 rounded-xl flex items-center gap-2 bg-slate-200 p-2 transition-all duration-300 ease-in-out transform hover:scale-105"
            href="/admindb/datamanage"
          >
            <img src="/adminfolder/folder.png" height={25} width={25} alt="" />
            <p className="text-sm font-semibold uppercase">Data Management</p>
          </Link>
          <Link
            className="hover:bg-slate-500 rounded-xl flex items-center gap-2 bg-slate-200 p-2 transition-all duration-300 ease-in-out transform hover:scale-105"
            href="/admindb/graph"
          >
            <img
              src="/adminfolder/linechart.png"
              height={25}
              width={25}
              alt=""
            />
            <p className="text-sm font-semibold uppercase">Graph</p>
          </Link>
          <Link
            className="hover:bg-slate-500 rounded-xl flex items-center gap-2 bg-slate-200 p-2 transition-all duration-300 ease-in-out transform hover:scale-105"
            href="/admindb/userdoc"
          >
            <img
              src="/adminfolder/linechart.png"
              height={25}
              width={25}
              alt=""
            />
            <p className="text-sm font-semibold uppercase">User Management</p>
          </Link>
          <Link
            className="hover:bg-slate-500 rounded-xl flex items-center gap-2 bg-slate-200 p-2 transition-all duration-300 ease-in-out transform hover:scale-105"
            href="/admindb/settings"
          >
            <img
              src="/adminfolder/linechart.png"
              height={25}
              width={25}
              alt=""
            />
            <p className="text-sm font-semibold uppercase">Profile Settings</p>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col grow h-full w-full">
        <div className="h-5 text-white p-4 bg-qc-red border-b-2 border-b-red-600 flex justify-end items-center uppercase md:h-16 lg:px-10 w-full">
          <div className="flex items-center space-x-4">
            <Link href="/user/">
              <img
                className="p-1 rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-110"
                src="/adminfolder/userPublic.png"
                height={40}
                width={40}
                alt=""
              />
            </Link>
            <span>{username || "Loading..."}</span>
            <img
              className="p-3 rounded-lg bg-transparent cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110"
              src="/adminfolder/drop-down.png"
              height={40}
              width={40}
              alt=""
              onClick={() => setShowDropdown(!showDropdown)}
            />
          </div>
          {showDropdown && (
            <div className="absolute top-16 right-4 bg-white shadow-md rounded-lg py-2 z-50 transition-all duration-300 ease-in-out transform">
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area with Fade-In Animation */}
        <div className="pl-[30px] pt-4 h-[90vh] overflow-y-scroll w-full animate-fadeIn">
          {children}
        </div>
      </div>
    </div>
  );
}


// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { UserProvider } from "@/context/qwert";
// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [sidebarButton, setSidebarButton] = useState({
//     admin: false,
//     datamanage: false,
//     model: false,
//     report: false,
//     userdoc: false,
//     settings: false,
//   });

//   return (
//     <div className="z-20 grid grid-cols-[230px_1fr]">
//       <div className="h-screen bg-qc-blue border-r-2 flex p-4 border-r-black font-semibold text-sm">
//         <div className="flex items-left gap-6 flex-col w-full">
//             <div className="ml-5">
//             <Link href="/admindb"><img src="/pics/qc_logo.png" alt="Quezon City logo" width="150" height="150"/></Link>
//               </div>
//           <Link
//             className=" hover:bg-slate-500 rounded-xl flex items-center gap-2 bg-slate-200 p-2"
//             href="/admindb"
//           >
//             <img
//               src="/adminfolder/linechart.png"
//               height={25}
//               width={25}
//               alt=""
//             />
//             <p className="text-sm font-semibold">Admin Dashboard</p>
//           </Link>
//           <Link
//             className="hover:bg-slate-500 rounded-xl flex items-center gap-2 bg-slate-200 p-2"
//             href="/admindb/datamanage"
//           >
//             <img src="/adminfolder/folder.png" height={25} width={25} alt="" />
//             <p className="text-sm font-semibold">Data Management</p>
//           </Link>
//           {/* <div
//             className="relative hover:bg-slate-500 rounded-xl flex items-center gap-2 bg-slate-200 px-2 py-2 font-semibold text-sm "
//             onClick={() =>
//               setSidebarButton((prev) => ({ ...prev, model: !prev.model }))
//             }
//           >
//             {sidebarButton.model && (
//               <div className="absolute z-20 bg-gray-300 -right-[125px] -bottom-[65px] flex flex-col text-md">
//                 <Link
//                   className="bg-slate-200 hover:bg-slate-500 m-2  p-[8px]"
//                   href="/admindb/modeltraining"
//                 >
//                   Model Training
//                 </Link>
//                 <Link
//                   className="bg-slate-200 hover:bg-slate-500 m-2 p-[9px]"
//                   href="/admindb/modeltesting"
//                 >
//                   Model Testing
//                 </Link>
//               </div>
//             )}
//             <img
//               className=" hover:bg-slate-500 rounded"
//               src="/adminfolder/modeling.png"
//               height={25}
//               width={25}
//               alt=""
//             />
//             <p>Models</p>
//           </div> */}
//           <Link
//             className="hover:bg-slate-500 rounded-xl flex items-center gap-2 bg-slate-200 p-2"
//             href="/admindb/reports"
//           >
//             <img src="/adminfolder/report.png" height={25} width={25} alt="" />
//             <p>Reports</p>
//           </Link>
//           {/* <Link
//             className="hover:bg-slate-500 rounded-xl flex items-center gap-2 bg-slate-200 p-2"
//             href="/admindb/"
//           >
//             <img src="/adminfolder/file.png" height={25} width={25} alt="" />
//             <p>User Documents</p>
//           </Link> */}
//           {/* <Link
//             className="hover:bg-slate-500 rounded-xl flex items-center gap-2 bg-slate-200 p-2"
//             href="/admindb/settings"
//           >
//             <img
//               src="/adminfolder/settings.png"
//               height={25}
//               width={25}
//               alt=""
//             />
//             <p>Settings</p>
//           </Link> */}
//         </div>
//       </div>

//       <div className="flex flex-col grow h-full w-full">
//         <div className="h-5 text-white p-4 bg-qc-red border-b-2 border-b-black flex justify-end uppercase md:h-16 lg:px-10 w-full ">
//           <Link href="/user/">
//             <img
//               className="p-1 border-2 rounded-lg bg-white border-black"
//               src="/adminfolder/userPublic.png"
//               height={40}
//               width={40}
//               alt=""
//             />
//           </Link>
//         </div>
//         <div className="pl-[30px] pt-4 h-[90vh] overflow-y-scroll w-full">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }
