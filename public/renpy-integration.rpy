# Blackwood Manor Detective Widget - Ren'Py 8.4 Integration
# Complete integration with all edge cases handled
# Place this file in your Ren'Py game directory

init python:
    import webbrowser
    import json
    import urllib.parse
    import os
    import sys
    import threading
    import time
    
    class BlackwoodWidget:
        def __init__(self):
            self.api_url = "https://blackwood-chat-app.vercel.app"
            self.widget_url = f"{self.api_url}/widget-demo"
            self.is_open = False
            self.current_character = None
            self.investigation_active = False
            self.widget_window = None
            self.retry_count = 0
            self.max_retries = 3
            
            # Character mapping for easy access
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
        
        def _safe_open_url(self, url, retry=True):
            """Safely open URL with error handling and retry logic"""
            try:
                # Check if we're in a web environment (Ren'Py Web)
                if renpy.variant("web"):
                    renpy.open_url(url)
                else:
                    # Desktop version
                    webbrowser.open(url)
                
                self.is_open = True
                self.retry_count = 0
                return True
                
            except Exception as e:
                renpy.notify(f"Error opening widget: {str(e)}")
                
                if retry and self.retry_count < self.max_retries:
                    self.retry_count += 1
                    renpy.notify(f"Retrying... ({self.retry_count}/{self.max_retries})")
                    renpy.restart_interaction()
                    return self._safe_open_url(url, True)
                else:
                    renpy.notify("Failed to open widget. Please check your internet connection.")
                    return False
        
        def show_widget(self, character_id=None, room_id=None, interrogation=False, force_new=False):
            """Show detective widget with comprehensive error handling"""
            try:
                # Build URL parameters
                params = {
                    'embed': 'true',
                    'theme': 'sepia',
                    'position': 'bottom-right',
                    'interrogation': str(interrogation).lower(),
                    'version': '8.4'
                }
                
                # Handle character selection
                if character_id:
                    if character_id in self.character_names:
                        params['character'] = character_id
                        self.current_character = character_id
                    else:
                        renpy.notify(f"Unknown character: {character_id}")
                        return False
                
                # Handle room-based character selection
                if room_id:
                    if room_id in self.room_characters:
                        character_id = self.room_characters[room_id]
                        params['character'] = character_id
                        self.current_character = character_id
                    else:
                        renpy.notify(f"No character found for room: {room_id}")
                        return False
                
                # Add game context
                if hasattr(persistent, 'investigation_progress'):
                    params['progress'] = persistent.investigation_progress
                
                if hasattr(persistent, 'evidence_collected'):
                    params['evidence_count'] = len(persistent.evidence_collected)
                
                # Build final URL
                url = f"{self.widget_url}?{urllib.parse.urlencode(params)}"
                
                # Open widget
                success = self._safe_open_url(url)
                
                if success:
                    self.investigation_active = True
                    
                    # Update persistent state
                    persistent.widget_open = True
                    persistent.current_investigation = self.current_character or ""
                    
                    # Show success message
                    character_name = self.character_names.get(self.current_character, "Unknown")
                    renpy.notify(f"Detective widget opened - Interviewing {character_name}")
                    
                    return True
                else:
                    return False
                    
            except Exception as e:
                renpy.notify(f"Widget error: {str(e)}")
                return False
        
        def hide_widget(self):
            """Hide widget (note: cannot programmatically close browser)"""
            try:
                self.is_open = False
                self.investigation_active = False
                persistent.widget_open = False
                renpy.notify("Investigation session ended")
                return True
            except Exception as e:
                renpy.notify(f"Error closing widget: {str(e)}")
                return False
        
        def start_room_investigation(self, room_id, interrogation=True):
            """Start investigation when entering a room"""
            try:
                if room_id not in self.room_characters:
                    renpy.notify(f"Unknown room: {room_id}")
                    return False
                
                character_id = self.room_characters[room_id]
                character_name = self.character_names.get(character_id, "Unknown")
                
                # Check if already investigated
                if hasattr(persistent, 'investigated_rooms'):
                    if room_id in persistent.investigated_rooms:
                        renpy.notify(f"You've already investigated {room_id}")
                        return False
                
                # Show widget
                success = self.show_widget(character_id=character_id, interrogation=interrogation)
                
                if success:
                    # Mark room as investigated
                    if not hasattr(persistent, 'investigated_rooms'):
                        persistent.investigated_rooms = []
                    
                    if room_id not in persistent.investigated_rooms:
                        persistent.investigated_rooms.append(room_id)
                    
                    # Update investigation progress
                    self._update_investigation_progress()
                    
                    return True
                else:
                    return False
                    
            except Exception as e:
                renpy.notify(f"Room investigation error: {str(e)}")
                return False
        
        def select_suspect(self, character_id, interrogation=True):
            """Select specific suspect to interview"""
            try:
                if character_id not in self.character_names:
                    renpy.notify(f"Unknown suspect: {character_id}")
                    return False
                
                character_name = self.character_names.get(character_id, "Unknown")
                
                # Check if already interviewed
                if hasattr(persistent, 'suspects_interviewed'):
                    if character_id in persistent.suspects_interviewed:
                        renpy.notify(f"You've already interviewed {character_name}")
                        return False
                
                # Show widget
                success = self.show_widget(character_id=character_id, interrogation=interrogation)
                
                if success:
                    # Mark suspect as interviewed
                    if not hasattr(persistent, 'suspects_interviewed'):
                        persistent.suspects_interviewed = []
                    
                    if character_id not in persistent.suspects_interviewed:
                        persistent.suspects_interviewed.append(character_id)
                    
                    # Update investigation progress
                    self._update_investigation_progress()
                    
                    return True
                else:
                    return False
                    
            except Exception as e:
                renpy.notify(f"Suspect selection error: {str(e)}")
                return False
        
        def _update_investigation_progress(self):
            """Update investigation progress based on completed actions"""
            try:
                progress = 0
                
                # Base progress from suspects interviewed
                if hasattr(persistent, 'suspects_interviewed'):
                    progress += len(persistent.suspects_interviewed) * 15
                
                # Additional progress from rooms investigated
                if hasattr(persistent, 'investigated_rooms'):
                    progress += len(persistent.investigated_rooms) * 10
                
                # Evidence bonus
                if hasattr(persistent, 'evidence_collected'):
                    progress += len(persistent.evidence_collected) * 5
                
                # Cap at 100%
                progress = min(progress, 100)
                
                persistent.investigation_progress = progress
                
                # Check for completion
                if progress >= 100:
                    renpy.notify("Investigation complete! You're ready to solve the case.")
                
            except Exception as e:
                renpy.notify(f"Progress update error: {str(e)}")
        
        def end_investigation(self):
            """End current investigation"""
            try:
                self.hide_widget()
                
                # Calculate final progress
                self._update_investigation_progress()
                
                # Show summary
                if hasattr(persistent, 'investigation_progress'):
                    progress = persistent.investigation_progress
                    renpy.notify(f"Investigation session ended. Progress: {progress}%")
                
                return True
                
            except Exception as e:
                renpy.notify(f"End investigation error: {str(e)}")
                return False
        
        def get_investigation_summary(self):
            """Get current investigation summary"""
            try:
                summary = {
                    'progress': getattr(persistent, 'investigation_progress', 0),
                    'suspects_interviewed': getattr(persistent, 'suspects_interviewed', []),
                    'rooms_investigated': getattr(persistent, 'investigated_rooms', []),
                    'evidence_collected': getattr(persistent, 'evidence_collected', []),
                    'widget_open': getattr(persistent, 'widget_open', False)
                }
                
                return summary
                
            except Exception as e:
                renpy.notify(f"Summary error: {str(e)}")
                return None
        
        def reset_investigation(self):
            """Reset all investigation progress"""
            try:
                persistent.investigation_progress = 0
                persistent.suspects_interviewed = []
                persistent.investigated_rooms = []
                persistent.evidence_collected = []
                persistent.widget_open = False
                persistent.current_investigation = ""
                
                self.is_open = False
                self.investigation_active = False
                self.current_character = None
                
                renpy.notify("Investigation reset. Starting fresh.")
                return True
                
            except Exception as e:
                renpy.notify(f"Reset error: {str(e)}")
                return False

