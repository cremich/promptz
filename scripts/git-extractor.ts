import { simpleGit, SimpleGit, LogResult } from 'simple-git'
import path from 'path'

export interface GitFileInfo {
  author: string
  authorEmail: string
  createdDate: string
  lastModifiedDate: string
  commitHash: string
  commitMessage: string
}

/**
 * Cache for git instances per repository (build-time version)
 */
const gitInstances = new Map<string, SimpleGit>()

/**
 * Get or create a git instance for a repository
 */
function getGitInstance(repoPath: string): SimpleGit {
  if (!gitInstances.has(repoPath)) {
    gitInstances.set(repoPath, simpleGit(repoPath))
  }
  return gitInstances.get(repoPath)!
}

/**
 * Extract git information for a specific file (build-time version)
 */
export async function extractGitFileInfo(filePath: string): Promise<GitFileInfo | null> {
  try {
    // Find the git repository root for this file
    const repoPath = await findGitRoot(filePath)
    if (!repoPath) {
      console.warn(`No git repository found for file: ${filePath}`)
      return null
    }
    
    const git = getGitInstance(repoPath)
    
    // Get relative path from repo root
    const relativePath = path.relative(repoPath, filePath)
    
    // Get git log for this specific file
    const log: LogResult = await git.log({
      file: relativePath,
      maxCount: 1000 // Get extensive history to find true creation
    })
    
    if (!log.all || log.all.length === 0) {
      console.warn(`No git history found for file: ${relativePath}`)
      return null
    }
    
    // Most recent commit (last modified)
    const latestCommit = log.all[0]
    
    // Oldest commit (creation) - last in the array
    const oldestCommit = log.all[log.all.length - 1]
    
    return {
      author: oldestCommit.author_name, // Use original author for creation
      authorEmail: oldestCommit.author_email,
      createdDate: oldestCommit.date,
      lastModifiedDate: latestCommit.date,
      commitHash: oldestCommit.hash, // Use original commit hash
      commitMessage: oldestCommit.message
    }
  } catch (error) {
    console.warn(`Failed to extract git info for ${filePath}:`, error)
    return null
  }
}

/**
 * Find the git repository root for a given file path
 */
async function findGitRoot(filePath: string): Promise<string | null> {
  try {
    let currentPath = path.dirname(filePath)
    
    // Walk up the directory tree looking for .git
    while (currentPath !== path.dirname(currentPath)) {
      const git = simpleGit(currentPath)
      
      try {
        await git.status()
        return currentPath
      } catch {
        // Not a git repo, continue up
        currentPath = path.dirname(currentPath)
      }
    }
    
    return null
  } catch (error) {
    console.warn(`Error finding git root for ${filePath}:`, error)
    return null
  }
}

/**
 * Check if a commit affects the given directory
 */
async function isCommitRelevantToDirectory(git: SimpleGit, commitHash: string, relativePath: string): Promise<boolean> {
  try {
    const files = await git.show([commitHash, '--name-only', '--format='])
    const fileList = files.split('\n').filter(f => f.trim())
    
    // Check if any file in the commit is within the directory
    const isRelevant = fileList.some(file => {
      // Normalize paths for comparison
      const normalizedFile = file.replace(/\\/g, '/')
      const normalizedPath = relativePath.replace(/\\/g, '/')
      
      return normalizedFile.startsWith(normalizedPath + '/') || normalizedFile === normalizedPath
    })
    
    return isRelevant
  } catch (error) {
    console.warn(`Error checking commit relevance for ${commitHash}:`, error)
    return false
  }
}

/**
 * Filter commits that affected the given directory
 */
async function getRelevantCommits(git: SimpleGit, log: LogResult, relativePath: string) {
  const relevantCommits = []
  
  for (const commit of log.all) {
    const isRelevant = await isCommitRelevantToDirectory(git, commit.hash, relativePath)
    if (isRelevant) {
      relevantCommits.push(commit)
    }
  }
  
  // Sort by date to ensure proper chronological order (newest first)
  relevantCommits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  return relevantCommits
}

/**
 * Extract git information for a directory (useful for powers/agents)
 */
export async function extractGitDirectoryInfo(dirPath: string): Promise<GitFileInfo | null> {
  try {
    const repoPath = await findGitRoot(dirPath)
    if (!repoPath) {
      console.warn(`No git repository found for directory: ${dirPath}`)
      return null
    }
    
    const git = getGitInstance(repoPath)
    const relativePath = path.relative(repoPath, dirPath)
    
    // First, try to find POWER.md or main file in the directory
    const powerMdPath = path.join(dirPath, 'POWER.md')
    const powerMdRelativePath = path.relative(repoPath, powerMdPath)
    
    // Try to get git history for POWER.md specifically
    try {
      const powerMdLog: LogResult = await git.log({
        file: powerMdRelativePath,
        maxCount: 1000
      })
      
      if (powerMdLog.all && powerMdLog.all.length > 0) {
        const latestCommit = powerMdLog.all[0]
        const oldestCommit = powerMdLog.all[powerMdLog.all.length - 1]
        
        return {
          author: oldestCommit.author_name,
          authorEmail: oldestCommit.author_email,
          createdDate: oldestCommit.date,
          lastModifiedDate: latestCommit.date,
          commitHash: oldestCommit.hash,
          commitMessage: oldestCommit.message
        }
      }
    } catch (powerMdError) {
      console.warn(`Could not get git history for POWER.md in ${relativePath}, trying directory approach:`, powerMdError)
    }
    
    // Fallback: Get commits that affected this directory
    const log: LogResult = await git.log({
      from: 'HEAD',
      maxCount: 1000
    })
    
    // Filter commits that touched files in this directory
    const relevantCommits = await getRelevantCommits(git, log, relativePath)
    
    if (relevantCommits.length === 0) {
      console.warn(`No relevant commits found for directory: ${relativePath}`)
      return null
    }
    
    const latestCommit = relevantCommits[0]
    const oldestCommit = relevantCommits[relevantCommits.length - 1]
    
    return {
      author: oldestCommit.author_name,
      authorEmail: oldestCommit.author_email,
      createdDate: oldestCommit.date,
      lastModifiedDate: latestCommit.date,
      commitHash: oldestCommit.hash,
      commitMessage: oldestCommit.message
    }
  } catch (error) {
    console.warn(`Failed to extract git directory info for ${dirPath}:`, error)
    return null
  }
}

/**
 * Format git date to a readable string
 */
export function formatGitDate(gitDate: string): string {
  try {
    return new Date(gitDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return gitDate
  }
}

/**
 * Get short commit hash (first 7 characters)
 */
export function getShortHash(fullHash: string): string {
  return fullHash.substring(0, 7)
}