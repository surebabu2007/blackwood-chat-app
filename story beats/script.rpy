# Enhanced Murder Mystery Script with Immersive Video Backgrounds
# ============================================================================
# CHARACTER DEFINITIONS
# ============================================================================
 
define detective = Character("Detective Sarah Chen", color="#2E86AB")
define victim = Character("Victoria Blackwood", color="#A23B72")
define suspect1 = Character("Marcus Reynolds", color="#F18F01")
define suspect2 = Character("Dr. Elena Rodriguez", color="#C73E1D")
define suspect3 = Character("James Blackwood", color="#8B4513")
define suspect4 = Character("Lily Chen", color="#228B22")
define narrator = Character(None, color="#FFFFFF")
define butler = Character("Mr. Thompson", color="#8B7355")

# ============================================================================
# GAME VARIABLES
# ============================================================================
default player_score = 0
default player_intelligence = 0
default player_emotional_balance = 50
default player_empathy = 50
default player_courage = 50
default player_fear = 0
default evidence_collected = []
default suspects_interviewed = []
default current_location = "mansion_entrance"
default current_context = "general"
default time_of_day = "evening"
default murder_weapon = None
default true_killer = None
default player_choices = []
default case_solved = False
default investigation_style = "methodical"
default relationship_with_suspects = {}
default hidden_evidence = []
default case_complexity = 0
default moral_choices = []

# ============================================================================
# VIDEO BACKGROUNDS
# ============================================================================
image bg mansion_entrance video = Movie(play="videos/mansion_entrance.webm", loop=True)
image bg mansion_entrance_day video = Movie(play="videos/mansion_entrance_day.webm", loop=True)
image bg study_crime_scene video = Movie(play="videos/study_crime_scene.webm", loop=True)
image bg study_clean video = Movie(play="videos/study_clean.webm", loop=True)
image bg library video = Movie(play="videos/library.webm", loop=True)
image bg dining_room video = Movie(play="videos/dining_room.webm", loop=True)
image bg kitchen video = Movie(play="videos/kitchen.webm", loop=True)
image bg garden video = Movie(play="videos/garden.webm", loop=True)
image bg basement video = Movie(play="videos/basement.webm", loop=True)
image bg bedroom video = Movie(play="videos/bedroom.webm", loop=True)
image bg hallway video = Movie(play="videos/hallway.webm", loop=True)
image bg conservatory video = Movie(play="videos/conservatory.webm", loop=True)
image bg storm_intensifies video = Movie(play="videos/storm_intensifies.webm", loop=True)
image bg flashback_study video = Movie(play="videos/flashback_study.webm", loop=True)
image bg dawn_breaks video = Movie(play="videos/dawn_breaks.webm", loop=True)
image bg police_station video = Movie(play="videos/police_station.webm", loop=True)
image bg hospital video = Movie(play="videos/hospital.webm", loop=True)
image bg study_final video = Movie(play="videos/study_final.webm", loop=True)
image bg lawn_lilychen video = Movie(play="videos/lawn_lilychen.webm", loop=True)
image bg marcus_interview video = Movie(play="videos/13.webm", loop=True)
# Fallback images for when videos don't load
image bg mansion_entrance = Solid("#2C3E50")
image bg mansion_entrance_day = Solid("#87CEEB")
image bg study_crime_scene = Solid("#8B4513")
image bg study_clean = Solid("#DEB887")
image bg library = Solid("#8B7355")
image bg dining_room = Solid("#F5DEB3")
image bg kitchen = Solid("#F0E68C")
image bg garden = Solid("#90EE90")
image bg basement = Solid("#696969")
image bg bedroom = Solid("#E6E6FA")
image bg hallway = Solid("#D3D3D3")
image bg conservatory = Solid("#98FB98")
image bg storm_intensifies = Solid("#2F4F4F")
image bg flashback_study = Solid("#DEB887")
image bg dawn_breaks = Solid("#FFB6C1")
image bg police_station = Solid("#708090")
image bg lawn_lilychen = Solid("#90EE90")
image bg marcus_interview = Solid("#8B4513")

# ============================================================================
# AUDIO TRACKS
# ============================================================================
define audio.rain_ambient = "audio/rain_ambient.ogg"
define audio.suspense_music = "audio/suspense_music.ogg"
define audio.reveal_music = "audio/reveal_music.ogg"
define audio.tense_music = "audio/tense_music.ogg"
define audio.soft_music = "audio/tense_music.ogg"
define audio.dramatic_music = "audio/suspense_music.ogg"
define audio.crime_ambient = "audio/crime.mp3"

# ============================================================================
# VOICE SYSTEM
# ============================================================================
init python:
    def get_voice(character, number):
        return f"audio/{character}{number}.mp3"

init python:
    for character in ["detective", "narrator", "butler", "victim", "suspect1", "suspect2", "suspect3", "suspect4"]:
        for i in range(100):
            renpy.store.__dict__[f"{character}{i}"] = get_voice(character, i)

    

# ============================================================================
# GAME FUNCTIONS
# ============================================================================

init python:
    def update_player_attributes(choice_type, value=5):
        global player_intelligence, player_emotional_balance, player_empathy, player_courage, player_fear
        
        if choice_type == "intelligence":
            player_intelligence += value
        elif choice_type == "emotional_balance":
            player_emotional_balance = max(0, min(100, player_emotional_balance + value))
        elif choice_type == "empathy":
            player_empathy = max(0, min(100, player_empathy + value))
        elif choice_type == "courage":
            player_courage = max(0, min(100, player_courage + value))
        elif choice_type == "fear":
            player_fear = max(0, min(100, player_fear + value))
    
    def update_relationship(suspect, value):
        if suspect not in relationship_with_suspects:
            relationship_with_suspects[suspect] = 0
        relationship_with_suspects[suspect] = max(-50, min(50, relationship_with_suspects[suspect] + value))
    


# ============================================================================
# GAME START
# ============================================================================

