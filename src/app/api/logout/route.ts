import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const response = NextResponse.json(
      { msg: "user logged out successfully" },
      { status: 200 }
    );

    // Corrected: Delete the token by passing the options as a single object
    response.cookies.delete({ name: "token", path: "/" });

    return response;
  } catch (err) {
    return NextResponse.json({ msg: err }, { status: 500 });
  }
}
