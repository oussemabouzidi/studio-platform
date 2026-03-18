import { NextRequest, NextResponse } from "next/server";

function backendBaseUrl() {
  const fromApiBaseUrl =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (fromApiBaseUrl) return fromApiBaseUrl.replace(/\/+$/, "");

  const fromBackendUrl = process.env.BACKEND_URL;
  if (fromBackendUrl) return `${fromBackendUrl.replace(/\/+$/, "")}/api`;

  return null;
}

export async function POST(req: NextRequest) {
  const base = backendBaseUrl();
  if (!base) {
    return NextResponse.json(
      { error: "Missing API_BASE_URL (preferred) or BACKEND_URL on the Next.js server." },
      { status: 500 },
    );
  }

  const targetUrl = `${base}/uploads/confirm${req.nextUrl.search}`;
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");

  const body = await req.arrayBuffer();

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(targetUrl, {
      method: "POST",
      headers,
      body,
      redirect: "manual",
    });
  } catch {
    return NextResponse.json({ error: "Upstream backend request failed.", targetUrl }, { status: 502 });
  }

  const resHeaders = new Headers();
  upstreamRes.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey === "set-cookie") return;
    if (lowerKey === "content-encoding") return;
    if (lowerKey === "content-length") return;
    resHeaders.set(key, value);
  });

  const resBody = await upstreamRes.arrayBuffer();
  return new NextResponse(resBody, { status: upstreamRes.status, headers: resHeaders });
}

