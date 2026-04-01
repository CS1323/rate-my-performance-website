/**
 * Keyword dictionary for automatic comment moderation.
 *
 * Any comment matching an entry in AUTO_HIDE is immediately set to
 * score=10, status=HIDDEN without calling the LLM.
 *
 * Three sub-lists:
 *  - keywords : matched as whole words (\bword\b), case-insensitive
 *  - phrases  : case-insensitive substring match
 *  - patterns : full regex strings, case-insensitive
 *
 * To tune: add/remove entries here. No logic changes needed.
 */
export const AUTO_HIDE = {
  // ─── Political figures & conflict keywords ─────────────────────────────────
  keywords: [
    "ai",
    "biden",
    "democrat",
    "fascist",
    "gaza",
    "hamas",
    "hezbollah",
    "iran",
    "israel",
    "khamenei",
    "nazi",
    "netanyahu",
    "palestine",
    "putin",
    "republican",
    "tehran",
    "trump",
    "ukraine",
    "zelensky",
    "zionist",
  ],

  // ─── Political / extremist phrases ─────────────────────────────────────────
  phrases: [
    "a👁",
    "ai ban",
    "ai is destroying",
    "ai should be banned",
    "ai takeover",
    "ethnic cleansing",
    "genocide",
    "isnotreal",
    "replace humans",
    "war crimes",
  ],

  // ─── Direct targeting (second-person attacks on a specific commenter) ───────
  patterns: [
    // "you're/you are [insult]"
    String.raw`you('re| are)\s+(so\s+)?(pathetic|stupid|dumb|an?\s+idiot|a\s+loser|worthless|disgusting|garbage|trash|terrible|awful|horrible|useless)`,
    // "you should die/kill yourself/etc."
    String.raw`you\s+should\s+(die|kill\s+yourself|hurt\s+yourself|disappear)`,
    // "kill/hurt/destroy/attack you"
    String.raw`(kill|hurt|destroy|attack)\s+you\b`,
    // "you … piece of crap/shit/waste of space"
    String.raw`\byou\b.{0,20}(piece\s+of\s+(crap|sh[i*]t)|waste\s+of\s+space)`,
    // "you" near a standalone insult (e.g. "what are you doing? pathetic!")
    String.raw`\byou\b.{0,50}\b(pathetic|worthless|disgusting|garbage|trash|horrible|useless|awful|terrible)\b`,
  ],
};
