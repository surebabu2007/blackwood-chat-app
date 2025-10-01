# Quick Start Guide - Dynamic Story System

## ✅ What's Been Implemented

Your chat system is now **fully dynamic** and automatically reads from the `story beats/` folder!

### 🎯 Key Changes Made

1. **Dynamic Story Context Loader** (`lib/storyContextLoader.ts`)
   - Automatically scans entire `story beats/` folder
   - Reads all markdown and text files
   - Organizes content by folder type
   - Caches for performance (1-minute refresh)

2. **1947 Time Period Integration**
   - Updated `worldConfig.ts` with 1947 historical context
   - Added detailed period information
   - Created `story beats/world_setting/1947_context.md` with comprehensive 1947 details

3. **API Integration** (`lib/api.ts`)
   - System prompts now include dynamic story context
   - Characters receive full context from story beats folder
   - Responses are period-appropriate and contextual

## 🚀 How to Use

### Adding New Story Information

Simply create files in the `story beats/` folder:

```bash
story beats/
├── your_new_folder/          # ← Create any folder
│   └── your_content.md       # ← Add your content
```

**That's it!** The system automatically:
- Detects the new folder
- Reads your content
- Adds it to character context
- Uses it in responses

### Example: Adding Developer Information

1. **Create folder:**
   ```bash
   mkdir "story beats/developer"
   ```

2. **Create file:**
   ```bash
   # In: story beats/developer/about_team.md
   
   # About the Development Team
   
   This game was created by [Your Name] in 2024.
   The team consists of...
   ```

3. **Done!** Characters now know about the development team.

## 📝 Current Structure

Your `story beats/` folder currently has:

```
story beats/
├── characters/              ✅ Character backstories (loaded)
├── locations/               ✅ Location details (loaded)
├── relationships/           ✅ Relationship maps (loaded)
├── technical/               ✅ Technical notes (loaded)
├── world_setting/           ✅ NEW: 1947 context (loaded)
├── README.md               ✅ World information (loaded)
└── [Any new folder you create will be automatically loaded!]
```

## 🎭 1947 Time Period

All characters now respond according to 1947 setting:

- ✅ Post-World War II America (war ended 1945)
- ✅ No modern technology (no computers, internet, phones)
- ✅ Period-appropriate language and slang
- ✅ 1940s social norms and etiquette
- ✅ Historical accuracy maintained

## 💡 Quick Examples

### Example 1: Chat with James Blackwood

**Before** (generic response):
> "I was in my study that night."

**After** (with dynamic context):
> "Detective Chen, I was listening to the radio broadcast that evening, around 8 o'clock. You know how things were after the war - we all had our ways of coping. I heard raised voices from Victoria's room, but Mr. Thompson assured me everything was fine."

Notice:
- ✅ Uses 1947 technology (radio)
- ✅ References WWII ("after the war")
- ✅ Addresses detective properly
- ✅ Uses period-appropriate language

### Example 2: Adding Custom Content

**You add**: `story beats/evidence/new_clue.md`
```markdown
# Hidden Letter

Found in Victoria's desk drawer:
"I know what you did, Marcus. Meet me tonight at 9 PM.
We need to talk about the missing $150,000."
```

**Characters immediately know** about this evidence!

## 🔄 How Updates Work

1. **Automatic**: Changes detected every 1 minute (cache refresh)
2. **No restart needed**: For most changes
3. **Force refresh**: Restart server for immediate effect
4. **Persistent**: All changes are permanent

## 📚 Detailed Documentation

For comprehensive information, see:
- **`DYNAMIC_STORY_SYSTEM_GUIDE.md`** - Complete system documentation
- **`story beats/world_setting/1947_context.md`** - Full 1947 time period details

## 🛠️ Technical Details

### Files Loaded
- `.md` (Markdown files) - **Recommended**
- `.txt` (Text files)

### Files Ignored
- Images (`.png`, `.jpg`, etc.)
- Hidden files (`.DS_Store`, etc.)
- Ren'Py scripts (`.rpy`)

### Cache System
- **Duration**: 1 minute
- **Auto-refresh**: Yes
- **Force reload**: Restart server

## ✨ Benefits

### Before:
- ❌ Had to edit code to update story
- ❌ Characters didn't know about new information
- ❌ No 1947 time period enforcement
- ❌ Manual updates required

### After:
- ✅ Just add files to `story beats/` folder
- ✅ Characters automatically use new information
- ✅ Enforced 1947 time period in all responses
- ✅ No code changes needed
- ✅ Unlimited custom folders supported

## 🎯 Next Steps

1. **Test the system**: Chat with characters and notice 1947 references
2. **Add custom content**: Create new folders in `story beats/`
3. **Update existing files**: Enhance character backstories
4. **Verify responses**: Check that characters use your new information

## 🚨 Troubleshooting

**Q: Characters not using my new content?**
- Wait 1 minute for cache refresh, or restart server

**Q: How do I know what's loaded?**
- Check server console for loading messages

**Q: Can I add any type of content?**
- Yes! Any folder, any markdown/text file

**Q: What if my file is too long?**
- Files are automatically truncated (first 1000-3000 characters used)

## 📞 Summary

You now have a **fully automatic, dynamic story system**:

1. ✅ Set to 1947 time period
2. ✅ Reads from `story beats/` folder automatically
3. ✅ Supports unlimited custom folders
4. ✅ No code changes needed
5. ✅ Characters respond with full context

**Just add your story files and start chatting!** 🎭

---

## Example: Testing the System

**Try asking James Blackwood:**
> "What was life like during the war?"

**He might respond:**
> "Detective Chen, those were difficult years. I served overseas in the European theater, came back in '45. The whole family pitched in for the war effort. Victoria kept the business running while the boys were away. It changed us all, I suppose. Some things you just can't forget."

Notice the 1947-appropriate response with WWII references! ✨


