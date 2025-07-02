#!/bin/bash

# git --no-pager Context Hook for Amazon Q Developer
# Provides comprehensive git --no-pager information for better AI assistance

echo "=== git --no-pager CONTEXT INFORMATION ==="
echo

echo "📍 CURRENT STATE"
echo "Branch: $(git --no-pager branch --show-current)"
echo "Last commit: $(git --no-pager log -1 --pretty=format:'%h - %s (%ar)')"
echo

echo "🔄 WORKING DIRECTORY STATUS"
git --no-pager status --porcelain --branch
echo

echo "📝 RECENT COMMITS (Last 10)"
git --no-pager log --oneline --graph --decorate -10
echo

echo "📊 RECENT FILE CHANGES"
echo "Files changed in last 5 commits:"
git --no-pager diff --stat HEAD~5..HEAD
echo

echo "🏷️ STAGED CHANGES"
if git --no-pager diff --cached --quiet; then
    echo "No staged changes"
else
    git --no-pager diff --cached --name-status
fi
echo

echo "⚡ UNSTAGED CHANGES"
if git --no-pager diff --quiet; then
    echo "No unstaged changes"
else
    git --no-pager diff --name-status
fi
echo

echo "🕒 RECENT ACTIVITY (Last 14 days)"
git --no-pager log --since="2 weeks ago" --pretty=format:"%h %s (%an, %ar)" --abbrev-commit
echo

echo "🌿 BRANCH INFORMATION"
echo "Recent branches:"
git --no-pager for-each-ref --format='%(refname:short) - %(committerdate:relative)' refs/heads/ | head -5
echo

echo "🔍 CURRENT DIFF SUMMARY"
if ! git --no-pager diff --quiet || ! git --no-pager diff --cached --quiet; then
    echo "Modified files with line changes:"
    git --no-pager diff --stat
    git --no-pager diff --cached --stat
else
    echo "No current changes to show"
fi

echo
echo "=== END git --no-pager CONTEXT ==="
