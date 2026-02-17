#!/usr/bin/env tsx

/* eslint-disable max-lines */

/**
 * Build-time script to generate static JSON data for all content types
 * Replaces runtime content service with pre-generated static data
 * Preserves exact same data structure and metadata extraction logic
 */

import path from 'path'
import fs from 'fs/promises'
import { 
  directoryExists, 
  getDirectories, 
  getFilesWithExtension,
  generatePathId,
  filenameToSlug
} from './library-file-parser'
import {
  extractPowerMetadata,
  extractAgentMetadata,
  extractPromptMetadata,
  extractSteeringMetadata,
  extractHookMetadata,
  getAuthorAndDate
} from './metadata-extractor'
import { compareDatesNewestFirst } from '../lib/formatter/date'
import { PROMPT_CATEGORIES } from './prompt-categories'
import type { Library, Power, Agent, Prompt, SteeringDocument, Hook } from '../lib/types/content'

const LIBRARIES_PATH = path.join(process.cwd(), 'libraries')
const DATA_OUTPUT_PATH = path.join(process.cwd(), 'data')

/**
 * Main function to generate all static JSON data
 */
async function generateLibraryData() {
  console.log('🚀 Starting library data generation...')
  
  try {
    // Ensure data directory exists
    await ensureDataDirectory()
    
    // Read all five libraries
    const [promptzLibrary, kiroLibrary, kiroBestPracticesLibrary, productTeamsLibrary, genaiStartupsLibrary] = await Promise.allSettled([
      readPromptzLibrary(),
      readKiroLibrary(),
      readKiroBestPracticesLibrary(),
      readProductTeamsLibrary(),
      readGenaiStartupsLibrary()
    ])
    
    // Extract data from successful library reads
    const promptzData = promptzLibrary.status === 'fulfilled' ? promptzLibrary.value : createEmptyLibrary('promptz', '')
    const kiroData = kiroLibrary.status === 'fulfilled' ? kiroLibrary.value : createEmptyLibrary('kiro-powers', '')
    const kiroBestPracticesData = kiroBestPracticesLibrary.status === 'fulfilled' ? kiroBestPracticesLibrary.value : createEmptyLibrary('kiro-best-practices', '')
    const productTeamsData = productTeamsLibrary.status === 'fulfilled' ? productTeamsLibrary.value : createEmptyLibrary('product-teams', '')
    const genaiStartupsData = genaiStartupsLibrary.status === 'fulfilled' ? genaiStartupsLibrary.value : createEmptyLibrary('genai-startups', '')
    
    // Log any library read failures
    if (promptzLibrary.status === 'rejected') {
      console.warn('⚠️  Failed to read promptz library:', promptzLibrary.reason)
    }
    if (kiroLibrary.status === 'rejected') {
      console.warn('⚠️  Failed to read kiro library:', kiroLibrary.reason)
    }
    if (kiroBestPracticesLibrary.status === 'rejected') {
      console.warn('⚠️  Failed to read kiro-best-practices library:', kiroBestPracticesLibrary.reason)
    }
    if (productTeamsLibrary.status === 'rejected') {
      console.warn('⚠️  Failed to read product-teams library:', productTeamsLibrary.reason)
    }
    if (genaiStartupsLibrary.status === 'rejected') {
      console.warn('⚠️  Failed to read genai-startups library:', genaiStartupsLibrary.reason)
    }
    
    // Generate JSON files for each content type
    await Promise.all([
      generatePromptsData(promptzData, productTeamsData),
      generateAgentsData(promptzData, genaiStartupsData),
      generatePowersData(promptzData, kiroData),
      generateSteeringData(promptzData, kiroData, kiroBestPracticesData, productTeamsData, genaiStartupsData),
      generateHooksData(promptzData, kiroBestPracticesData, productTeamsData)
    ])
    
    console.log('✅ Library data generation completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during library data generation:', error)
    // Don't exit with error code - log warning and continue build
    console.warn('⚠️  Continuing build with potentially incomplete data')
  }
}

/**
 * Ensure data directory exists
 */
