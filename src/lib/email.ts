import { Resend } from 'resend'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || 'demo-key')

export interface EmailData {
  to: string
  subject: string
  html: string
  from?: string
}

/**
 * Send care email to patient
 */
export async function sendCareEmail(emailData: EmailData): Promise<boolean> {
  try {
    // If no API key is provided or in demo mode, simulate email sending
    if (!process.env.RESEND_API_KEY ||
      process.env.RESEND_API_KEY === 'demo-key' ||
      process.env.RESEND_API_KEY === 'your_resend_api_key_here' ||
      process.env.DEMO_MODE === 'true') {
      console.log('📧 [DEMO] Email would be sent to:', emailData.to)
      console.log('📧 [DEMO] Subject:', emailData.subject)
      console.log('📧 [DEMO] Content Preview:', emailData.html.substring(0, 200) + '...')
      console.log('📧 [DEMO] ✅ Email simulation successful')
      return true
    }

    console.log('📧 Attempting to send real email to:', emailData.to)

    const { data, error } = await resend.emails.send({
      from: emailData.from || 'Healing Together <onboarding@resend.dev>',
      to: [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
    })

    if (error) {
      console.error('❌ Resend API error:', error)
      return false
    }

    console.log('✅ Real email sent successfully! ID:', data?.id)
    return true
  } catch (error) {
    console.error('❌ Error sending email:', error)
    return false
  }
}

/**
 * Convert plain text email to HTML format
 */
export function formatEmailAsHTML(plainText: string): string {
  // Split by lines and convert to HTML
  const lines = plainText.split('\n')
  let html = ''
  let inSubject = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('Subject:')) {
      // Skip subject line as it's handled separately
      inSubject = true
      continue
    }

    if (inSubject && trimmedLine === '') {
      inSubject = false
      continue
    }

    if (inSubject) {
      continue
    }

    if (trimmedLine === '') {
      html += '<br><br>'
    } else if (trimmedLine.startsWith('Hi ') || trimmedLine.startsWith('Hello ')) {
      html += `<p style="margin-bottom: 16px; font-weight: 600;">${trimmedLine}</p>`
    } else if (trimmedLine.includes('http')) {
      // Handle links
      const linkRegex = /(https?:\/\/[^\s]+)/g
      const htmlLine = trimmedLine.replace(linkRegex, '<a href="$1" style="color: #3b82f6; text-decoration: underline;">$1</a>')
      html += `<p style="margin-bottom: 12px;">${htmlLine}</p>`
    } else {
      html += `<p style="margin-bottom: 12px;">${trimmedLine}</p>`
    }
  }

  // Wrap in email template
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151;">
      <div style="background: #8573bd; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Healing Together</h1>
        <p style="color: #e0e7ff; margin: 8px 0 0 0; font-size: 14px;">Your journey to recovery, together</p>
      </div>
      <div style="background: white; padding: 32px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        ${html}
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            This email was sent with care by your Healing Together team.<br>
            If you have any questions, please don't hesitate to reach out.
          </p>
        </div>
      </div>
    </div>
  `
}

/**
 * Extract subject from email content
 */
export function extractSubject(emailContent: string): string {
  const lines = emailContent.split('\n')
  for (const line of lines) {
    if (line.trim().startsWith('Subject:')) {
      return line.replace('Subject:', '').trim()
    }
  }
  return 'A Message from Recovery Companion 💙'
}
