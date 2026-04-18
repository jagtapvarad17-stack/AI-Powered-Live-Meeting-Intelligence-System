/**
 * taskDetector.js
 * Regex-based action item extractor.
 * Returns: { task, assignee, confidence }
 */

const PATTERNS = [
  // "X will do Y"  or  "X will handle Y"
  {
    re: /\b(?<assignee>[A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+will\s+(?<task>.+?)(?:[,.]|$)/gi,
    confidence: 0.85,
  },
  // "I will ..."
  {
    re: /\bI(?:'m going to| will| am going to)\s+(?<task>.+?)(?:[,.]|$)/gi,
    assignee: 'Me',
    confidence: 0.75,
  },
  // "Assign ... to X"
  {
    re: /\bAssign\s+(?<task>.+?)\s+to\s+(?<assignee>[A-Z][a-z]+(?:\s[A-Z][a-z]+)?)(?:[,.]|$)/gi,
    confidence: 0.90,
  },
  // "Action item: ..."
  {
    re: /\baction item\s*[:–-]\s*(?<task>.+?)(?:[,.]|$)/gi,
    assignee: 'Unassigned',
    confidence: 0.70,
  },
  // "X should/must/needs to ..."
  {
    re: /\b(?<assignee>[A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+(?:should|must|needs to)\s+(?<task>.+?)(?:[,.]|$)/gi,
    confidence: 0.65,
  },
];

/**
 * @param {string} sentence
 * @returns {Array<{task: string, assignee: string, confidence: number}>}
 */
function extractTasks(sentence) {
  const results = [];

  for (const { re, assignee: staticAssignee, confidence } of PATTERNS) {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(sentence)) !== null) {
      const groups = match.groups || {};
      const task     = (groups.task     || '').trim();
      const assignee = (groups.assignee || staticAssignee || 'Unassigned').trim();

      if (task.split(' ').length < 2) continue; // skip noise

      results.push({
        task:      task.charAt(0).toUpperCase() + task.slice(1),
        assignee,
        confidence,
        timestamp: new Date().toISOString(),
      });
    }
  }

  return results;
}

module.exports = { extractTasks };
