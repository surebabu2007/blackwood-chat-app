# Blackwood Manor Detective Widget - Python Integration
# Comprehensive integration for Pygame, Kivy, Tkinter, and other Python games
# Handles all edge cases and provides fallback options

import webbrowser
import threading
import time
import json
import urllib.parse
import os
import sys
import logging
from typing import Optional, Dict, List, Any
from dataclasses import dataclass
from enum import Enum

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WidgetTheme(Enum):
    SEPIA = "sepia"
    AGED = "aged"
    CLASSIC = "classic"

class WidgetPosition(Enum):
    BOTTOM_RIGHT = "bottom-right"
    BOTTOM_LEFT = "bottom-left"
    TOP_RIGHT = "top-right"
    TOP_LEFT = "top-left"

@dataclass
class WidgetConfig:
    """Configuration for the detective widget"""
    api_url: str = "https://blackwood-chat-app.vercel.app"
    theme: WidgetTheme = WidgetTheme.SEPIA
    position: WidgetPosition = WidgetPosition.BOTTOM_RIGHT
    enable_voice: bool = True
    show_character_selector: bool = True
    is_interrogation_mode: bool = False
    width: str = "400px"
    height: str = "600px"
    max_retries: int = 3
    retry_delay: float = 1.0

@dataclass
class InvestigationState:
    """Tracks investigation progress"""
    progress: int = 0
    suspects_interviewed: List[str] = None
    rooms_investigated: List[str] = None
    evidence_collected: List[str] = None
    current_character: Optional[str] = None
    widget_open: bool = False
    
    def __post_init__(self):
        if self.suspects_interviewed is None:
            self.suspects_interviewed = []
        if self.rooms_investigated is None:
            self.rooms_investigated = []
        if self.evidence_collected is None:
            self.evidence_collected = []

