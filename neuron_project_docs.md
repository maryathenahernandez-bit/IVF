# NEURON Math Learning Assistant - Complete Project Documentation

## 📑 Table of Contents
1. [System Architecture](#system-architecture)
2. [Project Structure](#project-structure)
3. [Component Documentation](#component-documentation)
4. [Backend Architecture](#backend-architecture)
5. [API Reference](#api-reference)
6. [AI Integration](#ai-integration)
7. [Data Flow](#data-flow)
8. [State Management](#state-management)
9. [Development Guidelines](#development-guidelines)
10. [Performance Optimization](#performance-optimization)

---

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                   USER INTERFACE                        │
│              React 18.3.1 + TypeScript                  │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  Grade   │→ │  Topic   │→ │Difficulty│→ Session   │
│  │ Selector │  │ Selector │  │ Selector │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                       ↓                                │
│                 ┌──────────────┐                      │
│                 │Study Session │                      │
│                 │(Progressive) │                      │
│                 └──────┬───────┘                      │
│                        ↓                                │
│                 ┌──────────────┐                      │
│                 │   Results    │                      │
│                 │   Screen     │                      │
│                 └──────────────┘                      │
└────────────────────┬────────────────────────────────┘
                     │
                     │ HTTP/SSE (Server-Sent Events)
                     │
┌────────────────────▼────────────────────────────────┐
│              EXPRESS BACKEND (Port 5000)            │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │        Question Generator Service          │    │
│  │                                            │    │
│  │   ┌──────────────────────────────────┐    │    │
│  │   │   Topic Structure (Hardcoded)    │    │    │
│  │   │   - 12 topics across 2 grades    │    │    │
│  │   │   - Subtopic breakdowns          │    │    │
│  │   │   - Reference equations          │    │    │
│  │   └──────────────┬───────────────────┘    │    │
│  │                  │                         │    │
│  │   ┌──────────────▼───────────────────┐    │    │
│  │   │   AI Generation Pipeline         │    │    │
│  │   │                                  │    │    │
│  │   │  1. OpenAI GPT-5-nano (Primary) │    │    │
│  │   │     └→ Fast, high quality       │    │    │
│  │   │                                  │    │    │
│  │   │  2. Ollama llama3 (Secondary)   │    │    │
│  │   │     └→ Free, local processing   │    │    │
│  │   │                                  │    │    │
│  │   │  3. Fallback Generator (Backup) │    │    │
│  │   │     └→ Hardcoded questions      │    │    │
│  │   └──────────────────────────────────┘    │    │
│  │                                            │    │
│  │   ┌──────────────────────────────────┐    │    │
│  │   │   Symbol Formatting Engine       │    │    │
│  │   │   - Unicode superscripts         │    │    │
│  │   │   - Math operators               │    │    │
│  │   │   - Greek letters                │    │    │
│  │   └──────────────────────────────────┘    │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  Routes:                                            │
│  - GET  /api/questions/stream  (SSE)               │
│  - GET  /api/questions         (Batch)             │
│  - GET  /api/topics                                │
│  - GET  /api/symbols                               │
│  - GET  /health                                    │
└─────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | | | |
| Core | React | 18.3.1 | UI library |
| Language | TypeScript | Latest | Type safety |
| Build Tool | Vite | 6.4.1 | Fast builds & HMR |
| Styling | Tailwind CSS | 4.1.12 | Utility-first CSS |
| UI Components | Radix UI | Various | Accessible primitives |
| Icons | Lucide React | 0.487.0 | Icon library |
| Math | MathJS | 15.1.0 | Calculations |
| **Backend** | | | |
| Runtime | Node.js | 18+ | JavaScript runtime |
| Framework | Express | 4.18.2 | Web server |
| HTTP Client | Axios | 1.6.2 | API requests |
| Env Variables | dotenv | 17.2.3 | Configuration |
| CORS | cors | 2.8.5 | Cross-origin |
| **AI Services** | | | |
| Primary | OpenAI | gpt-5-nano | Question generation |
| Secondary | Ollama | llama3 | Local AI fallback |
| Backup | Fallback | N/A | Hardcoded questions |

---

## 📁 Project Structure

```
D:\ivf_coding\ivf\
│
├── 📄 index.html                          # HTML entry point
├── 📄 package.json                        # Frontend dependencies
├── 📄 package-lock.json                   # Dependency lock file
├── 📄 vite.config.ts                      # Vite configuration
├── 📄 postcss.config.mjs                  # PostCSS config
├── 📄 .gitignore                          # Git ignore rules
│
├── 📁 src/                                # Frontend source
│   ├── 📄 main.tsx                        # React entry point
│   │
│   ├── 📁 app/                            # Application code
│   │   ├── 📄 App.tsx                     # Root component (State management)
│   │   │
│   │   └── 📁 components/                 # React components
│   │       ├── 📄 grade-selector.tsx      # Grade 11/12 selection
│   │       ├── 📄 topic-selector.tsx      # Topic selection screen
│   │       ├── 📄 difficulty-selector.tsx # Difficulty selection
│   │       ├── 📄 study-session.tsx       # Main quiz interface ⭐
│   │       ├── 📄 results-screen.tsx      # Results & analytics ⭐
│   │       │
│   │       └── 📁 ui/                     # Reusable UI components
│   │           ├── 📄 button.tsx
│   │           ├── 📄 card.tsx
│   │           ├── 📄 progress.tsx
│   │           ├── 📄 alert.tsx
│   │           ├── 📄 dialog.tsx
│   │           └── ... (40+ components)
│   │
│   ├── 📁 services/                       # API & services
│   │   └── 📄 api.ts                      # API client with SSE ⭐
│   │
│   └── 📁 styles/                         # Styling
│       ├── 📄 index.css                   # Main CSS imports
│       ├── 📄 tailwind.css                # Tailwind directives
│       ├── 📄 theme.css                   # CSS variables (colors)
│       └── 📄 fonts.css                   # Font definitions
│
├── 📁 server/                             # Backend
│   ├── 📄 package.json                    # Server dependencies
│   ├── 📄 package-lock.json
│   ├── 📄 .env                            # Environment variables ⚠️
│   ├── 📄 server.js                       # Express server ⭐
│   ├── 📄 questionGenerator.js            # AI question generator ⭐
│   ├── 📄 fallbackQuestionGenerator.js    # Backup questions
│   └── 📄 generated_questions.json        # (Optional cache)
│
├── 📁 guidelines/                         # Development guidelines
│   └── 📄 Guidelines.md
│
└── 📁 Documentation/
    ├── 📄 NEURON Math Learning Assistant - Setup Guide.md
    └── 📄 NEURON Math Learning Assistant - Project Documentation.md

⭐ = Core/Critical files
⚠️ = Contains sensitive data (not in git)
```

---

## 🧩 Component Documentation

### 1. App.tsx (Root Component)

**Purpose:** Central state management and routing coordinator

**Responsibilities:**
- Manages global application state
- Handles screen transitions
- Passes props to child components
- Maintains session results

**State:**
```typescript
type Screen = 'grade' | 'topic' | 'difficulty' | 'session' | 'results';

const [screen, setScreen] = useState<Screen>('grade');
const [selectedGrade, setSelectedGrade] = useState<'grade11' | 'grade12'>('grade11');
const [selectedTopic, setSelectedTopic] = useState<string>('');
const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
const [sessionResults, setSessionResults] = useState<SessionResults>({
  score: 0,
  total: 0,
  timeSpent: 0,
  problems: [],
  userAnswers: []
});
```

**Navigation Flow:**
```
grade ──┐
        ├→ topic ──┐
        │          ├→ difficulty ──┐
        │          │                ├→ session ──┐
        │          │                │            ├→ results
        │          │                │            │
        ↑          ↑                ↑            ↑
        └──────────┴────────────────┴────────────┘
               Back navigation handlers
```

**Key Methods:**
- `handleSelectGrade()` - Updates grade, shows topic selector
- `handleSelectTopic()` - Updates topic, shows difficulty selector
- `handleSelectDifficulty()` - Updates difficulty, starts session
- `handleSessionComplete()` - Stores results, shows results screen
- `handleRestart()` - Restarts session with same settings
- `handleNewTopic()` - Returns to topic selection
- `handleExitSession()` - Returns to grade selection

---

### 2. GradeSelector.tsx

**Purpose:** Initial screen for grade level selection

**Features:**
- Two large card buttons (Grade 11 & 12)
- Gradient backgrounds with grade-specific colors
- Preview of topics for each grade
- Animated hover effects

**Props:**
```typescript
type GradeSelectorProps = {
  onSelectGrade: (grade: 'grade11' | 'grade12') => void;
};
```

**Visual Design:**
- Grade 11: Viridian/Emerald gradient (#10b981)
- Grade 12: Rose gradient (#f43f5e)
- Large "NEURON" title with gradient
- Topic preview lists with bullet points

**Code Highlights:**
```typescript
<Card onClick={() => onSelectGrade('grade11')}>
  <CardTitle style={{ color: 'var(--grade11)' }}>
    Grade 11
  </CardTitle>
  <CardDescription>
    Pre-calculus & Differential Calculus
  </CardDescription>
  {/* Topic preview list */}
</Card>
```

---

### 3. TopicSelector.tsx

**Purpose:** Display and select math topics for chosen grade

**Features:**
- Grid layout (3 columns on desktop, responsive)
- Topic cards with icons
- Back navigation to grade selector
- Grade-specific topic lists

**Props:**
```typescript
type TopicSelectorProps = {
  grade: 'grade11' | 'grade12';
  onSelectTopic: (topic: string) => void;
  onBack: () => void;
};
```

**Topics by Grade:**

**Grade 11:**
1. **Conic Sections** - Circles, ellipses, parabolas, hyperbolas
2. **Domain and Range** - Finding domain and range of functions
3. **Relations and Functions** - Relations and function notation
4. **Functions** - Analyzing and graphing functions
5. **Limits** - Calculate limits and continuity
6. **Derivatives** - Power, product, and chain rules

**Grade 12:**
1. **Indefinite Integrals** - Basic integration
2. **Definite Integrals** - FTC and evaluation
3. **Integration by Substitution** - U-substitution
4. **Integration by Parts** - Product integration
5. **Area Under Curve** - Calculating areas
6. **Volume of Revolution** - Disk and shell methods

**Code Structure:**
```typescript
const grade11Topics: Topic[] = [
  {
    id: 'conic-sections',
    name: 'Conic Sections',
    description: '...',
    icon: <Activity className="w-8 h-8" />
  },
  // ... more topics
];
```

---

### 4. DifficultySelector.tsx

**Purpose:** Choose question difficulty level

**Features:**
- Three colored cards (green/yellow/red)
- Characteristics list for each level
- Direct start buttons
- Back navigation

**Props:**
```typescript
type DifficultySelectorProps = {
  topic: string;
  onSelectDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onBack: () => void;
};
```

**Difficulty Levels:**

| Level | Color | Characteristics |
|-------|-------|----------------|
| **Easy** | Green | Smaller numbers, simple problems, build confidence |
| **Medium** | Yellow | Moderate difficulty, mixed problems, improve skills |
| **Hard** | Red | Complex problems, large numbers, expert practice |

**Implementation:**
```typescript
<Card onClick={() => onSelectDifficulty('easy')}>
  <div className="bg-green-100">🌱</div>
  <CardTitle className="text-green-700">Easy</CardTitle>
  <ul>
    <li>• Smaller numbers</li>
    <li>• Simple problems</li>
    <li>• Build confidence</li>
  </ul>
  <Button className="bg-green-600">Start Easy</Button>
</Card>
```

---

### 5. StudySession.tsx ⭐ (Core Component)

**Purpose:** Main quiz interface with progressive question loading

**Key Features:**

#### A. Progressive Loading
- Questions stream via Server-Sent Events (SSE)
- First question appears immediately when ready
- Background generation continues
- No blocking wait for all questions

#### B. Smart Timer
- Only counts active problem-solving time
- Pauses during:
  - Question generation
  - Feedback display
  - Answer submission
- Resumes when next question ready

#### C. State Management
```typescript
// Questions
const [problems, setProblems] = useState<MathProblem[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [questionsReceived, setQuestionsReceived] = useState(0);
const [allQuestionsLoaded, setAllQuestionsLoaded] = useState(false);

// User interaction
const [userAnswer, setUserAnswer] = useState('');
const [userAnswers, setUserAnswers] = useState<string[]>([]);
const [showFeedback, setShowFeedback] = useState(false);
const [isCorrect, setIsCorrect] = useState(false);

// Performance tracking
const [score, setScore] = useState(0);
const [timeSpent, setTimeSpent] = useState(0);
const [timerActive, setTimerActive] = useState(false);

// UI state
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

#### D. Progressive Loading Flow

**1. Initial Load:**
```typescript
useEffect(() => {
  const abortController = new AbortController();
  
  const loadQuestionsProgressively = async () => {
    await fetchQuestionsProgressive(
      topic,
      difficulty,
      grade,
      // Callback for each question
      (question, index) => {
        setProblems(prev => [...prev, question]);
        setQuestionsReceived(index + 1);
        
        // Start timer when first question arrives
        if (index === 0 && loading) {
          setLoading(false);
          setTimerActive(true);
        }
      },
      // Callback when all complete
      (total) => {
        setAllQuestionsLoaded(true);
        setTotalQuestionsExpected(total);
      },
      // Error callback
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      abortController.signal
    );
  };
  
  loadQuestionsProgressively();
  
  // Cleanup on unmount
  return () => {
    abortController.abort();
    setTimerActive(false);
  };
}, [topic, difficulty, grade]);
```

**2. Timer Management:**
```typescript
useEffect(() => {
  if (!timerActive) return;
  
  const timer = setInterval(() => {
    setTimeSpent(prev => prev + 1);
  }, 1000);
  
  return () => clearInterval(timer);
}, [timerActive]);
```

**3. Answer Submission:**
```typescript
const handleSubmit = () => {
  const userAnswerNormalized = userAnswer.trim().toUpperCase();
  const expectedAnswerNormalized = problems[currentIndex].answer.trim().toUpperCase();
  
  const correct = userAnswerNormalized === expectedAnswerNormalized;
  
  setIsCorrect(correct);
  if (correct) setScore(s => s + 1);
  
  setUserAnswers(prev => [...prev, userAnswer]);
  setShowFeedback(true);
  setTimerActive(false);  // Pause timer
};
```

**4. Next Question:**
```typescript
const handleNext = () => {
  if (currentIndex + 1 < problems.length) {
    // Next question ready
    setCurrentIndex(i => i + 1);
    setUserAnswer('');
    setShowFeedback(false);
    setTimerActive(true);  // Resume timer
  } else if (!allQuestionsLoaded) {
    // Wait for next question to generate
    setTimerActive(false);
  } else {
    // Session complete
    setTimerActive(false);
    onComplete(score, problems.length, timeSpent, problems, userAnswers);
  }
};
```

#### E. UI States

**Loading State:**
```jsx
if (loading) {
  return (
    <div className="animate-spin h-16 w-16 border-b-4">
      <h3>Generating Your First Question</h3>
      <p>Creating personalized math problems...</p>
    </div>
  );
}
```

**Waiting for Next Question:**
```jsx
if (needsMoreQuestions) {
  return (
    <div>
      <h3>Generating Next Question</h3>
      <p>Questions answered: {currentIndex}</p>
      <p>Questions generated: {questionsReceived}/{totalQuestionsExpected}</p>
    </div>
  );
}
```

**Question Display:**
```jsx
<Card>
  <CardTitle>{currentProblem.question}</CardTitle>
  
  {!showFeedback ? (
    // Answer options as buttons
    Object.entries(currentProblem.options).map(([key, value]) => (
      <Button onClick={() => {
        setUserAnswer(key);
        // Immediate submission on click
        handleSubmit();
      }}>
        <span>{key}.</span> {value}
      </Button>
    ))
  ) : (
    // Feedback with highlighted answers
    <div>
      {isCorrect ? <CheckCircle2 /> : <XCircle />}
      {/* Show all options with correct/incorrect highlighting */}
      {/* Show explanation */}
    </div>
  )}
</Card>
```

#### F. Multiple Choice Implementation

**Answer Options:**
- 4 options (A, B, C, D)
- Click to select and submit
- Immediate feedback
- No separate submit button needed

**Visual Feedback:**
- Correct answer: Green background, checkmark
- Wrong answer (if selected): Red background, X mark
- Other options: Gray background

---

### 6. ResultsScreen.tsx ⭐

**Purpose:** Display comprehensive session results and analytics

**Features:**

#### A. Score Display
- Large percentage circle
- Letter grade (A-F)
- Motivational message
- Trophy icon

#### B. Performance Metrics
```typescript
type ResultsScreenProps = {
  score: number;           // Correct answers
  total: number;           // Total questions
  topic: string;           // Topic practiced
  difficulty: string;      // Difficulty level
  timeSpent: number;       // Seconds spent
  problems: MathProblem[]; // All questions
  userAnswers: string[];   // User's answers
  onRestart: () => void;
  onNewTopic: () => void;
};
```

#### C. Statistics Displayed

**1. Basic Stats:**
- Score: X/Y correct
- Percentage: Z%
- Letter grade: A-F
- Time spent: MM:SS
- Average time per question

**2. Subtopic Analysis:**
```typescript
type SubtopicPerformance = {
  subtopic: string;
  correct: number;
  total: number;
  percentage: number;
};

const analyzePerformance = (): SubtopicPerformance[] => {
  const subtopicStats = new Map();
  
  problems.forEach((problem, index) => {
    const subtopic = problem.subtopic || problem.category || topic;
    const isCorrect = userAnswers[index] === problem.answer;
    
    // Track stats per subtopic
    if (!subtopicStats.has(subtopic)) {
      subtopicStats.set(subtopic, { correct: 0, total: 0 });
    }
    
    const stats = subtopicStats.get(subtopic);
    stats.total++;
    if (isCorrect) stats.correct++;
  });
  
  return Array.from(subtopicStats.entries())
    .map(([subtopic, stats]) => ({
      subtopic,
      correct: stats.correct,
      total: stats.total,
      percentage: (stats.correct / stats.total) * 100
    }))
    .sort((a, b) => a.percentage - b.percentage); // Worst first
};
```

**3. Personalized Tips:**
```typescript
const generatePersonalizedTips = () => {
  const tips = [];
  
  if (percentage === 100) {
    tips.push("🎯 Perfect score! You've mastered this topic.");
    tips.push("📈 Consider trying the next difficulty level.");
  } else if (percentage >= 80) {
    tips.push("🌟 Excellent work!");
    if (weakSubtopics.length > 0) {
      tips.push(`📚 Areas to strengthen: ${weakSubtopics.join(', ')}`);
    }
  } else if (percentage >= 60) {
    tips.push("💪 Good effort!");
    tips.push("🎯 Focus on: " + weakSubtopics.map(s => s.subtopic).join(', '));
    tips.push("📖 Review explanations for incorrect answers");
  } else {
    tips.push("🌱 Keep practicing!");
    tips.push("📚 Review fundamental concepts");
    tips.push("💡 Try the easy difficulty to build foundation");
  }
  
  return tips;
};
```

#### D. Problem Review Section

**Features:**
- Expandable/collapsible review cards
- All questions displayed
- Correct/incorrect indicators
- Full explanations
- "Expand All" / "Collapse All" buttons

**Implementation:**
```typescript
const [expandedProblems, setExpandedProblems] = useState<Set<number>>(new Set());

{problems.map((problem, index) => {
  const userAnswer = userAnswers[index];
  const isCorrect = userAnswer === problem.answer;
  const isExpanded = expandedProblems.has(index);
  
  return (
    <div
      className={isCorrect ? 'border-green-300' : 'border-red-300'}
      onClick={() => toggleProblem(index)}
    >
      {/* Question header */}
      <div>
        {isCorrect ? <CheckCircle2 /> : <XCircle />}
        <p>{problem.question}</p>
      </div>
      
      {/* Expanded content */}
      {isExpanded && (
        <div>
          {/* All options with highlighting */}
          {/* Explanation */}
        </div>
      )}
    </div>
  );
})}
```

#### E. Grade Calculation

```typescript
const getGrade = () => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};
```

---

### 7. api.ts (API Service) ⭐

**Purpose:** Frontend API client with SSE support

**Key Functions:**

#### A. Progressive Question Fetching (SSE)
```typescript
async function fetchQuestionsProgressive(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard',
  grade: number,
  onQuestion: (question: Question, index: number) => void,
  onComplete: (total: number) => void,
  onError: (error: Error) => void,
  signal?: AbortSignal
): Promise<void> {
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  
  try {
    const params = new URLSearchParams({ topic, difficulty, grade: grade.toString(), count: '10' });
    const response = await fetch(`${API_BASE_URL}/questions/stream?${params}`, { signal });
    
    reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      // Check abort signal
      if (signal?.aborted) {
        reader.cancel();
        break;
      }
      
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (signal?.aborted) {
          reader.cancel();
          return;
        }
        
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          
          if (data.type === 'question') {
            onQuestion(data.data, data.index);
          } else if (data.type === 'complete') {
            onComplete(data.total);
          } else if (data.type === 'error') {
            onError(new Error(data.error));
          }
        }
      }
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Question generation aborted');
      return;
    }
    onError(error);
  } finally {
    if (reader) {
      try {
        reader.cancel();
      } catch (e) {}
    }
  }
}
```

**Features:**
- Handles Server-Sent Events stream
- Abort signal support for cleanup
- Progressive callback invocation
- Error handling and recovery

#### B. Batch Fetching (Legacy)
```typescript
async function fetchQuestions(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard',
  grade: number
): Promise<QuestionsResponse> {
  const params = new URLSearchParams({ topic, difficulty, grade: grade.toString() });
  const response = await fetch(`${API_BASE_URL}/questions?${params}`);
  return response.json();
}
```

#### C. Other Endpoints
```typescript
// Get topics for grade
async function fetchTopics(grade: number): Promise<TopicsResponse>

// Get math symbols
async function fetchSymbols(): Promise<SymbolsResponse>

// Health check
async function checkHealth(): Promise<HealthResponse>
```

---

## 🔧 Backend Architecture

### server.js ⭐

**Purpose:** Express server with SSE endpoints

**Key Routes:**

#### 1. GET /api/questions/stream (SSE)
```javascript
app.get('/api/questions/stream', async (req, res) => {
  const { topic, difficulty, grade, count = 10 } = req.query;
  
  // Setup SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  
  let clientDisconnected = false;
  req.on('close', () => {
    clientDisconnected = true;
    console.log('Client disconnected - stopping generation');
  });
  
  try {
    for (let i = 0; i < count; i++) {
      // Check disconnect before generating
      if (clientDisconnected) break;
      
      // Generate question (tries OpenAI → Ollama → Fallback)
      const question = await generator.generateSingleQuestion(...);
      
      // Check disconnect before sending
      if (clientDisconnected) break;
      
      // Send via SSE
      res.write(`data: ${JSON.stringify({ type: 'question', data: question, index: i })}\n\n`);
    }
    
    if (!clientDisconnected) {
      res.write(`data: ${JSON.stringify({ type: 'complete', total: count })}\n\n`);
      res.end();
    }
  } catch (error) {
    if (!clientDisconnected) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      res.end();
    }
  }
});
```

**Features:**
- Detects client disconnect
- Stops generation if client leaves
- Streams questions immediately
- Handles errors gracefully

#### 2. GET /api/questions (Batch)
```javascript
app.get('/api/questions', async (req, res) => {
  const { topic, difficulty, grade } = req.query;
  
  const questions = await generator.generateQuestionsBatch(topic, difficulty, grade, 10);
  res.json({ success: true, questions });
});
```

####