// /api/user/route.ts
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode("mangodbzxyc");

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1];
    if (!token) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, secret);
    const { name } = payload as { name: string };

    return NextResponse.json({ name });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }
}
