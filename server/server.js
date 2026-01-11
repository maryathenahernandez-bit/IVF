import express from 'express';
import cors from 'cors';
import { MathQuestionGenerator } from './questionGenerator.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize question generator (NO CSV NEEDED!)
const generator = new MathQuestionGenerator();

// Hardcoded categories
const CATEGORIES = {
  11: ["Conic Sections", "Domain and Range", "Relations and Functions", "Functions", "Limits", "Derivatives"],
  12: ["Indefinite Integrals", "Definite Integrals", "Integration by Substitution", "Integration by Parts", "Area Under Curve", "Volume of Revolution"]
};

// Initialize and check AI availability
let aiStatus = {
  openai: false,
  ollama: false,
  primary: 'fallback'
};

(async () => {
  await generator.initialize();
  
  aiStatus.openai = generator.useOpenAI;
  aiStatus.ollama = generator.useOllama;
  
  if (generator.useOpenAI) {
    aiStatus.primary = 'openai';
  } else if (generator.useOllama) {
    aiStatus.primary = 'ollama';
  }
})();

// NEW ROUTE: Progressive question generation with Server-Sent Events
app.get('/api/questions/stream', async (req, res) => {
  const topic = req.query.topic || '';
  const difficulty = req.query.difficulty || 'easy';
  const gradeStr = req.query.grade || '11';
  const countStr = req.query.count || '10';

  let grade, count;
  try {
    grade = parseInt(gradeStr);
    count = parseInt(countStr);
  } catch (error) {
    grade = 11;
    count = 10;
  }

  // Set up Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  console.log(`\n📡 STREAMING ${count} questions for "${topic}" (${difficulty}, Grade ${grade})`);
  console.log(`   AI Status: Primary=${aiStatus.primary}, OpenAI=${aiStatus.openai}, Ollama=${aiStatus.ollama}`);

  // DETECT CLIENT DISCONNECT
  let clientDisconnected = false;
  
  req.on('close', () => {
    clientDisconnected = true;
    console.log('🛑 Client disconnected - stopping question generation');
  });

  try {
    const categoryTopics = generator.getCategoryTopics(grade, topic);
    let usingService = generator.useOpenAI ? 'openai' : generator.useOllama ? 'ollama' : 'fallback';
    let openAIFailed = false;

    for (let i = 0; i < count; i++) {
      // CHECK if client disconnected before generating each question
      if (clientDisconnected) {
        console.log(`⏹️  Stopped at question ${i + 1}/${count} due to client disconnect`);
        break;
      }

      let topicData = null;
      
      if (categoryTopics && categoryTopics.length > 0) {
        const topicIndex = i % categoryTopics.length;
        topicData = categoryTopics[topicIndex];
      }

      console.log(`  → [${i + 1}/${count}] Generating question...`);
      
      let question;
      try {
        if (usingService === 'openai' && !openAIFailed) {
          try {
            question = await generator.generateQuestionWithOpenAI(topicData, topic, difficulty, grade);
          } catch (error) {
            console.log(`  ⚠ [OpenAI] Failed, switching to ${generator.useOllama ? 'Ollama' : 'Fallback'}`);
            openAIFailed = true;
            usingService = generator.useOllama ? 'ollama' : 'fallback';
            
            if (usingService === 'ollama') {
              question = await generator.generateQuestionWithOllama(topicData, topic, difficulty, grade);
            } else {
              question = generator.generateFallbackQuestion(topic, difficulty, grade);
            }
          }
        } else if (usingService === 'ollama') {
          try {
            question = await generator.generateQuestionWithOllama(topicData, topic, difficulty, grade);
          } catch (error) {
            console.log(`  ⚠ [Ollama] Failed, using fallback`);
            usingService = 'fallback';
            question = generator.generateFallbackQuestion(topic, difficulty, grade);
          }
        } else {
          question = generator.generateFallbackQuestion(topic, difficulty, grade);
        }
      } catch (error) {
        console.log(`  ⚠ Error generating question, using fallback`);
        question = generator.generateFallbackQuestion(topic, difficulty, grade);
      }

      // CHECK again before sending (in case disconnect happened during generation)
      if (clientDisconnected) {
        console.log(`⏹️  Client disconnected after generating question ${i + 1}, not sending`);
        break;
      }

      // Send question immediately via SSE
      try {
        res.write(`data: ${JSON.stringify({ type: 'question', data: question, index: i })}\n\n`);
        console.log(`  ✓ Question ${i + 1}/${count} streamed using ${usingService.toUpperCase()}`);
      } catch (writeError) {
        console.log(`⏹️  Failed to write to stream - client likely disconnected`);
        break;
      }
    }

    // Only send completion if client is still connected
    if (!clientDisconnected) {
      res.write(`data: ${JSON.stringify({ type: 'complete', total: count })}\n\n`);
      console.log(`  ✓ Stream completed: ${count} questions sent\n`);
      res.end();
    } else {
      console.log(`  ⏹️  Stream terminated early due to client disconnect\n`);
    }

  } catch (error) {
    if (!clientDisconnected) {
      console.error('❌ Error in stream:', error);
      try {
        res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
        res.end();
      } catch (writeError) {
        console.log('⏹️  Could not send error - client disconnected');
      }
    }
  }
});

// EXISTING ROUTE: Generate all questions at once (keep for backwards compatibility)
app.get('/api/questions', async (req, res) => {
  const topic = req.query.topic || '';
  const difficulty = req.query.difficulty || 'easy';
  const gradeStr = req.query.grade || '11';

  let grade;
  try {
    grade = parseInt(gradeStr);
  } catch (error) {
    grade = 11;
  }

  try {
    console.log(`\n🔍 Generating questions for "${topic}" (${difficulty}, Grade ${grade})`);
    console.log(`   AI Status: Primary=${aiStatus.primary}, OpenAI=${aiStatus.openai}, Ollama=${aiStatus.ollama}`);
    
    const questions = await generator.generateQuestionsBatch(topic, difficulty, grade, 10);
    res.json({ success: true, questions });
  } catch (error) {
    console.error('❌ Error generating questions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/topics', (req, res) => {
  const gradeStr = req.query.grade || '11';

  let grade;
  try {
    grade = parseInt(gradeStr);
  } catch (error) {
    grade = 11;
  }

  const topics = CATEGORIES[grade] || CATEGORIES[11];

  res.json({
    success: true,
    topics
  });
});

app.get('/api/symbols', (req, res) => {
  const symbols = {
    operators: ['+', '−', '/', '*', '=', '≠', '≥', '≤'],
    calculus: ['∫', 'd', '∂', '∞', 'lim', 'Σ', 'Π'],
    functions: ['sin', 'cos', 'tan', 'sec', 'ln', 'log', '√', 'π', 'e'],
    superscripts: ['²', '³', '^'],
    brackets: ['(', ')', '[', ']', '{', '}'],
    greek: ['α', 'β', 'γ', 'δ', 'θ', 'λ', 'μ', 'π', 'σ', 'τ', 'φ', 'ω']
  };

  res.json({
    success: true,
    symbols
  });
});

app.get('/health', async (req, res) => {
  res.json({
    status: 'healthy',
    ai_services: {
      openai: aiStatus.openai,
      ollama: aiStatus.ollama,
      primary: aiStatus.primary
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(70));
  console.log('              Math Learning Assistant API Server');
  console.log('='.repeat(70));
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('AI Configuration:');
  console.log(`  OpenAI: ${process.env.OPENAI_API_KEY ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`  Ollama: Checking availability...`);
  console.log('');
  console.log('Priority: OpenAI → Ollama → Fallback');
  console.log('='.repeat(70));
});