class BlackwoodWidget:
    """Main widget integration class with comprehensive error handling"""
    
    def __init__(self, config: WidgetConfig = None, game_window=None):
        self.config = config or WidgetConfig()
        self.game_window = game_window
        self.widget_url = f"{self.config.api_url}/widget-demo"
        self.is_open = False
        self.current_character = None
        self.investigation_active = False
        self.retry_count = 0
        self.widget_window = None
        
        # Character mapping
        self.character_names = {
            'james-blackwood': 'James Blackwood',
            'marcus-reynolds': 'Marcus Reynolds', 
            'elena-rodriguez': 'Dr. Elena Rodriguez',
            'lily-chen': 'Lily Chen',
            'thompson-butler': 'Mr. Thompson'
        }
        
        # Room to character mapping
        self.room_characters = {
            'study': 'james-blackwood',
            'office': 'marcus-reynolds',
            'library': 'elena-rodriguez', 
            'art_studio': 'lily-chen',
            'kitchen': 'thompson-butler',
            'mansion_entrance': 'thompson-butler',
            'dining_room': 'thompson-butler',
            'bedroom': 'james-blackwood',
            'basement': 'marcus-reynolds'
        }
        
        # Investigation state
        self.investigation_state = InvestigationState()
        
        # Event callbacks
        self.on_character_selected = None
        self.on_message_sent = None
        self.on_evidence_found = None
        self.on_investigation_progress = None
        
        logger.info("Blackwood Widget initialized")
    
    def _safe_open_url(self, url: str, retry: bool = True) -> bool:
        """Safely open URL with error handling and retry logic"""
        try:
            logger.info(f"Opening widget URL: {url}")
            
            # Check if we're in a headless environment
            if os.environ.get('DISPLAY') is None and sys.platform.startswith('linux'):
                logger.warning("No display available, cannot open browser")
                return False
            
            # Try different browser opening methods
            try:
                # Primary method
                webbrowser.open(url)
                success = True
            except Exception as e1:
                logger.warning(f"Primary browser method failed: {e1}")
                try:
                    # Fallback method
                    webbrowser.open_new(url)
                    success = True
                except Exception as e2:
                    logger.warning(f"Fallback browser method failed: {e2}")
                    try:
                        # Last resort
                        webbrowser.open_new_tab(url)
                        success = True
                    except Exception as e3:
                        logger.error(f"All browser methods failed: {e3}")
                        success = False
            
            if success:
                self.is_open = True
                self.retry_count = 0
                logger.info("Widget opened successfully")
                return True
            else:
                raise Exception("All browser opening methods failed")
                
        except Exception as e:
            logger.error(f"Error opening widget: {e}")
            
            if retry and self.retry_count < self.config.max_retries:
                self.retry_count += 1
                logger.info(f"Retrying... ({self.retry_count}/{self.config.max_retries})")
                time.sleep(self.config.retry_delay * self.retry_count)
                return self._safe_open_url(url, True)
            else:
                logger.error("Max retries exceeded")
                return False
    
    def show_widget(self, character_id: str = None, room_id: str = None, 
                   interrogation: bool = False, force_new: bool = False) -> bool:
        """Show detective widget with comprehensive error handling"""
        try:
            logger.info(f"Showing widget - Character: {character_id}, Room: {room_id}")
            
            # Build URL parameters
            params = {
                'embed': 'true',
                'theme': self.config.theme.value,
                'position': self.config.position.value,
                'interrogation': str(interrogation).lower(),
                'width': self.config.width,
                'height': self.config.height
            }
            
            # Handle character selection
            if character_id:
                if character_id in self.character_names:
                    params['character'] = character_id
                    self.current_character = character_id
                    self.investigation_state.current_character = character_id
                else:
                    logger.error(f"Unknown character: {character_id}")
                    return False
            
            # Handle room-based character selection
            if room_id:
                if room_id in self.room_characters:
                    character_id = self.room_characters[room_id]
                    params['character'] = character_id
                    self.current_character = character_id
                    self.investigation_state.current_character = character_id
                else:
                    logger.error(f"No character found for room: {room_id}")
                    return False
            
            # Add game context
            params['progress'] = self.investigation_state.progress
            params['evidence_count'] = len(self.investigation_state.evidence_collected)
            params['suspects_count'] = len(self.investigation_state.suspects_interviewed)
            
            # Build final URL
            url = f"{self.widget_url}?{urllib.parse.urlencode(params)}"
            
            # Open widget
            success = self._safe_open_url(url)
            
            if success:
                self.investigation_active = True
                self.investigation_state.widget_open = True
                
                # Trigger callback
                if self.on_character_selected and self.current_character:
                    self.on_character_selected(self.current_character)
                
                character_name = self.character_names.get(self.current_character, "Unknown")
                logger.info(f"Widget opened successfully - Interviewing {character_name}")
                return True
            else:
                return False
                
        except Exception as e:
            logger.error(f"Widget error: {e}")
            return False
    
    def hide_widget(self) -> bool:
        """Hide widget (note: cannot programmatically close browser)"""
        try:
            self.is_open = False
            self.investigation_active = False
            self.investigation_state.widget_open = False
            logger.info("Widget hidden")
            return True
        except Exception as e:
            logger.error(f"Error hiding widget: {e}")
            return False
    
    def start_room_investigation(self, room_id: str, interrogation: bool = True) -> bool:
        """Start investigation when entering a room"""
        try:
            logger.info(f"Starting room investigation: {room_id}")
            
            if room_id not in self.room_characters:
                logger.error(f"Unknown room: {room_id}")
                return False
            
            # Check if already investigated
            if room_id in self.investigation_state.rooms_investigated:
                logger.info(f"Room {room_id} already investigated")
                return False
            
            character_id = self.room_characters[room_id]
            character_name = self.character_names.get(character_id, "Unknown")
            
            # Show widget
            success = self.show_widget(character_id=character_id, interrogation=interrogation)
            
            if success:
                # Mark room as investigated
                if room_id not in self.investigation_state.rooms_investigated:
                    self.investigation_state.rooms_investigated.append(room_id)
                
                # Update investigation progress
                self._update_investigation_progress()
                
                logger.info(f"Room investigation started: {room_id}")
                return True
            else:
                return False
                
        except Exception as e:
            logger.error(f"Room investigation error: {e}")
            return False
    
    def select_suspect(self, character_id: str, interrogation: bool = True) -> bool:
        """Select specific suspect to interview"""
        try:
            logger.info(f"Selecting suspect: {character_id}")
            
            if character_id not in self.character_names:
                logger.error(f"Unknown suspect: {character_id}")
                return False
            
            # Check if already interviewed
            if character_id in self.investigation_state.suspects_interviewed:
                logger.info(f"Suspect {character_id} already interviewed")
                return False
            
            character_name = self.character_names.get(character_id, "Unknown")
            
            # Show widget
            success = self.show_widget(character_id=character_id, interrogation=interrogation)
            
            if success:
                # Mark suspect as interviewed
                if character_id not in self.investigation_state.suspects_interviewed:
                    self.investigation_state.suspects_interviewed.append(character_id)
                
                # Update investigation progress
                self._update_investigation_progress()
                
                logger.info(f"Suspect selected: {character_name}")
                return True
            else:
                return False
                
        except Exception as e:
            logger.error(f"Suspect selection error: {e}")
            return False
    
    def add_evidence(self, evidence: str) -> bool:
        """Add evidence to investigation"""
        try:
            if evidence not in self.investigation_state.evidence_collected:
                self.investigation_state.evidence_collected.append(evidence)
                self._update_investigation_progress()
                
                # Trigger callback
                if self.on_evidence_found:
                    self.on_evidence_found(evidence)
                
                logger.info(f"Evidence added: {evidence}")
                return True
            return False
        except Exception as e:
            logger.error(f"Error adding evidence: {e}")
            return False
    
    def _update_investigation_progress(self):
        """Update investigation progress based on completed actions"""
        try:
            progress = 0
            
            # Base progress from suspects interviewed
            progress += len(self.investigation_state.suspects_interviewed) * 15
            
            # Additional progress from rooms investigated
            progress += len(self.investigation_state.rooms_investigated) * 10
            
            # Evidence bonus
            progress += len(self.investigation_state.evidence_collected) * 5
            
            # Cap at 100%
            progress = min(progress, 100)
            
            old_progress = self.investigation_state.progress
            self.investigation_state.progress = progress
            
            # Trigger callback if progress changed
            if progress != old_progress and self.on_investigation_progress:
                self.on_investigation_progress(progress)
            
            # Check for completion
            if progress >= 100:
                logger.info("Investigation complete!")
            
        except Exception as e:
            logger.error(f"Progress update error: {e}")
    
    def get_investigation_summary(self) -> Dict[str, Any]:
        """Get current investigation summary"""
        try:
            return {
                'progress': self.investigation_state.progress,
                'suspects_interviewed': self.investigation_state.suspects_interviewed.copy(),
                'rooms_investigated': self.investigation_state.rooms_investigated.copy(),
                'evidence_collected': self.investigation_state.evidence_collected.copy(),
                'widget_open': self.investigation_state.widget_open,
                'current_character': self.investigation_state.current_character
            }
        except Exception as e:
            logger.error(f"Summary error: {e}")
            return {}
    
    def reset_investigation(self) -> bool:
        """Reset all investigation progress"""
        try:
            self.investigation_state = InvestigationState()
            self.is_open = False
            self.investigation_active = False
            self.current_character = None
            self.retry_count = 0
            
            logger.info("Investigation reset")
            return True
        except Exception as e:
            logger.error(f"Reset error: {e}")
            return False
    
    def save_state(self, filename: str = "investigation_state.json") -> bool:
        """Save investigation state to file"""
        try:
            state_data = {
                'investigation_state': {
                    'progress': self.investigation_state.progress,
                    'suspects_interviewed': self.investigation_state.suspects_interviewed,
                    'rooms_investigated': self.investigation_state.rooms_investigated,
                    'evidence_collected': self.investigation_state.evidence_collected,
                    'current_character': self.investigation_state.current_character,
                    'widget_open': self.investigation_state.widget_open
                },
                'widget_state': {
                    'is_open': self.is_open,
                    'current_character': self.current_character,
                    'investigation_active': self.investigation_active,
                    'retry_count': self.retry_count
                },
                'timestamp': time.time()
            }
            
            with open(filename, 'w') as f:
                json.dump(state_data, f, indent=2)
            
            logger.info(f"State saved to {filename}")
            return True
        except Exception as e:
            logger.error(f"Save error: {e}")
            return False
    
    def load_state(self, filename: str = "investigation_state.json") -> bool:
        """Load investigation state from file"""
        try:
            if not os.path.exists(filename):
                logger.warning(f"State file {filename} not found")
                return False
            
            with open(filename, 'r') as f:
                state_data = json.load(f)
            
            # Restore investigation state
            if 'investigation_state' in state_data:
                inv_state = state_data['investigation_state']
                self.investigation_state.progress = inv_state.get('progress', 0)
                self.investigation_state.suspects_interviewed = inv_state.get('suspects_interviewed', [])
                self.investigation_state.rooms_investigated = inv_state.get('rooms_investigated', [])
                self.investigation_state.evidence_collected = inv_state.get('evidence_collected', [])
                self.investigation_state.current_character = inv_state.get('current_character', None)
                self.investigation_state.widget_open = inv_state.get('widget_open', False)
            
            # Restore widget state
            if 'widget_state' in state_data:
                widget_state = state_data['widget_state']
                self.is_open = widget_state.get('is_open', False)
                self.current_character = widget_state.get('current_character', None)
                self.investigation_active = widget_state.get('investigation_active', False)
                self.retry_count = widget_state.get('retry_count', 0)
            
            # Check if state is stale (older than 1 hour)
            timestamp = state_data.get('timestamp', 0)
            if time.time() - timestamp > 3600:  # 1 hour
                logger.info("State is stale, resetting")
                self.reset_investigation()
            
            logger.info(f"State loaded from {filename}")
            return True
        except Exception as e:
            logger.error(f"Load error: {e}")
            return False