label start:
    $ true_killer = renpy.random.choice(["Marcus Reynolds", "Dr. Elena Rodriguez", "James Blackwood", "Lily Chen"])
    $ murder_weapon = renpy.random.choice(["poisoned wine", "strangulation", "blunt force trauma", "stabbing", "overdose"])
    $ relationship_with_suspects = {"Marcus Reynolds": 0, "Dr. Elena Rodriguez": 0, "James Blackwood": 0, "Lily Chen": 0}
    
    
    scene bg mansion_entrance video
    play music rain_ambient fadein 3.0
    
    play sound get_voice("narrator", 0)
    narrator "The rain pounds against the windows of Blackwood Manor as Detective Sarah Chen arrives at the scene of a gruesome murder."
    stop sound
    play sound get_voice("narrator", 1)
    narrator "Victoria Blackwood, a wealthy socialite and art collector, has been found dead in her own mansion."
    stop sound
    play sound get_voice("narrator", 2)
    narrator "The year is 1947. The place: A secluded estate in the misty hills of New England."
    stop sound
    play sound get_voice("narrator", 3)
    narrator "The mansion looms before her, its Gothic architecture casting long shadows in the stormy night."
    stop sound
    
    scene bg police_station video
    play music soft_music fadein 1.0
    
    play sound get_voice("narrator", 4)
    narrator "Earlier that day, at the police station..."
    stop sound
    
    play sound get_voice("detective", 0)
    detective "This is Detective Sarah Chen, Homicide Division. I've been called to investigate the death of Victoria Blackwood."
    stop sound
    play sound get_voice("detective", 1)
    detective "According to the initial report, she was found in her study at approximately 9:30 PM by her butler."
    stop sound
    play sound get_voice("detective", 2)
    detective "The cause of death appears to be [murder_weapon], but I need to gather more evidence to confirm."
    stop sound
    play sound get_voice("detective", 3)
    detective "There are four potential suspects, each with their own motives and alibis."
    stop sound
    play sound get_voice("detective", 4)
    detective "I need to be thorough. Every detail matters in a case like this."
    stop sound
    
    scene bg mansion_entrance video
    play music rain_ambient fadein 2.0
    
    play sound get_voice("narrator", 5)
    narrator "Now, standing before the imposing Blackwood Manor..."
    stop sound
    
    #call start_shadow_reveal_minigame
    #call start_memoria_game (difficulty="Easy")
    call start_memoria_game (difficulty="Medium")
    #call start_memoria_game (difficulty="Hard")
    
    menu:
        "How should I approach this investigation?"
        
        "Start with the crime scene (Study) - Methodical approach":
            $ player_choices.append("started_with_crime_scene")
            $ current_location = "study"
            $ update_player_attributes("courage", 10)
            $ update_player_attributes("intelligence", 5)
            $ investigation_style = "methodical"
            jump investigate_study
        
        "Interview the butler first - Build rapport":
            $ player_choices.append("interviewed_butler_first")
            $ update_player_attributes("empathy", 10)
            $ update_player_attributes("emotional_balance", 5)
            $ investigation_style = "empathetic"
            jump interview_butler
        
        "Interview the staff witnesses - Analytical approach":
            $ player_choices.append("interviewed_staff_first")
            $ update_player_attributes("intelligence", 10)
            $ update_player_attributes("courage", -5)
            $ investigation_style = "methodical"
            jump check_witnesses
        
        "Examine the victim's personal effects - Emotional connection":
            $ player_choices.append("examined_personal_effects")
            $ update_player_attributes("empathy", 5)
            $ update_player_attributes("fear", 5)
            $ investigation_style = "empathetic"
            jump examine_effects
        
        "Chat with suspects - Interactive investigation":
            $ player_choices.append("chat_with_suspects")
            $ update_player_attributes("empathy", 5)
            $ update_player_attributes("intelligence", 3)
            $ investigation_style = "interactive"
            call screen chatbot_screen
            jump continue_investigation

    return

label investigate_study:
    scene bg study_crime_scene video
    play music suspense_music fadein 2.0
    play music crime_ambient volume 0.3 fadein 3.0
    
    play sound get_voice("narrator", 6)
    narrator "The study is eerily quiet. Victoria's body has been removed, but the scene remains preserved."
    stop sound
    play sound get_voice("narrator", 7)
    narrator "The air is thick with the scent of old books and something else... something metallic."
    stop sound
    
    play sound get_voice("detective", 5)
    detective "The study... this is where it happened. Let me examine the area carefully."
    stop sound
    
    menu:
        "What should I examine first?"
        
        "The desk and papers - Look for financial motives":
            $ evidence_collected.append("financial_documents")
            $ update_player_attributes("intelligence", 8)
            $ update_player_attributes("emotional_balance", 3)
            play sound get_voice("detective", 6)
            detective "Interesting... there are several financial documents here. It looks like Victoria was planning to change her will."
            stop sound
            play sound get_voice("detective", 7)
            detective "This could be a motive for murder."
            stop sound
            
        "The wine glass on the table - Check for poisoning":
            $ evidence_collected.append("wine_glass")
            $ update_player_attributes("intelligence", 10)
            $ update_player_attributes("fear", 5)
            play sound get_voice("detective", 8)
            detective "A half-empty wine glass. I should have this tested for poison."
            stop sound
            play sound get_voice("detective", 9)
            detective "The glass has lipstick marks - Victoria's shade."
            stop sound
            play sound get_voice("detective", 10)
            detective "There's a slight residue at the bottom that looks suspicious."
            stop sound
            
        "The fireplace and ashes - Look for destroyed evidence":
            $ evidence_collected.append("burned_papers")
            $ update_player_attributes("intelligence", 6)
            $ update_player_attributes("courage", 5)
            play sound get_voice("detective", 11)
            detective "There are partially burned papers in the fireplace. Someone tried to destroy evidence."
            stop sound
            play sound get_voice("detective", 12)
            detective "I can make out some fragments about a 'secret project'."
            stop sound
            play sound get_voice("detective", 13)
            detective "And something about 'medical records' and 'malpractice'..."
            stop sound
            
        "The window and lock - Check for forced entry":
            $ evidence_collected.append("forced_entry")
            $ update_player_attributes("intelligence", 7)
            $ update_player_attributes("fear", 3)
            play sound get_voice("detective", 14)
            detective "The window lock shows signs of tampering. Someone may have entered or exited this way."
            stop sound
            play sound get_voice("detective", 15)
            detective "But the rain would have made this difficult..."
            stop sound
            play sound get_voice("detective", 16)
            detective "There are muddy footprints leading away from the window."
            stop sound
    
    play sound get_voice("detective", 17)
    detective "Let me look around a bit more..."
    stop sound
    
    menu:
        "What else should I examine?"
        
        "The bookshelf - Look for hidden items":
            $ evidence_collected.append("hidden_diary")
            play sound get_voice("detective", 18)
            detective "Behind some books, I found a small diary. It's not Victoria's main one."
            stop sound
            play sound get_voice("detective", 19)
            detective "This one seems to contain more personal thoughts and fears."
            stop sound
        "The carpet - Look for blood stains":
            $ evidence_collected.append("blood_pattern")
            play sound get_voice("detective", 20)
            detective "There are subtle blood stains on the carpet that suggest a struggle."
            stop sound
            play sound get_voice("detective", 21)
            detective "The pattern indicates Victoria was attacked from behind."
            stop sound
        "The chair - Check for defensive wounds":
            $ evidence_collected.append("defensive_marks")
            play sound get_voice("detective", 22)
            detective "The chair shows signs of a struggle. There are scratch marks on the arms."
            stop sound
            play sound get_voice("detective", 23)
            detective "Victoria must have fought back against her attacker."
            stop sound
        "The clock - Check the timing":
            $ evidence_collected.append("stopped_clock")
            play sound get_voice("detective", 24)
            detective "The clock on the mantel stopped at 9:27 PM."
            stop sound
            play sound get_voice("detective", 25)
            detective "This gives us a more precise time of death."
            stop sound
        "Chat with suspects - Get their perspective":
            call screen chatbot_screen
        "Continue":
            jump continue_investigation

