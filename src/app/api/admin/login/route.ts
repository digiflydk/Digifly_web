
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const validUser = process.env.ADMIN_USER;
    const validPass = process.env.ADMIN_PASS;

    if (!validUser || !validPass) {
        console.error("ADMIN_USER or ADMIN_PASS environment variables are not set.");
        return NextResponse.json({ ok: false, error: "Server configuration error." }, { status: 500 });
    }

    if (username === validUser && password === validPass) {
      cookies().set("dadmin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ ok: false, error: "An unexpected error occurred." }, { status: 500 });
  }
}
