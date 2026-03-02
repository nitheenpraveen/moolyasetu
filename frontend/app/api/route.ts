import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, message } = body;

  // For now, just log the submission
  console.log("Contact form submission:", { name, email, message });

  // TODO: integrate with email service (Resend, Nodemailer, etc.)
  return NextResponse.json({ success: true, message: "Form submitted successfully!" });
}
