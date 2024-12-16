// api/login/route.ts
import { NextResponse } from "next/server";
import User from "@/models/userModels";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "../../../db/config";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ msg: "Invalid credentials" }, { status: 400 });
    }

    const isUserPresent = await User.findOne({ email });
    if (!isUserPresent) {
      return NextResponse.json({ msg: "Invalid credentials" }, { status: 409 });
    }

    const isMatch = await bcrypt.compare(password, isUserPresent.password);
    if (!isMatch) {
      return NextResponse.json({ msg: "Invalid credentials" }, { status: 409 });
    }

    const name = isUserPresent.name;
    const token = jwt.sign({ name, email }, "mangodbzxyc", { expiresIn: "1h" });

    const response = NextResponse.json(
      { msg: "User logged in successfully", redirectTo: "/admindb" },
      { status: 201 }
    );

    // Set the JWT token in a cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      path: "/",
      maxAge: 60 * 60, // 1 hour expiration
    });

    return response;
  } catch (err) {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
