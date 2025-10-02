import fs from 'fs';
import path from 'path';

// Dynamic Story Context Loader
// Automatically reads all files from the story beats folder
// and incorporates them into character responses

interface StoryContext {
  timePeriod: string;
  worldDetails: string;
  characterBackstories: Record<string, string>;
  locations: string;
  relationships: string;
  technicalDetails: string;
  customFolders: Record<string, string>;
}

export class StoryContextLoader {
  private static storyBeatsPath = path.join(process.cwd(), '..', 'story beats');
  private static cachedContext: StoryContext | null = null;
  private static lastLoadTime: number = 0;
  private static CACHE_DURATION = 60000; // 1 minute cache

  /**
   * Load all story context from the story beats folder
   * This method automatically discovers and reads all markdown and text files
   */
  static loadStoryContext(): StoryContext {
    // Check if we have a cached version
    const now = Date.now();
    if (this.cachedContext && (now - this.lastLoadTime) < this.CACHE_DURATION) {
      return this.cachedContext;
    }

    console.log('📚 Loading story context from story beats folder...');

    const context: StoryContext = {
      timePeriod: '1947 post-war America',
      worldDetails: '',
      characterBackstories: {},
      locations: '',
      relationships: '',
      technicalDetails: '',
      customFolders: {}
    };

    try {
      // Read the main story beats folder
      if (fs.existsSync(this.storyBeatsPath)) {
        this.loadDirectory(this.storyBeatsPath, context);
      } else {
        console.warn('⚠️  Story beats folder not found, using default context');
      }
    } catch (error) {
      console.error('❌ Error loading story context:', error);
    }

    // Update cache
    this.cachedContext = context;
    this.lastLoadTime = now;

    console.log('✅ Story context loaded successfully');
    return context;
  }

  /**
   * Recursively load all files and folders from a directory
   */
  private static loadDirectory(dirPath: string, context: StoryContext, folderName?: string) {
    try {
      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        // Skip hidden files and certain file types
        if (item.startsWith('.') || item.endsWith('.png') || item.endsWith('.jpg') || item.endsWith('.rpy')) {
          continue;
        }

        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Recursively load subdirectory
          this.loadDirectory(fullPath, context, item);
        } else if (stat.isFile()) {
          // Load file content
          this.loadFile(fullPath, item, context, folderName);
        }
      }
    } catch (error) {
      console.error(`❌ Error loading directory ${dirPath}:`, error);
    }
  }

  /**
   * Load content from a specific file
   */
  private static loadFile(
    filePath: string, 
    fileName: string, 
    context: StoryContext, 
    folderName?: string
  ) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Skip empty files
      if (!content.trim()) {
        return;
      }

      // Categorize based on folder name
      if (folderName === 'characters') {
        // Extract character name from filename
        const characterName = fileName.replace(/\.(md|txt)$/, '').replace(/_/g, ' ');
        context.characterBackstories[characterName] = content;
      } else if (folderName === 'locations') {
        context.locations += `\n\n${content}`;
      } else if (folderName === 'relationships') {
        context.relationships += `\n\n${content}`;
      } else if (folderName === 'technical') {
        context.technicalDetails += `\n\n${content}`;
      } else if (folderName && folderName !== 'story beats') {
        // Custom folder - store separately
        if (!context.customFolders[folderName]) {
          context.customFolders[folderName] = '';
        }
        context.customFolders[folderName] += `\n\n### ${fileName}\n${content}`;
      } else {
        // Main story beats folder files (README, etc.)
        context.worldDetails += `\n\n### ${fileName}\n${content}`;
      }

      console.log(`📄 Loaded: ${folderName ? folderName + '/' : ''}${fileName}`);
    } catch (error) {
      console.error(`❌ Error loading file ${filePath}:`, error);
    }
  }

  /**
   * Get a formatted context string for a specific character
   */
  static getCharacterContext(characterId: string): string {
    const context = this.loadStoryContext();
    
    // Build the context string
    let contextStr = `
=== STORY WORLD CONTEXT ===

TIME PERIOD: ${context.timePeriod}
The year is 1947. World War II has recently ended. This is the post-war era in America.
- Technology: No computers, no internet, no smartphones
- Communication: Telephones, telegrams, letters, face-to-face
- Transportation: Classic cars from the 1940s, trains, ships
- Society: Post-war prosperity beginning, traditional gender roles, formal social etiquette
- Fashion: 1940s formal attire, suits, dresses, hats
- Currency: Dollars and cents (different values than today)
- Language: Formal speech patterns, period-appropriate slang
- Historical Context: Post-WWII America, Cold War beginning, economic boom starting

IMPORTANT: All responses MUST reflect 1947 time period!
- Use period-appropriate language and references
- Refer to recent events like WWII ending in 1945
- No modern technology or anachronisms
- Maintain 1940s social norms and attitudes
`;

    // Add world details from README files
    if (context.worldDetails) {
      contextStr += `\n\n=== WORLD DETAILS ===\n${context.worldDetails.substring(0, 2000)}`;
    }

    // Add character-specific backstory
    const characterKey = Object.keys(context.characterBackstories).find(key => 
      key.toLowerCase().includes(characterId.toLowerCase()) || 
      characterId.toLowerCase().includes(key.toLowerCase())
    );
    
    if (characterKey && context.characterBackstories[characterKey]) {
      contextStr += `\n\n=== YOUR DETAILED BACKSTORY ===\n${context.characterBackstories[characterKey].substring(0, 3000)}`;
    }

    // Add locations
    if (context.locations) {
      contextStr += `\n\n=== LOCATIONS ===\n${context.locations.substring(0, 1500)}`;
    }

    // Add relationships
    if (context.relationships) {
      contextStr += `\n\n=== RELATIONSHIPS ===\n${context.relationships.substring(0, 1500)}`;
    }

    // Add all custom folders (like "developer" folder you mentioned)
    for (const [folderName, content] of Object.entries(context.customFolders)) {
      contextStr += `\n\n=== ${folderName.toUpperCase()} INFORMATION ===\n${content.substring(0, 1000)}`;
    }

    return contextStr;
  }

  /**
   * Get the full story context for investigation insights
   */
  static getFullContext(): StoryContext {
    return this.loadStoryContext();
  }

  /**
   * Force reload of story context (useful for development)
   */
  static forceReload(): StoryContext {
    this.cachedContext = null;
    this.lastLoadTime = 0;
    return this.loadStoryContext();
  }

  /**
   * Get information about what's been loaded
   */
  static getLoadedInfo(): string {
    const context = this.loadStoryContext();
    
    let info = '📚 Loaded Story Content:\n';
    info += `- Time Period: ${context.timePeriod}\n`;
    info += `- Character Backstories: ${Object.keys(context.characterBackstories).length} characters\n`;
    info += `- Locations: ${context.locations ? 'Yes' : 'No'}\n`;
    info += `- Relationships: ${context.relationships ? 'Yes' : 'No'}\n`;
    info += `- Custom Folders: ${Object.keys(context.customFolders).join(', ') || 'None'}\n`;
    
    return info;
  }
}

// Export a convenience function for easy use
export function getCharacterStoryContext(characterId: string): string {
  return StoryContextLoader.getCharacterContext(characterId);
}