label interview_butler:
    scene bg dining_room video
    play music soft_music fadein 1.0
    play music crime_ambient volume 0.2 fadein 2.0
    
    play sound get_voice("narrator", 8)
    narrator "The butler, Mr. Thompson, sits nervously in the dining room, his hands trembling slightly."
    stop sound
    play sound get_voice("narrator", 9)
    narrator "The grand dining table reflects the dim lighting, creating an atmosphere of quiet tension."
    stop sound
    
    play sound get_voice("detective", 26)
    detective "Mr. Thompson, I need to ask you some questions about last night."
    stop sound
    play sound get_voice("butler", 0)
    butler "Of course, Detective. I'll help in any way I can."
    stop sound
    
    play sound get_voice("detective", 27)
    detective "When did you last see Victoria alive?"
    stop sound
    play sound get_voice("butler", 1)
    butler "Around 8:30 PM. She was in the study, working on some papers. She asked me to bring her a glass of wine."
    stop sound
    
    play sound get_voice("detective", 28)
    detective "And when did you discover the body?"
    stop sound
    play sound get_voice("butler", 2)
    butler "At 9:30 PM, exactly. I went to check if she needed anything else, and... and I found her."
    stop sound
    
    menu:
        "How should I proceed with the questioning?"
        
        "Ask about the wine - Build trust":
            $ update_player_attributes("intelligence", 5)
            $ update_player_attributes("empathy", 3)
            play sound get_voice("detective", 29)
            detective "Tell me about the wine you brought her."
            stop sound
            play sound get_voice("butler", 3)
            butler "It was her usual - a 1942 Bordeaux. I poured it myself from the cellar."
            stop sound
            $ evidence_collected.append("wine_source_confirmed")
            $ update_relationship("Mr. Thompson", 5)
            
        "Ask about other people in the house - Get the full picture":
            $ update_player_attributes("intelligence", 6)
            $ update_player_attributes("emotional_balance", 5)
            play sound get_voice("detective", 30)
            detective "Who else was in the mansion last night?"
            stop sound
            play sound get_voice("butler", 4)
            butler "Well, there was her brother James, her business partner Marcus, her doctor Elena, and her niece Lily."
            stop sound
            $ evidence_collected.append("suspects_present")
            
        "Ask about any arguments - Show concern":
            $ update_player_attributes("empathy", 8)
            $ update_player_attributes("fear", 3)
            play sound get_voice("detective", 31)
            detective "Did you hear any arguments or unusual sounds?"
            stop sound
            play sound get_voice("butler", 5)
            butler "I... I did hear raised voices from the study around 8:45 PM. But I couldn't make out what was being said."
            stop sound
            $ evidence_collected.append("heard_argument")
            $ update_relationship("Mr. Thompson", 3)
            
        "Ask about the will - Direct approach":
            $ update_player_attributes("intelligence", 7)
            $ update_player_attributes("emotional_balance", -2)
            play sound get_voice("detective", 32)
            detective "Did Victoria mention anything about changing her will?"
            stop sound
            play sound get_voice("butler", 6)
            butler "She did mention it to me yesterday. She said she was going to 'set things right' and that some people would be 'very surprised'."
            stop sound
            $ evidence_collected.append("will_changes_mentioned")
    
    if investigation_style == "empathetic":
        play sound get_voice("detective", 33)
        detective "Mr. Thompson, I know this must be difficult for you. Victoria was like family to you, wasn't she?"
        stop sound
        play sound get_voice("butler", 7)
        butler "Yes, Detective. I've served the Blackwood family for thirty years. Victoria was... she was special."
        stop sound
        $ update_relationship("Mr. Thompson", 10)
        $ evidence_collected.append("butler_loyalty")
    
    jump continue_investigation

