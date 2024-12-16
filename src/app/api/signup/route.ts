import User from "@/models/userModels";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "../../../db/config";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password } = body;

    // Check for missing fields
    if (!name || !email || !password) {
      return NextResponse.json({ msg: "Invalid fields" }, { status: 400 });
    }

    // Check if user already exists
    const isUserPresent = await User.findOne({ email });
    if (isUserPresent) {
      return NextResponse.json({ msg: "User already exists" }, { status: 409 });
    }

    // Hash the password and create the user
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, name, password: hashPassword });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ name, email }, "ahahshskdkdk");

    // Return success response with token and status 201
    const response = NextResponse.json(
      { msg: "User created successfully" },
      { status: 201 }
    );
    response.cookies.set("token", token);
    return response;

  } catch (err) {
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}

// import User from "@/models/userModels";
// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import connectDB from "../../../db/config";

// export async function POST(req: Request) {
//   try {
//     connectDB();
//     const body = await req.json();
//     const { name, email, password } = body;
//     if (!name || !email || !password) {
//       return NextResponse.json({ msg: "invalid fields" }, { status: 400 });
//     }
//     const isUserPresent = await User.findOne({ email });
//     if (isUserPresent) {
//       return NextResponse.json({ msg: "user already exists" }, { status: 409 });
//     }

//     const hashPassword = await bcrypt.hash(password, 10);

//     const user = new User({ email, name, password: hashPassword });
//     await user.save();
//     const token = jwt.sign({ name, email }, "ahahshskdkdk");
//     const response = NextResponse.json(
//       { msg: "user successful create" },
//       { status: 401 }
//     );
//     response.cookies.set("token", token);
//     return response;
//   } catch (err) {
//     return NextResponse.json({ msg: err }, { status: 500 });
//   }
// }
