"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // Success message state
  const router = useRouter();

  const handleShowPasswordChange = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("/api/signup", {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => router.push("/login"), 2000); // Redirect after 2 seconds
      }
    } catch (err) {
      setError("Failed to create an account. Please try again.");
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg border-b-[2px] rounded-lg p-10">
        <div className="flex justify-center">
          <img src="/pics/qc_logo.png" alt="Quezon City logo" width="150" height="150" />
        </div>
        <span className="border-b-[2px] border-qc-blue w-full flex mt-4"></span>
        <h1 className="text-xl font-semibold my-4">Register</h1>
        
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Full Name"
            id="fname"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-[400px] border-gray-200 bg-zinc-100/40"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-[400px] border-gray-200 bg-zinc-100/40"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-[400px] border-gray-200 bg-zinc-100/40"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-indigo-600"
              id="show-password"
              checked={showPassword}
              onChange={handleShowPasswordChange}
            />
            <label htmlFor="show-password" className="ml-2 text-gray-700 text-sm font-semibold">
              Show password
            </label>
          </div>
          <button className="bg-qc-blue text-white cursor-pointer px-6 py-2">
            Register
          </button>
          
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {success}
            </div>
          )}

          <span className="border-b-[2px] border-qc-blue w-full flex"></span>
          <Link href={"/login"} className="bg-qc-blue text-white cursor-pointer px-6 py-2 text-center">
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;


// "use client";

// import React, { useState, useEffect, FormEvent, useRef } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import axios from "axios";

// const registerPage = () => {
//   const [name, setName] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState<string>();
//   const router = useRouter();
//   const ref = useRef<HTMLFormElement>(null);

//   const handleShowPasswordChange = () => {
//     setShowPassword(!showPassword);
//   };

//   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log(name, email, password);
//     axios
//       .post<{ email: string; password: string; name: string }>("/api/signup", {
//         email,
//         password,
//         name,
//       })
//       .then((res) => res)
//       .catch((err) => err);
//   };

//   return (
//     <div className="grid place-items-center h-screen">
//       <div className="shadow-lg border-b-[2px] rounded-lg p-10">
//       <div className="flex justify-center">
//           <img src="/pics/qc_logo.png" alt="Quezon City logo" width="150" height="150" />
//          </div> 
//          <span className="border-b-[2px] border-qc-blue w-full flex mt-4"></span>
//         <h1 className="text-xl font-semibold my-4">Register</h1>
//         <form onSubmit={onSubmit} className="flex flex-col gap-3">
//           <input
//             type="text"
//             placeholder="Full Name"
//             id="fname"
//             className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-[400px] border-gray-200  bg-zinc-100/40"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             id="email"
//             className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-[400px] border-gray-200  bg-zinc-100/40"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <input
//             className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-[400px] border-gray-200  bg-zinc-100/40"
//             type={showPassword ? "text" : "password"}
//             placeholder="Password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <div className="flex items-center mt-2">
//             <input
//               type="checkbox"
//               className="form-checkbox h-4 w-4 text-indigo-600"
//               id="show-password"
//               checked={showPassword}
//               onChange={handleShowPasswordChange}
//             />
//             <label
//               htmlFor="show-password"
//               className="ml-2 text-gray-700 text-sm font-semibold"
//             >
//               Show password
//             </label>
//           </div>
//           <div className="mb-4"></div>
//           <button className="bg-qc-blue text-white cursor-pointer px-6 py-2">
//             Register
//           </button>
//           <span className="border-b-[2px] border-qc-blue w-full flex"></span>
//           <Link
//             href={"/login"}
//             className="bg-qc-blue text-white cursor-pointer px-6 py-2 text-center"
//           >
//             Back to Login
//           </Link>
//           {error && (
//             <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
//               {error}
//             </div>
//           )}
//           <Link
//             className="text-sm text-end underline text-blue-500"
//             href={"/forgotpass"}
//           >
//             Forgot Password?
//           </Link>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default registerPage;
