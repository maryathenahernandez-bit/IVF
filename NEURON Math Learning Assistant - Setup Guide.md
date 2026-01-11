# NEURON Math Learning Assistant - Setup Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**NEURON** is an AI-powered math learning platform designed for Grade 11 and 12 students, focusing on Pre-calculus, Differential Calculus, and Integral Calculus. The application generates personalized math questions using AI (OpenAI GPT or Ollama) with a fallback to hardcoded questions.

### Key Features
- 🎓 Grade-specific content (Grade 11 & 12)
- 📚 Multiple math topics per grade
- 🎯 Three difficulty levels (Easy, Medium, Hard)
- 🤖 AI-powered question generation
- ⚡ Progressive loading with Server-Sent Events
- 📊 Real-time performance tracking
- 🎨 Modern, responsive UI with Tailwind CSS

### Tech Stack
**Frontend:**
- React 18.3.1 + TypeScript
- Vite 6.3.5
- Tailwind CSS 4.1.12
- Radix UI components
- Lucide React icons

**Backend:**
- Node.js + Express 4.18.2
- OpenAI API (Primary)
- Ollama (Secondary/Optional)
- Server-Sent Events for streaming

---

## 📦 Prerequisites

### Required Software
1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Git** (for cloning the repository)
   - Download: https://git-scm.com/

### Optional (for enhanced AI features)
4. **OpenAI API Key** (Recommended)
   - Sign up: https://platform.openai.com/
   - Get API key from dashboard

5. **Ollama** (Optional fallback)
   - Download: https://ollama.ai/
   - Install llama3 model: `ollama pull llama3`

---

## 🚀 Installation

### Step 1: Clone/Download Project
```bash
# Navigate to your project directory
cd D:\ivf
```

### Step 2: Install Frontend Dependencies
```bash
# Install root dependencies
npm install
```

Expected packages (from package.json):
- React ecosystem
- Tailwind CSS + plugins
- Radix UI components
- Material UI (optional)
- Vite build tools

### Step 3: Install Backend Dependencies
```bash
# Navigate to server directory
cd server

# Install server dependencies
npm install
```

Expected packages:
- express: Web server
- cors: Cross-origin requests
- dotenv: Environment variables
- axios: HTTP client
- csv-parse: CSV processing

### Step 4: Return to Root
```bash
cd ..
```

---

## ⚙️ Configuration

### 1. Backend Environment Variables

Create/edit `server/.env` file:

```env
# OpenAI Configuration (PRIMARY - Recommended)
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini

# Ollama Configuration (SECONDARY - Optional)
OLLAMA_HOST=127.0.0.1
OLLAMA_PORT=11434
```

**Configuration Options:**

#### Option A: OpenAI Only (Recommended)
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini
```
- ✅ Best quality questions
- ✅ Fast generation
- ❌ Requires API key and credits

#### Option B: Ollama Only (Free)
```env
# Leave OPENAI_API_KEY empty or remove it
OLLAMA_HOST=127.0.0.1
OLLAMA_PORT=11434
```
- ✅ Completely free
- ✅ Runs locally
- ❌ Requires Ollama installation
- ❌ Slower than OpenAI

#### Option C: Fallback Mode (No Setup)
- Leave .env empty or don't create it
- Uses hardcoded questions only
- ✅ Works immediately
- ❌ Limited question variety

### 2. Frontend Configuration

The frontend is pre-configured in `vite.config.ts`:
- Development server: Port 3000
- API proxy: Port 5000
- No additional configuration needed

---

## 🎮 Running the Application

### Method 1: Run Both (Recommended)
```bash
# From project root (D:\ivf)
npm run dev:all
```
This starts both frontend and backend simultaneously.

### Method 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm start
# Or for development with auto-restart:
npm run dev
```

**Terminal 2 - Frontend:**
```bash
# From project root
npm run dev
```

### Access the Application
1. Open browser: **http://localhost:3000**
2. Backend API: **http://localhost:5000**
3. Health check: **http://localhost:5000/health**

---

## 🔍 Verification Steps

