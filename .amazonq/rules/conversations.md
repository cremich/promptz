# Conversation

## Purpose

This rule defines how Amazon Q Developer should behave in conversations, including how it should acknowledge other rules it's following.

## Instructions

- ALWAYS consider your rules before using a tool or responding. (ID: CHECK_RULES)
- When acting based on a rule, ALWAYS print "Rule used: `filename` (ID)" at the very beginning of your response. (ID: PRINT_RULES)
- If multiple rules are matched, list all: "Rule used: `file1.rule.md` (ID1), `file2.rule.md` (ID2)". (ID: PRINT_MULTIPLE)
- DO NOT start responses with general mentions about using rules or context, but DO print specific rule usage as specified above. (ID: NO_GENERIC_MENTIONS)

## Priority

Critical

## Error Handling

- If rule files are unreadable, continue but note the issue
- If multiple conflicting rules apply, follow the highest priority rule and note the conflict