label check_witnesses:
    scene bg library video
    play music suspense_music fadein 1.0
    play music crime_ambient volume 0.25 fadein 2.0
    
    play sound get_voice("narrator", 10)
    narrator "The library serves as a quiet space for gathering witness testimonies."
    stop sound
    play sound get_voice("narrator", 11)
    narrator "The library's warm lighting provides a comfortable atmosphere for the staff to recall last night's events."
    stop sound
    
    play sound get_voice("detective", 34)
    detective "Let me gather witness testimonies from the staff about last night's events."
    stop sound
    
    play sound get_voice("detective", 35)
    detective "According to the night maid, at 8:30 PM, Victoria entered the study carrying several folders."
    stop sound
    play sound get_voice("detective", 36)
    detective "The maid witnessed the butler bringing wine at 8:35 PM and overheard them exchange a few words."
    stop sound
    play sound get_voice("detective", 37)
    detective "The night guard reports seeing Marcus Reynolds enter the study at 8:40 PM, looking tense."
    stop sound
    play sound get_voice("detective", 38)
    detective "The maid cleaning nearby heard raised voices at 8:45 PM and saw Marcus gesturing animatedly."
    stop sound
    play sound get_voice("detective", 39)
    detective "The guard confirms Marcus left at 8:50 PM, looking agitated and clutching papers."
    stop sound
    play sound get_voice("detective", 40)
    detective "At 8:55 PM, Dr. Elena Rodriguez was seen entering, carrying her medical bag."
    stop sound
    play sound get_voice("detective", 41)
    detective "Elena left at 9:00 PM, appearing calm but thoughtful according to the maid."
    stop sound
    play sound get_voice("detective", 42)
    detective "James Blackwood entered at 9:05 PM, his face showing distress according to the guard."
    stop sound
    play sound get_voice("detective", 43)
    detective "James left at 9:15 PM, seeming upset and wiping his eyes, as witnessed by the maid."
    stop sound
    play sound get_voice("detective", 44)
    detective "Lily Chen entered at 9:20 PM, her movements quick and nervous, as noted by the guard."
    stop sound
    play sound get_voice("detective", 45)
    detective "Lily left quickly at 9:25 PM, almost running, according to multiple staff members."
    stop sound
    play sound get_voice("detective", 46)
    detective "At 9:27 PM, the clock stopped. This must be when the murder occurred."
    stop sound
    play sound get_voice("detective", 47)
    detective "The butler discovered the body at 9:30 PM, as confirmed by his own testimony."
    stop sound
    
    $ evidence_collected.append("witness_testimonies")
    $ evidence_collected.append("precise_timing")
    
    play sound get_voice("detective", 48)
    detective "The witness accounts confirm everyone had access to the study last night. I need to interview them all."
    stop sound
    
    if investigation_style == "methodical":
        play sound get_voice("detective", 49)
        detective "The timing is crucial. Each person was alone with Victoria for several minutes."
        stop sound
        play sound get_voice("detective", 50)
        detective "I need to establish exact alibis and motives."
        stop sound
        $ evidence_collected.append("timeline_analysis")
    
    jump continue_investigation

label examine_effects:
    scene bg bedroom video
    play music soft_music fadein 1.0
    play music crime_ambient volume 0.2 fadein 2.0
    
    play sound get_voice("narrator", 12)
    narrator "Victoria's personal effects might reveal important clues about her state of mind and relationships."
    stop sound
    play sound get_voice("narrator", 13)
    narrator "The bedroom feels more intimate now, as if Victoria's presence still lingers in the air."
    stop sound
    
    play sound get_voice("detective", 51)
    detective "Let me examine Victoria's personal belongings."
    stop sound
    
    menu:
        "What should I examine?"
        
        "Her diary - Understand her emotional state":
            $ evidence_collected.append("victim_diary")
            play sound get_voice("detective", 52)
            detective "Her diary reveals she was planning to expose someone's secrets."
            stop sound
            play sound get_voice("detective", 53)
            detective "She wrote: 'I can't keep quiet anymore. The truth must come out, even if it destroys everything.'"
            stop sound
            play sound get_voice("detective", 54)
            detective "The last entry is from yesterday: 'I'm afraid. But I have to do what's right.'"
            stop sound
            
        "Her phone records - Check recent communications":
            $ evidence_collected.append("phone_records")
            play sound get_voice("detective", 55)
            detective "She made several calls yesterday - to her lawyer, her doctor, and her brother."
            stop sound
            play sound get_voice("detective", 56)
            detective "The last call was to her lawyer at 8:20 PM."
            stop sound
            play sound get_voice("detective", 57)
            detective "There's also a call to a private investigator at 7:45 PM."
            stop sound
            
        "Her financial records - Look for money motives":
            $ evidence_collected.append("financial_records")
            play sound get_voice("detective", 58)
            detective "She was planning to cut several people out of her will."
            stop sound
            play sound get_voice("detective", 59)
            detective "This includes her brother James and her business partner Marcus."
            stop sound
            play sound get_voice("detective", 60)
            detective "But there's also a large donation to a medical ethics foundation."
            stop sound
            
        "Her medical records - Check for health issues":
            $ evidence_collected.append("medical_records")
            play sound get_voice("detective", 61)
            detective "She had a recent appointment with Dr. Rodriguez."
            stop sound
            play sound get_voice("detective", 62)
            detective "The notes mention 'stress-related symptoms' and 'paranoia'."
            stop sound
            play sound get_voice("detective", 63)
            detective "But there's also a note about 'suspicious medication interactions'."
            stop sound
    
    if player_empathy > 60:
        play sound get_voice("detective", 64)
        detective "Let me look at her personal photos..."
        stop sound
        $ evidence_collected.append("family_photos")
        play sound get_voice("detective", 65)
        detective "These photos show a woman who was deeply connected to her family."
        stop sound
        play sound get_voice("detective", 66)
        detective "But there's sadness in her eyes, especially in recent pictures."
        stop sound
    
    jump continue_investigation

label continue_investigation:
    scene bg hallway video
    play music soft_music fadein 1.0
    
    play sound get_voice("narrator", 14)
    narrator "The long hallway stretches before Detective Chen, each door leading to new possibilities."
    stop sound
    
    play sound get_voice("detective", 67)
    detective "I need to gather more evidence before making my final decision."
    stop sound
    
    menu:
        "What should I investigate next?"
        
        "Search for the murder weapon" if "wine_glass" in evidence_collected:
            jump search_weapon
            
        "Check the financial records more thoroughly" if "financial_documents" in evidence_collected:
            jump check_financials
            
        "Review the witness testimonies again" if "witness_testimonies" in evidence_collected:
            jump review_testimonies
            
        "Interview a suspect again":
            jump reinterview_suspect
            
        "Chat with suspects - Interactive questioning":
            call screen chatbot_screen
            
        "Visit the kitchen - Look for additional clues":
            jump investigate_kitchen
            
        "Check the garden - Look for evidence":
            jump investigate_garden