### 1. Check Backend Status
```bash
curl http://localhost:5000/health
```

Expected response:
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

### 3. Frontend Verification
- Navigate to http://localhost:3000
- Select Grade 11 or 12
- Choose any topic
- Select difficulty
- Questions should load progressively

---

## 🐛 Troubleshooting

### Issue 1: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Issue 2: Backend Not Connecting

**Error:** Frontend shows "Failed to load questions"

**Check:**
1. Backend is running: `curl http://localhost:5000/health`
2. CORS is enabled (already configured)
3. Check backend console for errors

**Solution:**
```bash
# Restart backend
cd server
npm start
```

### Issue 3: OpenAI API Errors

**Error:** `401 Unauthorized` or `Invalid API key`

**Solutions:**
1. Verify API key in `server/.env`
2. Check API key has credits: https://platform.openai.com/usage
3. Try regenerating API key

**Fallback:**
- Remove/comment out `OPENAI_API_KEY`
- System will use Ollama or fallback mode

### Issue 4: Ollama Not Available

**Error:** `Ollama not available`

**Solutions:**
1. Check Ollama is running: `ollama list`
2. Verify model installed: `ollama pull llama3`
3. Check host/port in `.env`

**If Ollama isn't needed:**
- System automatically falls back to OpenAI or hardcoded questions

### Issue 5: Module Not Found

**Error:** `Cannot find module 'package-name'`

**Solution:**
```bash
# Reinstall dependencies
npm install

# For backend
cd server
npm install
```

### Issue 6: Build Errors

**Error:** Vite build fails

**Solution:**
```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

### Issue 7: Questions Not Generating

**Symptoms:** Infinite loading spinner

**Check:**
1. Backend console for errors
2. Network tab in browser DevTools
3. `/api/questions/stream` endpoint

**Solution:**
```bash
# Test streaming endpoint
curl http://localhost:5000/api/questions/stream?topic=Limits&difficulty=easy&grade=11
```

### Issue 8: Styling Issues

**Error:** UI looks unstyled

**Solution:**
1. Verify Tailwind is loaded
2. Check browser console for CSS errors
3. Clear browser cache: `Ctrl + Shift + R`

---

## 📊 System Requirements

### Minimum Requirements
- **RAM:** 4GB
- **Storage:** 500MB free space
- **CPU:** Dual-core processor
- **Internet:** Required for OpenAI API

### Recommended Requirements
- **RAM:** 8GB+ (for Ollama)
- **Storage:** 5GB+ (for Ollama models)
- **CPU:** Quad-core processor
- **Internet:** Stable connection for OpenAI

---

## 🎓 Quick Start Summary

```bash
# 1. Install dependencies
npm install
cd server && npm install && cd ..

# 2. Configure .env (optional but recommended)
# Add your OpenAI API key to server/.env

# 3. Run application
npm run dev:all

# 4. Open browser
# http://localhost:3000
```

---

## 📞 Support

### Common Questions

**Q: Do I need an OpenAI API key?**
A: No, but recommended for best quality. System works with Ollama or fallback mode.

**Q: How much does OpenAI API cost?**
A: Very cheap - approximately $0.01-0.05 per session. Check: https://openai.com/pricing

**Q: Can I use this offline?**
A: Yes, with Ollama installed. OpenAI requires internet.

**Q: How do I add more topics?**
A: Edit `server/questionGenerator.js` - MATH_TOPICS object.

**Q: Questions are too slow?**
A: Use OpenAI (fastest) or increase Ollama timeout settings.

---

## 🔄 Next Steps

After successful setup:
1. ✅ Test with all three difficulty levels
2. ✅ Try both Grade 11 and Grade 12
3. ✅ Check performance tracking
4. ✅ Review backend logs for AI service status
5. ✅ Read the [Full Documentation](link) for advanced features

---

## 📝 Notes

- First question may take 5-10 seconds to generate
- Subsequent questions stream progressively
- System automatically switches between AI services if one fails
- All math symbols are properly formatted with Unicode
- Timer only counts active question-solving time

**Version:** 1.0.0  
**Last Updated:** January 2026