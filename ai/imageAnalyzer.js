/**
 * imageAnalyzer.js
 * Analyzes meeting screenshots using Groq vision model.
 * Returns a short text description of what's on screen.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs   = require('fs');
const path = require('path');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

/**
 * Analyzes a screenshot file and returns a text description.
 * @param {string} filePath - Absolute path to the image file (png/jpg)
 * @returns {Promise<string|null>} - Short description or null on failure
 */
async function analyzeImage(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    console.warn('[ImageAnalyzer] File not found:', filePath);
    return null;
  }

  try {
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');
    const ext = path.extname(filePath).toLowerCase().replace('.', '');
    const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';

    const response = await groq.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
            {
              type: 'text',
              text: 'Describe what is visible on this screen in 1-2 sentences. Focus on slides, documents, diagrams, code, or any text content relevant to a meeting or presentation. Be concise.',
            },
          ],
        },
      ],
      temperature: 0.2,
      max_tokens: 150,
    });

    const description = response.choices[0]?.message?.content?.trim();
    if (description) {
      console.log('[ImageAnalyzer] Analyzed:', description);
    }
    return description || null;
  } catch (err) {
    console.error('[ImageAnalyzer] Error:', err.message);
    return null;
  }
}

module.exports = { analyzeImage };
