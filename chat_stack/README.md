# Blackwood Manor - Interactive Chatbot Investigation

An immersive interactive chatbot system for the Blackwood Manor murder mystery, featuring persistent memory, sleek UI, and character-driven conversations.

## Features

### 🎭 Character-Driven Conversations
- **5 Unique Characters**: Each with distinct personalities, secrets, and motivations
- **Persistent Memory**: Characters remember previous conversations and build relationships
- **Emotional Responses**: Dynamic emotional states based on conversation context
- **All Characters Available**: No locking mechanism - investigate anyone immediately

### 🔍 Investigation System
- **Evidence Collection**: Track clues and evidence discovered during conversations
- **Relationship Tracking**: Monitor trust levels and relationship scores with each character
- **Investigation Notes**: Add personal notes and insights
- **Progress Tracking**: Visual progress indicators and case status

### 🎨 Modern UI/UX
- **Sleek Design**: Modern, dark theme with smooth animations
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Interactive Elements**: Smooth transitions and hover effects
- **Accessibility**: Keyboard navigation and screen reader support

### 🧠 AI-Powered Intelligence
- **Claude Sonnet 4 Integration**: Advanced AI for natural character responses
- **Context Awareness**: Characters respond based on investigation progress
- **Memory Persistence**: Conversations build on previous interactions
- **Emotional Intelligence**: Characters show appropriate emotional responses

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand with persistence
- **AI Integration**: Claude Sonnet 4 API
- **Icons**: Lucide React

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat_stack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=your_api_endpoint_here
   NEXT_PUBLIC_BEARER_TOKEN=your_bearer_token_here
   ```
   
   **⚠️ Security Note**: Never commit your actual API credentials to version control. Keep your `.env.local` file in `.gitignore` and use placeholder values in documentation.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### Starting an Investigation
1. **Select a Character**: Choose from available suspects to interview
2. **Ask Questions**: Type questions to learn about the case
3. **Build Relationships**: Gain trust to unlock more information
4. **Collect Evidence**: Discover clues through conversation
5. **Track Progress**: Monitor your investigation in the panel

### Character Profiles

#### James Blackwood - The Desperate Brother
- **Personality**: Defensive, manipulative, self-pitying
- **Motivation**: Financial desperation, gambling debts
- **Secrets**: Embezzlement, loan shark threats
- **Availability**: 20% progress

#### Marcus Reynolds - The Business Partner
- **Personality**: Professional, calculating, charming
- **Motivation**: Career protection, financial crimes
- **Secrets**: Embezzlement scheme, missing funds
- **Availability**: 40% progress

#### Dr. Elena Rodriguez - The Family Doctor
- **Personality**: Compassionate, intelligent, secretive
- **Motivation**: Medical reputation, malpractice cover-up
- **Secrets**: Patient deaths, medical errors
- **Availability**: 60% progress

#### Lily Chen - The Emotional Niece
- **Personality**: Emotional, artistic, vulnerable
- **Motivation**: Financial dependence, family rejection
- **Secrets**: Mental health struggles, inheritance loss
- **Availability**: 80% progress

#### Mr. Thompson - The Loyal Butler
- **Personality**: Loyal, observant, discreet
- **Motivation**: Family protection, loyalty
- **Secrets**: Family knowledge, witness to events
- **Availability**: 0% progress (immediate)

#### Victoria Blackwood - The Victim
- **Status**: Murder victim (not selectable)
- **Information**: Available in investigation panel
- **Secrets**: Family betrayals, business irregularities
- **Role**: Central to the mystery, referenced by all characters

### Investigation Features

#### Evidence Collection
- Automatically detects potential evidence in conversations
- Tracks all discovered clues and information
- Provides context for evidence relevance

#### Relationship Management
- Build trust with characters through conversation
- Monitor relationship scores and trust levels
- Unlock more information as relationships improve

#### Progress Tracking
- Visual progress indicators
- Investigation milestones
- Character availability based on progress

#### Note-Taking System
- Add personal investigation notes
- Track insights and theories
- Organize information for case solving

## API Integration

The system integrates with Claude Sonnet 4 for intelligent character responses:

```typescript
// Example API call
const response = await ClaudeAPI.generateCharacterResponse(
  character,
  userMessage,
  conversationHistory,
  context
);
```

### Character Response Generation
- **System Prompts**: Detailed character personas and context
- **Message History**: Previous conversation context
- **Emotional State**: Current character emotional state
- **Trust Level**: Relationship and trust indicators

## Customization

### Adding New Characters
1. Add character data to `lib/characters.ts`
2. Update character types in `lib/types.ts`
3. Add character-specific styling in `tailwind.config.js`

### Modifying Character Behavior
1. Update response patterns in character data
2. Adjust emotional triggers and information sharing
3. Modify system prompts in `lib/api.ts`

### UI Customization
1. Update color schemes in `tailwind.config.js`
2. Modify component styles in `components/`
3. Adjust animations in `framer-motion` components

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
1. Build the project: `npm run build`
2. Start production server: `npm start`
3. Deploy the `out` directory to your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This is a Hackathon 2025 project by Suresh Pydikondala.

## Security Best Practices

### 🔒 Protecting Your API Credentials

- **Never commit `.env.local`** to version control
- **Use placeholder values** in documentation and example files
- **Rotate API keys** regularly
- **Use environment-specific** configurations for different deployments
- **Monitor API usage** for unauthorized access

### 🛡️ Environment Variables

Always use environment variables for sensitive data:
```bash
# ✅ Good - Use environment variables
NEXT_PUBLIC_API_URL=${API_URL}
NEXT_PUBLIC_BEARER_TOKEN=${API_TOKEN}

# ❌ Bad - Hardcoded credentials
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_BEARER_TOKEN=actual_token_here
```

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common issues

## Acknowledgments

- Character designs based on the Blackwood Manor murder mystery
- UI inspiration from modern chat applications
- AI integration powered by Claude Sonnet 4
- Built with Next.js and React ecosystem
