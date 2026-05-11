import emailjs from '@emailjs/nodejs';

/**
 * Integrated Email Service
 * Supports Resend (HTTP) and EmailJS (NodeJS SDK)
 */

// Helper to send email via EmailJS (Node.js SDK)
const sendViaEmailJS = async (toEmail, subject, html, templateType = 'general') => {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    return { success: false, error: 'EmailJS credentials incomplete' };
  }

  try {
    const result = await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: toEmail,
        subject: subject,
        message_html: html, // The template in EmailJS must have {{message_html}} variable
        template_type: templateType
      },
      {
        publicKey,
        privateKey,
      }
    );
    return { success: true, data: result };
  } catch (error) {
    console.error('EmailJS SDK Error:', error);
    return { success: false, error: typeof error === 'object' ? JSON.stringify(error) : error };
  }
};

// Helper to send email via Resend HTTP API
const sendViaResend = async (to, subject, html, fromOverride = null) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { success: false, error: 'Resend API Key missing' };
  }

  const from = fromOverride || process.env.EMAIL_FROM || 'onboarding@resend.dev';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html
      })
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result };
    } else {
      console.error('Resend API Error:', result);
      return { success: false, error: result.message || 'API request failed' };
    }
  } catch (error) {
    console.error('Resend Fetch Error:', error);
    return { success: false, error: error.message };
  }
};

// Master send function that picks the available service
const sendEmail = async (to, subject, html, options = {}) => {
  const hasEmailJS = !!(process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_PUBLIC_KEY && process.env.EMAILJS_PRIVATE_KEY);
  const hasResend = !!process.env.RESEND_API_KEY;

  console.log('📬 Email attempt - Configuration:', { hasEmailJS, hasResend });

  // Try EmailJS first if configured
  if (hasEmailJS) {
    console.log('🚀 Attempting to send via EmailJS...');
    const result = await sendViaEmailJS(to, subject, html, options.templateType);
    if (result.success) return result;
    console.warn('❌ EmailJS failed:', result.error);
  } else if (process.env.EMAILJS_SERVICE_ID) {
    console.warn('⚠️ EmailJS partially configured but missing required keys (Template ID or Private Key).');
  }

  // Fallback to Resend
  if (hasResend) {
    console.log('🔄 Falling back to Resend...');
    return await sendViaResend(to, subject, html, options.fromOverride);
  }

  return { success: false, error: 'No email service (EmailJS or Resend) is fully configured.' };
};

// Send invitation email to new admin
export const sendInvitationEmail = async (email, name, tempPassword, adminPanelUrl) => {
  const subject = 'Invitation to Join Admin Panel - Galata.D';
  const html = `
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
          <p style="margin: 0 0 10px 0; color: #1de9b6; font-size: 12px; text-transform: uppercase; font-weight: bold;">Step 1: Your Login Credentials</p>
          <p style="margin: 5px 0; color: #fff;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0; color: #fff;"><strong>Temporary Password:</strong> <span style="background: #1de9b6; color: #0a0a0f; padding: 2px 8px; border-radius: 4px; font-family: monospace; font-weight: bold;">${tempPassword}</span></p>
        </div>

        <div style="margin: 25px 0;">
          <p style="margin: 0 0 10px 0; color: #1de9b6; font-size: 12px; text-transform: uppercase; font-weight: bold;">Step 2: Access & Setup</p>
          <ol style="color: #ccc; padding-left: 20px; line-height: 1.8; margin: 0;">
            <li>Click the button below to go to the login page.</li>
            <li>Enter your email and the temporary password provided above.</li>
            <li>Once logged in, navigate to the <strong>Settings</strong> section in the sidebar.</li>
            <li>Go to the <strong>Security</strong> tab.</li>
            <li>Update your temporary password to a secure one of your choice.</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${adminPanelUrl}" 
             style="display: inline-block; background: #1de9b6; color: #0a0a0f; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(29, 233, 182, 0.3);">
            Access Admin Panel Now
          </a>
        </div>
        
        <p style="color: #888; font-size: 13px; line-height: 1.6; background: rgba(255, 107, 107, 0.1); padding: 15px; border-radius: 6px; border-left: 3px solid #ff6b6b;">
          <strong style="color: #ff6b6b;">Security Reminder:</strong> Temporary passwords expire or are less secure. For your protection, password updates are mandatory on first access.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
        <p style="color: #666; font-size: 12px; margin: 0;">
          This is an automated message from Galata.D Admin System.<br>
          If you did not request this invitation, please ignore this email.
        </p>
      </div>
    </div>
  `;
  return await sendEmail(email, subject, html, { templateType: 'invitation' });
};

// Send OTP for password reset
export const sendOTPEmail = async (email, otp) => {
  const subject = 'Password Reset OTP - Galata.D';
  const html = `
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
  `;
  return await sendEmail(email, subject, html, { templateType: 'otp' });
};

// Send reply email to client
export const sendReplyEmail = async (clientEmail, clientName, subject, replyMessage, originalMessage) => {
  const html = `
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
  `;
  return await sendEmail(clientEmail, subject, html, { templateType: 'reply' });
};

// Send password changed confirmation email
export const sendPasswordChangedEmail = async (email, name) => {
  const subject = 'Password Changed Successfully - Galata.D';
  const html = `
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
  `;
  return await sendEmail(email, subject, html, { templateType: 'security' });
};