label investigate_kitchen:
    scene bg kitchen video
    play music soft_music fadein 1.0
    play music crime_ambient volume 0.15 fadein 2.0
    
    play sound get_voice("narrator", 15)
    narrator "The kitchen is warm and inviting, a stark contrast to the cold investigation."
    stop sound
    
    play sound get_voice("detective", 68)
    detective "Let me check the kitchen for any clues."
    stop sound
    
    menu:
        "What should I examine?"
        
        "The wine storage - Check inventory":
            $ evidence_collected.append("wine_inventory")
            play sound get_voice("detective", 69)
            detective "The wine inventory shows that a specific bottle is missing."
            stop sound
            play sound get_voice("detective", 70)
            detective "It was a rare 1942 Bordeaux that Victoria kept for special occasions."
            stop sound
            
        "The staff schedule - Check alibis":
            $ evidence_collected.append("staff_alibis")
            play sound get_voice("detective", 71)
            detective "The staff schedule shows that most servants were off duty after 8 PM."
            stop sound
            play sound get_voice("detective", 72)
            detective "Only Mr. Thompson and the night guard were present."
            stop sound
    
    jump continue_investigation

label investigate_garden:
    scene bg garden video
    play music soft_music fadein 1.0
    play music crime_ambient volume 0.15 fadein 2.0
    
    play sound get_voice("narrator", 16)
    narrator "The garden is beautiful even in the rain, with carefully tended flowers and hedges."
    stop sound
    
    play sound get_voice("detective", 73)
    detective "Let me check the garden for any evidence."
    stop sound
    
    menu:
        "What should I examine?"
        
        "The footprints - Look for tracks":
            $ evidence_collected.append("garden_footprints")
            play sound get_voice("detective", 74)
            detective "I found fresh footprints leading from the study window to the garden gate."
            stop sound
            play sound get_voice("detective", 75)
            detective "They match the size and pattern of someone who was in a hurry."
            stop sound
            
        "The garden shed - Look for tools":
            $ evidence_collected.append("garden_tools")
            play sound get_voice("detective", 76)
            detective "The garden shed contains various tools, including pruning shears."
            stop sound
            play sound get_voice("detective", 77)
            detective "One set of shears has been recently cleaned."
            stop sound
            
        "The greenhouse - Look for plants":
            $ evidence_collected.append("poisonous_plants")
            play sound get_voice("detective", 78)
            detective "The greenhouse contains several poisonous plants."
            stop sound
            play sound get_voice("detective", 79)
            detective "Some of them have been recently harvested."
            stop sound
    
    jump continue_investigation

label search_weapon:
    scene bg basement video
    play music tense_music fadein 1.0
    play music crime_ambient volume 0.3 fadein 2.0
    
    play sound get_voice("narrator", 17)
    narrator "The basement contains the wine cellar and storage areas."
    stop sound
    play sound get_voice("narrator", 18)
    narrator "The air is cool and damp, and the sound of dripping water echoes through the stone corridors."
    stop sound
    
    play sound get_voice("detective", 80)
    detective "Let me search for the murder weapon or any other evidence."
    stop sound
    
    menu:
        "Where should I search?"
        
        "The wine cellar - Look for poisoned bottles":
            $ evidence_collected.append("poisoned_bottle")
            play sound get_voice("detective", 81)
            detective "I found a bottle of wine with traces of a rare poison."
            stop sound
            play sound get_voice("detective", 82)
            detective "This matches the wine glass from the study."
            stop sound
            play sound get_voice("detective", 83)
            detective "The bottle is from a vintage that Victoria kept for special occasions."
            stop sound
        "The storage room - Look for weapons":
            $ evidence_collected.append("hidden_weapon")
            play sound get_voice("detective", 84)
            detective "Behind some boxes, I found a letter opener with blood stains."
            stop sound
            play sound get_voice("detective", 85)
            detective "It's been cleaned, but forensics can still detect traces."
            stop sound
            play sound get_voice("detective", 86)
            detective "This matches the wounds on Victoria's body."
            stop sound
        "The utility room - Look for rope or tools":
            $ evidence_collected.append("rope_fibers")
            play sound get_voice("detective", 87)
            detective "I found rope fibers that match the ligature marks on Victoria's neck."
            stop sound
            play sound get_voice("detective", 88)
            detective "Someone used this rope to strangle her."
            stop sound
            play sound get_voice("detective", 89)
            detective "The rope is the same type used for the mansion's curtains."
            stop sound
        "Continue":
            jump final_investigation

label reinterview_suspect:
    scene bg conservatory video
    play music soft_music fadein 1.0
    play music crime_ambient volume 0.2 fadein 2.0
    
    play sound get_voice("narrator", 19)
    narrator "The conservatory provides a more relaxed setting for the reinterviews."
    stop sound
    
    menu:
        "Which suspect should I reinterview?"
        
        "Marcus Reynolds - The business partner":
            jump reinterview_marcus
            
        "Dr. Elena Rodriguez - The doctor":
            jump reinterview_elena
            
        "James Blackwood - The brother":
            jump reinterview_james
            
        "Lily Chen - The niece":
            jump reinterview_lily

label reinterview_marcus:
    scene bg marcus_interview video
    play music crime_ambient volume 0.25 fadein 1.0
    
    play sound get_voice("detective", 90)
    detective "Mr. Reynolds, I need to ask you one more question."
    stop sound
    play sound get_voice("detective", 91)
    detective "About the embezzlement accusation..."
    stop sound
    
    play sound get_voice("suspect1", 0)
    suspect1 "I told you, it's completely false!"
    stop sound
    
    play sound get_voice("detective", 92)
    detective "But I have evidence that suggests otherwise."
    stop sound
    
    play sound get_voice("suspect1", 1)
    suspect1 "You can't prove anything! Victoria was paranoid!"
    stop sound
    
    $ evidence_collected.append("marcus_defensive")
    
    if relationship_with_suspects.get("Marcus Reynolds", 0) > 10:
        play sound get_voice("detective", 93)
        detective "Marcus, I want to help you. If you're innocent, tell me the truth."
        stop sound
        play sound get_voice("suspect1", 2)
        suspect1 "I... I may have made some mistakes with the accounts. But I never meant to hurt anyone."
        stop sound
        $ evidence_collected.append("marcus_confession")
    
    jump final_investigation