# Initialize widget
detective_widget = BlackwoodWidget()

# Default persistent variables with proper initialization
default persistent.widget_open = False
default persistent.current_investigation = ""
default persistent.evidence_collected = []
default persistent.suspects_interviewed = []
default persistent.investigated_rooms = []
default persistent.investigation_progress = 0
default persistent.widget_errors = []
default persistent.last_widget_use = None

# Character definitions
define james = Character("James Blackwood", color="#8B4513", what_color="#654321")
define marcus = Character("Marcus Reynolds", color="#2F4F4F", what_color="#1F2F2F") 
define elena = Character("Dr. Elena Rodriguez", color="#8B0000", color="#5C0000")
define lily = Character("Lily Chen", color="#800080", what_color="#400040")
define thompson = Character("Mr. Thompson", color="#696969", what_color="#404040")

# Investigation menu with error handling
label investigation_menu:
    scene investigation_hub
    "Detective Investigation Hub"
    
    # Check widget status
    if persistent.widget_open:
        "The detective widget is currently open in your browser."
        menu:
            "Continue current investigation":
                "Return to your browser to continue the investigation."
                jump investigation_menu
            "Start new investigation":
                $ detective_widget.hide_widget()
                "Starting new investigation..."
            "Return to game":
                jump main_story
    
    # Show investigation summary
    $ summary = detective_widget.get_investigation_summary()
    if summary:
        "Investigation Progress: [summary['progress']]%"
        if summary['suspects_interviewed']:
            "Suspects interviewed: [len(summary['suspects_interviewed'])]"
        if summary['evidence_collected']:
            "Evidence collected: [len(summary['evidence_collected'])]"
    
    menu:
        "Interview James Blackwood":
            $ success = detective_widget.select_suspect("james-blackwood")
            if not success:
                jump investigation_menu
            jump continue_story
            
        "Interview Marcus Reynolds":
            $ success = detective_widget.select_suspect("marcus-reynolds")
            if not success:
                jump investigation_menu
            jump continue_story
            
        "Interview Dr. Elena Rodriguez":
            $ success = detective_widget.select_suspect("elena-rodriguez")
            if not success:
                jump investigation_menu
            jump continue_story
            
        "Interview Lily Chen":
            $ success = detective_widget.select_suspect("lily-chen")
            if not success:
                jump investigation_menu
            jump continue_story
            
        "Interview Mr. Thompson":
            $ success = detective_widget.select_suspect("thompson-butler")
            if not success:
                jump investigation_menu
            jump continue_story
            
        "Review Evidence":
            call review_evidence
            jump investigation_menu
            
        "Reset Investigation":
            menu:
                "Are you sure you want to reset all progress?"
                "Yes, reset everything":
                    $ detective_widget.reset_investigation()
                    jump investigation_menu
                "No, keep progress":
                    jump investigation_menu
            
        "End Investigation":
            $ detective_widget.end_investigation()
            jump main_story

