import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be set in .env file');
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send invitation email to new admin
export const sendInvitationEmail = async (email, name, tempPassword, adminPanelUrl) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Galata.D Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Invitation to Join Admin Panel - Galata.D',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0f; color: #ffffff; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1de9b6; margin: 0;">Galata.D</h1>
            <p style="color: #888; margin: 5px 0;">Admin Portal Invitation</p>
          </div>
          
          <div style="background: #12121a; padding: 25px; border-radius: 8px; border: 1px solid #1de9b6/30;">
            <h2 style="color: #1de9b6; margin-top: 0;">Welcome, ${name}!</h2>
            <p style="color: #ccc; line-height: 1.6;">
              You have been invited to join the <strong>Galata.D Admin Panel</strong> as an administrator.
            </p>
            
            <div style="background: #0a0a0f; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 3px solid #1de9b6;">
              <p style="margin: 0 0 10px 0; color: #888; font-size: 12px; text-transform: uppercase;">Your Login Credentials</p>
              <p style="margin: 5px 0; color: #fff;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0; color: #fff;"><strong>Password:</strong> <span style="background: #1de9b6; color: #0a0a0f; padding: 2px 8px; border-radius: 4px; font-family: monospace;">${tempPassword}</span></p>
            </div>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${adminPanelUrl}" 
                 style="display: inline-block; background: #1de9b6; color: #0a0a0f; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; text-transform: uppercase;">
                Access Admin Panel
              </a>
            </div>
            
            <p style="color: #888; font-size: 13px; line-height: 1.5;">
              <strong style="color: #ff6b6b;">Important:</strong> For security reasons, please change your password immediately after your first login. 
              You can do this in the Settings > Security section.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              This is an automated message from Galata.D Admin System.<br>
              If you did not request this invitation, please ignore this email.
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send invitation email:', error);
    return { success: false, error: error.message };
  }
};

// Send OTP for password reset
export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Galata.D Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - Galata.D',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0f; color: #ffffff; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1de9b6; margin: 0;">Galata.D</h1>
            <p style="color: #888; margin: 5px 0;">Password Reset Request</p>
          </div>
          
          <div style="background: #12121a; padding: 25px; border-radius: 8px; border: 1px solid #1de9b6/30;">
            <h2 style="color: #1de9b6; margin-top: 0;">Password Reset Code</h2>
            <p style="color: #ccc; line-height: 1.6;">
              You requested a password reset for your Galata.D admin account. Use the following OTP code to proceed:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: #0a0a0f; padding: 20px 40px; border-radius: 8px; border: 2px solid #1de9b6;">
                <span style="font-size: 32px; font-weight: bold; color: #1de9b6; letter-spacing: 8px; font-family: monospace;">${otp}</span>
              </div>
            </div>
            
            <p style="color: #888; font-size: 13px; text-align: center;">
              This code will expire in <strong style="color: #1de9b6;">10 minutes</strong>.
            </p>
            
            <div style="background: #ff6b6b/10; border-left: 3px solid #ff6b6b; padding: 15px; margin-top: 20px; border-radius: 4px;">
              <p style="color: #ff6b6b; margin: 0; font-size: 13px;">
                <strong>Didn't request this?</strong><br>
                If you didn't request a password reset, please ignore this email or contact your system administrator immediately.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              This is an automated security message from Galata.D.<br>
              Do not share this code with anyone.
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return { success: false, error: error.message };
  }
};

// Send reply email to client
export const sendReplyEmail = async (clientEmail, clientName, subject, replyMessage, originalMessage) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Galata.D" <${process.env.EMAIL_USER}>`,
      to: clientEmail,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0f; color: #ffffff; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1de9b6; margin: 0;">Galata.D</h1>
            <p style="color: #888; margin: 5px 0;">Response to Your Message</p>
          </div>

          <div style="background: #12121a; padding: 25px; border-radius: 8px; border: 1px solid rgba(29, 233, 182, 0.3);">
            <h2 style="color: #1de9b6; margin-top: 0;">Hello ${clientName},</h2>
            <p style="color: #ccc; line-height: 1.6;">
              Thank you for reaching out. Here is my response to your message:
            </p>

            <div style="background: #0a0a0f; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 3px solid #1de9b6;">
              <p style="margin: 0; color: #fff; white-space: pre-wrap;">${replyMessage}</p>
            </div>

            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #333;">
              <p style="color: #888; font-size: 12px; margin-bottom: 10px;">Your original message:</p>
              <p style="color: #666; font-size: 13px; font-style: italic; margin: 0;">${originalMessage}</p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              This is a response from Galata.D Portfolio.<br>
              If you have any further questions, feel free to reply to this email.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send reply email:', error);
    return { success: false, error: error.message };
  }
};

// Send password changed confirmation email
export const sendPasswordChangedEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Galata.D Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Changed Successfully - Galata.D',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0f; color: #ffffff; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1de9b6; margin: 0;">Galata.D</h1>
            <p style="color: #888; margin: 5px 0;">Security Notification</p>
          </div>
          
          <div style="background: #12121a; padding: 25px; border-radius: 8px; border: 1px solid #1de9b6/30;">
            <h2 style="color: #1de9b6; margin-top: 0;">Password Updated</h2>
            <p style="color: #ccc; line-height: 1.6;">
              Hello ${name},
            </p>
            <p style="color: #ccc; line-height: 1.6;">
              Your password for the Galata.D Admin Panel has been successfully changed.
            </p>
            
            <div style="background: #00d084/10; border-left: 3px solid #00d084; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="color: #00d084; margin: 0; font-size: 14px;">
                <strong>✓ Change Confirmed</strong><br>
                If you made this change, no further action is required.
              </p>
            </div>
            
            <div style="background: #ff6b6b/10; border-left: 3px solid #ff6b6b; padding: 15px; margin-top: 20px; border-radius: 4px;">
              <p style="color: #ff6b6b; margin: 0; font-size: 13px;">
                <strong>Didn't make this change?</strong><br>
                If you didn't change your password, please contact your system administrator immediately.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              This is an automated security message from Galata.D.
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send password changed email:', error);
    return { success: false, error: error.message };
  }
};
