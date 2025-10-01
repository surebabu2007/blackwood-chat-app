'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Globe, 
  Code, 
  Gamepad2, 
  BookOpen,
  Download,
  ExternalLink,
  Play,
  Settings,
  Zap,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface IntegrationTab {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

export default function IntegrationPage() {
  const [activeTab, setActiveTab] = useState('browser');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [widgetConfig, setWidgetConfig] = useState({
    position: 'bottom-right',
    theme: 'sepia',
    enableVoice: true,
    showCharacterSelector: true,
    isInterrogationMode: false,
    apiUrl: 'https://blackwood-chat-app.vercel.app'
  });

  const tabs: IntegrationTab[] = [
    {
      id: 'browser',
      name: 'Browser Games',
      icon: <Globe className="w-5 h-5" />,
      description: 'HTML5, JavaScript, WebGL games'
    },
    {
      id: 'python',
      name: 'Python Games',
      icon: <Code className="w-5 h-5" />,
      description: 'Pygame, Kivy, Tkinter games'
    },
    {
      id: 'renpy',
      name: 'Ren\'Py 8.4',
      icon: <Gamepad2 className="w-5 h-5" />,
      description: 'Visual novel integration'
    },
    {
      id: 'unity',
      name: 'Unity WebGL',
      icon: <Play className="w-5 h-5" />,
      description: 'Unity games for web'
    }
  ];

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getBrowserIntegrationCode = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Game - Detective Widget</title>
</head>
<body>
    <!-- Your game content here -->
    <div id="game-container">
        <h1>Your Game Title</h1>
        <p>Your game content goes here...</p>
    </div>

    <!-- Detective Widget Integration -->
    <div data-blackwood-widget 
         data-position="${widgetConfig.position}" 
         data-theme="${widgetConfig.theme}" 
         data-enable-voice="${widgetConfig.enableVoice}"
         data-show-character-selector="${widgetConfig.showCharacterSelector}"
         data-interrogation-mode="${widgetConfig.isInterrogationMode}">
    </div>

    <!-- Load Widget Script -->
    <script src="${widgetConfig.apiUrl}/widget-loader.js"></script>
    
    <script>
        // Game Integration
        let widget = null;
        
        // Initialize widget when ready
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                if (window.BlackwoodWidget) {
                    widget = window.BlackwoodWidget;
                    setupGameIntegration();
                }
            }, 1000);
        });
        
        function setupGameIntegration() {
            // Listen for widget events
            widget.on('characterSelected', (character) => {
                console.log('Character selected:', character.name);
                // Update your game state here
                updateGameState('character_interviewed', character.id);
            });
            
            widget.on('messageSent', (data) => {
                console.log('Message sent:', data.message);
                // Track player interactions
                trackPlayerAction('message_sent', data);
            });
            
            widget.on('evidenceFound', (evidence) => {
                console.log('Evidence found:', evidence);
                // Update game inventory
                addToInventory('evidence', evidence);
            });
        }
        
        // Game control functions
        function showDetectiveWidget() {
            if (widget) widget.show();
        }
        
        function hideDetectiveWidget() {
            if (widget) widget.hide();
        }
        
        function startInvestigation(roomId) {
            const roomCharacters = {
                'study': 'james-blackwood',
                'office': 'marcus-reynolds',
                'library': 'elena-rodriguez',
                'art_studio': 'lily-chen',
                'kitchen': 'thompson-butler'
            };
            
            const characterId = roomCharacters[roomId];
            if (characterId && widget) {
                widget.show();
                widget.selectCharacter(characterId);
                widget.setInterrogationMode(true);
            }
        }
        
        // Your game functions
        function updateGameState(action, data) {
            // Implement your game state management
            console.log('Game state update:', action, data);
        }
        
        function trackPlayerAction(action, data) {
            // Implement player action tracking
            console.log('Player action:', action, data);
        }
        
        function addToInventory(type, item) {
            // Implement inventory system
            console.log('Added to inventory:', type, item);
        }
    </script>
</body>
</html>`;
  };

  const getPythonIntegrationCode = () => {
    return `# Blackwood Manor Detective Widget - Python Integration
