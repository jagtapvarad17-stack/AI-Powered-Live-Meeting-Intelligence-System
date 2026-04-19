const express = require('express');
const { google } = require('googleapis');
const CalendarToken = require('./models/CalendarToken');

const router = express.Router();

const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

// 1. Generate Auth URL
router.get('/auth/google', (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(400).send('Google Client ID not configured in .env');
  }
  const oauth2Client = getOAuth2Client();
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Request refresh token
    prompt: 'consent',      // Force consent to ensure we get a refresh token
    scope: ['https://www.googleapis.com/auth/calendar.events'],
  });
  res.redirect(url);
});

// 2. Handle OAuth Callback
router.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.send('Authentication failed: No code provided');

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens in DB (using 'default' as userId for local single-user app)
    await CalendarToken.findOneAndUpdate(
      { userId: 'default' },
      { ...tokens, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    
    res.send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
          <h2>Authentication Successful!</h2>
          <p>You can close this window and return to the app.</p>
          <script>setTimeout(() => window.close(), 3000);</script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Error in Google Auth callback:', err);
    res.status(500).send('Authentication failed');
  }
});

// 3. Check Authentication Status
router.get('/api/calendar/status', async (req, res) => {
  const tokenRecord = await CalendarToken.findOne({ userId: 'default' });
  if (tokenRecord && tokenRecord.refresh_token) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

// 4. Schedule Event
router.post('/api/calendar/schedule', async (req, res) => {
  const { title, start, end, description } = req.body;
  if (!start) return res.status(400).json({ error: 'Start time is required' });

  try {
    const tokenRecord = await CalendarToken.findOne({ userId: 'default' });
    if (!tokenRecord) {
      return res.status(401).json({ error: 'auth_expired' });
    }

    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({
      access_token: tokenRecord.access_token,
      refresh_token: tokenRecord.refresh_token,
      expiry_date: tokenRecord.expiry_date
    });

    // Handle token refresh automatically via googleapis if expired
    oauth2Client.on('tokens', async (tokens) => {
      if (tokens.refresh_token) {
        await CalendarToken.findOneAndUpdate(
          { userId: 'default' },
          { ...tokens, updatedAt: Date.now() }
        );
      }
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const serverTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const event = {
      summary: title,
      description: description,
      start: {
        dateTime: new Date(start).toISOString(),
        timeZone: serverTimezone,
      },
      end: {
        dateTime: new Date(end).toISOString(),
        timeZone: serverTimezone,
      },
      reminders: {
        useDefault: true,
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    res.json({ success: true, eventLink: response.data.htmlLink });
  } catch (err) {
    console.error('Calendar scheduling error:', err);
    // Determine if it's an auth error
    if (err.code === 401 || err.message.includes('invalid_grant')) {
      return res.status(401).json({ error: 'auth_expired' });
    }
    res.status(500).json({ error: 'event_failed', details: err.message });
  }
});

module.exports = router;
