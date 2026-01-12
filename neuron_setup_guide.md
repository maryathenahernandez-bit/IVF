# NEURON Math Learning Assistant - Complete Setup Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Detailed Installation](#detailed-installation)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)
9. [Advanced Configuration](#advanced-configuration)

---

## 🎯 Overview

**NEURON** is an AI-powered adaptive math learning platform for Grade 11-12 students, featuring progressive question loading, real-time AI generation, and comprehensive performance analytics.

### Architecture
```
Frontend (React + Vite)          Backend (Express + Node.js)
Port: 3000                       Port: 5000
     │                                  │
     │         HTTP/SSE API             │
     └──────────────────────────────────┘
                    │
            ┌───────┴───────┐
            │               │
        OpenAI API      Ollama (Local)
        (Primary)       (Secondary)
            │               │
            └───────┬───────┘
                    │
            Fallback Generator
            (Always Available)
```

### Key Features
- 🎓 **Grade-Specific**: Grade 11 (Pre-calc, Differential) & Grade 12 (Integral Calculus)
- 📚 **12 Total Topics**: 6 per grade level
- 🎯 **3 Difficulty Levels**: Easy, Medium, Hard with adaptive complexity
- 🤖 **AI-Powered**: OpenAI GPT-5-nano primary, Ollama secondary
- ⚡ **Progressive Loading**: Questions stream via SSE as they're generated
- ⏱️ **Smart Timer**: Only counts active problem-solving time
- 📊 **Performance Analytics**: Detailed results with subtopic breakdown
- 🎨 **Modern UI**: Responsive design with Tailwind CSS + Radix UI

---

## 📦 Prerequisites

### Required
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** 9+ (included with Node.js)
- **Git** (for version control)

### Optional but Recommended
- **OpenAI API Key** - Best quality, fastest generation ([Get Key](https://platform.openai.com/))
- **Ollama** - Free local AI alternative ([Download](https://ollama.ai/))

### System Requirements
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 4GB | 8GB+ |
| Storage | 500MB | 5GB+ (with Ollama) |
| CPU | Dual-core | Quad-core |
| Internet | Required for OpenAI | Optional with Ollama |

---

## ⚡ Quick Start

```bash
# 1. Navigate to project directory
cd D:\ivf_coding\ivf

# 2. Install all dependencies
npm install
cd server && npm install && cd ..

# 3. Configure environment (OPTIONAL - see Configuration section)
# Create server/.env and add your OpenAI API key

# 4. Start both frontend and backend
npm run dev:all

# 5. Open browser
# http://localhost:3000
```

**That's it!** The app works immediately with fallback questions. Add OpenAI key for AI-powered generation.

---

## 🔧 Detailed Installation

### Step 1: Verify Node.js Installation
```bash
node --version  # Should show v18.0.0 or higher
npm --version   # Should show v9.0.0 or higher
```

If not installed, download from [nodejs.org](https://nodejs.org/)

### Step 2: Navigate to Project
```bash
cd D:\ivf_coding\ivf
```

### Step 3: Install Frontend Dependencies
```bash
npm install
```

This installs:
- React 18.3.1 + React DOM
- Vite 6.4.1 (build tool)
- Tailwind CSS 4.1.12
- Radix UI components (40+ UI primitives)
- Lucide React (icons)
- MathJS (mathematical computations)
- Additional utilities

**Note:** This may take 2-3 minutes depending on internet speed.

### Step 4: Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

This installs:
- Express 4.18.2 (web server)
- CORS (cross-origin support)
- Axios (HTTP client for AI APIs)
- dotenv (environment variable management)
- csv-parse (data parsing)

### Step 5: Verify Installation
```bash
# Check if node_modules exists
ls node_modules  # Should show many packages

# Check server dependencies
ls server/node_modules  # Should show server packages
```

---

## ⚙️ Configuration

### Option A: OpenAI Only (Recommended for Best Quality)

**1. Create `server/.env` file:**
```env
# OpenAI Configuration (PRIMARY)
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_MODEL=gpt-5-nano

# Ollama (leave commented if not using)
# OLLAMA_HOST=127.0.0.1
# OLLAMA_PORT=11434
```

**2. Get OpenAI API Key:**
- Visit https://platform.openai.com/
- Create account or log in
- Go to API Keys section
- Create new key
- Copy and paste into `.env`

**Benefits:**
- ✅ Highest quality questions
- ✅ Fast generation (1-3 seconds per question)
- ✅ Best explanations
- ✅ Consistent formatting

**Costs:**
- ~$0.01-0.05 per 10-question session
- Very affordable for educational use

---

### Option B: Ollama Only (Free Local AI)

**1. Install Ollama:**
```bash
# Download from https://ollama.ai/
# Or use package manager:

# Windows (via installer)
# Download .exe from website

# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh
```

**2. Install llama3 model:**
```bash
ollama pull llama3
```

**3. Verify Ollama is running:**
```bash
ollama list  # Should show llama3
```

**4. Create `server/.env` file:**
```env
# Ollama Configuration
OLLAMA_HOST=127.0.0.1
OLLAMA_PORT=11434

# Don't set OPENAI_API_KEY
```

**Benefits:**
- ✅ Completely free
- ✅ Works offline
- ✅ Privacy-friendly (local processing)

**Limitations:**
- ⚠️ Slower (5-15 seconds per question)
- ⚠️ May need answer validation
- ⚠️ Requires 5GB+ storage

---

### Option C: Fallback Mode (No Setup Required)

Don't create `.env` file or leave it empty.

**Benefits:**
- ✅ Works immediately
- ✅ No API keys needed
- ✅ Fast and reliable
- ✅ Perfect for testing

**Limitations:**
- ⚠️ Limited question variety
- ⚠️ No adaptive difficulty
- ⚠️ Predefined questions only

---

### Option D: Hybrid (OpenAI + Ollama Fallback)

**Create `server/.env`:**
```env
# Primary: OpenAI
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_MODEL=gpt-5-nano

# Secondary: Ollama (fallback if OpenAI fails)
OLLAMA_HOST=127.0.0.1
OLLAMA_PORT=11434
```

**Benefits:**
- ✅ Best of both worlds
- ✅ Automatic failover
- ✅ Redundancy and reliability

---

## 🚀 Running the Application

### Method 1: Run Both Together (Recommended)
```bash
# From project root
npm run dev:all
```

This command uses `concurrently` to start:
- Frontend dev server (Port 3000)
- Backend API server (Port 5000)

**Console Output:**
```
[0] 
[0] VITE v6.4.1  ready in 523 ms
[0] 
[0] ➜  Local:   http://localhost:3000/
[1] ==================================================================
[1]           Math Learning Assistant API Server
[1] ==================================================================
[1] Server running on http://0.0.0.0:5000
[1] AI Configuration:
[1]   OpenAI: ✓ Configured
[1]   Ollama: Checking availability...
```

### Method 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm start
# Or with auto-restart on file changes:
npm run dev
```

**Terminal 2 - Frontend:**
```bash
# From project root
npm run dev
```

### Method 3: Production Build
```bash
# Build frontend
npm run build

# Serve built files (requires static server)
npx serve -s dist
```

---

## ✅ Verification

### 1. Check Backend Health
```bash
curl http://localhost:5000/health
```

**Expected Response:**
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

### 2. Test Question Generation
```bash
curl "http://localhost:5000/api/questions?topic=Limits&difficulty=easy&grade=11"
```

**Should return JSON with 10 questions.**

### 3. Test Progressive Streaming
```bash
curl -N "http://localhost:5000/api/questions/stream?topic=Limits&difficulty=easy&grade=11"
```

**Should stream questions one by one via SSE.**

### 4. Frontend Verification
1. Open http://localhost:3000
2. Select **Grade 11**
3. Choose **Limits**
4. Select **Easy**
5. First question should appear within 5-10 seconds
6. Timer should start automatically
7. Answer should be accepted when clicked
8. Feedback should show immediately
9. "Next" should load second question
10. After 10 questions, results screen should appear

---

## 🛠️ Troubleshooting

### Issue 1: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution (Windows):**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

**Solution (Mac/Linux):**
```bash
lsof -ti:3000 | xargs kill -9
# Or for backend:
lsof -ti:5000 | xargs kill -9
```

**Alternative:** Change port in `vite.config.ts`:
```typescript
server: {
  port: 3001,  // Change to available port
  // ...
}
```

---

### Issue 2: Cannot Connect to Backend

**Symptoms:** Frontend shows "Failed to load questions"

**Diagnosis:**
```bash
# Check if backend is running
curl http://localhost:5000/health

# Check backend logs for errors
# (should be visible in terminal)
```

**Solutions:**

**A. Backend not started:**
```bash
cd server
npm start
```

**B. Port conflict:**
```bash
# Change port in server/server.js:
const PORT = process.env.PORT || 5001;
```

**C. Firewall blocking:**
```bash
# Windows: Allow Node.js through firewall
# Settings → Windows Security → Firewall → Allow an app
```

---

### Issue 3: OpenAI API Errors

**Error: `401 Unauthorized`**

**Solution:**
1. Verify API key in `server/.env`
2. Check no extra spaces/quotes around key
3. Ensure key starts with `sk-proj-` or `sk-`

**Error: `429 Too Many Requests`**

**Solution:**
1. Check quota: https://platform.openai.com/usage
2. Add payment method if free tier exceeded
3. Wait and retry (rate limits)

**Error: `Invalid API key`**

**Solution:**
1. Regenerate key in OpenAI dashboard
2. Update `server/.env`
3. Restart backend

**Fallback:**
```bash
# Temporarily disable OpenAI
# Comment out OPENAI_API_KEY in .env
# System will use Ollama or fallback
```

---

### Issue 4: Ollama Not Working

**Error:** `Ollama not available at http://127.0.0.1:11434`

**Diagnosis:**
```bash
ollama list  # Should show installed models
```

**Solutions:**

**A. Ollama not running:**
```bash
# Start Ollama service
ollama serve
```

**B. Model not installed:**
```bash
ollama pull llama3
```

**C. Wrong port:**
```bash
# Check Ollama port
netstat -ano | findstr :11434

# Update server/.env if different:
OLLAMA_PORT=your_actual_port
```

**D. Check logs:**
```bash
# Backend will show:
# ✗ SECONDARY: Ollama not available
```

---

### Issue 5: Module Not Found

**Error:** `Cannot find module 'express'` or similar

**Solution:**
```bash
# Root dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..

# Force clean reinstall if needed
rm -rf node_modules package-lock.json
npm install

cd server
rm -rf node_modules package-lock.json
npm install
cd ..
```

---

### Issue 6: Vite Build Errors

**Error:** `Failed to resolve import` or TypeScript errors

**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall dependencies
npm install

# Check TypeScript config
npx tsc --noEmit  # Check for type errors
```

---

### Issue 7: Questions Not Loading

**Symptoms:** Infinite loading spinner, no questions appear

**Diagnosis:**

**A. Check browser console (F12):**
- Look for network errors
- Check `/api/questions/stream` response

**B. Check backend logs:**
```bash
# Should show:
# 📡 STREAMING 10 questions for "Limits"
# → [1/10] Generating question...
# ✓ Question 1/10 streamed
```

**Solutions:**

**A. AbortController cleanup:**
```typescript
// In study-session.tsx, check useEffect cleanup:
return () => { 
  mounted = false;
  abortController.abort();
};
```

**B. SSE connection:**
```bash
# Test directly:
curl -N http://localhost:5000/api/questions/stream?topic=Limits&difficulty=easy&grade=11

# Should stream:
# data: {"type":"question",...}
# data: {"type":"question",...}
```

**C. Restart both servers:**
```bash
# Ctrl+C to stop, then:
npm run dev:all
```

---

### Issue 8: Styling Issues

**Symptoms:** UI appears unstyled or broken

**Solutions:**

**A. Tailwind not loading:**
```bash
# Check src/styles/index.css imports:
@import './fonts.css';
@import './tailwind.css';
@import './theme.css';
```

**B. Clear browser cache:**
```
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

**C. Rebuild CSS:**
```bash
npm run build
npm run dev
```

---

### Issue 9: Timer Not Working

**Symptoms:** Timer doesn't start or doesn't pause

**Check:**

**study-session.tsx timer logic:**
```typescript
// Timer should start when first question loads
if (index === 0 && loading) {
  setTimerActive(true);
}

// Timer pauses on answer submit
setTimerActive(false);

// Timer resumes on next question
setTimerActive(true);
```

**Verify:**
1. `timerActive` state changes correctly
2. `useEffect` with `timerActive` dependency runs
3. No JavaScript errors in console

---

### Issue 10: Math Symbols Display Incorrectly

**Symptoms:** Shows `^2` instead of `²`, or weird characters

**Solution:**

**A. Check character encoding:**
```html
<!-- index.html should have: -->
<meta charset="UTF-8" />
```

**B. Verify symbol formatting:**
```javascript
// In questionGenerator.js:
formatMathQuestion(questionText) {
  // Converts ^2 → ²
  // Converts integral → ∫
  // etc.
}
```

**C. Browser console warnings:**
- Check for encoding warnings
- Verify Unicode support

---

## 🔍 Advanced Configuration

### Custom Topics

**1. Backend (server/questionGenerator.js):**
```javascript
const MATH_TOPICS = {
  11: {
    // Add new topic
    "Trigonometry": [
      {
        topic: "Sine and Cosine",
        concept: "Basic trig functions",
        equation: "sin²θ + cos²θ = 1",
        rules: "SOHCAHTOA"
      }
    ]
  }
};
```

**2. Frontend (src/app/components/topic-selector.tsx):**
```typescript
const grade11Topics: Topic[] = [
  {
    id: 'trigonometry',
    name: 'Trigonometry',
    description: 'Sine, cosine, and tangent',
    icon: <Activity className="w-8 h-8" />
  }
];
```

**3. Fallback (server/fallbackQuestionGenerator.js):**
```javascript
generateTrigonometry(difficulty, id) {
  return {
    id,
    question: "What is sin(30°)?",
    answer: "A",
    options: {
      A: "1/2",
      B: "√3/2",
      C: "1",
      D: "0"
    },
    explanation: "sin(30°) = 1/2 by definition",
    topic: "Trigonometry",
    difficulty,
    grade: 11
  };
}
```

### Custom Difficulty Parameters

**Edit AI prompts in questionGenerator.js:**
```javascript
const userPrompt = `Create a ${difficulty} question...

${difficulty === 'easy' ? `
  - Use integers only
  - Single-step solutions
  - Basic concepts
` : ''}

${difficulty === 'hard' ? `
  - Multi-step problems
  - Complex calculations
  - Advanced concepts
` : ''}
`;
```

### Theme Customization

**src/styles/theme.css:**
```css
:root {
  /* Change grade colors */
  --grade11: #10b981;  /* Green → Your color */
  --grade12: #f43f5e;  /* Pink → Your color */
  
  /* Change primary accent */
  --primary: #3b82f6;  /* Blue → Your color */
}
```

### API Rate Limiting

**Add to server.js:**
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📚 Additional Resources

### Documentation
- [Full Project Documentation](./NEURON%20Math%20Learning%20Assistant%20-%20Project%20Documentation.md)
- [Guidelines](./guidelines/Guidelines.md)

### API References
- [OpenAI API](https://platform.openai.com/docs)
- [Ollama Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)

### Technology Docs
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)

---

## 🎓 Usage Tips

### For Students
1. Start with Easy difficulty to build confidence
2. Review explanations for wrong answers
3. Practice regularly (10 questions = 5-10 minutes)
4. Track your progress over time

### For Teachers
1. Use results screen to identify weak areas
2. Adjust difficulty based on student performance
3. Create custom topics for specific curriculum
4. Monitor backend logs for usage analytics

### For Developers
1. Check backend logs for AI service status
2. Monitor question generation times
3. Use health endpoint for uptime checks
4. Implement analytics for usage patterns

---

## 🔐 Security Notes

### Production Deployment
1. **Never commit `.env` to version control**
   - Already in `.gitignore`
   - Use environment variables on hosting platform

2. **Update CORS for production:**
   ```javascript
   // server.js
   app.use(cors({
     origin: 'https://your-production-domain.com'
   }));
   ```

3. **Add rate limiting** (see Advanced Configuration)

4. **Use HTTPS** in production

5. **Rotate API keys regularly**

---

## ✅ Success Checklist

- [ ] Node.js and npm installed
- [ ] Project dependencies installed (root + server)
- [ ] `.env` configured (or using fallback)
- [ ] Backend starts successfully on port 5000
- [ ] Frontend starts successfully on port 3000
- [ ] Health endpoint returns "healthy"
- [ ] Can select grade and topic
- [ ] Questions load progressively
- [ ] Timer works correctly
- [ ] Answers can be submitted
- [ ] Results screen displays correctly

---

**Version:** 1.0.0  
**Last Updated:** January 2026  
**License:** Educational Use