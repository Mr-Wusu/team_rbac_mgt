import { checkDbConnexion } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const isConnected = await checkDbConnexion();
  if (!isConnected)
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed!",
      },
      { status: 503 },
    );

  return NextResponse.json(
    {
      message: "Successfully connected to DB!",
      status: "ok"
    },
    { status: 200 },
  );
}
