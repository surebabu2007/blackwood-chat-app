# 🕵️ Blackwood Detective Widget - Comprehensive Integration Guide

## Overview

This guide provides complete integration instructions for the Blackwood Detective Widget across multiple platforms. The widget system is designed to be easily copyable and integrable into Unity games, Python applications, web games, websites, and more.

## 🎯 Widget Types Available

### 1. **Unified Detective Widget** (`UnifiedDetectiveWidget.tsx`)
- Complete investigation hub with character selection
- Multiple character management
- Advanced features and settings

### 2. **Individual Character Widget** (`IndividualCharacterWidget.tsx`)
- Single character focused interface
- Compact design for specific encounters
- Character-specific theming

### 3. **Vintage Chat Widget** (`VintageChatWidget.tsx`)
- Core chat functionality
- Vintage detective aesthetic
- Interrogation mode support

### 4. **Standalone HTML Widget** (`standalone-widget.html`)
- Complete standalone implementation
- No dependencies required
- Easy copy-paste integration

## 🚀 Quick Start Integration

### Option 1: Standalone HTML (Easiest)

Simply copy the `standalone-widget.html` file to your project and open it in a browser. No additional setup required.

```html
<!-- Include in your HTML -->
<iframe src="standalone-widget.html" width="400" height="600" frameborder="0"></iframe>
```

### Option 2: JavaScript Library

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="web-integration.css">
</head>
<body>
    <!-- Your content -->
    
    <!-- Widget will auto-initialize -->
    <div data-blackwood-widget 
         data-position="bottom-right" 
         data-theme="sepia" 
         data-auto-open="true">
    </div>
    
    <script src="web-integration.js"></script>
</body>
</html>
```

### Option 3: Programmatic Integration

```javascript
// Initialize widget programmatically
const widget = new BlackwoodDetectiveWidget({
    position: 'bottom-right',
    theme: 'sepia',
    enableVoice: true,
    autoOpen: true
});

// Show widget
widget.show();

// Select character
widget.selectCharacter('james-blackwood');

// Send message
widget.sendMessage('Tell me about the case');
```

## 🎮 Unity Integration

### Step 1: Add the Script

Copy `unity-integration.cs` to your Unity project's `Assets/Scripts/` folder.

### Step 2: Setup UI

1. Create a Canvas in your scene
2. Add the following UI elements:
   - Panel (for widget container)
   - Text (for character name)
   - Text (for character role)
   - Image (for character avatar)
   - ScrollRect (for chat messages)
   - InputField (for message input)
   - Button (for send)
   - Button (for close)

### Step 3: Configure the Widget

```csharp
// In your game script
public class GameManager : MonoBehaviour
{
    public BlackwoodDetectiveWidget detectiveWidget;
    
    void Start()
    {
        // Initialize widget
        detectiveWidget = BlackwoodDetectiveWidget.FindOrCreate();
        
        // Setup event listeners
        detectiveWidget.OnCharacterSelected += OnCharacterSelected;
        detectiveWidget.OnMessageReceived += OnMessageReceived;
        detectiveWidget.OnError += OnError;
    }
    
    void OnCharacterSelected(BlackwoodDetectiveWidget.CharacterData character)
    {
        Debug.Log($"Character selected: {character.name}");
    }
    
    void OnMessageReceived(BlackwoodDetectiveWidget.ChatMessage message)
    {
        Debug.Log($"Message received: {message.content}");
    }
    
    void OnError(string error)
    {
        Debug.LogError($"Widget error: {error}");
    }
    
    // Trigger investigation
    public void StartInvestigation(string roomId)
    {
        detectiveWidget.SetCharacterByRoom(roomId);
        detectiveWidget.ShowWidget();
    }
}
```

### Step 4: Room-Based Integration

```csharp
// Map rooms to characters
public class RoomManager : MonoBehaviour
{
    public BlackwoodDetectiveWidget detectiveWidget;
    
    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            string roomName = gameObject.name.ToLower();
            detectiveWidget.SetCharacterByRoom(roomName);
            detectiveWidget.ShowWidget();
        }
    }
}
```

## 🐍 Python Integration

### Option 1: Pygame Integration

```python
import pygame
from blackwood_widget import BlackwoodWidget