# For Pygame, Kivy, Tkinter games

import webbrowser
import threading
import time
import json
from urllib.parse import urlencode

class BlackwoodWidget:
    def __init__(self, game_window):
        self.game_window = game_window
        self.widget_url = "${widgetConfig.apiUrl}/widget-demo"
        self.is_open = False
        self.current_character = None
        
    def show_widget(self):
        """Open widget in browser"""
        if not self.is_open:
            params = {
                'embed': 'true',
                'theme': '${widgetConfig.theme}',
                'position': '${widgetConfig.position}',
                'interrogation': '${widgetConfig.isInterrogationMode}'
            }
            
            url = f"{self.widget_url}?{urlencode(params)}"
            webbrowser.open(url)
            self.is_open = True
            
            # Optional: Open in specific browser window
            # self.open_in_game_window(url)
    
    def hide_widget(self):
        """Close widget browser window"""
        # Note: Cannot programmatically close browser windows for security
        self.is_open = False
    
    def select_character(self, character_id):
        """Select character in widget"""
        self.current_character = character_id
        
        # Open widget with specific character
        params = {
            'embed': 'true',
            'character': character_id,
            'theme': '${widgetConfig.theme}',
            'interrogation': '${widgetConfig.isInterrogationMode}'
        }
        
        url = f"{self.widget_url}?{urlencode(params)}"
        webbrowser.open(url)
        self.is_open = True
    
    def start_investigation(self, room_id):
        """Start investigation for specific room"""
        room_characters = {
            'study': 'james-blackwood',
            'office': 'marcus-reynolds', 
            'library': 'elena-rodriguez',
            'art_studio': 'lily-chen',
            'kitchen': 'thompson-butler'
        }
        
        character_id = room_characters.get(room_id)
        if character_id:
            self.select_character(character_id)
            self.set_interrogation_mode(True)
    
    def set_interrogation_mode(self, enabled):
        """Enable/disable interrogation mode"""
        # This will be reflected in the widget URL
        pass
    
    def open_in_game_window(self, url):
        """Open widget in embedded browser window (if supported)"""
        try:
            # For Kivy with WebView
            from kivy.uix.webview import WebView
            
            webview = WebView(url=url)
            self.game_window.add_widget(webview)
            
        except ImportError:
            # Fallback to system browser
            webbrowser.open(url)

# Pygame Integration Example
class PygameGame:
    def __init__(self):
        self.widget = BlackwoodWidget(self)
        self.investigation_active = False
        
    def handle_room_enter(self, room_id):
        """Called when player enters a room"""
        if room_id in ['study', 'office', 'library', 'art_studio', 'kitchen']:
            self.widget.start_investigation(room_id)
            self.investigation_active = True
    
    def handle_evidence_found(self, evidence):
        """Called when player finds evidence"""
        # Update game state
        print(f"Evidence found: {evidence}")
        # Trigger widget update if needed
    
    def toggle_widget(self):
        """Toggle widget visibility"""
        if self.investigation_active:
            self.widget.hide_widget()
            self.investigation_active = False
        else:
            self.widget.show_widget()
            self.investigation_active = True

# Kivy Integration Example  
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.webview import WebView

