"use client";

import React, { useRef, useState } from "react";

const page = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState();

  const handleImageClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    //(file);
    setImage(event.target.files[0]);
  };
  return (
    <div>
      <div className="flex flex-col">
        <p className="font-semibold text-2xl">Graph</p>
        <div className="flex items-start space-x-8 p-6 mb-4 bg-background rounded-lg border-2 border-black">
        <div className="flex flex-col items-center">
          <img
                  src="/adminfolder/accuracy.png"
                  height={800}
                  width={800}
                  alt="Training and Validation"
                />
          
          <img
                  src="/adminfolder/actual-vs-predict.png"
                  height={800}
                  width={800}
                  alt="Actual vs Prediction GDP"
                />

          </div>
          </div>



        {/* <div className="m-6">
          <div className="flex items-start space-x-8 p-6 mb-4 bg-background rounded-lg border-2 border-black">
            <div className="flex flex-col items-center">
              <div className="w-52 h-52 border-black border-2 bg-zinc-200 rounded-full flex items-center justify-center">
                asd
              </div>
              <div>
                <button className="mt-2 bg-destructive text-destructive-foreground p-2 bg-red-500 rounded-full">
                  Delete
                </button>
                <button className="mt-2 bg-secondary text-secondary-foreground p-2 rounded-md">
                  Upload
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 bg-red-500 p-2 mx-2">
              <div className="items-end">
                <div className="flex justify-between">
                  <p className="font-semibold">Name:</p>
                  <p className="flex place-self-end">John Dope</p>
                  <button className="text-primary hover:text-primary/80"></button>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">Email:</p>
                  <p>johndope@gmail.com</p>
                  <button className="text-primary hover:text-primary/80"></button>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">Contacts:</p>
                  <p>123-456-7890</p>
                  <button className="text-primary hover:text-primary/80"></button>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">Role:</p>
                  <p>Admin</p>
                  <button className="text-primary hover:text-primary/80"></button>
                </div>
              </div>
            </div>
          </div>
          <div className="border-2 border-black w-[500px] h-[300px] flex rounded-lg p-2">
            asd
          </div>
          <div className="border-2 border-black w-full flex rounded-lg p-2">
            asd
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default page;