# Room investigation labels with error handling
label room_study:
    scene study_room
    "You enter the study. James Blackwood is sitting at the desk."
    
    menu:
        "Talk to James":
            $ success = detective_widget.start_room_investigation("study")
            if not success:
                "There was an issue opening the detective widget."
                menu:
                    "Try again":
                        jump room_study
                    "Continue without widget":
                        jump continue_story
            jump continue_story
        "Look around":
            "You examine the study for clues..."
            $ persistent.evidence_collected.append("Study clues found")
            $ detective_widget._update_investigation_progress()
            jump continue_story
        "Leave":
            jump continue_story

label room_office:
    scene office_room
    "You enter Marcus Reynolds' office."
    
    menu:
        "Interview Marcus":
            $ success = detective_widget.start_room_investigation("office")
            if not success:
                "There was an issue opening the detective widget."
                menu:
                    "Try again":
                        jump room_office
                    "Continue without widget":
                        jump continue_story
            jump continue_story
        "Search the office":
            "You find business documents..."
            $ persistent.evidence_collected.append("Business documents")
            $ detective_widget._update_investigation_progress()
            jump continue_story

label room_library:
    scene library_room
    "You enter the library where Dr. Elena Rodriguez is reading."
    
    menu:
        "Talk to Dr. Rodriguez":
            $ success = detective_widget.start_room_investigation("library")
            if not success:
                "There was an issue opening the detective widget."
                menu:
                    "Try again":
                        jump room_library
                    "Continue without widget":
                        jump continue_story
            jump continue_story
        "Browse books":
            "You find medical records..."
            $ persistent.evidence_collected.append("Medical records")
            $ detective_widget._update_investigation_progress()
            jump continue_story

label room_art_studio:
    scene art_studio
    "You enter Lily Chen's art studio."
    
    menu:
        "Interview Lily":
            $ success = detective_widget.start_room_investigation("art_studio")
            if not success:
                "There was an issue opening the detective widget."
                menu:
                    "Try again":
                        jump room_art_studio
                    "Continue without widget":
                        jump continue_story
            jump continue_story
        "Examine artwork":
            "You find suspicious paintings..."
            $ persistent.evidence_collected.append("Suspicious artwork")
            $ detective_widget._update_investigation_progress()
            jump continue_story

