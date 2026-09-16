import nodemailer from "nodemailer";

export async function sendOtpEmail(to: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"DevRoad" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your DevRoad Login Code",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Your DevRoad Verification Code</title>
      </head>
      <body style="margin: 0; padding: 40px 20px; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #09090b; color: #fafafa; border-radius: 24px; border: 1px solid #27272a; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
          
          <div style="padding: 40px 40px 20px; text-align: center;">
            <h1 style="font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">DevRoad</h1>
          </div>

          <div style="padding: 20px 40px 40px;">
            <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; text-align: center;">
              <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px 0;">Verify your email</h2>
              <p style="color: #a1a1aa; font-size: 15px; margin: 0 0 24px 0; line-height: 1.5;">Enter the following 6-digit code to continue with your account setup.</p>
              
              <div style="background-color: #000000; border: 1px solid #3f3f46; border-radius: 12px; padding: 20px; font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #ffffff; margin-bottom: 24px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">
                ${otp}
              </div>
              
              <p style="color: #71717a; font-size: 13px; margin: 0;">This code expires in 10 minutes.<br/>If you didn't request this, you can safely ignore this email.</p>
            </div>
          </div>

          <div style="background-color: #000000; border-top: 1px solid #27272a; padding: 24px; text-align: center;">
            <p style="color: #52525b; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} DevRoad. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send OTP email.");
  }
}
