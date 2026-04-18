/**
 * summarizer.js
 * Generates a rolling meeting summary using Groq.
 * Accepts transcript text + optional visual screen context from screenshots.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const SUMMARY_MODEL = 'llama-3.3-70b-versatile';

/**
 * Generates a concise meeting summary.
 * @param {string} transcriptText - Full or partial meeting transcript
 * @param {string[]} imageContexts - Optional array of screen descriptions from screenshots
 * @returns {Promise<string>} - Summary text or empty string on failure
 */
async function generateSummary(transcriptText, imageContexts = []) {
  if (!transcriptText || !transcriptText.trim()) return '';

  // Build the visual context section with spacing between each capture
  const visualSection = imageContexts.length > 0
    ? `\n\nVisual context from screen captures:\n\n${imageContexts.map((d, i) => `📸 Screen ${i + 1}:\n${d}`).join('\n\n')}`
    : '';

  const userContent = `Meeting transcript:\n${transcriptText}${visualSection}`;

  try {
    const response = await groq.chat.completions.create({
      model: SUMMARY_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a meeting assistant. Produce a structured summary with these sections:\n' +
            '**Discussion:** 1-2 sentences on topics discussed.\n' +
            '**Visuals:** bullet points of key content seen on screen (only if screen captures provided).\n' +
            '**Action Items:** bullet points of any tasks or decisions (omit if none).\n' +
            'Keep each section concise. Skip any section that has no content.',
        },
        { role: 'user', content: userContent },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    const summary = response.choices[0]?.message?.content?.trim() || '';
    if (summary) console.log('[Summarizer] Generated summary.');
    return summary;
  } catch (err) {
    console.error('[Summarizer] Groq error:', err.message);
    return '';
  }
}

module.exports = { generateSummary };
