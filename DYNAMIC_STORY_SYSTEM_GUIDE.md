# Dynamic Story Context System - Complete Guide

## Overview

Your chat system now **automatically reads and incorporates** any information you add to the `story beats/` folder. The system dynamically loads all story content, including the 1947 time period setting, and uses it to generate authentic, period-appropriate character responses.

## 🎯 Key Features

### 1. **Automatic Story Detection**
- The system automatically scans the entire `story beats/` folder
- Reads all `.md` and `.txt` files
- Incorporates content into character responses
- **No code changes needed** when you update story files

### 2. **1947 Time Period Integration**
- All characters now respond according to 1947 post-war America
- Period-appropriate language, technology, and social norms
- References to WWII (ended in 1945)
- No modern technology or anachronisms

### 3. **Dynamic Folder Support**
- Add any new folder to `story beats/` and it's automatically included
- Examples:
  - Create `story beats/developer/` → Characters know about developers
  - Create `story beats/weapons/` → Characters reference weapon details
  - Create `story beats/timeline/` → Characters use timeline information

## 📁 How It Works

### Current Folder Structure
```
story beats/
├── characters/          ← Character backstories (automatically loaded)
├── locations/           ← Location details (automatically loaded)
├── relationships/       ← Relationship maps (automatically loaded)
├── technical/           ← Technical details (automatically loaded)
├── README.md           ← World information (automatically loaded)
└── [ANY NEW FOLDER]/   ← Automatically detected and loaded!
```

### What Happens Automatically

1. **System Startup**: Scans `story beats/` folder
2. **File Detection**: Finds all markdown and text files
3. **Content Loading**: Reads file contents
4. **Context Building**: Organizes by folder type
5. **Character Integration**: Adds to character prompts
6. **Response Generation**: Characters respond with full context

## 🚀 How to Add New Story Information

### Example 1: Adding Developer Information

1. **Create a new folder:**
   ```
   story beats/developer/
   ```

2. **Add a markdown file:**
   ```
   story beats/developer/about_developers.md
   ```

3. **Write your content:**
   ```markdown
   # About the Game Developers
   
   This game was created by [Your Team Name] in 2024.
   
   ## Development History
   - Started: October 2024
   - Technology: Next.js, Claude AI
   - Purpose: Interactive murder mystery experience
   ```

4. **That's it!** Characters will now reference this information when relevant.

### Example 2: Adding Timeline Details

1. **Create folder:**
   ```
   story beats/timeline/
   ```

2. **Add file:**
   ```
   story beats/timeline/murder_timeline.md
   ```

3. **Content:**
   ```markdown
   # Detailed Murder Timeline - October 1947
   
   ## October 15, 1947
   - 6:00 PM: Victoria returns from Boston
   - 7:00 PM: Dinner with family
   - 8:00 PM: Argument heard in study
   - 9:00 PM: Victoria seen alive (last time)
   - 10:00 PM: Gunshot heard
   - 10:30 PM: Body discovered
   ```

### Example 3: Adding World War II Context

1. **Create file:**
   ```
   story beats/historical_context/wwii_aftermath.md
   ```

2. **Content:**
   ```markdown
   # World War II Aftermath (1947)
   
   The Blackwood family was deeply affected by WWII:
   
   - **James Blackwood**: Served in European theater, returned in 1945
   - **Marcus Reynolds**: Worked in war production, avoided draft
   - **Mr. Thompson**: Too old to serve, managed estate during war
   - **Victoria**: Ran business during war, grew company
   
   Post-war changes:
   - Veterans dealing with trauma
   - Economy booming with returning soldiers
   - Traditional values being questioned
   ```

## 📝 File Naming Conventions

- **Use descriptive names**: `character_motivations.md` not `file1.md`
- **Use underscores**: `about_developer.md` not `about developer.md`
- **Keep organized**: Group related files in folders
- **Use markdown**: `.md` files are preferred for formatting

## 🎭 What Gets Loaded Where

| Folder | Used For | Character Response |
|--------|----------|-------------------|
| `characters/` | Character backstories | Deep character knowledge |
| `locations/` | Setting details | Location descriptions |
| `relationships/` | Character connections | Relationship dynamics |
| `technical/` | Implementation notes | Usually not in responses |
| **Custom folders** | **Any topic you add** | **Automatically referenced** |

## 🔄 Cache System

- **Cache Duration**: 1 minute
- **Auto-refresh**: New content loads automatically
- **Force Reload**: Restart the server to force immediate reload

## 🎯 Best Practices

### ✅ DO:
- Add detailed, well-written content
- Keep files organized in logical folders
- Use period-appropriate language (1947)
- Update existing files to improve responses
- Add new folders for new topics

