import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { firstName, lastName, email, phone, subject, message } = body

    // Send notification to admin
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      const subjectLabels: Record<string, string> = {
        general: "General Inquiry",
        profile: "Profile Activation",
        advertising: "Advertising",
        nomination: "Nomination Question",
        other: "Other",
      }

      await sendEmail({
        to: adminEmail,
        subject: `Contact Form: ${subjectLabels[subject] || subject} - ${firstName} ${lastName}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .details { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">New Contact Form Submission</h1>
                </div>
                <div class="content">
                  <div class="details">
                    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
                    <p><strong>Subject:</strong> ${subjectLabels[subject] || subject}</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, "<br>")}</p>
                  </div>
                  <p style="color: #6b7280; font-size: 14px;">
                    Reply directly to this email to respond to ${firstName}.
                  </p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Top Law Firms</p>
                </div>
              </div>
            </body>
          </html>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
