#!/usr/bin/env tsx

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
  getFilesWithExtension 
} from './library-file-parser'
import {
  extractPowerMetadata,
  extractAgentMetadata,
  extractPromptMetadata,
  extractSteeringMetadata,
  extractHookMetadata
} from './metadata-extractor'
import { compareDatesNewestFirst } from '../lib/formatter/date'
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
    
    // Read all three libraries
    const [promptzLibrary, kiroLibrary, kiroBestPracticesLibrary] = await Promise.allSettled([
      readPromptzLibrary(),
      readKiroLibrary(),
      readKiroBestPracticesLibrary()
    ])
    
    // Extract data from successful library reads
    const promptzData = promptzLibrary.status === 'fulfilled' ? promptzLibrary.value : createEmptyLibrary('promptz', '')
    const kiroData = kiroLibrary.status === 'fulfilled' ? kiroLibrary.value : createEmptyLibrary('kiro-powers', '')
    const kiroBestPracticesData = kiroBestPracticesLibrary.status === 'fulfilled' ? kiroBestPracticesLibrary.value : createEmptyLibrary('kiro-best-practices', '')
    
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
    
    // Generate JSON files for each content type
    await Promise.all([
      generatePromptsData(promptzData),
      generateAgentsData(promptzData),
      generatePowersData(promptzData, kiroData),
      generateSteeringData(promptzData, kiroData, kiroBestPracticesData),
      generateHooksData(promptzData, kiroBestPracticesData)
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
async function generatePromptsData(promptzLibrary: Library) {
  try {
    const allPrompts = promptzLibrary.prompts
    
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
async function generateAgentsData(promptzLibrary: Library) {
  try {
    const allAgents = promptzLibrary.agents
    
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
async function generateSteeringData(promptzLibrary: Library, kiroLibrary: Library, kiroBestPracticesLibrary: Library) {
  try {
    // Combine steering documents from all three libraries
    const allSteering = [
      ...promptzLibrary.steering,
      ...kiroLibrary.steering,
      ...kiroBestPracticesLibrary.steering
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
async function generateHooksData(promptzLibrary: Library, kiroBestPracticesLibrary: Library) {
  try {
    // Combine hooks from both libraries that contain them
    const allHooks = [
      ...promptzLibrary.hooks,
      ...kiroBestPracticesLibrary.hooks
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