class DetectiveGame:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((800, 600))
        self.widget = BlackwoodWidget()
        self.setup_callbacks()
    
    def setup_callbacks(self):
        self.widget.on_character_selected = self.on_character_selected
        self.widget.on_evidence_found = self.on_evidence_found
        self.widget.on_investigation_progress = self.on_investigation_progress
    
    def on_character_selected(self, character_id):
        print(f"Character selected: {character_id}")
        # Update your game state
    
    def on_evidence_found(self, evidence):
        print(f"Evidence found: {evidence}")
        # Update inventory
    
    def on_investigation_progress(self, progress):
        print(f"Investigation progress: {progress}%")
        # Update UI
    
    def handle_room_enter(self, room_id):
        success = self.widget.start_room_investigation(room_id)
        if success:
            print(f"Started investigation in {room_id}")
    
    def run(self):
        running = True
        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_i:  # 'I' for investigate
                        self.widget.show_widget()
                    elif event.key == pygame.K_ESCAPE:
                        self.widget.hide_widget()
            
            # Your game logic here
            pygame.display.flip()

if __name__ == "__main__":
    game = DetectiveGame()
    game.run()
```

### Option 2: Tkinter Integration

```python
import tkinter as tk
from tkinter import ttk
from blackwood_widget import BlackwoodWidget

class DetectiveGameApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Detective Game")
        self.widget = BlackwoodWidget()
        self.setup_ui()
    
    def setup_ui(self):
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Title
        title_label = ttk.Label(main_frame, text="Blackwood Manor Investigation", 
                              font=('Arial', 16, 'bold'))
        title_label.grid(row=0, column=0, columnspan=2, pady=(0, 20))
        
        # Buttons
        ttk.Button(main_frame, text="Show Widget", 
                  command=self.show_widget).grid(row=1, column=0, padx=5, pady=5)
        
        ttk.Button(main_frame, text="Investigate Study", 
                  command=lambda: self.start_investigation('study')).grid(row=1, column=1, padx=5, pady=5)
        
        # Status label
        self.status_label = ttk.Label(main_frame, text="Ready to investigate")
        self.status_label.grid(row=2, column=0, columnspan=2, pady=10)
    
    def show_widget(self):
        success = self.widget.show_widget()
        if success:
            self.status_label.config(text="Widget opened successfully")
        else:
            self.status_label.config(text="Failed to open widget")
    
    def start_investigation(self, room_id):
        success = self.widget.start_room_investigation(room_id)
        if success:
            self.status_label.config(text=f"Investigating {room_id}")
        else:
            self.status_label.config(text=f"Failed to investigate {room_id}")
    
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = DetectiveGameApp()
    app.run()
```

## 🎭 Ren'Py Integration

### Step 1: Add the Script

Copy `renpy-integration.rpy` to your Ren'Py game directory.

### Step 2: Use in Your Game

```renpy
# In your script.rpy

label start:
    "You arrive at Blackwood Manor to investigate Victoria Blackwood's murder."
    
    menu:
        "Start Investigation":
            call investigation_menu
        "Explore the mansion":
            jump mansion_exploration

label investigation_menu:
    scene investigation_hub
    "Detective Investigation Hub"
    
    menu:
        "Interview James Blackwood":
            $ success = detective_widget.select_suspect("james-blackwood")
            if success:
                "The detective widget opens in your browser."
                "Return to the game when you're done questioning James."
            else:
                "There was an issue opening the detective widget."
                jump investigation_menu
            
        "Interview Marcus Reynolds":
            $ success = detective_widget.select_suspect("marcus-reynolds")
            if success:
                "The detective widget opens in your browser."
            else:
                "There was an issue opening the detective widget."
                jump investigation_menu
        
        "Return to main story":
            jump main_story

label room_study:
    scene study_room
    "You enter the study. James Blackwood is sitting at the desk."
    
    menu:
        "Talk to James":
            $ success = detective_widget.start_room_investigation("study")
            if success:
                "The detective widget opens in your browser."
                "Interview James about the case."
            else:
                "There was an issue opening the detective widget."
                jump room_study
        "Look around":
            "You examine the study for clues..."
            $ detective_widget.add_evidence("Study clues found")
            jump continue_story
