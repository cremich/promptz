import path from 'path'
import { 
  safeFileRead, 
  parseYamlFrontmatter, 
  parseJsonConfig, 
  generateTitleFromFilename,
  generatePathId,
  directoryExists,
  getFilesWithExtension
} from './library-file-parser'
import { extractGitFileInfo, extractGitDirectoryInfo, formatGitDate, getShortHash } from './git-extractor'
import type { Power, Agent, Prompt, SteeringDocument, Hook, GitInfo } from '../lib/types/content'

const PLACEHOLDER_AUTHOR = 'Unknown Author'
const PLACEHOLDER_DATE = 'Unknown Date'

/**
 * Get author and date with git fallback
 * Build-time version with git integration
 */
async function getAuthorAndDate(
  frontmatterData: Record<string, unknown>,
  filePath: string,
  useDirectory = false
): Promise<{ author: string; date: string; git?: GitInfo }> {
  // Try frontmatter first - ensure they are strings
  let author = typeof frontmatterData.author === 'string' ? frontmatterData.author : undefined
  let date = typeof frontmatterData.date === 'string' ? frontmatterData.date : undefined
  
  // If frontmatter has both author and date, use them but still get git info
  let gitInfo: GitInfo | undefined
  
  try {
    // Extract git information
    const gitFileInfo = useDirectory 
      ? await extractGitDirectoryInfo(filePath)
      : await extractGitFileInfo(filePath)
    
    if (gitFileInfo) {
      gitInfo = {
        author: gitFileInfo.author,
        authorEmail: gitFileInfo.authorEmail,
        createdDate: formatGitDate(gitFileInfo.createdDate),
        lastModifiedDate: formatGitDate(gitFileInfo.lastModifiedDate),
        commitHash: getShortHash(gitFileInfo.commitHash),
        commitMessage: gitFileInfo.commitMessage
      }
      
      // Use git info as fallback if frontmatter is missing
      if (!author) {
        author = gitFileInfo.author
      }
      if (!date) {
        date = formatGitDate(gitFileInfo.createdDate)
      }
    }
  } catch (error) {
    console.warn(`Failed to extract git info for ${filePath}:`, error)
  }
  
  // Final fallback to placeholders if no frontmatter or git data
  return {
    author: author || PLACEHOLDER_AUTHOR,
    date: date || PLACEHOLDER_DATE,
    git: gitInfo
  }
}

/**
 * Extract power metadata from directory
 * Build-time version without Next.js cache
 */
export async function extractPowerMetadata(
  libraryName: string,
  powerName: string,
  powerPath: string
): Promise<Power | null> {
  try {
    const powerMdPath = path.join(powerPath, 'POWER.md')
    const mcpConfigPath = path.join(powerPath, 'mcp.json')
    
    // Read POWER.md file
    const powerContent = await safeFileRead(powerMdPath)
    if (!powerContent) {
      console.warn(`No POWER.md found for power: ${powerName}`)
      return null
    }
    
    // Parse frontmatter
    const { content, data } = parseYamlFrontmatter(powerContent)
    
    // Extract author and date with git fallback
    const { author, date, git } = await getAuthorAndDate(data, powerPath, true)
    
    // Read MCP configuration if it exists
    const mcpConfig = await parseJsonConfig(mcpConfigPath)
    
    // Check for steering files
    const steeringPath = path.join(powerPath, 'steering')
    const steeringFiles: string[] = []
    if (await directoryExists(steeringPath)) {
      const files = await getFilesWithExtension(steeringPath, '.md')
      steeringFiles.push(...files)
    }
    
    // Extract metadata
    const displayName = typeof data.displayName === 'string' ? data.displayName : generateTitleFromFilename(powerName)
    const description = typeof data.description === 'string' ? data.description : ''
    const keywords = Array.isArray(data.keywords) ? data.keywords.filter(k => typeof k === 'string') : []
    
    return {
      type: 'power',
      id: generatePathId(libraryName, 'powers', powerName),
      title: displayName,
      displayName,
      description,
      keywords,
      author,
      date,
      path: powerPath,
      content,
      mcpConfig: mcpConfig || undefined,
      steeringFiles: steeringFiles.length > 0 ? steeringFiles : undefined,
      git
    }
    
  } catch (error) {
    console.warn(`Failed to extract power metadata: ${powerName}`, error)
    return null
  }
}

/**
 * Extract agent metadata from file
 * Build-time version without Next.js cache
 */