label reinterview_elena:
    scene bg hospital video
    play music crime_ambient volume 0.2 fadein 1.0
    
    play sound get_voice("detective", 94)
    detective "Dr. Rodriguez, about Victoria's medication..."
    stop sound
    
    play sound get_voice("suspect2", 0)
    suspect2 "What about it?"
    stop sound
    
    play sound get_voice("detective", 95)
    detective "Did you ever prescribe her anything that could be lethal in high doses?"
    stop sound
    
    play sound get_voice("suspect2", 1)
    suspect2 "I... I may have prescribed sleeping pills. But that's standard practice."
    stop sound
    
    play sound get_voice("detective", 96)
    detective "And did you know she was planning to expose your medical malpractice?"
    stop sound
    
    play sound get_voice("suspect2", 2)
    suspect2 "What? No! That's ridiculous!"
    stop sound
    
    $ evidence_collected.append("elena_secret")
    
    if player_empathy > 60:
        play sound get_voice("detective", 97)
        detective "Dr. Rodriguez, I understand the pressure you must be under."
        stop sound
        play sound get_voice("suspect2", 3)
        suspect2 "You don't understand! Victoria was going to ruin my career!"
        stop sound
        $ evidence_collected.append("elena_motive")
    
    jump final_investigation

label reinterview_james:
    scene bg study_clean video
    play music crime_ambient volume 0.25 fadein 1.0
    
    play sound get_voice("detective", 98)
    detective "Mr. Blackwood, about your gambling debts..."
    stop sound
    
    play sound get_voice("suspect3", 0)
    suspect3 "How did you find out about that?"
    stop sound
    
    play sound get_voice("detective", 99)
    detective "Victoria knew. She was going to cut you out of the will entirely."
    stop sound
    
    play sound get_voice("suspect3", 1)
    suspect3 "She wouldn't do that to me! I'm her brother!"
    stop sound
    
    play sound get_voice("detective", 100)
    detective "But she was going to. And you were desperate."
    stop sound
    
    $ evidence_collected.append("james_desperation")
    
    if player_courage > 60:
        play sound get_voice("detective", 101)
        detective "James, I know you're in trouble. How much do you owe?"
        stop sound
        play sound get_voice("suspect3", 2)
        suspect3 "Fifty thousand dollars. I was going to lose everything!"
        stop sound
        $ evidence_collected.append("james_debts")
    
    jump final_investigation

label reinterview_lily:
    scene bg lawn_lilychen video
    play music crime_ambient volume 0.2 fadein 1.0
    
    play sound get_voice("detective", 102)
    detective "Miss Chen, about your relationship with Victoria..."
    stop sound
    
    play sound get_voice("suspect4", 0)
    suspect4 "What about it?"
    stop sound
    
    play sound get_voice("detective", 103)
    detective "Did you know she was planning to disinherit you?"
    stop sound
    
    play sound get_voice("suspect4", 1)
    suspect4 "She... she told me last night. She said I was a disappointment."
    stop sound
    play sound get_voice("suspect4", 2)
    suspect4 "That I was just like my mother, who she always hated."
    stop sound
    
    play sound get_voice("detective", 104)
    detective "And how did that make you feel?"
    stop sound
    
    play sound get_voice("suspect4", 3)
    suspect4 "I was angry. Very angry. But I would never hurt her!"
    stop sound
    
    $ evidence_collected.append("lily_anger")
    
    if player_empathy > 60:
        play sound get_voice("detective", 105)
        detective "Lily, I can see how much this hurts you."
        stop sound
        play sound get_voice("suspect4", 4)
        suspect4 "She was the only family I had left. And she was going to throw me away like trash!"
        stop sound
        $ evidence_collected.append("lily_emotional")
    
    jump final_investigation

label check_financials:
    scene bg study_clean video
    play music crime_ambient volume 0.25 fadein 1.0
    
    play sound get_voice("detective", 106)
    detective "Let me examine the financial documents more carefully."
    stop sound
    
    if "financial_documents" in evidence_collected:
        play sound get_voice("detective", 107)
        detective "These documents reveal that Victoria was planning to cut everyone out of her will."
        stop sound
        play sound get_voice("detective", 108)
        detective "She was going to leave everything to charity."
        stop sound
        $ evidence_collected.append("charity_bequest")
        
        play sound get_voice("detective", 109)
        detective "This gives everyone a motive for murder."
        stop sound
        
        if player_intelligence > 50:
            play sound get_voice("detective", 110)
            detective "But wait... there's something else here."
            stop sound
            play sound get_voice("detective", 111)
            detective "She was also planning to expose financial irregularities in her business."
            stop sound
            $ evidence_collected.append("financial_irregularities")
    
    jump final_investigation

label review_testimonies:
    scene bg library video
    play music crime_ambient volume 0.25 fadein 1.0
    
    play sound get_voice("detective", 112)
    detective "Let me review the witness testimonies again, more carefully this time."
    stop sound
    play sound get_voice("detective", 113)
    detective "Wait... I notice something I missed before."
    stop sound
    
    if "witness_testimonies" in evidence_collected:
        play sound get_voice("detective", 114)
        detective "The witness testimonies confirm that [true_killer] was the last person to see Victoria alive."
        stop sound
        play sound get_voice("detective", 115)
        detective "And they were alone with her for several minutes according to the staff accounts."
        stop sound
        $ evidence_collected.append("killer_timing")
        
        if investigation_style == "methodical":
            play sound get_voice("detective", 116)
            detective "The timing is crucial. The murder happened between 9:25 and 9:27 PM."
            stop sound
            play sound get_voice("detective", 117)
            detective "That's a very narrow window of opportunity."
            stop sound
    
    jump final_investigation

