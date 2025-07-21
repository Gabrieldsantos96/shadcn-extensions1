import { NextResponse } from "next/server";
import db from "@/db.json";
import { sleep } from "@/src/utils/sleep";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("name_like") || "";
  const start = parseInt(searchParams.get("_start") || "0", 10);
  const limit = parseInt(searchParams.get("_limit") || "10", 10);

  await sleep(500);

  let users = db.users;
  if (searchTerm) {
    users = users.filter((user: any) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const paginatedData = users.slice(start, start + limit).map((s: any) => ({
    label: s.name,
    value: s.id,
  }));

  return NextResponse.json(paginatedData, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
}

export async function HEAD(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("name_like") || "";
  let users = db.users;
  if (searchTerm) {
    users = users.filter((user: any) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  return NextResponse.json({ total: users.length });
}