```

## 🌐 Web Game Integration

### Option 1: Iframe Embed

```html
<!DOCTYPE html>
<html>
<head>
    <title>Detective Game</title>
</head>
<body>
    <h1>Blackwood Manor Mystery</h1>
    <p>Click the detective widget to begin your investigation.</p>
    
    <!-- Embed the widget -->
    <iframe src="standalone-widget.html" 
            width="400" 
            height="600" 
            frameborder="0"
            style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
    </iframe>
    
    <!-- Your game content -->
    <div id="game-content">
        <!-- Game elements here -->
    </div>
</body>
</html>
```

### Option 2: JavaScript Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>Detective Game</title>
    <link rel="stylesheet" href="web-integration.css">
</head>
<body>
    <h1>Blackwood Manor Mystery</h1>
    
    <!-- Game content -->
    <div id="game-content">
        <button onclick="startInvestigation('study')">Investigate Study</button>
        <button onclick="startInvestigation('office')">Investigate Office</button>
        <button onclick="startInvestigation('library')">Investigate Library</button>
    </div>
    
    <!-- Widget integration -->
    <div data-blackwood-widget 
         data-position="bottom-right" 
         data-theme="sepia" 
         data-auto-open="false">
    </div>
    
    <script src="web-integration.js"></script>
    <script>
        // Game integration
        let detectiveWidget;
        
        document.addEventListener('DOMContentLoaded', function() {
            detectiveWidget = window.blackwoodWidget;
            
            // Setup event listeners
            detectiveWidget.on('characterSelected', function(character) {
                console.log('Character selected:', character.name);
                // Update game state
            });
            
            detectiveWidget.on('messageReceived', function(data) {
                console.log('Message received:', data.text);
                // Process character response
            });
        });
        
        function startInvestigation(roomId) {
            // Map rooms to characters
            const roomCharacters = {
                'study': 'james-blackwood',
                'office': 'marcus-reynolds',
                'library': 'elena-rodriguez',
                'art_studio': 'lily-chen',
                'kitchen': 'thompson-butler'
            };
            
            const characterId = roomCharacters[roomId];
            if (characterId) {
                detectiveWidget.selectCharacter(characterId);
                detectiveWidget.show();
            }
        }
    </script>
</body>
</html>
```

## ⚙️ Configuration Options

### Widget Configuration

```javascript
const config = {
    // API Settings
    apiUrl: 'https://blackwood-chat-app.vercel.app',
    
    // Appearance
    position: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    theme: 'sepia', // 'sepia', 'aged', 'classic'
    
    // Features
    enableVoice: false,
    enableFileUpload: false,
    showCharacterSelector: true,
    autoOpen: false,
    
    // Behavior
    debug: false,
    maxRetries: 3,
    retryDelay: 1000,
    requestTimeout: 30000
};
```

### Character Configuration

```javascript
const characters = [
    {
        id: 'james-blackwood',
        name: 'James Blackwood',
        role: 'Mansion Owner',
        avatar: '/Profile images /james blackwood.png',
        description: 'The wealthy owner of Blackwood Manor'
    },
    // ... more characters
];
```

## 🔧 Customization

### Custom Themes

```css
/* Custom theme example */
.detective-widget.custom-theme {
    background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
    border-color: #your-accent-color;
}

.detective-widget.custom-theme .widget-header {
    background: linear-gradient(90deg, #your-header-1 0%, #your-header-2 100%);
}
```

### Custom Characters

```javascript
// Add custom character
const customCharacter = {
    id: 'detective-smith',
    name: 'Detective Smith',
    role: 'Lead Investigator',
    avatar: '/images/detective-smith.png',
    description: 'Experienced detective with keen intuition'
};

// Add to characters array
widget.characters.push(customCharacter);
```

## 🛡️ Error Handling

### JavaScript Error Handling

```javascript
const widget = new BlackwoodDetectiveWidget({
    debug: true
});

widget.on('error', function(error) {
    console.error('Widget error:', error);
    // Handle error in your game
    showErrorMessage('Detective widget encountered an error. Please try again.');
});

widget.on('characterSelected', function(character) {
    try {
        // Your character selection logic
        updateGameState(character);
    } catch (error) {
        console.error('Character selection error:', error);
        widget.emit('error', error);
    }
});
```

