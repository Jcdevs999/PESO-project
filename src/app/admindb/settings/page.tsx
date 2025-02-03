"use client";

import Image from "next/image";
import React, {useState} from "react";

const profileSettings = () => {

   const [profilePicture, setProfilePicture] = useState(
     "/adminfolder/user.png"
   );
   const [name, setName] = useState("John Lemon");
   const [email, setEmail] = useState("JohnLemon@gmail.com");
   const [contacts, setContacts] = useState("Null");

   const [isEditingName, setIsEditingName] = useState(false);
   const [isEditingEmail, setIsEditingEmail] = useState(false);
   const [isEditingContacts, setIsEditingContacts] = useState(false);

   const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
     if (event.target.files && event.target.files[0]) {
       const file = event.target.files[0];
       const reader = new FileReader();

       reader.onloadend = () => {
         setProfilePicture(reader.result as string);
       };

       reader.readAsDataURL(file);
     }
   };

   const handleDelete = () => {
     setProfilePicture("/adminfolder/user.png");
   };

   const handleSave = (field: "name" | "email" | "contacts", value: string) => {
     if (field === "name") setName(value);
     if (field === "email") setEmail(value);
     if (field === "contacts") setContacts(value);

     setIsEditingName(false);
     setIsEditingEmail(false);
     setIsEditingContacts(false);
   };

  return (
    <div className="m-6">
      <div className="flex flex-col w-full border border-gray-300 p-6 rounded-xl shadow-md transition-all duration-500 ease-in-out">
        <p className="font-semibold text-2xl text-gray-800">Profile Settings</p>
        <div className="flex w-full">
          <div className="m-12 pr-20 p-4">
            <div className="border-gray-400">
              <div className="h-[200px] w-[200px] border-4 border-gray-500 rounded-full overflow-hidden shadow-inner">
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full rounded-full"
                />
              </div>
              <div className="flex justify-center mt-6 p-2">
                <button
                  className="border-2 mr-4 border-gray-400 bg-red-500 rounded-full p-2 hover:bg-red-600"
                  onClick={handleDelete}
                >
                  <img
                    src="/adminfolder/clear.png"
                    height={50}
                    width={25}
                    alt="Clear"
                  />
                </button>
                <label className="border-[1px] border-gray-400 rounded-full hover:bg-gray-800 hover:text-white p-2 transition-colors cursor-pointer">
                  <p className="text-md font-semibold pl-4 pr-4">Upload</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full mt-12">
            <div className="w-full mb-6">
              <p className="font-semibold text-2xl text-gray-800">Name:</p>
              <div className="flex items-center">
                {isEditingName ?
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-2 text-lg border-b-2 border-gray-400 focus:outline-none"
                  />
                : <p className="w-full mt-2 text-lg text-gray-500">{name}</p>}
                <img
                  src="/adminfolder/editing.png"
                  height={30}
                  width={30}
                  alt="Edit"
                  className="cursor-pointer"
                  onClick={() => setIsEditingName(!isEditingName)}
                />
              </div>
            </div>
            <div className="w-full mb-6">
              <p className="font-semibold text-2xl text-gray-800">Email:</p>
              <div className="flex items-center">
                {isEditingEmail ?
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-2 text-lg border-b-2 border-gray-400 focus:outline-none"
                  />
                : <p className="w-full mt-2 text-lg text-gray-500">{email}</p>}
                <img
                  src="/adminfolder/editing.png"
                  height={30}
                  width={30}
                  alt="Edit"
                  className="cursor-pointer"
                  onClick={() => setIsEditingEmail(!isEditingEmail)}
                />
              </div>
            </div>
            <div className="w-full mb-6">
              <p className="font-semibold text-2xl text-gray-800">Contacts:</p>
              <div className="flex items-center">
                {isEditingContacts ?
                  <input
                    type="text"
                    value={contacts}
                    onChange={(e) => setContacts(e.target.value)}
                    className="w-full mt-2 text-lg border-b-2 border-gray-400 focus:outline-none"
                  />
                : <p className="w-full mt-2 text-lg text-gray-500">
                    {contacts}
                  </p>
                }
                <img
                  src="/adminfolder/editing.png"
                  height={30}
                  width={30}
                  alt="Edit"
                  className="cursor-pointer"
                  onClick={() => setIsEditingContacts(!isEditingContacts)}
                />
              </div>
            </div>
            <div className="w-full mb-6">
              <p className="font-semibold text-2xl text-gray-800">Role:</p>
              <p className="mt-2 text-lg text-gray-500">User</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="border border-gray-300 shadow-md transition-all duration-500 ease-in-out w-[600px] m-4 h-[500px] flex rounded-lg p-4">
          <div className="flex flex-col">
            <p className="p-2 font-semibold text-lg">System Configuration:</p>
            <p className="text-md font-semibold p-2">Data Refresh Interval:</p>
            <div className="w-fit p-2">
              <div className="border-[1px] w-fit border-gray-400 rounded-md px-4 py-2 text-sm">
                <select id="dataRef" defaultValue="">
                  <option className="text-gray-100" value="" disabled hidden>
                    Select Options
                  </option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div>
              <p className="pl-2 pt-6 font-semibold text-lg">Preference:</p>
              <div className="flex w-full">
                <div>
                  <p className="p-2 font-semibold text-md">Theme:</p>
                  <div className="w-fit p-2">
                    <div className="border-[1px] w-55 inline-block border-gray-400 rounded-md px-4 py-2 text-sm">
                      <select id="systemSettings" defaultValue="">
                        <option
                          className="text-gray-100"
                          value=""
                          disabled
                          hidden
                        >
                          System Settings
                        </option>
                        <option value="Night">Night</option>
                        <option value="Day">Day</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="pl-10">
                  <p className="p-2 font-semibold text-md">Fonts:</p>
                  <div className="w-fit p-2">
                    <div className="border-[1px] w-fit border-gray-400 rounded-md px-4 py-2 text-sm">
                      <select id="systemSettings" defaultValue="">
                        <option
                          className="text-gray-100"
                          value=""
                          disabled
                          hidden
                        >
                          System Settings
                        </option>
                        <option value="Arial">Arial</option>
                        <option value="Calibri">Calibri</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" w-[925px] h-[500px] m-4 flex flex-col border border-gray-300 rounded-xl shadow-md transition-all duration-500 ease-in-out">
          <div className="border-b-2 border-gray-300 w-full h-fit p-2">
            <p className="text-sm font-semibold p-2">Latest Backup</p>
          </div>
          <div className="flex w-full h-full items-center">
            <div className="flex items-center w-full border-r-2 border-b-2 border-gray-300 h-full p-2 text-xs"></div>
            <div className="flex items-center w-full border-r-2 border-b-2 border-gray-300 h-full p-2 text-xs">
              <p>Date Created</p>
            </div>
            <div className="flex items-center w-full h-full border-b-2 p-2 border-gray-300 text-xs">
              <p>Type</p>
            </div>
          </div>
          <div className="flex w-full h-full items-center">
            <div className="flex items-center justify-center w-full border-r-2 border-b-2 border-gray-300 h-full p-2 text-xs">
              <input type="checkbox" name="" id="" />
            </div>
            <div className="flex items-center w-full border-r-2 border-b-2 border-gray-300 h-full p-2 text-xs">
              <p>January 1, 2024</p>
            </div>
            <div className="flex items-center w-full h-full border-b-2 p-2 border-gray-300 text-xs">
              <p>Manual Backup</p>
            </div>
          </div>
          <div className="flex w-full h-full items-center">
            <div className="flex items-center justify-center w-full border-r-2 border-b-2 border-gray-300 h-full p-2 text-xs">
              <input type="checkbox" name="" id="" />
            </div>
            <div className="flex items-center w-full border-r-2 border-b-2 border-gray-300 h-full p-2 text-xs">
              <p>January 1, 2024</p>
            </div>
            <div className="flex items-center w-full h-full border-b-2 p-2 border-gray-300 text-xs">
              <p>Manual Backup</p>
            </div>
          </div>
          <div className="flex w-full h-full items-center">
            <div className="flex items-center justify-center w-full border-r-2 border-b-2 border-gray-300 h-full p-2 text-xs">
              <input type="checkbox" name="" id="" />
            </div>
            <div className="flex items-center w-full border-r-2 border-b-2 border-gray-300 h-full p-2 text-xs">
              <p>January 1, 2024</p>
            </div>
            <div className="flex items-center w-full h-full border-b-2 p-2 border-gray-300 text-xs">
              <p>Manual Backup</p>
            </div>
          </div>
          <div className="flex w-full h-full items-center">
            <div className="flex items-center justify-center w-full border-r-2 border-b-2 border-gray-300 h-full p-2 text-xs">
              <input type="checkbox" name="" id="" />
            </div>
            <div className="flex items-center w-full border-b-2 border-r-2 border-gray-300 h-full p-2 text-xs">
              <p>January 1, 2024</p>
            </div>
            <div className="flex items-center w-full border-b-2 h-full p-2 border-gray-300 text-xs">
              <p>Manual Backup</p>
            </div>
          </div>
          <div className="flex flex-col p-2 items-center border-b-2 border-gray-300">
            <p className="text-lg font-semibold">Backup and Restore</p>
          </div>
          <div className="flex items-center w-full h-full ">
            <div className="flex flex-col border-r-2 items-center justify-center w-full border-gray-300 p-2">
              <img
                className="mb-4"
                src="/adminfolder/cloud.png"
                height={160}
                width={160}
                alt=""
              />
              <button className="border-2 rounded-lg border-gray-500  hover:bg-gray-800 transition-colors hover:text-white px-10 py-1 w-fit">
                <p className="text-xs font-semibold">Backup</p>
              </button>
            </div>
            <div className="flex flex-col items-center justify-center w-full border-gray-300 ">
              <img
                className="mb-4 mt-2"
                src="/adminfolder/history.png"
                height={100}
                width={100}
                alt=""
              />
              <button className="border-2 rounded-lg border-gray-500  hover:bg-gray-800 transition-colors hover:text-white px-10 py-1 w-fit">
                <p className="text-xs font-semibold">Restore</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default profileSettings;