# Pygame Integration Example
class PygameGame:
    """Example integration for Pygame games"""
    
    def __init__(self):
        self.widget = BlackwoodWidget()
        self.investigation_active = False
        
        # Set up callbacks
        self.widget.on_character_selected = self.on_character_selected
        self.widget.on_evidence_found = self.on_evidence_found
        self.widget.on_investigation_progress = self.on_investigation_progress
    
    def on_character_selected(self, character_id: str):
        """Called when a character is selected"""
        print(f"Character selected: {character_id}")
        # Update your game state here
    
    def on_evidence_found(self, evidence: str):
        """Called when evidence is found"""
        print(f"Evidence found: {evidence}")
        # Update your inventory system
    
    def on_investigation_progress(self, progress: int):
        """Called when investigation progress changes"""
        print(f"Investigation progress: {progress}%")
        # Update your UI
    
    def handle_room_enter(self, room_id: str):
        """Called when player enters a room"""
        if room_id in self.widget.room_characters:
            success = self.widget.start_room_investigation(room_id)
            if success:
                self.investigation_active = True
    
    def handle_evidence_found(self, evidence: str):
        """Called when player finds evidence"""
        self.widget.add_evidence(evidence)
    
    def toggle_widget(self):
        """Toggle widget visibility"""
        if self.investigation_active:
            self.widget.hide_widget()
            self.investigation_active = False
        else:
            self.widget.show_widget()
            self.investigation_active = True