async function ensureDataDirectory() {
  try {
    await fs.mkdir(DATA_OUTPUT_PATH, { recursive: true })
    console.log('📁 Data directory ready')
  } catch (error) {
    console.error('Failed to create data directory:', error)
    throw error
  }
}

/**
 * Generate prompts.json
 */
async function generatePromptsData(promptzLibrary: Library, productTeamsLibrary: Library) {
  try {
    const allPrompts = [
      ...promptzLibrary.prompts,
      ...productTeamsLibrary.prompts
    ].map(prompt => ({
      ...prompt,
      category: prompt.category || PROMPT_CATEGORIES[prompt.id] || undefined
    }))
    
    // Sort by creation date (newest first)
    const sortedPrompts = allPrompts.sort((a, b) => {
      const dateA = a.git?.createdDate || a.date
      const dateB = b.git?.createdDate || b.date
      return compareDatesNewestFirst(dateA, dateB)
    })
    
    await writeJsonFile('prompts.json', sortedPrompts)
    console.log(`📝 Generated prompts.json with ${sortedPrompts.length} items`)
    
  } catch (error) {
    console.warn('⚠️  Error generating prompts data:', error)
    await writeJsonFile('prompts.json', [])
  }
}

/**
 * Generate agents.json
 */
async function generateAgentsData(promptzLibrary: Library, genaiStartupsLibrary: Library) {
  try {
    const allAgents = [
      ...promptzLibrary.agents,
      ...genaiStartupsLibrary.agents
    ]
    
    // Sort by creation date (newest first)
    const sortedAgents = allAgents.sort((a, b) => {
      const dateA = a.git?.createdDate || a.date
      const dateB = b.git?.createdDate || b.date
      return compareDatesNewestFirst(dateA, dateB)
    })
    
    await writeJsonFile('agents.json', sortedAgents)
    console.log(`🤖 Generated agents.json with ${sortedAgents.length} items`)
    
  } catch (error) {
    console.warn('⚠️  Error generating agents data:', error)
    await writeJsonFile('agents.json', [])
  }
}

/**
 * Generate powers.json
 */
async function generatePowersData(promptzLibrary: Library, kiroLibrary: Library) {
  try {
    // Combine powers from both libraries
    const allPowers = [
      ...promptzLibrary.powers,
      ...kiroLibrary.powers
    ]
    
    // Sort by creation date (newest first)
    const sortedPowers = allPowers.sort((a, b) => {
      const dateA = a.git?.createdDate || a.date
      const dateB = b.git?.createdDate || b.date
      return compareDatesNewestFirst(dateA, dateB)
    })
    
    await writeJsonFile('powers.json', sortedPowers)
    console.log(`⚡ Generated powers.json with ${sortedPowers.length} items`)
    
  } catch (error) {
    console.warn('⚠️  Error generating powers data:', error)
    await writeJsonFile('powers.json', [])
  }
}

/**
 * Generate steering.json
 */
async function generateSteeringData(promptzLibrary: Library, kiroLibrary: Library, kiroBestPracticesLibrary: Library, productTeamsLibrary: Library, genaiStartupsLibrary: Library) {
  try {
    // Combine steering documents from all five libraries
    const allSteering = [
      ...promptzLibrary.steering,
      ...kiroLibrary.steering,
      ...kiroBestPracticesLibrary.steering,
      ...productTeamsLibrary.steering,
      ...genaiStartupsLibrary.steering
    ]
    
    // Sort by creation date (newest first)
    const sortedSteering = allSteering.sort((a, b) => {
      const dateA = a.git?.createdDate || a.date
      const dateB = b.git?.createdDate || b.date
      return compareDatesNewestFirst(dateA, dateB)
    })
    
    await writeJsonFile('steering.json', sortedSteering)
    console.log(`🎯 Generated steering.json with ${sortedSteering.length} items`)
    
  } catch (error) {
    console.warn('⚠️  Error generating steering data:', error)
    await writeJsonFile('steering.json', [])
  }
}

/**
 * Generate hooks.json
 */