label final_investigation:
    scene bg study_final video
    play music reveal_music fadein 2.0
    play music crime_ambient volume 0.3 fadein 3.0
    
    play sound get_voice("narrator", 20)
    narrator "Detective Chen has gathered all the evidence. It's time to make her final decision."
    stop sound
    
    play sound get_voice("detective", 118)
    detective "I have all the pieces now. Let me review what I've learned."
    stop sound
    
    if len(evidence_collected) >= 8:
        play sound get_voice("detective", 119)
        detective "I've collected substantial evidence. This should be enough to identify the killer."
        stop sound
        $ player_score += 100
        $ case_complexity = 3
    elif len(evidence_collected) >= 5:
        play sound get_voice("detective", 120)
        detective "I've collected good evidence. This should help identify the killer."
        stop sound
        $ player_score += 50
        $ case_complexity = 2
    else:
        play sound get_voice("detective", 121)
        detective "I wish I had more evidence, but I need to make a decision based on what I have."
        stop sound
        $ case_complexity = 1
    
    if investigation_style == "methodical":
        play sound get_voice("detective", 122)
        detective "My methodical approach has revealed the patterns in this case."
        stop sound
        $ player_intelligence += 10
    elif investigation_style == "empathetic":
        play sound get_voice("detective", 123)
        detective "My empathetic approach has helped me understand the human side of this tragedy."
        stop sound
        $ player_empathy += 10
    
    scene bg storm_intensifies video
    play music dramatic_music fadein 1.0
    
    play sound get_voice("narrator", 21)
    narrator "Outside, the storm intensifies. Lightning illuminates the mansion, casting dramatic shadows."
    stop sound
    
    play sound get_voice("detective", 124)
    detective "Based on my investigation, I believe the killer is..."
    stop sound
    
    menu:
        "Who do I accuse of murder?"
        
        "Marcus Reynolds - The business partner (Financial motive)":
            jump accuse_marcus
            
        "Dr. Elena Rodriguez - The doctor (Professional motive)":
            jump accuse_elena
            
        "James Blackwood - The brother (Family motive)":
            jump accuse_james
            
        "Lily Chen - The niece (Emotional motive)":
            jump accuse_lily

label accuse_marcus:
    play sound get_voice("detective", 125)
    detective "I accuse Marcus Reynolds of murdering Victoria Blackwood."
    stop sound
    
    if true_killer == "Marcus Reynolds":
        jump correct_accusation
    else:
        jump wrong_accusation

label accuse_elena:
    play sound get_voice("detective", 126)
    detective "I accuse Dr. Elena Rodriguez of murdering Victoria Blackwood."
    stop sound
    
    if true_killer == "Dr. Elena Rodriguez":
        jump correct_accusation
    else:
        jump wrong_accusation

label accuse_james:
    play sound get_voice("detective", 127)
    detective "I accuse James Blackwood of murdering Victoria Blackwood."
    stop sound
    
    if true_killer == "James Blackwood":
        jump correct_accusation
    else:
        jump wrong_accusation

label accuse_lily:
    play sound get_voice("detective", 128)
    detective "I accuse Lily Chen of murdering Victoria Blackwood."
    stop sound
    
    if true_killer == "Lily Chen":
        jump correct_accusation
    else:
        jump wrong_accusation

label correct_accusation:
    scene bg study_final video
    play music reveal_music
    play music crime_ambient volume 0.4 fadein 2.0
    
    play sound get_voice("narrator", 22)
    narrator "The evidence supports your accusation. You've solved the case!"
    stop sound
    
    play sound get_voice("detective", 129)
    detective "The evidence clearly points to [true_killer] as the murderer."
    stop sound
    
    if true_killer == "Marcus Reynolds":
        play sound get_voice("detective", 130)
        detective "Marcus killed Victoria because he discovered his embezzlement."
        stop sound
        play sound get_voice("detective", 131)
        detective "He had been stealing from the company for years, and Victoria was about to expose him."
        stop sound
        play sound get_voice("detective", 132)
        detective "The financial documents and his defensive behavior all pointed to his guilt."
        stop sound
        
    elif true_killer == "Dr. Elena Rodriguez":
        play sound get_voice("detective", 133)
        detective "Dr. Rodriguez killed Victoria because Victoria was going to expose her medical malpractice."
        stop sound
        play sound get_voice("detective", 134)
        detective "She had been prescribing dangerous drug combinations and covering up patient deaths."
        stop sound
        play sound get_voice("detective", 135)
        detective "Victoria's medical records and the doctor's secretive behavior revealed the truth."
        stop sound
        
    elif true_killer == "James Blackwood":
        play sound get_voice("detective", 136)
        detective "James killed his sister because he was going to cut him out of her will."
        stop sound
        play sound get_voice("detective", 137)
        detective "His gambling debts had left him desperate, and he saw Victoria's fortune as his only hope."
        stop sound
        play sound get_voice("detective", 138)
        detective "The financial records and his emotional outbursts showed his desperation."
        stop sound
        
    elif true_killer == "Lily Chen":
        play sound get_voice("detective", 139)
        detective "Lily killed her aunt because Victoria was going to disinherit her."
        stop sound
        play sound get_voice("detective", 140)
        detective "The rejection was too much for her to bear, especially after losing her mother."
        stop sound
        play sound get_voice("detective", 141)
        detective "Her emotional instability and the timing of her visit made her the killer."
        stop sound
    
    $ player_score += 200
    $ player_intelligence += 20
    $ player_courage += 15
    $ case_solved = True
    
    play sound get_voice("detective", 142)
    detective "Case closed. Justice has been served."
    stop sound
    
    jump final_results

