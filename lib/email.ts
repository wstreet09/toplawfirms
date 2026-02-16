// Email service using Resend
// To use this, install: npm install resend
// And add RESEND_API_KEY to your .env file

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  // Check if Resend is configured
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured. Email not sent.')
    console.log('Would have sent email to:', to)
    console.log('Subject:', subject)
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'noreply@toplawfirms.com',
        to,
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Email send failed:', error)
      return { success: false, error }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

export function createNominationReceivedEmail(firmName: string, nominatorName: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .highlight { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Nomination Received</h1>
          </div>
          <div class="content">
            <p>Dear ${nominatorName},</p>

            <p>Thank you for nominating <strong>${firmName}</strong> to the Top Law Firms directory.</p>

            <div class="highlight">
              <strong>Your nomination is currently under review.</strong><br>
              Our team will carefully evaluate the submission and you will receive an email once a decision has been made.
            </div>

            <p>What happens next:</p>

            <ol>
              <li>Our editorial team will review the nomination</li>
              <li>We may reach out if we need additional information</li>
              <li>You'll receive an email notification with our decision</li>
            </ol>

            <p>The review process typically takes 5-7 business days.</p>

            <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>

            <p>Best regards,<br>The Top Law Firms Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Top Law Firms. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

interface NominationDetails {
  firmName: string
  nominatorName: string
  nominatorEmail: string
  nominatorPhone?: string
  city: string
  state: string
  practiceAreas: string[]
  notes?: string
}

export function createAdminNominationNotificationEmail(details: NominationDetails) {
  const practiceAreasHtml = details.practiceAreas.length > 0
    ? details.practiceAreas.map(pa => `<li>${pa}</li>`).join('')
    : '<li>None specified</li>'

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .details { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .details-row { display: flex; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          .details-label { font-weight: bold; width: 140px; color: #6b7280; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">New Nomination Submitted</h1>
          </div>
          <div class="content">
            <p>A new law firm nomination has been submitted and requires review.</p>

            <div class="details">
              <h3 style="margin-top: 0; color: #1e293b;">Firm Details</h3>
              <p><strong>Firm Name:</strong> ${details.firmName}</p>
              <p><strong>Location:</strong> ${details.city}, ${details.state}</p>

              <h3 style="color: #1e293b;">Practice Areas</h3>
              <ul>${practiceAreasHtml}</ul>

              <h3 style="color: #1e293b;">Nominator Contact</h3>
              <p><strong>Name:</strong> ${details.nominatorName}</p>
              <p><strong>Email:</strong> ${details.nominatorEmail}</p>
              ${details.nominatorPhone ? `<p><strong>Phone:</strong> ${details.nominatorPhone}</p>` : ''}

              ${details.notes ? `<h3 style="color: #1e293b;">Additional Notes</h3><p>${details.notes}</p>` : ''}
            </div>

            <p style="text-align: center;">
              <a href="https://toplawfirms.net/admin/nominations" style="display: inline-block; background: #dc2626; color: #ffffff !important; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold;">Review in Admin Panel</a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Top Law Firms Admin</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function createApprovalEmail(firmName: string, nominatorName: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Nomination Approved!</h1>
          </div>
          <div class="content">
            <p>Dear ${nominatorName},</p>

            <p>Great news! Your nomination for <strong>${firmName}</strong> has been approved and added to the Top Law Firms directory.</p>

            <p>The firm profile has been created as an <strong>inactive profile</strong>. This means:</p>

            <ul>
              <li>The firm appears in our directory listings</li>
              <li>Visitors can see the firm name and basic information</li>
              <li>An "Activate Profile" button is displayed instead of full profile access</li>
            </ul>

            <p>To activate the full profile and unlock all features, the firm will need to:</p>

            <ol>
              <li>Contact our team to discuss activation options</li>
              <li>Complete payment for profile activation</li>
              <li>Provide additional profile details (optional)</li>
            </ol>

            <p style="text-align: center;">
              <a href="https://toplawfirms.net/pricing" style="display: inline-block; background: #dc2626; color: #ffffff !important; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold;">View Profile Options</a>
            </p>

            <p>Thank you for contributing to our directory!</p>

            <p>Best regards,<br>The Top Law Firms Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Top Law Firms. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
