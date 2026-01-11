# NEURON Math Learning Assistant - Project Documentation

## 📚 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Component Documentation](#component-documentation)
4. [API Documentation](#api-documentation)
5. [AI Integration](#ai-integration)
6. [Data Flow](#data-flow)
7. [Development Guide](#development-guide)

---

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    NEURON Frontend                      │
│                   (React + Vite)                        │
│                   Port: 3000                            │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/SSE
                     │
┌────────────────────▼────────────────────────────────────┐
│                 Express Backend                         │
│                   Port: 5000                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │        Question Generator Service               │  │
│  │                                                  │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────┐  │  │
│  │  │  OpenAI    │→ │   Ollama   │→ │ Fallback │  │  │
│  │  │  (Primary) │  │ (Secondary)│  │ (Backup) │  │  │
│  │  └────────────┘  └────────────┘  └──────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend Layer:**
- **React 18.3.1**: UI library with hooks
- **TypeScript**: Type safety
- **Vite 6.3.5**: Fast build tool and dev server
- **Tailwind CSS 4.1.12**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library

**Backend Layer:**
- **Node.js + Express**: REST API server
- **Server-Sent Events**: Progressive question streaming
- **Axios**: HTTP client for AI services
- **CORS**: Cross-origin support

**AI Services:**
- **OpenAI GPT-4o-mini**: Primary question generator
- **Ollama (llama3)**: Secondary generator
- **Fallback System**: Hardcoded questions

---

## 📁 Project Structure

```
D:\ivf\
├── src/
│   ├── main.tsx                      # React entry point
│   ├── app/
│   │   ├── App.tsx                   # Main app component
│   │   └── components/
│   │       ├── grade-selector.tsx    # Grade 11/12 selection
│   │       ├── topic-selector.tsx    # Topic selection screen
│   │       ├── difficulty-selector.tsx # Easy/Medium/Hard
│   │       ├── study-session.tsx     # Main quiz interface
│   │       ├── results-screen.tsx    # Score & statistics
│   │       └── ui/                   # Reusable UI components
│   │           ├── button.tsx
│   │           ├── card.tsx
│   │           ├── progress.tsx
│   │           └── ... (40+ components)
│   ├── services/
│   │   └── api.ts                    # API client with SSE support
│   └── styles/
│       ├── index.css                 # Global styles
│       ├── tailwind.css              # Tailwind imports
│       ├── theme.css                 # CSS variables
│       └── fonts.css                 # Font definitions
│
├── server/
│   ├── server.js                     # Express server + routes
│   ├── questionGenerator.js          # AI question generator
│   ├── fallbackQuestionGenerator.js  # Hardcoded questions
│   ├── .env                          # Environment variables
│   └── package.json                  # Server dependencies
│
├── index.html                        # HTML template
├── vite.config.ts                    # Vite configuration
├── package.json                      # Root dependencies
└── postcss.config.mjs                # PostCSS config (minimal)
```

---

## 🧩 Component Documentation

### Frontend Components

#### 1. **App.tsx** (Main Container)
**Purpose:** Root component managing application state and routing

**State Management:**
```typescript
const [screen, setScreen] = useState<Screen>('grade');
const [selectedGrade, setSelectedGrade] = useState<'grade11' | 'grade12'>('grade11');
const [selectedTopic, setSelectedTopic] = useState<string>('');
const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
const [sessionResults, setSessionResults] = useState<SessionResults>();
```

**Screen Flow:**
```
grade → topic → difficulty → session → results
  ↑                             ↓
  └─────────────────────────────┘
```

**Props Passed:**
- Grade selector: `onSelectGrade`
- Topic selector: `grade`, `onSelectTopic`, `onBack`
- Difficulty: `topic`, `onSelectDifficulty`, `onBack`
- Session: `topic`, `difficulty`, `grade`, `onComplete`, `onExit`
- Results: `score`, `total`, `topic`, `difficulty`, `timeSpent`, `onRestart`, `onNewTopic`

---

#### 2. **GradeSelector.tsx**
**Purpose:** Initial screen for selecting Grade 11 or 12

**Features:**
- Visual cards with gradient backgrounds
- Color coding (viridian for G11, rose for G12)
- Topic preview lists
- Animated hover effects

**Props:**
```typescript
type GradeSelectorProps = {
  onSelectGrade: (grade: 'grade11' | 'grade12') => void;
};
```

**Topics Displayed:**
- **Grade 11:** Conic Sections, Functions & Relations, Limits & Derivatives
- **Grade 12:** Integration Techniques, Area Under Curves, Volume of Revolution

---

#### 3. **TopicSelector.tsx**
**Purpose:** Display available topics for selected grade

**Features:**
- Dynamic topic loading based on grade
- Icon-based visual representation
- Grid layout (3 columns on desktop)
- Back navigation to grade selection

**Props:**
```typescript
type TopicSelectorProps = {
  grade: 'grade11' | 'grade12';
  onSelectTopic: (topic: string) => void;
  onBack: () => void;
};
```

**Grade 11 Topics:**
1. Conic Sections (Circles, Ellipses, Parabolas, Hyperbolas)
2. Domain and Range
3. Relations and Functions
4. Functions
5. Limits
6. Derivatives

**Grade 12 Topics:**
1. Indefinite Integrals
2. Definite Integrals
3. Integration by Substitution
4. Integration by Parts
5. Area Under Curve
6. Volume of Revolution

---

#### 4. **DifficultySelector.tsx**
**Purpose:** Choose question difficulty level

**Features:**
- Three difficulty cards with color coding
- Characteristics of each level explained
- Direct transition to study session

**Props:**
```typescript
type DifficultySelectorProps = {
  topic: string;
  onSelectDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onBack: () => void;
};
```

**Difficulty Levels:**
- **Easy** (Green): Smaller numbers, simple problems, build confidence
- **Medium** (Yellow): Moderate difficulty, mixed problems, improve skills
- **Hard** (Red): Complex problems, large numbers, expert practice

---

#### 5. **StudySession.tsx** (Core Component)
**Purpose:** Main quiz interface with progressive question loading

**Key Features:**
- **Progressive Loading**: Questions stream via SSE as they're generated
- **Smart Timer**: Only counts active solving time (pauses during generation/feedback)
- **Real-time Feedback**: Immediate correctness indication
- **Visual Progress**: Progress bar showing completion
- **Answer Highlighting**: Correct answer in green, wrong in red
- **Detailed Explanations**: Shows reasoning for each answer

**State Management:**
```typescript
const [problems, setProblems] = useState<MathProblem[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [userAnswer, setUserAnswer] = useState('');
const [score, setScore] = useState(0);
const [showFeedback, setShowFeedback] = useState(false);
const [isCorrect, setIsCorrect] = useState(false);
const [timeSpent, setTimeSpent] = useState(0);
const [timerActive, setTimerActive] = useState(false);
const [loading, setLoading] = useState(true);
const [questionsReceived, setQuestionsReceived] = useState(0);
const [allQuestionsLoaded, setAllQuestionsLoaded] = useState(false);
```

**Timer Logic:**
```typescript
// Timer starts when first question loads
if (index === 0 && loading) {
  setLoading(false);
  setTimerActive(true);
}

// Timer pauses when answer submitted
setTimerActive(false);

// Timer resumes when next question ready
setTimerActive(true);
```

**Progressive Loading Flow:**
```
1. User selects topic/difficulty
2. Backend starts generating questions
3. First question arrives → UI shows, timer starts
4. Questions continue generating in background
5. User answers → timer pauses, feedback shows
6. Next question ready → timer resumes
7. Repeat until all 10 questions answered
```

---

#### 6. **ResultsScreen.tsx**
**Purpose:** Display session results and statistics

**Features:**
- Score percentage with grade calculation
- Performance metrics (time, accuracy)
- Motivational messages based on score
- Options to retry or choose new topic
- Study tips for scores below 80%

**Props:**
```typescript
type ResultsScreenProps = {
  score: number;
  total: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeSpent: number;
  onRestart: () => void;
  onNewTopic: () => void;
};
```

**Grade Calculation:**
- A: 90-100%
- B: 80-89%
- C: 70-79%
- D: 60-69%
- F: Below 60%

**Metrics Displayed:**
- Total score (correct/total)
- Percentage and letter grade
- Total time spent
- Average time per question
- Topic and difficulty completed

---

### Services

#### 7. **api.ts** (API Client)
**Purpose:** Frontend service for backend communication

**Key Functions:**

**Progressive Question Fetching:**
```typescript
async function fetchQuestionsProgressive(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard',
  grade: number,
  onQuestion: (question: Question, index: number) => void,
  onComplete: (total: number) => void,
  onError: (error: Error) => void,
  signal?: AbortSignal
): Promise<void>
```

**Features:**
- Server-Sent Events (SSE) for streaming
- Abort signal support for cleanup
- Progressive question arrival handling
- Error handling and recovery

**Other Functions:**
- `fetchQuestions()`: Batch fetch (legacy)
- `fetchTopics()`: Get available topics
- `fetchSymbols()`: Math symbols library
- `checkHealth()`: Backend health check

---

## 🔌 API Documentation

### Backend Endpoints

#### 1. **GET /api/questions/stream**
**Purpose:** Stream questions progressively using Server-Sent Events

**Query Parameters:**
```typescript
{
  topic: string;      // e.g., "Limits"
  difficulty: string; // "easy" | "medium" | "hard"
  grade: number;      // 11 or 12
  count?: number;     // Default: 10
}
```

**Response Format (SSE):**
```javascript
// Question event
data: {
  "type": "question",
  "data": {
    "id": "Limits-easy-1234",
    "question": "Evaluate: lim(x→2) (x² - 4)/(x - 2)",
    "options": {
      "A": "4",
      "B": "2",
      "C": "0",
      "D": "undefined"
    },
    "answer": "A",
    "explanation": "Factor numerator: (x-2)(x+2)/(x-2) = x+2, so limit is 2+2 = 4",
    "topic": "Limits",
    "difficulty": "easy",
    "grade": 11
  },
  "index": 0
}

// Completion event
data: {
  "type": "complete",
  "total": 10
}

// Error event
data: {
  "type": "error",
  "error": "Error message"
}
```

**Example Usage:**
```bash
curl "http://localhost:5000/api/questions/stream?topic=Limits&difficulty=easy&grade=11&count=10"
```

---

#### 2. **GET /api/questions**
**Purpose:** Get all questions at once (batch mode)

**Query Parameters:** Same as `/stream`

**Response:**
```json
{
  "success": true,
  "questions": [
    {
      "id": "...",
      "question": "...",
      "options": { ... },
      "answer": "A",
      "explanation": "...",
      "topic": "...",
      "difficulty": "...",
      "grade": 11
    }
  ]
}
```

---

#### 3. **GET /api/topics**
**Purpose:** Get available topics for a grade

**Query Parameters:**
```typescript
{
  grade: number; // 11 or 12
}
```

**Response:**
```json
{
  "success": true,
  "topics": [
    "Conic Sections",
    "Domain and Range",
    "Relations and Functions",
    "Functions",
    "Limits",
    "Derivatives"
  ]
}
```

---

#### 4. **GET /api/symbols**
**Purpose:** Get mathematical symbols library

**Response:**
```json
{
  "success": true,
  "symbols": {
    "operators": ["+", "−", "/", "*", "=", "≠", "≥", "≤"],
    "calculus": ["∫", "d", "∂", "∞", "lim", "Σ", "Π"],
    "functions": ["sin", "cos", "tan", "sec", "ln", "log", "√", "π", "e"],
    "superscripts": ["²", "³", "^"],
    "brackets": ["(", ")", "[", "]", "{", "}"],
    "greek": ["α", "β", "γ", "δ", "θ", "λ", "μ", "π", "σ", "τ", "φ", "ω"]
  }
}
```

---

#### 5. **GET /health**
**Purpose:** Check backend and AI service status

**Response:**
```json
{
  "status": "healthy",
  "ai_services": {
    "openai": true,
    "ollama": false,
    "primary": "openai"
  }
}
```

---

## 🤖 AI Integration

### Question Generation Pipeline

```
User Request
    ↓
┌───────────────────────────────────────┐
│   1. Parse Request Parameters         │
│   - Topic, Difficulty, Grade          │
└───────────┬───────────────────────────┘
            ↓
┌───────────────────────────────────────┐
│   2. Load Topic Structure              │
│   - Get subtopics from MATH_TOPICS    │
│   - Reference equations & rules       │
└───────────┬───────────────────────────┘
            ↓
┌───────────────────────────────────────┐
│   3. Try OpenAI (Primary)              │
│   - Model: gpt-4o-mini                │
│   - Temperature: 1.0 (variety)        │
│   - JSON format with options          │
└───────────┬───────────────────────────┘
            │ ✗ Failed
            ↓
┌───────────────────────────────────────┐
│   4. Try Ollama (Secondary)            │
│   - Model: llama3                     │
│   - Local generation                  │
│   - JSON format enforcement           │
└───────────┬───────────────────────────┘
            │ ✗ Failed
            ↓
┌───────────────────────────────────────┐
│   5. Use Fallback Generator            │
│   - Hardcoded question templates      │
│   - Guaranteed to work                │
└───────────┬───────────────────────────┘
            ↓
┌───────────────────────────────────────┐
│   6. Format Mathematical Symbols       │
│   - Convert ^2 → ²                    │
│   - Replace integral → ∫             │
│   - Greek letters: pi → π            │
└───────────┬───────────────────────────┘
            ↓
┌───────────────────────────────────────┐
│   7. Generate Multiple Choice Options  │
│   - 1 correct answer                  │
│   - 3 plausible distractors           │
│   - Shuffle options                   │
└───────────┬───────────────────────────┘
            ↓
        Question Ready
```

### OpenAI Integration

**Configuration:**
```javascript
{
  model: "gpt-4o-mini",
  temperature: 1.0,
  max_completion_tokens: 10000
}
```

**Prompt Structure:**
```javascript
System: "You are a math education expert. Generate clear, educational math questions with proper Unicode symbols."

User: `Create a ${difficulty} level Grade ${grade} question for ${topic}.
Reference: ${equation}
Rules: ${keyRules}

This MUST be a multiple choice question with 4 options (A, B, C, D).
Respond with this exact JSON structure: { ... }`
```

**Symbol Formatting:**
- Exponents: ^2 → ²
- Integrals: integral → ∫
- Greek: pi → π, theta → θ
- Operators: >= → ≥, <= → ≤
- Arrows: -> → →

### Ollama Integration

**Model:** llama3 (7B parameters)

**Benefits:**
- Free and local
- No API limits
- Privacy-friendly

**Limitations:**
- Slower than OpenAI
- Requires local installation
- May need option validation

### Fallback System

**Hardcoded Questions:**
- Pre-generated for all topics
- Guaranteed correctness
- Instant generation
- Limited variety

**Topics Covered:**
- All Grade 11 and 12 topics
- Multiple difficulty levels
- Proper answer format

---

## 🔄 Data Flow

### Session Flow Diagram

```
[User] → Select Grade
         ↓
      [Frontend] → Update selectedGrade state
         ↓
      Show Topic Selector
         ↓
[User] → Select Topic (e.g., "Limits")
         ↓
      [Frontend] → Update selectedTopic state
         ↓
      Show Difficulty Selector
         ↓
[User] → Select Difficulty (e.g., "medium")
         ↓
      [Frontend] → Navigate to StudySession
         ↓
      [StudySession] → Call fetchQuestionsProgressive()
         ↓
      [API Service] → GET /api/questions/stream?topic=Limits&difficulty=medium&grade=11
         ↓
      [Backend] → Start question generation loop
         │
         ├→ [Question Generator] → Try OpenAI
         │      ↓ (success)
         │   Format symbols → Stream via SSE
         │      ↓
         ├→ [Frontend] receives question #1
         │   - Add to problems array
         │   - Show UI
         │   - Start timer
         │      ↓
         ├→ [Question Generator] → Generate question #2
         │   (continues in background)
         │      ↓
         ├→ [User] → Selects answer
         │      ↓
         │   [Frontend] → Stop timer, show feedback
         │      ↓
         │   [User] → Click "Next"
         │      ↓
         │   [Frontend] → currentIndex++, restart timer
         │      ↓
         └→ Repeat until 10 questions completed
         ↓
      [Frontend] → Navigate to ResultsScreen
         ↓
      Display score, time, statistics
```

### State Management

**App-Level State:**
```typescript
// Navigation
screen: 'grade' | 'topic' | 'difficulty' | 'session' | 'results'

// User Selections
selectedGrade: 'grade11' | 'grade12'
selectedTopic: string
selectedDifficulty: 'easy' | 'medium' | 'hard'

// Results
sessionResults: {
  score: number;
  total: number;
  timeSpent: number;
}
```

**StudySession State:**
```typescript
// Questions
problems: MathProblem[]
currentIndex: number
questionsReceived: number
allQuestionsLoaded: boolean

// User Input
userAnswer: string
showFeedback: boolean
isCorrect: boolean

// Performance
score: number
timeSpent: number
timerActive: boolean

// UI
loading: boolean
error: string | null
```

---

## 💻 Development Guide

### Adding New Topics

**1. Update Backend (server/questionGenerator.js):**
```javascript
const MATH_TOPICS = {
  11: {
    // ... existing topics ...
    "Your New Topic": [
      {
        topic: "Subtopic Name",
        concept: "What students learn",
        equation: "Key formula",
        rules: "Important rules"
      }
    ]
  }
};
```

**2. Update Frontend (src/app/components/topic-selector.tsx):**
```typescript
const grade11Topics: Topic[] = [
  // ... existing topics ...
  {
    id: 'your-new-topic',
    name: 'Your New Topic',
    description: 'Brief description',
    icon: <YourIcon className="w-8 h-8" />
  }
];
```

**3. Add Fallback Questions (server/fallbackQuestionGenerator.js):**
```javascript
generateYourNewTopic(difficulty, id) {
  return {
    id,
    question: "Question text",
    answer: "A",
    options: {
      A: "Correct answer",
      B: "Wrong answer 1",
      C: "Wrong answer 2",
      D: "Wrong answer 3"
    },
    explanation: "Why this is correct",
    topic: "Your New Topic",
    difficulty,
    grade: 11
  };
}
```

### Customizing Difficulty

Edit difficulty parameters in `questionGenerator.js`:

```javascript
const systemPrompt = `Generate a ${difficulty} question...
${difficulty === 'easy' ? 'Use simple numbers and basic concepts' : ''}
${difficulty === 'medium' ? 'Use moderate complexity' : ''}
${difficulty === 'hard' ? 'Use complex calculations' : ''}
`;
```

### Styling Customization

**Theme Colors (src/styles/theme.css):**
```css
:root {
  --grade11: #10b981; /* Viridian/Emerald */
  --grade12: #f43f5e; /* Rose */
  --primary: #3b82f6;  /* Blue */
  --secondary: #8b5cf6; /* Purple */
}
```

**Tailwind Configuration:**
Colors are handled through CSS variables. Update `theme.css` to change color scheme.

### Testing Endpoints

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Get Topics:**
```bash
curl http://localhost:5000/api/topics?grade=11
```

**Generate Questions:**
```bash
curl "http://localhost:5000/api/questions?topic=Limits&difficulty=easy&grade=11"
```

**Stream Questions:**
```bash
curl -N "http://localhost:5000/api/questions/stream?topic=Limits&difficulty=easy&grade=11"
```

---

## 📊 Performance Optimization

### Frontend Optimizations
1. **Progressive Loading**: Questions load one at a time
2. **Abort Signals**: Cancel in-flight requests on component unmount
3. **Smart Timer**: Only counts active problem-solving time
4. **Efficient Re-renders**: Minimal state updates

### Backend Optimizations
1. **Streaming**: SSE for immediate first question
2. **AI Fallback**: Automatic failover between services
3. **Connection Handling**: Detects client disconnects
4. **Symbol Caching**: Pre-formatted math symbols

### Recommended Settings

**For Speed (OpenAI):**
```env
OPENAI_API_KEY=your-key
OPENAI_MODEL=gpt-4o-mini
```

**For Cost Savings (Ollama):**
```env
OLLAMA_HOST=127.0.0.1
OLLAMA_PORT=11434
# Leave OPENAI_API_KEY empty
```

**For Reliability (Fallback):**
```env
# Don't set any AI keys
# System uses hardcoded questions
```

---

## 🔐 Security Considerations

1. **API Key Protection**
   - Never commit `.env` to git
   - Use environment variables only
   - Rotate keys regularly

2. **CORS Configuration**
   - Configured for localhost development
   - Update for production deployment

3. **Input Validation**
   - All API parameters validated
   - Type checking on frontend

4. **Error Handling**
   - Graceful degradation
   - No sensitive data in errors
   - User-friendly messages

---

**Version:** 1.0.0  
**Last Updated:** January 2026  
**License:** Educational Use