### Unity Error Handling

```csharp
public class GameManager : MonoBehaviour
{
    public BlackwoodDetectiveWidget detectiveWidget;
    
    void Start()
    {
        detectiveWidget.OnError += OnWidgetError;
    }
    
    void OnWidgetError(string error)
    {
        Debug.LogError($"Widget error: {error}");
        // Show error message to player
        ShowErrorMessage("Detective widget error. Please try again.");
    }
    
    void ShowErrorMessage(string message)
    {
        // Your error display logic
    }
}
```

## 📱 Mobile Support

### Responsive Design

The widgets automatically adapt to mobile devices:

```css
@media (max-width: 768px) {
    .blackwood-widget-container {
        position: fixed;
        bottom: 0;
        right: 0;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
}
```

### Touch Optimization

- Touch-friendly button sizes
- Swipe gestures for character selection
- Mobile keyboard handling
- Viewport management

## 🔒 Security Considerations

### API Security

```javascript
// Never expose API keys in client-side code
const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'https://blackwood-chat-app.vercel.app'
};
```

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://unpkg.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://blackwood-chat-app.vercel.app;
">
```

## 🚀 Performance Optimization

### Lazy Loading

```javascript
// Load widget only when needed
function loadDetectiveWidget() {
    return import('./web-integration.js').then(module => {
        const BlackwoodDetectiveWidget = module.default;
        return new BlackwoodDetectiveWidget(config);
    });
}
```

### Caching

```javascript
// Cache conversation history
const widget = new BlackwoodDetectiveWidget({
    cacheConversation: true,
    maxCacheSize: 100
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Widget not appearing**
   - Check if required files are loaded
   - Verify API URL is accessible
   - Check browser console for errors

2. **Character selection not working**
   - Verify character IDs match exactly
   - Check if character data is properly loaded
   - Ensure event listeners are set up

3. **API errors**
   - Check network connectivity
   - Verify API endpoint is working
   - Check request format and headers

4. **Styling issues**
   - Ensure CSS file is loaded
   - Check for CSS conflicts
   - Verify responsive breakpoints

### Debug Mode

```javascript
const widget = new BlackwoodDetectiveWidget({
    debug: true
});

// Enable detailed logging
widget.on('ready', () => console.log('Widget ready'));
widget.on('characterSelected', (char) => console.log('Character:', char));
widget.on('messageSent', (msg) => console.log('Message sent:', msg));
widget.on('messageReceived', (msg) => console.log('Message received:', msg));
widget.on('error', (err) => console.error('Error:', err));
```

## 📊 Analytics Integration

### Event Tracking

```javascript
// Track widget usage
widget.on('characterSelected', function(character) {
    analytics.track('detective_character_selected', {
        character_id: character.id,
        character_name: character.name,
        timestamp: new Date().toISOString()
    });
});

widget.on('messageSent', function(data) {
    analytics.track('detective_message_sent', {
        character_id: data.characterId,
        message_length: data.text.length,
        timestamp: new Date().toISOString()
    });
});
```

## 🎯 Best Practices

### 1. **Integration Patterns**
- Use room-based character selection
- Implement proper error handling
- Provide fallback options
- Test on multiple devices

### 2. **Performance**
- Lazy load the widget
- Cache conversation history
- Optimize for mobile
- Use proper error boundaries

### 3. **User Experience**
- Provide clear instructions
- Handle network errors gracefully
- Support keyboard navigation
- Ensure accessibility

### 4. **Security**
- Never expose API keys
- Validate all inputs
- Use HTTPS in production
- Implement proper CSP

## 📞 Support

For integration support or custom modifications:

1. Check the demo page: `/widget-demo`
2. Review the source code in `/components/`
3. Test different configurations using the demo interface
4. Check the troubleshooting section above

## 🚀 Future Enhancements

- Voice synthesis for character responses
- Advanced animation effects
- Custom character creation tools
- Multi-language support
- Advanced investigation tracking
- Integration with popular game engines
- Real-time collaboration features
- Advanced analytics and reporting

---

**Ready to integrate?** Start with the standalone HTML version for quick testing, then move to the JavaScript library for full integration! 🕵️‍♂️✨
