import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    vapid_public: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.slice(0, 20) + "...",
    tem_vapid_private: !!process.env.VAPID_PRIVATE_KEY,
    tem_vapid_email: !!process.env.VAPID_EMAIL,
  });
}