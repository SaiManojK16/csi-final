/**
 * Keep-Alive Script for Render Free Tier
 * 
 * This script pings your Render service every 14 minutes to prevent spin-down.
 * 
 * To use this:
 * 1. Deploy this to a free service like UptimeRobot, Cron-Job.org, or GitHub Actions
 * 2. Set the RENDER_URL environment variable to your Render service URL
 * 3. Schedule it to run every 14 minutes
 * 
 * Or use UptimeRobot (free): https://uptimerobot.com
 * - Add a new monitor
 * - Type: HTTP(s)
 * - URL: https://csi-final.onrender.com/api/ping
 * - Interval: 5 minutes
 */

const RENDER_URL = process.env.RENDER_URL || 'https://csi-final.onrender.com';

async function pingService() {
  try {
    const response = await fetch(`${RENDER_URL}/api/ping`);
    const data = await response.json();
    console.log(`✅ Ping successful: ${new Date().toISOString()}`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`❌ Ping failed: ${new Date().toISOString()}`, error.message);
    return { success: false, error: error.message };
  }
}

// If running as a script
if (require.main === module) {
  pingService().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = { pingService };