class KivyGame(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.widget = BlackwoodWidget(self)
        
        # Add buttons for widget control
        btn_show = Button(text='Show Detective Widget')
        btn_show.bind(on_press=self.show_widget)
        self.add_widget(btn_show)
        
        btn_investigate = Button(text='Start Investigation')
        btn_investigate.bind(on_press=self.start_investigation)
        self.add_widget(btn_investigate)
    
    def show_widget(self, instance):
        self.widget.show_widget()
    
    def start_investigation(self, instance):
        self.widget.start_investigation('study')  # Example room

class DetectiveGameApp(App):
    def build(self):
        return KivyGame()

if __name__ == '__main__':
    DetectiveGameApp().run()

# Usage in your existing game:
# game = PygameGame()
# game.handle_room_enter('study')  # Opens widget for James Blackwood`;
  };

  const getRenpyIntegrationCode = () => {
    return `# Blackwood Manor Detective Widget - Ren'Py 8.4 Integration
# Place this in your Ren'Py game's script.rpy or create a new file

init python:
    import webbrowser
    import json
    import urllib.parse
    
    class BlackwoodWidget:
        def __init__(self):
            self.api_url = "${widgetConfig.apiUrl}"
            self.widget_url = f"{self.api_url}/widget-demo"
            self.is_open = False
            self.current_character = None
            self.investigation_active = False
            
        def show_widget(self, character_id=None, room_id=None, interrogation=False):
            """Show detective widget"""
            params = {
                'embed': 'true',
                'theme': '${widgetConfig.theme}',
                'position': '${widgetConfig.position}',
                'interrogation': str(interrogation).lower()
            }
            
            if character_id:
                params['character'] = character_id
                self.current_character = character_id
            
            if room_id:
                # Map rooms to characters
                room_characters = {
                    'study': 'james-blackwood',
                    'office': 'marcus-reynolds',
                    'library': 'elena-rodriguez', 
                    'art_studio': 'lily-chen',
                    'kitchen': 'thompson-butler',
                    'mansion_entrance': 'thompson-butler'
                }
                
                if room_id in room_characters:
                    params['character'] = room_characters[room_id]
                    self.current_character = room_characters[room_id]
            
            url = f"{self.widget_url}?{urllib.parse.urlencode(params)}"
            webbrowser.open(url)
            self.is_open = True
            self.investigation_active = True
            
            # Store investigation state
            persistent.widget_open = True
            persistent.current_investigation = character_id or room_characters.get(room_id, '')
        
        def hide_widget(self):
            """Hide widget (note: cannot programmatically close browser)"""
            self.is_open = False
            self.investigation_active = False
            persistent.widget_open = False
        
        def start_room_investigation(self, room_id):
            """Start investigation when entering a room"""
            self.show_widget(room_id=room_id, interrogation=True)
            
            # Update game state
            if room_id in ['study', 'office', 'library', 'art_studio', 'kitchen']:
                renpy.notify("Detective widget opened - interview the suspect!")
        
        def select_suspect(self, character_id):
            """Select specific suspect to interview"""
            self.show_widget(character_id=character_id, interrogation=True)
            renpy.notify(f"Interviewing {character_id.replace('-', ' ').title()}")
        
        def end_investigation(self):
            """End current investigation"""
            self.hide_widget()
            renpy.notify("Investigation session ended")
    
    # Initialize widget
    detective_widget = BlackwoodWidget()

# Default persistent variables
default persistent.widget_open = False
default persistent.current_investigation = ""
default persistent.evidence_collected = []
default persistent.suspects_interviewed = []
default persistent.investigation_progress = 0

# Character definitions for easy reference
define james = Character("James Blackwood", color="#8B4513")
define marcus = Character("Marcus Reynolds", color="#2F4F4F") 
define elena = Character("Dr. Elena Rodriguez", color="#8B0000")
define lily = Character("Lily Chen", color="#800080")
define thompson = Character("Mr. Thompson", color="#696969")

# Room investigation labels
label room_study:
    scene study_room
    "You enter the study. James Blackwood is sitting at the desk."
    
    menu:
        "Talk to James":
            detective_widget.start_room_investigation("study")
            jump continue_story
        "Look around":
            "You examine the study for clues..."
            $ persistent.evidence_collected.append("Study clues found")
            jump continue_story
        "Leave":
            jump continue_story

label room_office:
    scene office_room
    "You enter Marcus Reynolds' office."
    
    menu:
        "Interview Marcus":
            detective_widget.start_room_investigation("office")
            jump continue_story
        "Search the office":
            "You find business documents..."
            $ persistent.evidence_collected.append("Business documents")
            jump continue_story

label room_library:
    scene library_room
    "You enter the library where Dr. Elena Rodriguez is reading."
    
    menu:
        "Talk to Dr. Rodriguez":
            detective_widget.start_room_investigation("library")
            jump continue_story
        "Browse books":
            "You find medical records..."
            $ persistent.evidence_collected.append("Medical records")
            jump continue_story

label room_art_studio:
    scene art_studio
    "You enter Lily Chen's art studio."
    
    menu:
        "Interview Lily":
            detective_widget.start_room_investigation("art_studio")
            jump continue_story
        "Examine artwork":
            "You find suspicious paintings..."
            $ persistent.evidence_collected.append("Suspicious artwork")
            jump continue_story

label room_kitchen:
    scene kitchen_room
    "You enter the kitchen where Mr. Thompson is preparing tea."
    
    menu:
        "Talk to Mr. Thompson":
            detective_widget.start_room_investigation("kitchen")
            jump continue_story
        "Look for clues":
            "You find kitchen utensils..."
            $ persistent.evidence_collected.append("Kitchen clues")
            jump continue_story

# Main investigation menu
label investigation_menu:
    scene investigation_hub
    "Detective Investigation Hub"
    
    menu:
        "Interview James Blackwood":
            detective_widget.select_suspect("james-blackwood")
            $ persistent.suspects_interviewed.append("james-blackwood")
            
        "Interview Marcus Reynolds":
            detective_widget.select_suspect("marcus-reynolds")
            $ persistent.suspects_interviewed.append("marcus-reynolds")
            
        "Interview Dr. Elena Rodriguez":
            detective_widget.select_suspect("elena-rodriguez")
            $ persistent.suspects_interviewed.append("elena-rodriguez")
            
        "Interview Lily Chen":
            detective_widget.select_suspect("lily-chen")
            $ persistent.suspects_interviewed.append("lily-chen")
            
        "Interview Mr. Thompson":
            detective_widget.select_suspect("thompson-butler")
            $ persistent.suspects_interviewed.append("thompson-butler")
            
        "Review Evidence":
            call review_evidence
            jump investigation_menu
            
        "End Investigation":
            detective_widget.end_investigation()
            jump main_story

label review_evidence:
    scene evidence_board
    "Evidence Review"
    
    if len(persistent.evidence_collected) > 0:
        "Evidence collected so far:"
        for evidence in persistent.evidence_collected:
            "[evidence]"
    else:
        "No evidence collected yet."
    
    if len(persistent.suspects_interviewed) > 0:
        "Suspects interviewed:"
        for suspect in persistent.suspects_interviewed:
            "[suspect.replace('-', ' ').title()]"
    else:
        "No suspects interviewed yet."
    
    return

# Story integration examples
label main_story:
    scene mansion_exterior
    "You arrive at Blackwood Manor to investigate Victoria Blackwood's murder."
    
    menu:
        "Start Investigation":
            jump investigation_menu
        "Explore the mansion":
            jump mansion_exploration
        "Talk to the butler":
            jump room_kitchen

label mansion_exploration:
    scene mansion_interior
    "You explore the mansion. Which room would you like to investigate?"
    
    menu:
        "Study":
            jump room_study
        "Office":
            jump room_office
        "Library":
            jump room_library
        "Art Studio":
            jump room_art_studio
        "Kitchen":
            jump room_kitchen
        "Return to main":
            jump main_story

# Advanced integration features
label advanced_investigation:
    "Advanced Investigation Features"
    
    # Check if widget is already open
    if persistent.widget_open:
        "The detective widget is already open in your browser."
        menu:
            "Continue current investigation":
                # Widget is already open, just notify
                renpy.notify("Return to browser to continue investigation")
            "Start new investigation":
                detective_widget.hide_widget()
                detective_widget.show_widget()
    
    # Progress tracking
    $ investigation_progress = len(persistent.suspects_interviewed) * 20
    if investigation_progress >= 100:
        "You have interviewed all suspects! Time to solve the case."
        jump case_solution
    else:
        "[investigation_progress]% investigation complete"

# Error handling and edge cases
label widget_error_handling:
    "Widget Error Handling"
    
    try:
        detective_widget.show_widget()
    except Exception as e:
        "There was an error opening the detective widget."
        "Please ensure you have an internet connection and try again."
        
    # Fallback investigation method
    menu:
        "Try again":
            jump widget_error_handling
        "Continue without widget":
            jump main_story

# Save/load integration
label before_save:
    # Save widget state
    persistent.widget_state = {
        'is_open': detective_widget.is_open,
        'current_character': detective_widget.current_character,
        'investigation_active': detective_widget.investigation_active
    }

label after_load:
    # Restore widget state
    if hasattr(persistent, 'widget_state'):
        state = persistent.widget_state
        detective_widget.is_open = state.get('is_open', False)
        detective_widget.current_character = state.get('current_character', None)
        detective_widget.investigation_active = state.get('investigation_active', False)

# Usage Examples:
# detective_widget.start_room_investigation("study")
# detective_widget.select_suspect("james-blackwood") 
# detective_widget.end_investigation()`;
  };

  const getUnityIntegrationCode = () => {
    return `// Blackwood Manor Detective Widget - Unity WebGL Integration
// Place this script on a GameObject in your Unity scene

using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Runtime.InteropServices;

public class DetectiveWidget : MonoBehaviour
{
    [Header("Widget Configuration")]
    public string apiUrl = "${widgetConfig.apiUrl}";
    public string theme = "${widgetConfig.theme}";
    public string position = "${widgetConfig.position}";
    public bool enableVoice = ${widgetConfig.enableVoice};
    public bool showCharacterSelector = ${widgetConfig.showCharacterSelector};
    public bool isInterrogationMode = ${widgetConfig.isInterrogationMode}";
    
    [Header("UI References")]
    public Button showWidgetButton;
    public Button hideWidgetButton;
    public Button investigationButton;
    public Text statusText;
    
    // JavaScript interop for Unity WebGL
    [DllImport("__Internal")]
    private static extern void OpenDetectiveWidget(string url);
    
    [DllImport("__Internal")]
    private static extern void CloseDetectiveWidget();
    
    [DllImport("__Internal")]
    private static extern void SendMessageToWidget(string message);
    
    private bool widgetOpen = false;
    private string currentCharacter = "";
    
    void Start()
    {
        // Setup UI buttons
        if (showWidgetButton != null)
            showWidgetButton.onClick.AddListener(ShowWidget);
            
        if (hideWidgetButton != null)
            hideWidgetButton.onClick.AddListener(HideWidget);
            
        if (investigationButton != null)
            investigationButton.onClick.AddListener(StartInvestigation);
            
        UpdateUI();
    }
    
    public void ShowWidget()
    {
        string url = BuildWidgetURL();
        
        #if UNITY_WEBGL && !UNITY_EDITOR
            OpenDetectiveWidget(url);
        #else
            Application.OpenURL(url);
        #endif
        
        widgetOpen = true;
        UpdateUI();
        
        if (statusText != null)
            statusText.text = "Detective Widget Opened";
    }
    
    public void HideWidget()
    {
        #if UNITY_WEBGL && !UNITY_EDITOR
            CloseDetectiveWidget();
        #endif
        
        widgetOpen = false;
        UpdateUI();
        
        if (statusText != null)
            statusText.text = "Detective Widget Closed";
    }
    
    public void StartInvestigation(string roomId)
    {
        string characterId = GetCharacterForRoom(roomId);
        if (!string.IsNullOrEmpty(characterId))
        {
            SelectCharacter(characterId);
            SetInterrogationMode(true);
            ShowWidget();
        }
    }
    
    public void SelectCharacter(string characterId)
    {
        currentCharacter = characterId;
        
        string message = $"{{\\"type\\": \\"SELECT_CHARACTER\\", \\"characterId\\": \\"{characterId}\\"}}";
        
        #if UNITY_WEBGL && !UNITY_EDITOR
            SendMessageToWidget(message);
        #endif
        
        Debug.Log($"Selected character: {characterId}");
    }
    
    public void SetInterrogationMode(bool enabled)
    {
        isInterrogationMode = enabled;
        
        string message = $"{{\\"type\\": \\"SET_INTERROGATION_MODE\\", \\"enabled\\": {enabled.ToString().ToLower()}}}";
        
        #if UNITY_WEBGL && !UNITY_EDITOR
            SendMessageToWidget(message);
        #endif
    }
    
    private string BuildWidgetURL()
    {
        string url = $"{apiUrl}/widget-demo?embed=true";
        url += $"&theme={theme}";
        url += $"&position={position}";
        url += $"&interrogation={isInterrogationMode.ToString().ToLower()}";
        
        if (!string.IsNullOrEmpty(currentCharacter))
        {
            url += $"&character={currentCharacter}";
        }
        
        return url;
    }
    
    private string GetCharacterForRoom(string roomId)
    {
        switch (roomId.ToLower())
        {
            case "study": return "james-blackwood";
            case "office": return "marcus-reynolds";
            case "library": return "elena-rodriguez";
            case "art_studio": return "lily-chen";
            case "kitchen": return "thompson-butler";
            default: return "";
        }
    }
    
    private void UpdateUI()
    {
        if (showWidgetButton != null)
            showWidgetButton.interactable = !widgetOpen;
            
        if (hideWidgetButton != null)
            hideWidgetButton.interactable = widgetOpen;
    }
    
    // Game integration methods
    public void OnRoomEntered(string roomId)
    {
        Debug.Log($"Entered room: {roomId}");
        StartInvestigation(roomId);
    }
    
    public void OnEvidenceFound(string evidence)
    {
        Debug.Log($"Evidence found: {evidence}");
        // Update game state, inventory, etc.
    }
    
    public void OnSuspectInterviewed(string suspectId)
    {
        Debug.Log($"Suspect interviewed: {suspectId}");
        // Update investigation progress
    }
    
    // Callback methods for JavaScript communication
    public void OnWidgetMessage(string message)
    {
        Debug.Log($"Widget message: {message}");
        
        // Parse message and handle different types
        // This would be called from JavaScript
    }
}

// JavaScript plugin for Unity (place in Assets/Plugins/WebGL/)
/*
mergeInto(LibraryManager.library, {
    OpenDetectiveWidget: function(url) {
        var urlString = UTF8ToString(url);
        window.open(urlString, 'detectiveWidget', 'width=400,height=600,resizable=yes,scrollbars=yes');
    },
    
    CloseDetectiveWidget: function() {
        // Note: Cannot programmatically close windows for security
        console.log('Widget close requested');
    },
    
    SendMessageToWidget: function(message) {
        var messageString = UTF8ToString(message);
        // Send message to widget window if it exists
        if (window.detectiveWidget && !window.detectiveWidget.closed) {
            window.detectiveWidget.postMessage(messageString, '*');
        }
    }
});
*/

// Usage in your Unity game:
// 1. Add DetectiveWidget component to a GameObject
// 2. Assign UI references in inspector
// 3. Call methods from your game scripts:
//    detectiveWidget.OnRoomEntered("study");
//    detectiveWidget.SelectCharacter("james-blackwood");`;
  };

  const getIntegrationCode = () => {
    switch (activeTab) {
      case 'browser':
        return getBrowserIntegrationCode();
      case 'python':
        return getPythonIntegrationCode();
      case 'renpy':
        return getRenpyIntegrationCode();
      case 'unity':
        return getUnityIntegrationCode();
      default:
        return getBrowserIntegrationCode();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-200 to-yellow-200 border-b-2 border-amber-400 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">
            🕵️ Widget Integration Hub
          </h1>
          <p className="text-amber-800 text-lg">
            Copy-paste ready code for integrating Blackwood Manor detective widgets into your games
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Widget Configuration */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-amber-300 p-6 mb-8">
          <h2 className="text-2xl font-serif font-bold text-amber-900 mb-6">Widget Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-amber-700 mb-2 font-medium">Position</label>
              <select 
                value={widgetConfig.position}
                onChange={(e) => setWidgetConfig({...widgetConfig, position: e.target.value})}
                className="w-full p-3 border-2 border-amber-300 rounded-lg"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
              </select>
            </div>

            <div>
              <label className="block text-amber-700 mb-2 font-medium">Theme</label>
              <select 
                value={widgetConfig.theme}
                onChange={(e) => setWidgetConfig({...widgetConfig, theme: e.target.value})}
                className="w-full p-3 border-2 border-amber-300 rounded-lg"
              >
                <option value="sepia">Sepia</option>
                <option value="aged">Aged Paper</option>
                <option value="classic">Classic Detective</option>
              </select>
            </div>

            <div>
              <label className="block text-amber-700 mb-2 font-medium">Features</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={widgetConfig.enableVoice}
                    onChange={(e) => setWidgetConfig({...widgetConfig, enableVoice: e.target.checked})}
                    className="mr-2"
                  />
                  Voice Enabled
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={widgetConfig.showCharacterSelector}
                    onChange={(e) => setWidgetConfig({...widgetConfig, showCharacterSelector: e.target.checked})}
                    className="mr-2"
                  />
                  Character Selector
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={widgetConfig.isInterrogationMode}
                    onChange={(e) => setWidgetConfig({...widgetConfig, isInterrogationMode: e.target.checked})}
                    className="mr-2"
                  />
                  Interrogation Mode
                </label>
              </div>
            </div>

            <div>
              <label className="block text-amber-700 mb-2 font-medium">API URL</label>
              <input 
                type="text" 
                value={widgetConfig.apiUrl}
                onChange={(e) => setWidgetConfig({...widgetConfig, apiUrl: e.target.value})}
                className="w-full p-3 border-2 border-amber-300 rounded-lg"
                placeholder="https://your-domain.com"
              />
            </div>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-amber-300 p-6 mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <h3 className="text-xl font-serif font-bold text-amber-900 mb-2">
                  {tabs.find(tab => tab.id === activeTab)?.name} Integration
                </h3>
                <p className="text-amber-700">
                  {tabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-mono font-bold text-green-400">Integration Code</h4>
                  <button
                    onClick={() => copyToClipboard(getIntegrationCode(), activeTab)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    {copiedCode === activeTab ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                
                <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                  <code>{getIntegrationCode()}</code>
                </pre>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Platform-specific Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Features */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-amber-300 p-6">
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">Features</h3>
            <ul className="space-y-2 text-amber-700">
              <li className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-amber-600" />
                Real-time character interaction
              </li>
              <li className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-amber-600" />
                Secure API communication
              </li>
              <li className="flex items-center">
                <Settings className="w-4 h-4 mr-2 text-amber-600" />
                Fully customizable themes
              </li>
              <li className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-amber-600" />
                Cross-platform compatibility
              </li>
              <li className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-amber-600" />
                Comprehensive documentation
              </li>
            </ul>
          </div>

          {/* Quick Start */}
          <div className="bg-white rounded-lg shadow-lg border-2 border-amber-300 p-6">
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">Quick Start</h3>
            <div className="space-y-3 text-amber-700">
              <div className="flex items-start">
                <span className="bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                <div>
                  <p className="font-medium">Copy the integration code</p>
                  <p className="text-sm text-amber-600">Select your platform and copy the provided code</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                <div>
                  <p className="font-medium">Paste into your project</p>
                  <p className="text-sm text-amber-600">Add the code to your game's main files</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                <div>
                  <p className="font-medium">Test the integration</p>
                  <p className="text-sm text-amber-600">Run your game and test the widget functionality</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edge Cases & Troubleshooting */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-amber-300 p-6 mt-6">
          <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">Edge Cases & Troubleshooting</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-amber-800 mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                Common Issues
              </h4>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>• Widget not opening: Check internet connection</li>
                <li>• Character not responding: Verify API URL</li>
                <li>• Styling conflicts: Use iframe isolation</li>
                <li>• Mobile issues: Test responsive design</li>
                <li>• Ren'Py errors: Check Python syntax</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-amber-800 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-600" />
                Best Practices
              </h4>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>• Always test on target platform</li>
                <li>• Handle network errors gracefully</li>
                <li>• Save widget state in game saves</li>
                <li>• Provide fallback options</li>
                <li>• Test with different screen sizes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Test Links */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-amber-300 p-6 mt-6">
          <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">Test Your Integration</h3>
          
          <div className="flex flex-wrap gap-4">
            <a 
              href="/widget-test.html" 
              target="_blank"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Test Widget Functionality</span>
            </a>
            
            <a 
              href="/game-integration.html" 
              target="_blank"
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>See Live Demo</span>
            </a>
            
            <a 
              href="/widget-demo" 
              target="_blank"
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Widget Demo Page</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
