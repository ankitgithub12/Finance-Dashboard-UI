const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send forgot password email via SendGrid
 * @param {string} toEmail - recipient email
 * @param {string} resetUrl - full reset link
 * @param {string} userName - recipient's name
 */
const sendPasswordResetEmail = async (toEmail, resetUrl, userName) => {
  const msg = {
    to: toEmail,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'Finance Dashboard',
    },
    subject: 'Reset Your Password – Finance Dashboard',
    text: `Hi ${userName},\n\nYou requested a password reset.\n\nClick the link below to reset your password (valid for 15 minutes):\n${resetUrl}\n\nIf you didn't request this, please ignore this email.\n\n– The Finance Dashboard Team`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f1a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f1a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6c63ff 0%,#a855f7 100%);padding:40px 40px 30px;text-align:center;">
              <div style="width:60px;height:60px;background:rgba(255,255,255,0.2);border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:28px;line-height:60px;">🔐</div>
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Reset Your Password</h1>
              <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:15px;">Finance Dashboard Security</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#c4c4d4;font-size:16px;line-height:1.7;margin:0 0 20px;">Hi <strong style="color:#ffffff;">${userName}</strong>,</p>
              <p style="color:#c4c4d4;font-size:16px;line-height:1.7;margin:0 0 30px;">
                We received a request to reset the password for your Finance Dashboard account. Click the button below to choose a new password.
              </p>
              
              <!-- CTA Button -->
              <div style="text-align:center;margin:0 0 30px;">
                <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#6c63ff 0%,#a855f7 100%);color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:12px;font-size:16px;font-weight:600;letter-spacing:0.5px;">
                  Reset My Password
                </a>
              </div>
              
              <!-- Timer Warning -->
              <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:16px;margin:0 0 24px;">
                <p style="color:#fca5a5;margin:0;font-size:14px;text-align:center;">
                  ⏱️ This link expires in <strong>15 minutes</strong>
                </p>
              </div>
              
              <!-- Fallback link -->
              <p style="color:#7a7a95;font-size:13px;line-height:1.6;margin:0 0 12px;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="background:rgba(108,99,255,0.1);border:1px solid rgba(108,99,255,0.2);border-radius:8px;padding:12px;word-break:break-all;margin:0 0 30px;">
                <a href="${resetUrl}" style="color:#a78bfa;font-size:13px;text-decoration:none;">${resetUrl}</a>
              </p>
              
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:0 0 24px;" />
              
              <p style="color:#7a7a95;font-size:13px;line-height:1.6;margin:0;">
                If you didn't request a password reset, please ignore this email or contact support if you have concerns. Your password will remain unchanged.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background:rgba(0,0,0,0.2);padding:20px 40px;text-align:center;">
              <p style="color:#7a7a95;font-size:12px;margin:0;">© ${new Date().getFullYear()} Finance Dashboard. All rights reserved.</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };

  await sgMail.send(msg);
};

module.exports = { sendPasswordResetEmail };