label wrong_accusation:
    scene bg study_final video
    play music tense_music
    play music crime_ambient volume 0.4 fadein 2.0
    
    play sound get_voice("narrator", 23)
    narrator "The evidence doesn't support your accusation. You've made a terrible mistake."
    stop sound
    
    play sound get_voice("detective", 143)
    detective "I was wrong. The evidence doesn't point to my suspect."
    stop sound
    play sound get_voice("detective", 144)
    detective "The real killer was [true_killer]."
    stop sound
    
    if true_killer == "Marcus Reynolds":
        play sound get_voice("detective", 145)
        detective "Marcus killed Victoria because he discovered his embezzlement."
        stop sound
        play sound get_voice("detective", 146)
        detective "I should have paid more attention to the financial irregularities and his defensive behavior."
        stop sound
        
    elif true_killer == "Dr. Elena Rodriguez":
        play sound get_voice("detective", 147)
        detective "Dr. Rodriguez killed Victoria because she was going to expose her medical malpractice."
        stop sound
        play sound get_voice("detective", 148)
        detective "I missed the clues in the medical records and her secretive behavior."
        stop sound
        
    elif true_killer == "James Blackwood":
        play sound get_voice("detective", 149)
        detective "James killed his sister because he was going to cut him out of her will."
        stop sound
        play sound get_voice("detective", 150)
        detective "I should have recognized the signs of his desperation and gambling addiction."
        stop sound
        
    elif true_killer == "Lily Chen":
        play sound get_voice("detective", 151)
        detective "Lily killed her aunt because she was going to disinherit her."
        stop sound
        play sound get_voice("detective", 152)
        detective "I underestimated the depth of her emotional pain and instability."
        stop sound
    
    $ player_score += 25
    $ player_fear += 20
    $ player_emotional_balance -= 15
    $ case_solved = False
    
    play sound get_voice("detective", 153)
    detective "I failed to solve this case properly. An innocent person may go to prison."
    stop sound
    
    jump final_results

label final_results:
    scene bg dawn_breaks video
    play music reveal_music fadein 2.0
    
    play sound get_voice("narrator", 24)
    narrator "As dawn breaks over Blackwood Manor, the case reaches its conclusion."
    stop sound
    
    $ final_score = player_score + (player_intelligence * 2) + (player_emotional_balance * 0.5) + (player_empathy * 0.5) + (player_courage * 1.5) - (player_fear * 0.3)
    
    if investigation_style == "methodical":
        $ final_score += 50
    elif investigation_style == "empathetic":
        $ final_score += 40
    
    $ final_score += case_complexity * 25
    
    if final_score >= 500:
        $ detective_rating = "Master Detective"
    elif final_score >= 400:
        $ detective_rating = "Skilled Investigator"
    elif final_score >= 300:
        $ detective_rating = "Competent Detective"
    elif final_score >= 200:
        $ detective_rating = "Novice Investigator"
    else:
        $ detective_rating = "Amateur Detective"
    
    play sound get_voice("detective", 154)
    detective "The investigation is complete. Let me review my performance..."
    stop sound
    
    # Display the investigation report table
    call screen investigation_report_table
    
    play sound get_voice("detective", 155)
    detective "Investigation complete. I am [detective_rating]."
    stop sound
    
    return

# Investigation report screen and styles moved to investigation_report.rpy

# ============================================================================
# VOICE COMMAND HANDLERS
# ============================================================================

label examine_desk:
    play sound get_voice("detective", 200)
    detective "Let me examine the desk and papers more carefully..."
    stop sound
    $ evidence_collected.append("detailed_desk_examination")
    $ update_player_attributes("intelligence", 5)
    return

label examine_wine:
    play sound get_voice("detective", 201)
    detective "I'll take a closer look at this wine glass..."
    stop sound
    $ evidence_collected.append("detailed_wine_examination")
    $ update_player_attributes("intelligence", 7)
    return

label examine_fireplace:
    play sound get_voice("detective", 202)
    detective "Let me examine the fireplace and ashes more thoroughly..."
    stop sound
    $ evidence_collected.append("detailed_fireplace_examination")
    $ update_player_attributes("intelligence", 6)
    return

label examine_window:
    play sound get_voice("detective", 203)
    detective "I need to check this window for signs of forced entry..."
    stop sound
    $ evidence_collected.append("detailed_window_examination")
    $ update_player_attributes("intelligence", 4)
    return

label go_to_study:
    play sound get_voice("detective", 204)
    detective "I'll head to the study to investigate further..."
    stop sound
    $ current_location = "study"
    jump investigate_study

label go_to_kitchen:
    play sound get_voice("detective", 205)
    detective "Let me check the kitchen for additional clues..."
    stop sound
    $ current_location = "kitchen"
    jump investigate_kitchen

label go_to_garden:
    play sound get_voice("detective", 206)
    detective "I'll examine the garden for evidence..."
    stop sound
    $ current_location = "garden"
    jump investigate_garden

label go_to_basement:
    play sound get_voice("detective", 207)
    detective "Let me search the basement for the murder weapon..."
    stop sound
    $ current_location = "basement"
    jump search_weapon

label voice_interview_butler:
    play sound get_voice("detective", 208)
    detective "I need to ask the butler some more questions..."
    stop sound
    jump interview_butler

label voice_interview_marcus:
    play sound get_voice("detective", 209)
    detective "Let me reinterview Marcus Reynolds..."
    stop sound
    jump reinterview_marcus

label voice_interview_elena:
    play sound get_voice("detective", 210)
    detective "I'll speak with Dr. Rodriguez again..."
    stop sound
    jump reinterview_elena

label voice_interview_james:
    play sound get_voice("detective", 211)
    detective "Let me talk to James Blackwood once more..."
    stop sound
    jump reinterview_james

label voice_interview_lily:
    play sound get_voice("detective", 212)
    detective "I need to reinterview Lily Chen..."
    stop sound
    jump reinterview_lily

label save_game:
    play sound get_voice("detective", 213)
    detective "I'll save my progress..."
    stop sound
    $ renpy.call_screen("save")
    return

label load_game:
    play sound get_voice("detective", 214)
    detective "Let me load a previous save..."
    stop sound
    $ renpy.call_screen("load")
    return

label show_menu:
    play sound get_voice("detective", 215)
    detective "Opening the game menu..."
    stop sound
    $ renpy.call_screen("game_menu")
    return

label show_help:
    play sound get_voice("detective", 216)
    detective "Let me show you the help information..."
    stop sound
    $ renpy.call_screen("help")
    return

