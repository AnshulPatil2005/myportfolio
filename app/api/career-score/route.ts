import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Career Mode completion times, newest last. This lives in module memory:
// good enough to rank a visitor against everyone the running instance has
// seen, and it resets when the instance goes cold. Swap for Vercel KV or
// Upstash if the numbers ever need to be durable.
const MAX = 500;
const seconds: number[] = [];

export async function POST(req: Request) {
  let body: { seconds?: number; deaths?: number; accuracy?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const s = Number(body?.seconds);
  // reject anything that is not a plausible run rather than poisoning the set
  if (!Number.isFinite(s) || s < 20 || s > 3600) {
    return NextResponse.json({ error: "bad score" }, { status: 400 });
  }

  seconds.push(Math.round(s));
  if (seconds.length > MAX) seconds.shift();

  const slower = seconds.filter(v => v > s).length;
  const percentile = seconds.length > 1
    ? Math.round((slower / (seconds.length - 1)) * 100)
    : null;

  return NextResponse.json({
    runs: seconds.length,
    percentile,
    best: Math.min(...seconds),
  });
}