# Kivy Integration Example
try:
    from kivy.app import App
    from kivy.uix.boxlayout import BoxLayout
    from kivy.uix.button import Button
    from kivy.uix.label import Label
    from kivy.uix.webview import WebView
    
    class KivyGame(BoxLayout):
        """Example integration for Kivy games"""
        
        def __init__(self, **kwargs):
            super().__init__(**kwargs)
            self.orientation = 'vertical'
            self.widget = BlackwoodWidget()
            
            # Add UI elements
            self.add_widget(Label(text='Detective Game', size_hint_y=0.1))
            
            # Button container
            button_container = BoxLayout(orientation='horizontal', size_hint_y=0.1)
            
            btn_show = Button(text='Show Widget')
            btn_show.bind(on_press=self.show_widget)
            button_container.add_widget(btn_show)
            
            btn_investigate = Button(text='Investigate Study')
            btn_investigate.bind(on_press=lambda x: self.start_investigation('study'))
            button_container.add_widget(btn_investigate)
            
            self.add_widget(button_container)
            
            # Status label
            self.status_label = Label(text='Ready to investigate', size_hint_y=0.1)
            self.add_widget(self.status_label)
        
        def show_widget(self, instance):
            success = self.widget.show_widget()
            if success:
                self.status_label.text = "Widget opened"
            else:
                self.status_label.text = "Failed to open widget"
        
        def start_investigation(self, room_id):
            success = self.widget.start_room_investigation(room_id)
            if success:
                self.status_label.text = f"Investigating {room_id}"
            else:
                self.status_label.text = f"Failed to investigate {room_id}"
    
    class DetectiveGameApp(App):
        def build(self):
            return KivyGame()
    
