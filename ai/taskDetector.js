/**
 * taskDetector.js
 * 
 * Hybrid Local Task Detection: Comprehensive Regex + NLP (compromise.js)
 * Understands both explicit task phrasing and general linguistic grammar.
 * Zero API calls — runs offline, instantly.
 */
const nlp = require('compromise');

// Dedup recent tasks
let recentTasks = [];

// ── Strategy 1: Comprehensive Regex Patterns ─────────────────────────────
const REGEX_PATTERNS = [
  { re: /\b(?<assignee>[A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+will\s+(?<task>.+?)(?:[,.]|$)/gi, confidence: 0.85 },
  { re: /\bI(?:'m going to| will| am going to)\s+(?<task>.+?)(?:[,.]|$)/gi, assignee: 'Me', confidence: 0.80 },
  { re: /\bAssign\s+(?<task>.+?)\s+to\s+(?<assignee>\w+(?:\s\w+)?)(?:[,.]|$)/gi, confidence: 0.90 },
  { re: /\baction item\s*[:–\-]\s*(?<task>.+?)(?:[,.]|$)/gi, assignee: 'Unassigned', confidence: 0.85 },
  { re: /\b(?<assignee>[A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+(?:should|must|needs to|has to)\s+(?<task>.+?)(?:[,.]|$)/gi, confidence: 0.70 },
  { re: /\b(?<assignee>[A-Z][a-z]+)[,.]?\s+(?:it is|it's)\s+your\s+(?:duty|responsibility|job|task)\s+to\s+(?<task>.+?)(?:[,.]|$)/gi, confidence: 0.90 },
  { re: /\b(?:it is|it's)\s+your\s+(?:duty|responsibility|job|task)\s+to\s+(?<task>.+?)(?:[,.]|$)/gi, assignee: 'You', confidence: 0.85 },
  { re: /\byour\s+(?:duty|responsibility|job|task)\s+(?:is\s+)?to\s+(?<task>.+?)(?:[,.]|$)/gi, assignee: 'You', confidence: 0.85 },
  { re: /\byou\s+(?:need to|have to|should|must|gotta|got to)\s+(?<task>.+?)(?:[,.]|$)/gi, assignee: 'You', confidence: 0.75 },
  { re: /\b(?<assignee>[A-Z][a-z]+)[,]?\s+(?<task>(?:do|write|send|finish|complete|prepare|handle|update|fix|review|check|create|set up|schedule|organize|submit|draft|make|take care of|look into|follow up|work on|get|find|call|email|contact|reach out|clean up|test|deploy|push|merge|investigate)\b.+?)(?:[,.]|$)/gi, confidence: 0.80 },
  { re: /\bI\s+(?:need|want)\s+you\s+to\s+(?<task>.+?)(?:[,.]|$)/gi, assignee: 'You', confidence: 0.85 },
  { re: /\b(?:let's|let us|we need to|we should|we must|we have to|we gotta)\s+(?<task>.+?)(?:[,.]|$)/gi, assignee: 'Team', confidence: 0.65 },
  { re: /\b(?:make sure|don't forget to|remember to|be sure to)\s+(?<task>.+?)(?:[,.]|$)/gi, assignee: 'Unassigned', confidence: 0.70 },
  { re: /\bplease\s+(?<task>\w+\s+.+?)(?:[,.]|$)/gi, assignee: 'Unassigned', confidence: 0.65 },
  { re: /\b(?:can you|could you|would you|will you)\s+(?:please\s+)?(?<task>.+?)(?:\?|[,.]|$)/gi, assignee: 'Unassigned', confidence: 0.65 },
  { re: /\b(?<assignee>[A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+is\s+responsible\s+for\s+(?<task>.+?)(?:[,.]|$)/gi, confidence: 0.85 },
  { re: /\b(?<assignee>[A-Z][a-z]+)\s+(?:will\s+)?(?:take care of|handle|manage|own)\s+(?<task>.+?)(?:[,.]|$)/gi, confidence: 0.75 },
  { re: /\b(?<task>.{10,}?)\s+by\s+(?<deadline>tomorrow|tonight|end of (?:day|week|month|sprint)|next (?:week|monday|tuesday|wednesday|thursday|friday)|(?:monday|tuesday|wednesday|thursday|friday))(?:[,.]|$)/gi, assignee: 'Unassigned', confidence: 0.70 },
];

const OBLIGATION_VERBS = new Set(['will', 'shall', 'should', 'must', 'need', 'have', 'got', 'going', 'ought', 'supposed']);
const COMMON_NAMES = new Set(['john', 'sarah', 'mike', 'maria', 'david', 'james', 'robert', 'mary', 'alex', 'sam', 'chris', 'pat', 'jordan']);

/**
 * Normalizes task and prepares details.
 */
function buildTaskObj(task, assignee, confidence, deadline, source) {
  const tStr = typeof task === 'string' ? task : '';
  if (tStr.split(' ').length < 2 || tStr.length < 5) return null;
  return {
    task: tStr.charAt(0).toUpperCase() + tStr.slice(1).trim(),
    assignee: assignee || 'Unassigned',
    confidence,
    priority: 'medium',
    deadline: deadline || null,
    source,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Detect tasks per sentence using Regex, then fallback to NLP if no match.
 */
function extractTasks(sentence) {
  if (!sentence || sentence.trim().length < 5) return [];

  const text = sentence.trim();
  const lower = text.toLowerCase();
  const results = [];
  const seen = new Set();
  let foundByRegex = false;

  // 1. Try Regex Patterns
  for (const { re, assignee: staticAssignee, confidence } of REGEX_PATTERNS) {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(text)) !== null) {
      const groups = match.groups || {};
      const tStr = (groups.task || '').trim();
      const aStr = (groups.assignee || staticAssignee || 'Unassigned').trim();
      const dStr = groups.deadline || null;

      const obj = buildTaskObj(tStr, aStr, confidence, dStr, 'regex');
      if (obj) {
        const key = obj.task.toLowerCase();
        if (!seen.has(key) && !recentTasks.includes(key)) {
          results.push(obj);
          seen.add(key);
          recentTasks.push(key);
          foundByRegex = true;
        }
      }
    }
  }

  // 2. Try NLP if Regex didn't catch anything
  if (!foundByRegex) {
    const doc = nlp(text);
    let isImperative = false;
    let hasModalVerb = false;
    let hasPersonAssignment = false;
    
    // Check sentences
    doc.sentences().forEach(s => {
      const parts = s.terms().json();
      if (parts.length < 2) return;
      
      const firstWordInfo = parts[0];
      const tags = (firstWordInfo.terms && firstWordInfo.terms[0] && firstWordInfo.terms[0].tags) || [];
      
      if (tags.includes('Verb') || tags.includes('Imperative')) {
        const w = firstWordInfo.text.toLowerCase();
        if (!['is', 'am', 'are', 'was', 'does', 'did', 'have', 'has', 'know', 'see', 'say', 'think', 'feel'].includes(w)) {
          isImperative = true;
        }
      }
      
      parts.forEach(p => {
        const tTags = (p.terms && p.terms[0] && p.terms[0].tags) || [];
        if (tTags.includes('Modal') || OBLIGATION_VERBS.has(p.text.toLowerCase())) {
          hasModalVerb = true;
        }
      });
    });

    const people = doc.people().out('array');
    const firstWord = text.split(/[\s,]+/)[0].toLowerCase();
    if (COMMON_NAMES.has(firstWord) || people.length > 0) {
      hasPersonAssignment = true;
    }

    const isTask = isImperative || (hasModalVerb && hasPersonAssignment);
    
    if (isTask) {
      let assignee = 'Unassigned';
      let conf = 0.70;
      let taskText = text;

      if (people.length > 0) assignee = people[0];
      else if (COMMON_NAMES.has(firstWord)) assignee = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
      
      if (lower.includes('i will') || lower.includes("i'm going to")) assignee = 'Me';
      else if (lower.startsWith("let's") || lower.startsWith('we ')) assignee = 'Team';

      if (assignee !== 'Unassigned' && assignee !== 'Me' && assignee !== 'Team') {
        taskText = text.replace(new RegExp('^' + assignee + '[,.]?\\s*', 'i'), '').trim();
      }

      if (taskText.length > 80) taskText = taskText.substring(0, 80).trim() + '...';

      let deadline = null;
      const dMatch = lower.match(/by\s+(tomorrow|tonight|next week|friday)/i);
      if (dMatch) deadline = dMatch[1];

      const obj = buildTaskObj(taskText, assignee, conf, deadline, 'nlp');
      if (obj) {
        const key = obj.task.toLowerCase();
        if (!seen.has(key) && !recentTasks.includes(key)) {
          results.push(obj);
          seen.add(key);
          recentTasks.push(key);
        }
      }
    }
  }

  // Bounded dedup
  if (recentTasks.length > 100) recentTasks = recentTasks.slice(-50);

  if (results.length > 0) {
    console.log(`[TaskDetector] Found ${results.length} task(s):`, results.map(t => `"${t.task}" → ${t.assignee}`));
  }

  return results;
}

function resetTaskDetector() {
  recentTasks = [];
}

module.exports = { extractTasks, resetTaskDetector };
