// Test email script - Run this to test if email sending works
const { sendWelcomeEmail, createTransporter } = require('./services/emailService');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testEmail() {
  console.log('🧪 Testing email configuration...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'SET (hidden)' : 'NOT SET');
  console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? 'SET (hidden)' : 'NOT SET');
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'NOT SET');
  console.log('');
  
  // Test transporter creation
  console.log('🔧 Creating email transporter...');
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.error('❌ Cannot create transporter - email credentials not configured');
      console.error('   Add EMAIL_APP_PASSWORD to server/.env file');
      process.exit(1);
    }
    
    // Verify connection
    console.log('✅ Transporter created successfully');
    console.log('🔍 Verifying SMTP connection...');
    
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');
    
    // Test sending email
    const testEmail = process.env.TEST_EMAIL || 'your-email@example.com';
    console.log(`📧 Sending test welcome email to: ${testEmail}`);
    if (!process.env.TEST_EMAIL) {
      console.log('⚠️  Using default email. Set TEST_EMAIL in .env to test with your email.\n');
    }
    console.log('');
    
    const result = await sendWelcomeEmail('Test User', testEmail);
    
    if (result.success) {
      console.log('✅ SUCCESS! Email sent successfully!');
      console.log('📬 Message ID:', result.messageId);
      console.log(`\n📬 Check the inbox/spam folder for: ${testEmail}`);
      console.log('   Subject: 🎉 Welcome to Acceptly - Your Journey to Mastery Begins!');
    } else {
      console.log('❌ FAILED to send email');
      console.log('Error:', result.error);
      if (result.code) {
        console.log('Error Code:', result.code);
      }
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('\n🔍 Full error details:');
    console.error(error);
    
    // Common error solutions
    console.log('\n💡 Common Solutions:');
    if (error.code === 'EAUTH') {
      console.log('  - Check your EMAIL_USER and EMAIL_APP_PASSWORD in server/.env');
      console.log('  - Make sure you\'re using Gmail App Password, not regular password');
    }
    if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.log('  - Check your internet connection');
      console.log('  - Check if Gmail SMTP is accessible');
    }
    if (error.message.includes('Invalid login')) {
      console.log('  - Gmail App Password might be incorrect');
      console.log('  - Generate a new App Password from Google Account settings');
    }
  }
  
  process.exit(0);
}

testEmail();

