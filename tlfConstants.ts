/* obsidian-file-info-panel-plugin */
/* https://github.com/CattailNu/obsidian-file-info-panel-plugin */

/* T. L. Ford */
/* https://www.Cattail.Nu */

export const VIEW_TYPE = "tlfItemView";

// export const INTERVAL_MINUTES = 0.3;


/*
https://github.com/lukeleppan/better-word-count
*/

export const MATCH_HTML_COMMENT = new RegExp(
  "<!--[\\s\\S]*?(?:-->)?" +
    "<!---+>?" +
    "|<!(?![dD][oO][cC][tT][yY][pP][eE]|\\[CDATA\\[)[^>]*>?" +
    "|<[?][^>]*>?",
  "g"
);
export const MATCH_COMMENT = new RegExp("%%[^%%]+%%", "g");

export const COMMON_ENGLISH_WORDS = "\
(\\ba\\b)|\
(\\babout\\b)|\
(\\bafter\\b)|\
(\\ball\\b)|\
(\\balso\\b)|\
(\\ban\\b)|\
(\\band\\b)|\
(\\bany\\b)|\
(\\bas\\b)|\
(\\bat\\b)|\
(\\bback\\b)|\
(\\bbe\\b)|\
(\\bbecause\\b)|\
(\\bbut\\b)|\
(\\bby\\b)|\
(\\bcan\\b)|\
(\\bcome\\b)|\
(\\bcould\\b)|\
(\\bday\\b)|\
(\\bdo\\b)|\
(\\beven\\b)|\
(\\bfirst\\b)|\
(\\bfor\\b)|\
(\\bfrom\\b)|\
(\\bget\\b)|\
(\\bgive\\b)|\
(\\bgo\\b)|\
(\\bgood\\b)|\
(\\bhave\\b)|\
(\\bhe\\b)|\
(\\bher\\b)|\
(\\bhim\\b)|\
(\\bhis\\b)|\
(\\bhow\\b)|\
(\\bi\\b)|\
(\\bif\\b)|\
(\\bin\\b)|\
(\\binto\\b)|\
(\\bit\\b)|\
(\\bits\\b)|\
(\\bjust\\b)|\
(\\bknow\\b)|\
(\\blike\\b)|\
(\\blook\\b)|\
(\\bmake\\b)|\
(\\bme\\b)|\
(\\bmost\\b)|\
(\\bmy\\b)|\
(\\bnew\\b)|\
(\\bno\\b)|\
(\\bnot\\b)|\
(\\bnow\\b)|\
(\\bof\\b)|\
(\\bon\\b)|\
(\\bone\\b)|\
(\\bonly\\b)|\
(\\bor\\b)|\
(\\bother\\b)|\
(\\bour\\b)|\
(\\bout\\b)|\
(\\bover\\b)|\
(\\bpeople\\b)|\
(\\bsay\\b)|\
(\\bsee\\b)|\
(\\bshe\\b)|\
(\\bso\\b)|\
(\\bsome\\b)|\
(\\btake\\b)|\
(\\bthan\\b)|\
(\\bthat\\b)|\
(\\bthe\\b)|\
(\\btheir\\b)|\
(\\bthem\\b)|\
(\\bthen\\b)|\
(\\bthere\\b)|\
(\\bthese\\b)|\
(\\bthey\\b)|\
(\\bthink\\b)|\
(\\bthis\\b)|\
(\\btime\\b)|\
(\\bto\\b)|\
(\\btwo\\b)|\
(\\bup\\b)|\
(\\bus\\b)|\
(\\buse\\b)|\
(\\bwant\\b)|\
(\\bway\\b)|\
(\\bwe\\b)|\
(\\bwell\\b)|\
(\\bwhat\\b)|\
(\\bwhen\\b)|\
(\\bwhich\\b)|\
(\\bwho\\b)|\
(\\bwill\\b)|\
(\\bwith\\b)|\
(\\bwork\\b)|\
(\\bwould\\b)|\
(\\byear\\b)|\
(\\byou\\b)|\
(\\byour\\b)\
";
