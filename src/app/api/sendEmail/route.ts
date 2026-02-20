import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type SendEmailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
};

function getEnv(name: string) {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : null;
}

export async function POST(req: NextRequest) {
  let payload: SendEmailPayload;
  try {
    payload = (await req.json()) as SendEmailPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!payload?.to || !payload?.subject) {
    return NextResponse.json(
      { error: "`to` and `subject` are required." },
      { status: 400 },
    );
  }

  const host = getEnv("SMTP_HOST");
  const portStr = getEnv("SMTP_PORT");
  const user = getEnv("SMTP_USER");
  const pass = getEnv("SMTP_PASS")?.replace(/\s+/g, "") ?? null;
  const secureStr = getEnv("SMTP_SECURE");
  const defaultFrom = getEnv("SMTP_FROM");

  const emailUser = getEnv("EMAIL_USER");
  const emailPass = getEnv("EMAIL_PASS")?.replace(/\s+/g, "") ?? null;

  let transport: nodemailer.Transporter;
  let resolvedFrom: string | null = payload.from || defaultFrom || emailUser;

  if (host || portStr || user || pass || secureStr || defaultFrom) {
    if (!host || !portStr || !user || !pass) {
      return NextResponse.json(
        {
          error:
            "Incomplete SMTP config. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (and optionally SMTP_SECURE, SMTP_FROM).",
        },
        { status: 500 },
      );
    }

    const port = Number(portStr);
    if (!Number.isFinite(port) || port <= 0) {
      return NextResponse.json(
        { error: "SMTP_PORT must be a valid number." },
        { status: 500 },
      );
    }

    const secure =
      secureStr === "true" || (secureStr == null && Number(port) === 465);

    transport = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  } else if (emailUser && emailPass) {
    transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user: emailUser, pass: emailPass },
    });
  } else {
    return NextResponse.json(
      {
        error:
          "Missing email config. Set SMTP_* env vars, or set EMAIL_USER and EMAIL_PASS (Gmail app password) on the Next.js server.",
      },
      { status: 500 },
    );
  }

  if (!resolvedFrom) {
    return NextResponse.json(
      { error: "Missing `from` address. Set SMTP_FROM or EMAIL_USER." },
      { status: 500 },
    );
  }

  try {
    await transport.sendMail({
      from: resolvedFrom,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed.";
    return NextResponse.json(
      { error: "Failed to send email.", details: message },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