async function generateHooksData(promptzLibrary: Library, kiroBestPracticesLibrary: Library, productTeamsLibrary: Library) {
  try {
    // Combine hooks from all three libraries that contain them
    const allHooks = [
      ...promptzLibrary.hooks,
      ...kiroBestPracticesLibrary.hooks,
      ...productTeamsLibrary.hooks
    ]
    
    // Sort by creation date (newest first)
    const sortedHooks = allHooks.sort((a, b) => {
      const dateA = a.git?.createdDate || a.date
      const dateB = b.git?.createdDate || b.date
      return compareDatesNewestFirst(dateA, dateB)
    })
    
    await writeJsonFile('hooks.json', sortedHooks)
    console.log(`🪝 Generated hooks.json with ${sortedHooks.length} items`)
    
  } catch (error) {
    console.warn('⚠️  Error generating hooks data:', error)
    await writeJsonFile('hooks.json', [])
  }
}

/**
 * Write JSON data to file
 */
async function writeJsonFile(filename: string, data: unknown) {
  const filePath = path.join(DATA_OUTPUT_PATH, filename)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

/**
 * Read and parse the Promptz community library
 * Replicates logic from lib/content-service.ts
 */
async function readPromptzLibrary(): Promise<Library> {
  const libraryPath = path.join(LIBRARIES_PATH, 'promptz')
  const libraryName = 'promptz'
  
  if (!(await directoryExists(libraryPath))) {
    console.warn('Promptz library not found')
    return createEmptyLibrary(libraryName, libraryPath)
  }
  
  const [prompts, agents, powers, steering, hooks] = await Promise.all([
    readPrompts(libraryName, path.join(libraryPath, 'prompts')),
    readAgents(libraryName, path.join(libraryPath, 'agents')),
    readPowers(libraryName, path.join(libraryPath, 'powers')),
    readSteering(libraryName, path.join(libraryPath, 'steering')),
    readHooks(libraryName, path.join(libraryPath, 'hooks'))
  ])
  
  return {
    name: libraryName,
    path: libraryPath,
    prompts,
    agents,
    powers,
    steering,
    hooks
  }
}

/**
 * Read and parse the Kiro Powers library
 * Replicates logic from lib/content-service.ts
 */
async function readKiroLibrary(): Promise<Library> {
  const libraryPath = path.join(LIBRARIES_PATH, 'kiro-powers')
  const libraryName = 'kiro-powers'
  
  if (!(await directoryExists(libraryPath))) {
    console.warn('Kiro Powers library not found')
    return createEmptyLibrary(libraryName, libraryPath)
  }
  
  // Kiro Powers library primarily contains powers
  const powers = await readPowers(libraryName, libraryPath)
  
  return {
    name: libraryName,
    path: libraryPath,
    prompts: [],
    agents: [],
    powers,
    steering: [],
    hooks: []
  }
}

/**
 * Read and parse the Kiro Best Practices library
 * Contains hooks and steering documents in .kiro directory structure
 */
async function readKiroBestPracticesLibrary(): Promise<Library> {
  const libraryPath = path.join(LIBRARIES_PATH, 'kiro-best-practices')
  const libraryName = 'kiro-best-practices'
  
  if (!(await directoryExists(libraryPath))) {
    console.warn('Kiro Best Practices library not found')
    return createEmptyLibrary(libraryName, libraryPath)
  }
  
  // Kiro Best Practices library contains hooks and steering in .kiro directory
  const kiroPath = path.join(libraryPath, '.kiro')
  const [steering, hooks] = await Promise.all([
    readSteering(libraryName, path.join(kiroPath, 'steering')),
    readHooks(libraryName, path.join(kiroPath, 'hooks'))
  ])
  
  return {
    name: libraryName,
    path: libraryPath,
    prompts: [],
    agents: [],
    powers: [],
    steering,
    hooks
  }
}

/**
 * Read and parse the Product Teams library
 * Contains prompts, steering documents, and hooks for product development workflows
 */
async function readProductTeamsLibrary(): Promise<Library> {
  const libraryPath = path.join(LIBRARIES_PATH, 'product-teams')
  const libraryName = 'product-teams'
  
  if (!(await directoryExists(libraryPath))) {
    console.warn('Product Teams library not found')
    return createEmptyLibrary(libraryName, libraryPath)
  }
  
  // Product Teams library contains prompts, steering, and hooks
  const kiroPath = path.join(libraryPath, '.kiro')
  const [prompts, steering, hooks] = await Promise.all([
    readPrompts(libraryName, path.join(libraryPath, 'prompts')),
    readSteering(libraryName, path.join(kiroPath, 'steering')),
    readHooksFromJson(libraryName, path.join(kiroPath, 'hooks.json'))
  ])
  
  return {
    name: libraryName,
    path: libraryPath,
    prompts,
    agents: [],
    powers: [],
    steering,
    hooks
  }
}

/**
 * Read and parse the GenAI Startups library
 * Contains agents and steering documents for GenAI development with Strands and AgentCore
 */
async function readGenaiStartupsLibrary(): Promise<Library> {
  const libraryPath = path.join(LIBRARIES_PATH, 'genai-startups')
  const libraryName = 'genai-startups'
  
  if (!(await directoryExists(libraryPath))) {
    console.warn('GenAI Startups library not found')
    return createEmptyLibrary(libraryName, libraryPath)
  }
  
  // GenAI Startups library contains agents and steering in kiro-agents subdirectories
  const kiroAgentsPath = path.join(libraryPath, 'kiro-agents')
  const [agents, steering] = await Promise.all([
    readAgentsFromKiroAgents(libraryName, kiroAgentsPath),
    readSteeringFromKiroAgents(libraryName, kiroAgentsPath)
  ])
  
  return {
    name: libraryName,
    path: libraryPath,
    prompts: [],
    agents,
    powers: [],
    steering,
    hooks: []
  }
}

/**
 * Read agents from kiro-agents directory structure
 * Each subdirectory contains a .kiro/agents folder with JSON agent configs
 */
async function readAgentsFromKiroAgents(libraryName: string, kiroAgentsPath: string): Promise<Agent[]> {
  if (!(await directoryExists(kiroAgentsPath))) {
    return []
  }
  
  const agentDirs = await getDirectories(kiroAgentsPath)
  const agents: Agent[] = []
  
  for (const agentDir of agentDirs) {
    const dirAgents = await readAgentsFromKiroAgentDir(libraryName, kiroAgentsPath, agentDir)
    agents.push(...dirAgents)
  }
  
  return agents
}

/**
 * Read agents from a single kiro-agent directory
 */
async function readAgentsFromKiroAgentDir(libraryName: string, kiroAgentsPath: string, agentDir: string): Promise<Agent[]> {
  const agents: Agent[] = []
  
  try {
    const agentsPath = path.join(kiroAgentsPath, agentDir, '.kiro', 'agents')
    if (!(await directoryExists(agentsPath))) {
      return []
    }
    
    const agentFiles = await getFilesWithExtension(agentsPath, '.json')
    for (const agentFile of agentFiles) {
      const agentPath = path.join(agentsPath, agentFile)
      const agent = await extractAgentMetadata(libraryName, agentFile, agentPath)
      if (agent) {
        agents.push(agent)
      }
    }
  } catch (error) {
    console.warn(`⚠️  Error processing agent directory ${agentDir}:`, error)
  }
  
  return agents
}

/**
 * Read steering documents from kiro-agents directory structure
 * Each subdirectory may contain .kiro/rules and .kiro/context folders with MD files
 */
async function readSteeringFromKiroAgents(libraryName: string, kiroAgentsPath: string): Promise<SteeringDocument[]> {
  if (!(await directoryExists(kiroAgentsPath))) {
    return []
  }
  
  const agentDirs = await getDirectories(kiroAgentsPath)
  const steering: SteeringDocument[] = []
  
  for (const agentDir of agentDirs) {
    try {
      const kiroPath = path.join(kiroAgentsPath, agentDir, '.kiro')
      
      // Read from rules directory
      const rulesPath = path.join(kiroPath, 'rules')
      if (await directoryExists(rulesPath)) {
        const ruleDocs = await readSteering(libraryName, rulesPath)
        steering.push(...ruleDocs)
      }
      
      // Read from context directory (recursively)
      const contextPath = path.join(kiroPath, 'context')
      if (await directoryExists(contextPath)) {
        const contextDocs = await readSteeringRecursive(libraryName, contextPath)
        steering.push(...contextDocs)
      }
    } catch (error) {
      console.warn(`⚠️  Error processing steering in ${agentDir}:`, error)
    }
  }
  
  return steering
}

/**
 * Recursively read steering documents from a directory and its subdirectories
 */
async function readSteeringRecursive(libraryName: string, basePath: string): Promise<SteeringDocument[]> {
  if (!(await directoryExists(basePath))) {
    return []
  }
  
  const steering: SteeringDocument[] = []
  
  // Read MD files in current directory
  const mdFiles = await getFilesWithExtension(basePath, '.md')
  for (const mdFile of mdFiles) {
    try {
      const filePath = path.join(basePath, mdFile)
      const doc = await extractSteeringMetadata(libraryName, mdFile, filePath)
      if (doc) {
        steering.push(doc)
      }
    } catch (error) {
      console.warn(`⚠️  Error processing steering file ${mdFile}:`, error)
    }
  }
  
  // Recursively process subdirectories
  const subdirs = await getDirectories(basePath)
  for (const subdir of subdirs) {
    const subdirPath = path.join(basePath, subdir)
    const subdirDocs = await readSteeringRecursive(libraryName, subdirPath)
    steering.push(...subdirDocs)
  }
  
  return steering
}
/**
 * Read powers from a directory
 * Replicates logic from lib/content-service.ts
 */
async function readPowers(libraryName: string, powersPath: string): Promise<Power[]> {
  if (!(await directoryExists(powersPath))) {
    return []
  }
  
  const powerDirs = await getDirectories(powersPath)
  const powers: Power[] = []
  
  for (const powerDir of powerDirs) {
    try {
      const powerPath = path.join(powersPath, powerDir)
      const power = await extractPowerMetadata(libraryName, powerDir, powerPath)
      
      if (power) {
        powers.push(power)
      }
    } catch (error) {
      console.warn(`⚠️  Error processing power ${powerDir}:`, error)
      // Continue processing other powers
    }
  }
  
  return powers
}

/**
 * Read agents from a directory
 * Updated to handle both JSON-only and JSON+MD agent patterns
 */
async function readAgents(libraryName: string, agentsPath: string): Promise<Agent[]> {
  if (!(await directoryExists(agentsPath))) {
    return []
  }
  
  // Look for JSON configuration files instead of MD files
  const agentFiles = await getFilesWithExtension(agentsPath, '.json')
  const agents: Agent[] = []
  
  for (const agentFile of agentFiles) {
    try {
      const agentPath = path.join(agentsPath, agentFile)
      const agent = await extractAgentMetadata(libraryName, agentFile, agentPath)
      
      if (agent) {
        agents.push(agent)
      }
    } catch (error) {
      console.warn(`⚠️  Error processing agent ${agentFile}:`, error)
      // Continue processing other agents
    }
  }
  
  return agents
}

/**
 * Read prompts from a directory
 * Replicates logic from lib/content-service.ts
 */
async function readPrompts(libraryName: string, promptsPath: string): Promise<Prompt[]> {
  if (!(await directoryExists(promptsPath))) {
    return []
  }
  
  const promptFiles = await getFilesWithExtension(promptsPath, '.md')
  const prompts: Prompt[] = []
  
  for (const promptFile of promptFiles) {
    try {
      const promptPath = path.join(promptsPath, promptFile)
      const prompt = await extractPromptMetadata(libraryName, promptFile, promptPath)
      
      if (prompt) {
        prompts.push(prompt)
      }
    } catch (error) {
      console.warn(`⚠️  Error processing prompt ${promptFile}:`, error)
      // Continue processing other prompts
    }
  }
  
  return prompts
}

/**
 * Read steering documents from a directory
 * Replicates logic from lib/content-service.ts
 */
async function readSteering(libraryName: string, steeringPath: string): Promise<SteeringDocument[]> {
  if (!(await directoryExists(steeringPath))) {
    return []
  }
  
  const steeringFiles = await getFilesWithExtension(steeringPath, '.md')
  const steering: SteeringDocument[] = []
  
  for (const steeringFile of steeringFiles) {
    try {
      const filePath = path.join(steeringPath, steeringFile)
      const doc = await extractSteeringMetadata(libraryName, steeringFile, filePath)
      
      if (doc) {
        steering.push(doc)
      }
    } catch (error) {
      console.warn(`⚠️  Error processing steering document ${steeringFile}:`, error)
      // Continue processing other steering documents
    }
  }
  
  return steering
}

/**
 * Read hooks from a directory
 * Replicates logic from lib/content-service.ts
 */
async function readHooks(libraryName: string, hooksPath: string): Promise<Hook[]> {
  if (!(await directoryExists(hooksPath))) {
    return []
  }
  
  const hookFiles = await getFilesWithExtension(hooksPath, '.kiro.hook')
  const hooks: Hook[] = []
  
  for (const hookFile of hookFiles) {
    try {
      const hookPath = path.join(hooksPath, hookFile)
      const hook = await extractHookMetadata(libraryName, hookFile, hookPath)
      
      if (hook) {
        hooks.push(hook)
      }
    } catch (error) {
      console.warn(`⚠️  Error processing hook ${hookFile}:`, error)
      // Continue processing other hooks
    }
  }
  
  return hooks
}

/**
 * Read hooks from a JSON configuration file
 * Used for libraries that store hooks in a single JSON file like product-teams
 */
async function readHooksFromJson(libraryName: string, hooksJsonPath: string): Promise<Hook[]> {
  try {
    const fileContent = await fs.readFile(hooksJsonPath, 'utf-8')
    const hooksConfig = JSON.parse(fileContent)
    
    if (!hooksConfig.hooks || !Array.isArray(hooksConfig.hooks)) {
      console.warn(`Invalid hooks.json structure in ${hooksJsonPath}`)
      return []
    }
    
    // Get git metadata for the JSON file itself
    const { author, date, git } = await getAuthorAndDate({}, hooksJsonPath)
    
    const hooks: Hook[] = []
    
    for (const hookConfig of hooksConfig.hooks) {
      try {
        // Convert JSON hook config to Hook interface
        const hookSlug = filenameToSlug(hookConfig.name)
        const hook: Hook = {
          id: generatePathId(libraryName, 'hooks', hookSlug),
          type: 'hook',
          title: hookConfig.name,
          description: hookConfig.description || '',
          content: hookConfig.action?.prompt || JSON.stringify(hookConfig, null, 2),
          library: libraryName,
          path: hooksJsonPath,
          author,
          date,
          trigger: hookConfig.trigger?.type || 'manual',
          enabled: hookConfig.enabled !== false,
          action: hookConfig.action || { type: 'agentPrompt', prompt: '' },
          git
        }
        
        hooks.push(hook)
      } catch (error) {
        console.warn(`⚠️  Error processing hook config ${hookConfig.name}:`, error)
        // Continue processing other hooks
      }
    }
    
    return hooks
  } catch (error) {
    console.warn(`⚠️  Error reading hooks JSON file ${hooksJsonPath}:`, error)
    return []
  }
}

/**
 * Create an empty library structure
 * Replicates logic from lib/content-service.ts
 */
function createEmptyLibrary(name: string, path: string): Library {
  return {
    name,
    path,
    prompts: [],
    agents: [],
    powers: [],
    steering: [],
    hooks: []
  }
}

// Execute the main function
if (require.main === module) {
  generateLibraryData()
    .then(() => {
      console.log('🎉 Build-time data generation completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Fatal error during data generation:', error)
      // Exit with success code to not fail the build
      console.warn('⚠️  Exiting with success to continue build process')
      process.exit(0)
    })
}