except ImportError:
    logger.warning("Kivy not available - Kivy integration skipped")

# Tkinter Integration Example
try:
    import tkinter as tk
    from tkinter import ttk, messagebox
    
    class TkinterGame:
        """Example integration for Tkinter games"""
        
        def __init__(self):
            self.root = tk.Tk()
            self.root.title("Detective Game")
            self.widget = BlackwoodWidget()
            
            self.setup_ui()
        
        def setup_ui(self):
            """Set up the user interface"""
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
            
            ttk.Button(main_frame, text="Investigate Office", 
                      command=lambda: self.start_investigation('office')).grid(row=2, column=0, padx=5, pady=5)
            
            ttk.Button(main_frame, text="Investigate Library", 
                      command=lambda: self.start_investigation('library')).grid(row=2, column=1, padx=5, pady=5)
            
            # Status label
            self.status_label = ttk.Label(main_frame, text="Ready to investigate")
            self.status_label.grid(row=3, column=0, columnspan=2, pady=10)
            
            # Progress bar
            self.progress_var = tk.DoubleVar()
            self.progress_bar = ttk.Progressbar(main_frame, variable=self.progress_var, 
                                              maximum=100)
            self.progress_bar.grid(row=4, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        
        def show_widget(self):
            success = self.widget.show_widget()
            if success:
                self.status_label.config(text="Widget opened successfully")
            else:
                messagebox.showerror("Error", "Failed to open widget")
        
        def start_investigation(self, room_id):
            success = self.widget.start_room_investigation(room_id)
            if success:
                self.status_label.config(text=f"Investigating {room_id}")
                self.update_progress()
            else:
                messagebox.showerror("Error", f"Failed to investigate {room_id}")
        
        def update_progress(self):
            summary = self.widget.get_investigation_summary()
            progress = summary.get('progress', 0)
            self.progress_var.set(progress)
            self.status_label.config(text=f"Investigation progress: {progress}%")
        
        def run(self):
            self.root.mainloop()
    
except ImportError:
    logger.warning("Tkinter not available - Tkinter integration skipped")

# Usage Examples
if __name__ == "__main__":
    # Example usage
    config = WidgetConfig(
        theme=WidgetTheme.SEPIA,
        position=WidgetPosition.BOTTOM_RIGHT,
        enable_voice=True
    )
    
    widget = BlackwoodWidget(config)
    
    # Set up callbacks
    def on_character_selected(character_id):
        print(f"Character selected: {character_id}")
    
    def on_evidence_found(evidence):
        print(f"Evidence found: {evidence}")
    
    def on_investigation_progress(progress):
        print(f"Investigation progress: {progress}%")
    
    widget.on_character_selected = on_character_selected
    widget.on_evidence_found = on_evidence_found
    widget.on_investigation_progress = on_investigation_progress
    
    # Example interactions
    print("Starting investigation...")
    
    # Start room investigation
    widget.start_room_investigation("study")
    
    # Add evidence
    widget.add_evidence("Mysterious letter")
    
    # Get summary
    summary = widget.get_investigation_summary()
    print(f"Investigation summary: {summary}")
    
    # Save state
    widget.save_state("my_investigation.json")
    
    # Load state
    widget.load_state("my_investigation.json")
