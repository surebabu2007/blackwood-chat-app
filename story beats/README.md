# Murder Mystery Game - Character Documentation

## Overview
This repository contains comprehensive character profiles, location documentation, and technical implementation guides for a murder mystery game featuring interactive chatbots. Each character has been designed with detailed backstories, motivations, weaknesses, and relationships that create an immersive and engaging experience.

## Project Structure

```
story beats/
├── characters/           # Individual character profiles
│   ├── james_blackwood.md
│   ├── marcus_reynolds.md
│   ├── dr_elena_rodriguez.md
│   ├── lily_chen.md
│   └── victoria_blackwood.md
├── locations/            # Location documentation
│   └── locations_guide.md
├── relationships/        # Relationship mapping
│   └── relationship_map.md
├── technical/           # Technical implementation
│   └── chatbot_implementation_guide.md
├── script.rpy          # Original game script
└── README.md           # This file
```

## Character Profiles

### 1. James Blackwood (Brother)
- **Age**: 42
- **Occupation**: Former Investment Banker
- **Motivation**: Financial desperation, gambling debts
- **Key Traits**: Desperate, manipulative, charming when needed
- **Secrets**: Embezzlement, loan shark threats, planned fake death

### 2. Marcus Reynolds (Business Partner)
- **Age**: 38
- **Occupation**: CFO at Blackwood Enterprises
- **Motivation**: Cover up embezzlement, protect reputation
- **Key Traits**: Ambitious, calculating, professional
- **Secrets**: Stole $150,000, planned to flee country

### 3. Dr. Elena Rodriguez (Family Doctor)
- **Age**: 45
- **Occupation**: Family Physician
- **Motivation**: Cover up medical malpractice, protect career
- **Key Traits**: Compassionate, secretive, guilt-ridden
- **Secrets**: Covered up patient deaths, medical malpractice

### 4. Lily Chen (Niece)
- **Age**: 19
- **Occupation**: Art Student
- **Motivation**: Financial desperation, need for approval
- **Key Traits**: Emotional, artistic, vulnerable
- **Secrets**: Stealing money, planned to run away

### 5. Victoria Blackwood (Victim)
- **Age**: 47
- **Occupation**: Art Collector, Business Owner
- **Motivation**: Expose corruption, justice
- **Key Traits**: Intelligent, controlling, secretive
- **Secrets**: Terminal illness, planned will changes

## Location Guide

### Primary Locations
- **Study**: Crime scene, primary investigation area
- **Library**: Witness testimonies, analysis
- **Dining Room**: Butler interviews, family dinners
- **Kitchen**: Staff information, wine storage
- **Garden**: Escape route, environmental evidence
- **Basement**: Weapon storage, additional evidence
- **Bedroom**: Personal effects, victim's private space

### Atmospheric Elements
- **Weather**: Stormy night, rain, lightning
- **Lighting**: Dim, dramatic, natural
- **Sound**: Rain, music, silence
- **Mood**: Tension, mystery, foreboding

## Relationship Dynamics

### Family Relationships
- **Victoria & James**: Sibling rivalry, financial dependence
- **Victoria & Lily**: Mother-daughter surrogate relationship
- **James & Lily**: Complicated father-daughter relationship

### Professional Relationships
- **Victoria & Marcus**: Business partnership, friendship
- **Victoria & Elena**: Doctor-patient, friendship
- **All characters**: Interconnected through Victoria

### Financial Dependencies
- **Victoria**: Source of all money
- **Everyone**: Financially dependent on Victoria
- **Control**: Victoria used money to control behavior

## Technical Implementation

### Chatbot Features
- **Character-Specific Personalities**: Each chatbot has unique traits
- **Emotional State Management**: Dynamic emotional responses
- **Secret Revelation System**: Gradual information disclosure
- **Relationship Dynamics**: Context-aware conversations
- **Memory System**: Conversation history tracking

### API Integration
- **Claude Sonnet 4**: Primary language model
- **Character Profiles**: JSON-based configuration
- **Response Processing**: Post-processing for authenticity
- **Performance Monitoring**: Usage tracking and optimization

## Usage Instructions

### For Game Developers
1. **Character Integration**: Use character profiles to create authentic NPCs
2. **Location Design**: Reference location guide for atmospheric details
3. **Relationship Mapping**: Use relationship data for character interactions
4. **Technical Implementation**: Follow chatbot guide for API integration

### For Chatbot Developers
1. **Character Setup**: Load character profiles into chatbot system
2. **API Configuration**: Set up Claude Sonnet 4 integration
3. **Response Processing**: Implement character-specific response handling
4. **Testing**: Validate character authenticity and consistency

## Character Development Notes

### Personality Consistency
- Each character maintains consistent voice and behavior
- Emotional responses match character traits
- Speech patterns reflect background and education
- Secrets revealed gradually based on trust and context

### Dynamic Interactions
- Characters respond to user's approach and emotional state
- Relationships evolve based on conversation history
- Information disclosure depends on trust level
- Emotional states change based on interactions

### Immersive Experience
- Characters feel authentic and human-like
- Conversations flow naturally and engagingly
- Mystery elements maintained throughout interactions
- Player choices affect character responses and relationships

## Technical Requirements

### API Requirements
- **Claude Sonnet 4 API**: Primary language model
- **Python 3.8+**: Backend implementation
- **JSON**: Character profile storage
- **Rate Limiting**: API usage management

### Performance Considerations
- **Response Time**: Optimize for real-time conversations
- **Memory Usage**: Efficient conversation history management
- **Cost Management**: Monitor API usage and costs
- **Scalability**: Handle multiple concurrent conversations

## Future Enhancements

### Planned Features
- **Voice Integration**: Text-to-speech for character voices
- **Visual Elements**: Character avatars and expressions
- **Multiplayer Support**: Multiple players interacting with characters
- **Advanced AI**: More sophisticated emotional modeling

### Character Expansion
- **Additional Characters**: More family members and staff
- **Backstory Development**: Deeper character histories
- **Relationship Complexity**: More intricate relationship dynamics
- **Moral Ambiguity**: Grayer character motivations

## Contributing

### Character Development
- Maintain consistency with established character profiles
- Follow the established format for character documentation
- Ensure all relationships and motivations are logical
- Test character authenticity through conversation

### Technical Improvements
- Optimize API usage and response times
- Improve character response quality
- Add new features and capabilities
- Maintain code quality and documentation

## License

This project is for educational and entertainment purposes. All character profiles and story elements are original creations based on the provided game script.

## Support

For questions or issues with character implementation or chatbot development, please refer to the technical documentation or contact the development team.

---

**Note**: This documentation is designed to be modular and easy to understand. Each character profile can be used independently to create authentic chatbot experiences that enhance the murder mystery game's immersion and engagement.