### ❌ DON'T:
- Add image files (automatically skipped)
- Use very long files (first 1000-3000 chars used)
- Mix modern and period content
- Use files without proper structure

## 💡 Example Use Cases

### 1. Adding Secret Evidence
Create `story beats/evidence/hidden_clues.md`:
```markdown
# Hidden Evidence

## Secret Letter
Found in Victoria's desk:
"My dearest confidant,
I fear I have discovered something terrible about Marcus.
The accounts don't match. I will confront him tonight.
- V.B., October 15, 1947"

## Fingerprint Analysis
Butler's fingerprints found on murder weapon.
```

### 2. Adding Social Context
Create `story beats/society/1947_social_norms.md`:
```markdown
# 1947 Social Norms at Blackwood Manor

## Class System
- Servants know their place
- Formal titles always used
- Evening dress required for dinner

## Gender Roles
- Women manage household
- Men handle business
- Female detective (Sarah Chen) is unusual
```

### 3. Adding Location Details
Add to `story beats/locations/manor_layout.md`:
```markdown
# Manor Secret Passages

## Hidden Door in Library
Behind the Shakespeare section lies a secret passage
leading to the wine cellar. Only family members know.

## Servant Staircases
Three hidden staircases for servants to move unseen.
Could explain alibis.
```

## 🔍 How Characters Use This Information

When you chat with a character, the system:

1. **Loads all relevant story content**
2. **Includes 1947 time period context**
3. **Adds character-specific backstories**
4. **Incorporates custom folder content**
5. **Generates period-appropriate responses**

### Example Interaction:

**You**: "Tell me about the night of the murder."

**James Blackwood** (using loaded content):
*"Detective Chen, I was in my study that evening, listening to the radio broadcast. It was around 8 o'clock when I heard raised voices coming from Victoria's room. You know how it was in those days after the war - tensions were high in our family. I stepped into the hallway, but Mr. Thompson assured me everything was fine. I... I should have insisted on checking on her."*

Notice how the response includes:
- ✅ 1947 time period reference (radio, post-war)
- ✅ Addresses detective properly
- ✅ References other characters
- ✅ Uses period-appropriate language
- ✅ Incorporates story timeline

## 🛠️ Technical Details

### File Types Supported
- `.md` (Markdown) - **Recommended**
- `.txt` (Plain text)

### File Types Ignored
- `.png`, `.jpg`, `.gif` (Images)
- `.rpy` (Ren'Py scripts)
- Files starting with `.` (Hidden files)
- `.DS_Store` (Mac system files)

### Character Limit per Section
- Character backstories: 3000 characters
- World details: 2000 characters
- Locations: 1500 characters
- Relationships: 1500 characters
- Custom folders: 1000 characters each

### Automatic Categorization
The system automatically categorizes content based on folder names:
- `characters/` → Character-specific knowledge
- `locations/` → Setting and environment
- `relationships/` → Character connections
- `technical/` → Development notes
- **Any other folder** → Custom context added to all characters

## 🚨 Troubleshooting

### Characters not using new information?
1. **Wait 1 minute** - Cache refreshes every 60 seconds
2. **Restart server** - Forces immediate reload
3. **Check file format** - Must be `.md` or `.txt`
4. **Verify folder location** - Must be in `story beats/`

### Information seems cut off?
- Files are truncated to prevent prompt overflow
- Keep individual files under 2000 words
- Split large topics into multiple files

### Period-inappropriate responses?
- Check your story files for modern references
- Ensure files emphasize 1947 setting
- Add more period-specific context

## 📊 Monitoring What's Loaded

The system logs what it loads:
```
📚 Loading story context from story beats folder...
📄 Loaded: characters/james_blackwood.md
📄 Loaded: locations/locations_guide.md
📄 Loaded: developer/about_team.md
✅ Story context loaded successfully
```

Check your server console to see what's being loaded.

## 🎓 Summary

You now have a **fully dynamic story system** that:

✅ Automatically reads from `story beats/` folder  
✅ Enforces 1947 time period in all responses  
✅ Supports unlimited custom folders  
✅ Requires no code changes when adding content  
✅ Generates authentic, contextual character responses  
✅ Updates automatically (1-minute cache)  

**Just add your story files and the characters will know about them!**

## 📞 Questions?

The system is designed to be:
- **Automatic**: No manual configuration needed
- **Flexible**: Add any content structure you want
- **Period-aware**: Always maintains 1947 context
- **Character-aware**: Each character gets relevant information

Start adding your story content to `story beats/` and watch your characters come alive with rich, period-appropriate responses! 🎭


