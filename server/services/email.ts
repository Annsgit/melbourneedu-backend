import { MailService } from '@sendgrid/mail';

// Initialize SendGrid if API key is present
let mailService: MailService | null = null;

if (process.env.SENDGRID_API_KEY) {
  mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Interface for email parameters
 */
interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Sends an email using SendGrid
 * Falls back to logging if SendGrid is not available
 * @param params Email parameters
 * @returns Success status
 */
export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!mailService) {
    console.log('SendGrid not configured. Email would have been sent with the following details:');
    console.log('To:', params.to);
    console.log('Subject:', params.subject);
    console.log('Content:', params.text || params.html);
    return false;
  }
  
  try {
    await mailService.send({
      to: params.to,
      from: 'notifications@melbourneschools.info', // Replace with your verified sender
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Sends a subscription confirmation email
 * @param email Recipient email
 * @param name Optional recipient name
 * @param token Confirmation token
 * @param baseUrl Base URL for confirmation link
 * @returns Success status
 */
export async function sendConfirmationEmail(
  email: string,
  name: string,
  token: string,
  baseUrl: string
): Promise<boolean> {
  const confirmUrl = `${baseUrl}/api/subscriptions/confirm/${token}`;
  
  const subject = 'Confirm Your Subscription to Melbourne Schools';
  
  const text = `
Hello ${name || 'there'},

Thank you for subscribing to Melbourne Schools updates. To confirm your subscription, please click on the link below:

${confirmUrl}

If you did not request this subscription, you can safely ignore this email.

Best regards,
The Melbourne Schools Team
  `;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; background-color: #4A90E2; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Confirm Your Subscription</h2>
    <p>Hello ${name || 'there'},</p>
    <p>Thank you for subscribing to Melbourne Schools updates. To confirm your subscription, please click on the button below:</p>
    <p><a href="${confirmUrl}" class="button">Confirm Subscription</a></p>
    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
    <p>${confirmUrl}</p>
    <p>If you did not request this subscription, you can safely ignore this email.</p>
    <p>Best regards,<br>The Melbourne Schools Team</p>
    <div class="footer">
      <p>© 2025 Melbourne Schools. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
  
  return await sendEmail({
    to: email,
    subject,
    text,
    html
  });
}

/**
 * Sends a welcome email after subscription confirmation
 * @param email Recipient email
 * @param name Optional recipient name
 * @returns Success status
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<boolean> {
  const subject = 'Welcome to Melbourne Schools!';
  
  const text = `
Hello ${name || 'there'},

Thank you for confirming your subscription to Melbourne Schools updates. You will now receive our latest news, school information, and educational resources.

You can update your preferences or unsubscribe at any time by visiting your profile on our website.

Best regards,
The Melbourne Schools Team
  `;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; background-color: #4A90E2; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Welcome to Melbourne Schools!</h2>
    <p>Hello ${name || 'there'},</p>
    <p>Thank you for confirming your subscription to Melbourne Schools updates. You will now receive our latest news, school information, and educational resources.</p>
    <p>You can update your preferences or unsubscribe at any time by visiting your profile on our website.</p>
    <p>Best regards,<br>The Melbourne Schools Team</p>
    <div class="footer">
      <p>© 2025 Melbourne Schools. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
  
  return await sendEmail({
    to: email,
    subject,
    text,
    html
  });
}

/**
 * Sends a subscription upgrade confirmation email
 * @param email Recipient email
 * @param name Optional recipient name
 * @returns Success status
 */
export async function sendSubscriptionUpgradeEmail(
  email: string,
  name: string
): Promise<boolean> {
  const subject = 'Your Premium Subscription is Active!';
  
  const text = `
Hello ${name || 'there'},

Thank you for upgrading to a Melbourne Schools Premium subscription. Your subscription is now active, and you have full access to all premium features including:

- Detailed school performance data
- Comprehensive comparison tools
- Priority support
- Advanced search filters
- PDF exports and reports

Your subscription will be billed at $6.99 per month. You can manage your subscription at any time through your account settings.

Best regards,
The Melbourne Schools Team
  `;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .feature-list { background-color: #f5f5f5; padding: 15px; border-radius: 4px; }
    .feature-list ul { margin: 0; padding-left: 20px; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Your Premium Subscription is Active!</h2>
    <p>Hello ${name || 'there'},</p>
    <p>Thank you for upgrading to a Melbourne Schools Premium subscription. Your subscription is now active, and you have full access to all premium features including:</p>
    <div class="feature-list">
      <ul>
        <li>Detailed school performance data</li>
        <li>Comprehensive comparison tools</li>
        <li>Priority support</li>
        <li>Advanced search filters</li>
        <li>PDF exports and reports</li>
      </ul>
    </div>
    <p>Your subscription will be billed at $6.99 per month. You can manage your subscription at any time through your account settings.</p>
    <p>Best regards,<br>The Melbourne Schools Team</p>
    <div class="footer">
      <p>© 2025 Melbourne Schools. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
  
  return await sendEmail({
    to: email,
    subject,
    text,
    html
  });
}