export async function extractAgentMetadata(
  libraryName: string,
  agentFile: string,
  agentPath: string
): Promise<Agent | null> {
  try {
    // Read agent markdown file
    const agentContent = await safeFileRead(agentPath)
    if (!agentContent) {
      console.warn(`Failed to read agent file: ${agentFile}`)
      return null
    }
    
    // Parse frontmatter
    const { content, data } = parseYamlFrontmatter(agentContent)
    
    // Extract author and date with git fallback
    const { author, date, git } = await getAuthorAndDate(data, agentPath)
    
    // Look for corresponding JSON config file with same base name
    const agentDir = path.dirname(agentPath)
    const agentName = path.basename(agentFile, '.md')
    const configPath = path.join(agentDir, `${agentName}.json`)
    const config = await parseJsonConfig(configPath) || {}
    
    // Extract metadata
    const title = typeof data.title === 'string' ? data.title : generateTitleFromFilename(agentName)
    const description = typeof data.description === 'string' ? data.description : ''
    
    return {
      type: 'agent',
      id: generatePathId(libraryName, 'agents', agentName),
      title,
      description,
      author,
      date,
      path: agentPath,
      content,
      config,
      git
    }
    
  } catch (error) {
    console.warn(`Failed to extract agent metadata: ${agentFile}`, error)
    return null
  }
}

/**
 * Extract prompt metadata from file
 * Build-time version without Next.js cache
 */
export async function extractPromptMetadata(
  libraryName: string,
  promptFile: string,
  promptPath: string
): Promise<Prompt | null> {
  try {
    // Read prompt markdown file
    const promptContent = await safeFileRead(promptPath)
    if (!promptContent) {
      console.warn(`Failed to read prompt file: ${promptFile}`)
      return null
    }
    
    // Parse frontmatter
    const { content, data } = parseYamlFrontmatter(promptContent)
    
    // Extract author and date with git fallback
    const { author, date, git } = await getAuthorAndDate(data, promptPath)
    
    // Extract metadata
    const promptName = path.basename(promptFile, '.md')
    const title = typeof data.title === 'string' ? data.title : generateTitleFromFilename(promptName)
    const category = typeof data.category === 'string' ? data.category : undefined
    
    return {
      type: 'prompt',
      id: generatePathId(libraryName, 'prompts', promptName),
      title,
      author,
      date,
      path: promptPath,
      content,
      category,
      git
    }
    
  } catch (error) {
    console.warn(`Failed to extract prompt metadata: ${promptFile}`, error)
    return null
  }
}

/**
 * Extract steering document metadata from file
 * Build-time version without Next.js cache
 */
export async function extractSteeringMetadata(
  libraryName: string,
  steeringFile: string,
  steeringPath: string
): Promise<SteeringDocument | null> {
  try {
    // Read steering markdown file
    const steeringContent = await safeFileRead(steeringPath)
    if (!steeringContent) {
      console.warn(`Failed to read steering file: ${steeringFile}`)
      return null
    }
    
    // Parse frontmatter
    const { content, data } = parseYamlFrontmatter(steeringContent)
    
    // Extract author and date with git fallback
    const { author, date, git } = await getAuthorAndDate(data, steeringPath)
    
    // Extract metadata
    const steeringName = path.basename(steeringFile, '.md')
    const title = typeof data.title === 'string' ? data.title : generateTitleFromFilename(steeringName)
    const category = typeof data.category === 'string' ? data.category : undefined
    
    return {
      type: 'steering',
      id: generatePathId(libraryName, 'steering', steeringName),
      title,
      author,
      date,
      path: steeringPath,
      content,
      category,
      git
    }
    
  } catch (error) {
    console.warn(`Failed to extract steering metadata: ${steeringFile}`, error)
    return null
  }
}

/**
 * Extract hook metadata from file
 * Build-time version without Next.js cache
 */
export async function extractHookMetadata(
  libraryName: string,
  hookFile: string,
  hookPath: string
): Promise<Hook | null> {
  try {
    // Read hook file
    const hookContent = await safeFileRead(hookPath)
    if (!hookContent) {
      console.warn(`Failed to read hook file: ${hookFile}`)
      return null
    }
    
    // Parse as JSON (hook files are JSON format)
    let hookData: Record<string, unknown>
    try {
      hookData = JSON.parse(hookContent)
    } catch (error) {
      console.warn(`Failed to parse hook JSON: ${hookFile}`, error)
      return null
    }
    
    // Extract author and date with git fallback
    const { author, date, git } = await getAuthorAndDate(hookData, hookPath)
    
    // Extract metadata
    const hookName = path.basename(hookFile, '.kiro.hook')
    const title = typeof hookData.title === 'string' ? hookData.title : generateTitleFromFilename(hookName)
    const description = typeof hookData.description === 'string' ? hookData.description : ''
    const trigger = typeof hookData.trigger === 'string' ? hookData.trigger : undefined
    
    return {
      type: 'hook',
      id: generatePathId(libraryName, 'hooks', hookName),
      title,
      description,
      author,
      date,
      path: hookPath,
      content: hookContent,
      trigger,
      git
    }
    
  } catch (error) {
    console.warn(`Failed to extract hook metadata: ${hookFile}`, error)
    return null
  }
}