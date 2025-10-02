# 📚 Story Configuration Guide

## 🌍 World Building

### File: `lib/worldConfig.ts`

This file contains all the world-building elements for your mystery:

#### **Setting Information**
- **Location**: Where the story takes place
- **Time Period**: When the story occurs
- **Atmosphere**: The mood and feeling of the world
- **Description**: Detailed description of the main location

#### **Locations**
Define key locations where clues can be found:
- **Study**: James's workspace
- **Office**: Business meeting area
- **Library**: Dr. Rodriguez's space
- **Art Studio**: Lily's creative area
- **Kitchen**: Butler's domain

Each location should include:
- Name and description
- Significance to the story
- Potential clues that can be found there

#### **Timeline of Events**
Create a chronological list of what happened:
```typescript
timeline: {
  'three_days_ago': 'Victoria was seen arguing with Marcus',
  'two_days_ago': 'Victoria cancelled all appointments',
  'yesterday_evening': 'Victoria was last seen alive',
  'this_morning': 'Victoria\'s body was discovered'
}
```

---

## 🔍 Investigation Elements

### **Clues by Category**

#### Physical Clues
- Items found at the scene
- Physical evidence
- Objects that tell a story

#### Digital Clues
- Electronic evidence
- Computer/phone data
- Security system information

#### Testimonial Clues
- Witness statements
- What people saw or heard
- Behavioral observations

### **Red Herrings**
False leads that misdirect the investigation:
- Suspicious characters who are innocent
- Clues that lead nowhere
- Misleading evidence

---

## ❓ Key Questions

### Essential Questions for the Detective:
1. **Alibi Questions**: Where was everyone during the critical time?
2. **Motive Questions**: Who had reason to harm Victoria?
3. **Opportunity Questions**: Who had access and means?
4. **Character Questions**: What secrets are people hiding?

### Example Questions to Add:
```typescript
keyQuestions: [
  'Where was everyone between 8 PM and midnight?',
  'Who had access to Victoria\'s medication?',
  'What was the nature of the business argument?',
  'Why were the security cameras offline?',
  'Who benefits most from Victoria\'s death?',
  'What secrets was Victoria hiding?'
]
```

---

## 🎭 Story Themes

### Primary Themes
- **Family secrets and betrayal**
- **Greed and ambition**
- **Love and loss**
- **Suspicion and mistrust**

### How to Use Themes:
- Guide character motivations
- Shape the overall atmosphere
- Influence dialogue and responses
- Create emotional depth

---

## 🏢 Business Information

### Company Details
- **Name**: Blackwood Enterprises
- **Current Value**: Financial status
- **Assets**: What the company owns
- **Problems**: Financial difficulties

### Financial Troubles
Create realistic business problems:
- Declining revenues
- Failed investments
- Legal issues
- Tax problems

---

## 👥 Character Motivations

### Understanding Why Characters Act
Each character should have clear motivations:

```typescript
characterMotivations: {
  'james-blackwood': 'Wants to save the family business',
  'marcus-reynolds': 'Seeking control of the company',
  'elena-rodriguez': 'Protecting family medical secrets',
  'lily-chen': 'Desperate for family approval',
  'thompson-butler': 'Loyal but knows more than he reveals'
}
```

---

## 📝 How to Update Story Elements

### 1. **Add New Locations**
1. Open `lib/worldConfig.ts`
2. Add new location to the `locations` object
3. Include name, description, significance, and clues
4. Update character responses to reference the location

### 2. **Modify Timeline**
1. Open `lib/worldConfig.ts`
2. Update the `timeline` object
3. Add new events or modify existing ones
4. Ensure timeline makes logical sense

### 3. **Add Investigation Clues**
1. Open `lib/worldConfig.ts`
2. Add clues to the appropriate category
3. Make sure clues are relevant to the story
4. Balance clues across all categories

### 4. **Update Business Information**
1. Open `lib/worldConfig.ts`
2. Modify `businessInfo` section
3. Add realistic financial details
4. Create believable business problems

---

## 🎯 Story Development Tips

### 1. **Keep It Believable**
- Make motives realistic
- Ensure timeline makes sense
- Create logical connections between events

### 2. **Balance Information**
- Don't reveal everything too quickly
- Spread clues across multiple characters
- Create mystery and suspense

### 3. **Character Consistency**
- Ensure motivations align with actions
- Keep personality traits consistent
- Make relationships realistic

### 4. **Progressive Revelation**
- Start with basic information
- Reveal deeper secrets gradually
- Build tension through discovery

---

## 🔄 Testing Your Story

### 1. **Character Conversations**
- Test how characters respond to questions
- Ensure they reveal information appropriately
- Check that secrets are protected until trust is built

### 2. **Story Logic**
- Verify timeline makes sense
- Check that clues lead somewhere
- Ensure red herrings don't confuse the main plot

### 3. **Player Experience**
- Test the investigation flow
- Ensure enough information is available
- Check that the mystery is solvable

---

## 📖 Example Story Updates

### Adding a New Suspect Location:
```typescript
'greenhouse': {
  name: 'Family Greenhouse',
  description: 'A glass structure filled with exotic plants and flowers',
  significance: 'Victoria\'s private sanctuary where she grew rare orchids',
  clues: ['Poisonous plant cuttings', 'Gardening journal', 'Soil samples']
}
```

### Adding Timeline Events:
```typescript
'timeline': {
  'one_week_ago': 'Victoria received threatening phone calls',
  'five_days_ago': 'Victoria changed her will',
  'three_days_ago': 'Victoria was seen arguing with Marcus',
  'two_days_ago': 'Victoria cancelled all appointments',
  'yesterday_evening': 'Victoria was last seen alive at 8 PM',
  'this_morning': 'Victoria\'s body was discovered at 7 AM'
}
```

### Adding New Clues:
```typescript
investigationClues: {
  physical: [
    'Broken vase in the hallway',
    'Muddy footprints near the back door',
    'Victoria\'s jewelry box left open',
    'Wine glass with lipstick on the rim',
    'Poisonous plant cuttings in the greenhouse'  // New clue
  ]
}
```

---

## 🚀 Quick Start Checklist

- [ ] Update character backstories in `lib/characters.ts`
- [ ] Modify world setting in `lib/worldConfig.ts`
- [ ] Add new locations and clues
- [ ] Update timeline of events
- [ ] Define character motivations
- [ ] Test conversations with updated characters
- [ ] Verify story logic and flow
- [ ] Deploy and test the complete experience

Remember: You can always iterate and improve your story. Start with the basics and build complexity over time!