label room_kitchen:
    scene kitchen_room
    "You enter the kitchen where Mr. Thompson is preparing tea."
    
    menu:
        "Talk to Mr. Thompson":
            $ success = detective_widget.start_room_investigation("kitchen")
            if not success:
                "There was an issue opening the detective widget."
                menu:
                    "Try again":
                        jump room_kitchen
                    "Continue without widget":
                        jump continue_story
            jump continue_story
        "Look for clues":
            "You find kitchen utensils..."
            $ persistent.evidence_collected.append("Kitchen clues")
            $ detective_widget._update_investigation_progress()
            jump continue_story

# Evidence review with error handling
label review_evidence:
    scene evidence_board
    "Evidence Review"
    
    $ summary = detective_widget.get_investigation_summary()
    if summary and summary['evidence_collected']:
        "Evidence collected so far:"
        for evidence in summary['evidence_collected']:
            "[evidence]"
    else:
        "No evidence collected yet."
    
    if summary and summary['suspects_interviewed']:
        "Suspects interviewed:"
        for suspect in summary['suspects_interviewed']:
            $ character_name = detective_widget.character_names.get(suspect, suspect.replace('-', ' ').title())
            "[character_name]"
    else:
        "No suspects interviewed yet."
    
    return

# Main story integration
label main_story:
    scene mansion_exterior
    "You arrive at Blackwood Manor to investigate Victoria Blackwood's murder."
    
    # Check if widget is available
    $ widget_available = True
    try:
        # Test widget functionality
        $ test_result = detective_widget.get_investigation_summary()
        if not test_result:
            $ widget_available = False
    except:
        $ widget_available = False
    
    if widget_available:
        menu:
            "Start Investigation":
                jump investigation_menu
            "Explore the mansion":
                jump mansion_exploration
            "Talk to the butler":
                jump room_kitchen
    else:
        "The detective widget is currently unavailable."
        menu:
            "Continue without widget":
                jump mansion_exploration
            "Try again":
                jump main_story

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

# Save/load integration with error handling
label before_save:
    try:
        # Save widget state
        persistent.widget_state = {
            'is_open': detective_widget.is_open,
            'current_character': detective_widget.current_character,
            'investigation_active': detective_widget.investigation_active,
            'retry_count': detective_widget.retry_count
        }
        
        # Save timestamp
        persistent.last_widget_use = time.time()
        
    except Exception as e:
        # Log error but don't crash
        if not hasattr(persistent, 'widget_errors'):
            persistent.widget_errors = []
        persistent.widget_errors.append(f"Save error: {str(e)}")

label after_load:
    try:
        # Restore widget state
        if hasattr(persistent, 'widget_state'):
            state = persistent.widget_state
            detective_widget.is_open = state.get('is_open', False)
            detective_widget.current_character = state.get('current_character', None)
            detective_widget.investigation_active = state.get('investigation_active', False)
            detective_widget.retry_count = state.get('retry_count', 0)
        
        # Check if widget session is stale (older than 1 hour)
        if persistent.last_widget_use:
            if time.time() - persistent.last_widget_use > 3600:  # 1 hour
                detective_widget.hide_widget()
                renpy.notify("Previous investigation session expired")
        
    except Exception as e:
        # Log error but don't crash
        if not hasattr(persistent, 'widget_errors'):
            persistent.widget_errors = []
        persistent.widget_errors.append(f"Load error: {str(e)}")

# Error recovery
label widget_error_recovery:
    "There was an error with the detective widget."
    
    menu:
        "Try again":
            jump widget_error_recovery
        "Continue without widget":
            jump main_story
        "Reset widget state":
            $ detective_widget.reset_investigation()
            renpy.notify("Widget state reset")
            jump main_story

# Network error handling
label network_error:
    "Network error: Unable to connect to detective widget."
    
    menu:
        "Check internet connection and try again":
            jump network_error
        "Continue offline":
            jump main_story
        "Use fallback investigation":
            "You'll need to investigate manually without the widget."
            jump mansion_exploration

# Utility functions for other scripts
label add_evidence(evidence_name):
    $ persistent.evidence_collected.append(evidence_name)
    $ detective_widget._update_investigation_progress()
    renpy.notify(f"Evidence found: {evidence_name}")
    return

label mark_suspect_interviewed(suspect_id):
    if suspect_id not in persistent.suspects_interviewed:
        $ persistent.suspects_interviewed.append(suspect_id)
        $ detective_widget._update_investigation_progress()
    return

# Usage Examples:
# call add_evidence("Mysterious letter")
# call mark_suspect_interviewed("james-blackwood")
# $ success = detective_widget.start_room_investigation("study")
# $ success = detective_widget.select_suspect("james-blackwood")
# $ detective_widget.end_investigation()
