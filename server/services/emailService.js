const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

/**
 * Create and configure email transporter
 * Uses Gmail SMTP by default
 */
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER || "Teamacceptly@gmail.com";
  const emailPass =
    process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD || "";

  if (!emailPass) {
    console.warn(
      "⚠️  WARNING: EMAIL_APP_PASSWORD or EMAIL_PASSWORD not set in environment variables"
    );
    console.warn(
      "⚠️  Emails will not be sent. Add email credentials to server/.env"
    );
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

/**
 * Generate beautiful HTML welcome email template
 */
const getWelcomeEmailTemplate = (username, email) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Acceptly</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 50px 30px;
            text-align: center;
            color: #ffffff;
        }
        
        .email-header h1 {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        
        .email-header p {
            font-size: 18px;
            opacity: 0.95;
            margin: 0;
        }
        
        .email-body {
            padding: 50px 40px;
        }
        
        .welcome-message {
            font-size: 28px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .welcome-text {
            font-size: 16px;
            color: #555555;
            margin-bottom: 30px;
            text-align: center;
            line-height: 1.8;
        }
        
        .features-section {
            background-color: #f8f9fa;
            border-radius: 12px;
            padding: 30px;
            margin: 40px 0;
        }
        
        .features-title {
            font-size: 22px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .feature-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .feature-item:hover {
            transform: translateX(5px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
            font-size: 28px;
            margin-right: 15px;
            flex-shrink: 0;
        }
        
        .feature-content h3 {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 8px;
        }
        
        .feature-content p {
            font-size: 14px;
            color: #666666;
            margin: 0;
            line-height: 1.6;
        }
        
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        
        .cta-button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .info-box {
            background-color: #e8f4f8;
            border-left: 4px solid #667eea;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        
        .info-box p {
            font-size: 14px;
            color: #555555;
            margin: 0;
            line-height: 1.6;
        }
        
        .email-footer {
            background-color: #f8f9fa;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
        }
        
        .email-footer p {
            font-size: 14px;
            color: #666666;
            margin: 8px 0;
        }
        
        .email-footer a {
            color: #667eea;
            text-decoration: none;
        }
        
        @media only screen and (max-width: 600px) {
            .email-body {
                padding: 30px 20px;
            }
            
            .email-header {
                padding: 30px 20px;
            }
            
            .email-header h1 {
                font-size: 28px;
            }
            
            .welcome-message {
                font-size: 24px;
            }
            
            .features-section {
                padding: 20px;
            }
            
            .feature-item {
                flex-direction: column;
            }
            
            .feature-icon {
                margin-bottom: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <h1>🎉 Welcome to Acceptly!</h1>
            <p>From Mistakes to Mastery, One Transition at a Time</p>
        </div>
        
        <!-- Body -->
        <div class="email-body">
            <div class="welcome-message">
                Hello ${username}! 👋
            </div>
            
            <div class="welcome-text">
                We're thrilled to have you join the Acceptly community! You've taken the first step towards mastering 
                Finite Automata and becoming a better computer scientist.
            </div>
            
            <div class="features-section">
                <div class="features-title">🚀 What You Can Do</div>
                
                <div class="feature-item">
                    <div class="feature-icon">🎨</div>
                    <div class="feature-content">
                        <h3>Build Interactive Automata</h3>
                        <p>Create and visualize Finite Automata with our intuitive drag-and-drop canvas. Design states, transitions, and test your automata in real-time.</p>
                    </div>
                </div>
                
                <div class="feature-item">
                    <div class="feature-icon">🤖</div>
                    <div class="feature-content">
                        <h3>AI-Powered Learning Assistant</h3>
                        <p>Get intelligent hints and explanations powered by Google Gemini. Learn through guided discovery without spoilers.</p>
                    </div>
                </div>
                
                <div class="feature-item">
                    <div class="feature-icon">📊</div>
                    <div class="feature-content">
                        <h3>Track Your Progress</h3>
                        <p>Monitor your learning journey with detailed insights. See your improvements and celebrate your achievements.</p>
                    </div>
                </div>
                
                <div class="feature-item">
                    <div class="feature-icon">✅</div>
                    <div class="feature-content">
                        <h3>Automated Testing</h3>
                        <p>Validate your automata with comprehensive test suites. Get instant feedback and understand why tests pass or fail.</p>
                    </div>
                </div>
            </div>
            
            <div class="button-container">
                <a href="${frontendUrl}/auth?mode=login&email=${encodeURIComponent(email)}" class="cta-button">
                    Start Your Journey →
                </a>
            </div>
            
            <div class="info-box">
                <p>
                    <strong>💡 Pro Tip:</strong> Begin with our guided tour to get familiar with the interface. 
                    Don't worry about making mistakes - that's exactly how you learn!
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
            <p><strong>Ready to master Finite Automata?</strong></p>
            <p>We're here to help you every step of the way.</p>
            
            <p style="margin-top: 20px;">Questions? Just reply to this email - we'd love to hear from you!</p>
            
            <p style="margin-top: 30px; font-size: 12px; color: #999999;">
                This email was sent to ${email}<br>
                © ${new Date().getFullYear()} Acceptly. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
  `.trim();
};

/**
 * Generate plain text version of welcome email
 */
const getWelcomeEmailText = (username, email) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  return `
Welcome to Acceptly!

Hello ${username}!

We're thrilled to have you join the Acceptly community! You've taken the first step towards mastering Finite Automata and becoming a better computer scientist.

What You Can Do:

🎨 Build Interactive Automata
   Create and visualize Finite Automata with our intuitive drag-and-drop canvas. Design states, transitions, and test your automata in real-time.

🤖 AI-Powered Learning Assistant
   Get intelligent hints and explanations powered by Google Gemini. Learn through guided discovery without spoilers.

📊 Track Your Progress
   Monitor your learning journey with detailed insights. See your improvements and celebrate your achievements.

✅ Automated Testing
   Validate your automata with comprehensive test suites. Get instant feedback and understand why tests pass or fail.

Get started: ${frontendUrl}/auth?mode=login&email=${encodeURIComponent(email)}

💡 Pro Tip: Begin with our guided tour to get familiar with the interface. Don't worry about making mistakes - that's exactly how you learn!

Ready to master Finite Automata? We're here to help you every step of the way!

Questions? Just reply to this email - we'd love to hear from you!

---
This email was sent to ${email}
© ${new Date().getFullYear()} Acceptly. All rights reserved.
  `.trim();
};

/**
 * Send welcome email to new user
 * @param {string} username - User's username
 * @param {string} email - User's email address
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendWelcomeEmail = async (username, email) => {
  try {
    // Check if email credentials are configured
    const emailPass =
      process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD;
    if (!emailPass) {
      console.warn(
        "⚠️  Cannot send welcome email: Email credentials not configured"
      );
      console.warn("⚠️  Add EMAIL_APP_PASSWORD to server/.env file");
      return { success: false, error: "Email credentials not configured" };
    }

    console.log("📧 Attempting to send welcome email to:", email);
    const transporter = createTransporter();

    if (!transporter) {
      return {
        success: false,
        error: "Email transporter could not be created",
      };
    }

    const mailOptions = {
      from: `"Acceptly Team" <${
        process.env.EMAIL_USER || "Teamacceptly@gmail.com"
      }>`,
      to: email,
      subject: "🎉 Welcome to Acceptly - Your Journey to Mastery Begins!",
      html: getWelcomeEmailTemplate(username, email),
      text: getWelcomeEmailText(username, email),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent successfully!");
    console.log("   Message ID:", info.messageId);
    console.log("   To:", email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending welcome email:");
    console.error("   Error message:", error.message);
    console.error("   Error code:", error.code || "N/A");
    if (error.response) {
      console.error("   Server response:", error.response);
    }
    // Don't throw error - email failure shouldn't break signup
    return { success: false, error: error.message, code: error.code };
  }
};

/**
 * Generate beautiful HTML password reset email template
 */
const getPasswordResetEmailTemplate = (email, resetToken) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: #ffffff;
        }
        
        .email-header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        
        .email-header p {
            font-size: 16px;
            opacity: 0.95;
            margin: 0;
        }
        
        .email-body {
            padding: 50px 40px;
        }
        
        .main-message {
            font-size: 20px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .email-text {
            font-size: 16px;
            color: #555555;
            margin-bottom: 30px;
            text-align: center;
            line-height: 1.8;
        }
        
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        
        .reset-button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .reset-link-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            word-break: break-all;
        }
        
        .reset-link-box p {
            font-size: 14px;
            color: #666666;
            margin: 5px 0;
        }
        
        .reset-link-box a {
            color: #667eea;
            text-decoration: none;
            word-break: break-all;
        }
        
        .warning-box {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        
        .warning-box p {
            font-size: 14px;
            color: #856404;
            margin: 0;
            line-height: 1.6;
        }
        
        .security-note {
            background-color: #e8f4f8;
            border-left: 4px solid #667eea;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        
        .security-note p {
            font-size: 14px;
            color: #555555;
            margin: 0;
            line-height: 1.6;
        }
        
        .email-footer {
            background-color: #f8f9fa;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
        }
        
        .email-footer p {
            font-size: 14px;
            color: #666666;
            margin: 8px 0;
        }
        
        @media only screen and (max-width: 600px) {
            .email-body {
                padding: 30px 20px;
            }
            
            .email-header {
                padding: 30px 20px;
            }
            
            .email-header h1 {
                font-size: 26px;
            }
            
            .main-message {
                font-size: 18px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <h1>🔐 Reset Your Password</h1>
            <p>Acceptly Account Security</p>
        </div>
        
        <!-- Body -->
        <div class="email-body">
            <div class="main-message">
                Password Reset Request
            </div>
            
            <div class="email-text">
                You requested to reset your password for your Acceptly account. Click the button below to create a new password.
            </div>
            
            <div class="button-container">
                <a href="${resetLink}" class="reset-button">
                    Reset My Password →
                </a>
            </div>
            
            <div class="reset-link-box">
                <p><strong>Can't click the button?</strong></p>
                <p>Copy and paste this link into your browser:</p>
                <p><a href="${resetLink}">${resetLink}</a></p>
            </div>
            
            <div class="warning-box">
                <p>
                    <strong>⏰ Important:</strong> This password reset link will expire in <strong>1 hour</strong> for your security. 
                    If you didn't request a password reset, please ignore this email or contact us if you have concerns.
                </p>
            </div>
            
            <div class="security-note">
                <p>
                    <strong>🔒 Security Tip:</strong> For your account security, never share this link with anyone. 
                    Acceptly will never ask you for your password or reset link.
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
            <p><strong>Need Help?</strong></p>
            <p>If you're having trouble resetting your password, just reply to this email.</p>
            
            <p style="margin-top: 30px; font-size: 12px; color: #999999;">
                This email was sent to ${email}<br>
                © ${new Date().getFullYear()} Acceptly. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
  `.trim();
};

/**
 * Generate plain text version of password reset email
 */
const getPasswordResetEmailText = (email, resetToken) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

  return `
Reset Your Password

You requested to reset your password for your Acceptly account.

Click this link to reset your password:
${resetLink}

IMPORTANT: This password reset link will expire in 1 hour for your security.

If you didn't request a password reset, please ignore this email or contact us if you have concerns.

SECURITY TIP: For your account security, never share this link with anyone. Acceptly will never ask you for your password or reset link.

---
This email was sent to ${email}
© ${new Date().getFullYear()} Acceptly. All rights reserved.
  `.trim();
};

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @param {string} resetToken - Password reset token
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const emailPass =
      process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD;
    if (!emailPass) {
      console.warn(
        "⚠️  Cannot send password reset email: Email credentials not configured"
      );
      return { success: false, error: "Email credentials not configured" };
    }

    console.log("📧 Attempting to send password reset email to:", email);
    const transporter = createTransporter();
    if (!transporter) {
      return {
        success: false,
        error: "Email transporter could not be created",
      };
    }

    const mailOptions = {
      from: `"Acceptly Team" <${
        process.env.EMAIL_USER || "Teamacceptly@gmail.com"
      }>`,
      to: email,
      subject: "🔐 Reset Your Acceptly Password",
      html: getPasswordResetEmailTemplate(email, resetToken),
      text: getPasswordResetEmailText(email, resetToken),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent successfully!");
    console.log("   Message ID:", info.messageId);
    console.log("   To:", email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending password reset email:");
    console.error("   Error message:", error.message);
    console.error("   Error code:", error.code || "N/A");
    return { success: false, error: error.message, code: error.code };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  createTransporter,
  getWelcomeEmailTemplate,
  getWelcomeEmailText,
};

