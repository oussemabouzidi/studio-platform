import { NextRequest, NextResponse } from "next/server";

function backendBaseUrl() {
  const fromApiBaseUrl =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (fromApiBaseUrl) return fromApiBaseUrl.replace(/\/+$/, "");

  const fromBackendUrl = process.env.BACKEND_URL;
  if (fromBackendUrl) return `${fromBackendUrl.replace(/\/+$/, "")}/api`;

  return null;
}

async function proxy(
  req: NextRequest,
  params: Promise<{ path: string[] }> | { path: string[] },
) {
  const base = backendBaseUrl();
  if (!base) {
    return NextResponse.json(
      {
        error:
          "Missing API_BASE_URL (preferred) or BACKEND_URL on the Next.js server.",
      },
      { status: 500 },
    );
  }

  const { path } = await params;
  const pathStr = path.join("/");
  const targetUrl = `${base}/${pathStr}${req.nextUrl.search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");
  // If a user is already authenticated on the backend, some backends will
  // prioritize the existing session cookie and ignore new login credentials.
  // Strip cookies only for auth endpoints that must establish a new session.
  if (
    pathStr === "auth/login" ||
    pathStr.startsWith("auth/login/") ||
    pathStr === "auth/register" ||
    pathStr.startsWith("auth/register/") ||
    pathStr === "auth/signup" ||
    pathStr.startsWith("auth/signup/")
  ) {
    headers.delete("cookie");
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      redirect: "manual",
    });
  } catch {
    return NextResponse.json(
      {
        error: "Upstream backend request failed.",
        targetUrl,
      },
      { status: 502 },
    );
  }

  // Preserve headers, but handle Set-Cookie carefully: multiple Set-Cookie headers
  // must be forwarded as separate header values (comma-joining breaks cookies).
  const resHeaders = new Headers();
  upstreamRes.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey === "set-cookie") return;
    if (lowerKey === "content-encoding") return;
    if (lowerKey === "content-length") return;
    resHeaders.set(key, value);
  });

  const upstreamHeaders = upstreamRes.headers as unknown as {
    getSetCookie?: () => string[];
  };
  const setCookies =
    typeof upstreamHeaders.getSetCookie === "function"
      ? upstreamHeaders.getSetCookie()
      : [];

  if (setCookies.length) {
    for (const cookie of setCookies) resHeaders.append("set-cookie", cookie);
  } else {
    const cookie = upstreamRes.headers.get("set-cookie");
    if (cookie) resHeaders.append("set-cookie", cookie);
  }

  const resBody = await upstreamRes.arrayBuffer();
  return new NextResponse(resBody, {
    status: upstreamRes.status,
    headers: resHeaders,
  });
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxy(req, ctx.params);
}
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxy(req, ctx.params);
}
export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxy(req, ctx.params);
}
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxy(req, ctx.params);
}
export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxy(req, ctx.params);
}
