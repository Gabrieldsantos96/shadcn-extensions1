import { NextResponse } from "next/server";
import db from "@/db.json";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = db.users.find((u: any) => u.id === params.id);
  if (!user) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.json(user, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
}
