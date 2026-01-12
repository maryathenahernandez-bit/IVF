import axios from 'axios';
import { FallbackQuestionGenerator } from './fallbackQuestionGenerator.js';

// Hardcoded topics structure - Simple topic names only
const MATH_TOPICS = {
  11: {
    "Conic Sections": [
      "Circles",
      "Ellipses",
      "Parabolas",
      "Hyperbolas"
    ],
    "Domain and Range": [
      "Domain",
      "Range"
    ],
    "Relations and Functions": [
      "Relations and Functions",
      "Function Transformations"
    ],
    "Functions": [
      "Quadratic Functions",
      "Polynomial Functions"
    ],
    "Limits": [
      "Limits",
      "L'Hopital's Rule"
    ],
    "Derivatives": [
      "Power Rule",
      "Exponential Derivatives",
      "Logarithmic Derivatives",
      "Trigonometric Derivatives",
      "Inverse Trig Derivatives",
      "Hyperbolic Derivatives",
      "Inverse Hyperbolic Derivatives",
      "Product Rule",
      "Quotient Rule",
      "Chain Rule"
    ]
  },
  12: {
    "Indefinite Integrals": [
      "Basic Integrals",
      "Exponential Integrals",
      "Logarithmic Integrals",
      "Trigonometric Integrals",
      "Advanced Trig Integrals",
      "Hyperbolic Integrals",
      "Inverse Trig Integrals",
      "Inverse Hyperbolic Integrals"
    ],
    "Definite Integrals": [
      "Definite Integrals",
      "Fundamental Theorem of Calculus"
    ],
    "Integration by Substitution": [
      "U-substitution"
    ],
    "Integration by Parts": [
      "Integration by Parts"
    ],
    "Area Under Curve": [
      "Area Between Curves"
    ],
    "Volume of Revolution": [
      "Disk Method",
      "Washer Method",
      "Shell Method"
    ]
  }
};

// ✨ NEW: Helper function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ✨ NEW: Helper function to randomize options
function randomizeOptions(correctAnswer, allOptions) {
  if (!allOptions || Object.keys(allOptions).length === 0) {
    return { options: allOptions, answer: correctAnswer };
  }

  // Get all option values
  const optionValues = Object.values(allOptions);
  
  // Shuffle the values
  const shuffledValues = shuffleArray(optionValues);
  
  // Find which position the correct answer ended up in
  const correctValue = allOptions[correctAnswer];
  const correctIndex = shuffledValues.indexOf(correctValue);
  
  // Map to A, B, C, D
  const letters = ['A', 'B', 'C', 'D'];
  const newOptions = {};
  shuffledValues.forEach((value, index) => {
    newOptions[letters[index]] = value;
  });
  
  // Return new options and the new letter for the correct answer
  return {
    options: newOptions,
    answer: letters[correctIndex]
  };
}

export class MathQuestionGenerator {
  constructor(csvPath = null, ollamaUrl = null) {
    this.fallbackGenerator = new FallbackQuestionGenerator();
    
    // OpenAI Configuration (PRIMARY)
    this.openaiApiKey = process.env.OPENAI_API_KEY || null;
    this.openaiModel = process.env.OPENAI_MODEL || 'gpt-5-nano';
    this.useOpenAI = !!this.openaiApiKey;
    
    // Ollama Configuration (SECONDARY)
    this.useOllama = false;
    const envUrl = process.env.OLLAMA_URL || null;
    const envHost = process.env.OLLAMA_HOST || null;
    const envPort = process.env.OLLAMA_HTTP_PORT || process.env.OLLAMA_PORT || null;

    if (ollamaUrl) {
      this.ollamaUrl = ollamaUrl;
    } else if (envUrl) {
      this.ollamaUrl = envUrl;
    } else if (envHost && envHost.startsWith('http')) {
      this.ollamaUrl = envHost;
    } else if (envHost && envPort) {
      this.ollamaUrl = `http://${envHost}:${envPort}`;
    } else if (envHost) {
      if (envHost.includes(':')) {
        this.ollamaUrl = `http://${envHost}`;
      } else {
        this.ollamaUrl = `http://${envHost}:11434`;
      }
    } else if (envPort) {
      this.ollamaUrl = `http://127.0.0.1:${envPort}`;
    } else {
      this.ollamaUrl = 'http://127.0.0.1:11434';
    }

    console.log(`Loaded hardcoded topics structure`);
  }

  async initialize() {
    if (this.useOpenAI) {
      console.log(`✓ PRIMARY: OpenAI API configured (Model: ${this.openaiModel})`);
    }
    
    try {
      const response = await axios.get(`${this.ollamaUrl}/api/tags`, { timeout: 2000 });
      if (response.status === 200) {
        this.useOllama = true;
        console.log(`✓ SECONDARY: Ollama available at ${this.ollamaUrl}`);
      }
    } catch (error) {
      this.useOllama = false;
      console.log(`✗ SECONDARY: Ollama not available`);
    }
    
    if (!this.useOpenAI && !this.useOllama) {
      console.log(`⚠ Using FALLBACK generator only (hardcoded questions)`);
    }
  }

  getCategoryTopics(grade, category) {
    const gradeTopics = MATH_TOPICS[grade];
    if (!gradeTopics) {
      console.log(`  ⚠ No topics for Grade ${grade}`);
      return null;
    }

    const categoryTopics = gradeTopics[category];
    if (!categoryTopics) {
      console.log(`  ⚠ No topics for Category "${category}"`);
      return null;
    }

    // Return array of topic strings
    return categoryTopics;
  }

  formatMathQuestion(questionText) {
    let formatted = questionText;
    
    // STEP 1: Remove duplicate integral symbols
    formatted = formatted.replace(/∫∫+/g, '∫');
    formatted = formatted.replace(/\bintegral\s+integral\b/gi, 'integral');
    
    // STEP 2: Superscript character mapping
    const superscriptMap = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', 
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
      'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 
      'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ', 
      'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 
      'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 
      'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
      'A': 'ᴬ', 'B': 'ᴮ', 'D': 'ᴰ', 'E': 'ᴱ', 'G': 'ᴳ', 
      'H': 'ᴴ', 'I': 'ᴵ', 'J': 'ᴶ', 'K': 'ᴷ', 'L': 'ᴸ', 
      'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ', 'R': 'ᴿ', 
      'T': 'ᵀ', 'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ',
      '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾'
    };
    
    // STEP 3: Convert exponents in parentheses first: ^(2x), ^(n+1)
    formatted = formatted.replace(/\^\(([^)]+)\)/g, (match, content) => {
      let result = '';
      for (let char of content) {
        result += superscriptMap[char] || char;
      }
      return result;
    });
    
    // STEP 4: Convert single-character exponents: ^2, ^x, ^n
    formatted = formatted.replace(/\^([a-zA-Z0-9])(?=[\s\)\],.\+\-\*\/=]|$)/g, (match, char) => {
      return superscriptMap[char] || match;
    });
    
    // STEP 5: Greek letters
    formatted = formatted.replace(/\bpi\b/gi, 'π');
    formatted = formatted.replace(/\btheta\b/gi, 'θ');
    formatted = formatted.replace(/\balpha\b/gi, 'α');
    formatted = formatted.replace(/\bbeta\b/gi, 'β');
    formatted = formatted.replace(/\bgamma\b/gi, 'γ');
    formatted = formatted.replace(/\bdelta\b/gi, 'δ');
    
    // STEP 6: Math operators
    formatted = formatted.replace(/\*\*/g, '×');
    formatted = formatted.replace(/\bsqrt\(/g, '√(');
    formatted = formatted.replace(/\binfinity\b/gi, '∞');
    
    // STEP 7: Calculus symbols
    formatted = formatted.replace(/\bintegral\b/gi, '∫');
    formatted = formatted.replace(/\bsum\b/gi, 'Σ');
    
    // STEP 8: Comparison operators
    formatted = formatted.replace(/\s>=\s/g, ' ≥ ');
    formatted = formatted.replace(/\s<=\s/g, ' ≤ ');
    formatted = formatted.replace(/\s!=\s/g, ' ≠ ');
    
    // STEP 9: Arrows
    formatted = formatted.replace(/\s->\s/g, ' → ');
    
    return formatted;
  }

  async generateQuestionWithOpenAI(topicData, category, difficulty, grade) {
    // topicData is now just a string (topic name)
    const specificTopic = topicData || category;

    const systemPrompt = `You are a math education expert. Generate clear, educational math questions with proper Unicode symbols.

Use these symbols:
- Exponents: ² ³ ⁴ ⁵
- Math: × ÷ √ π ∞
- Calculus: ∫ Σ →
- Comparisons: ≥ ≤ ≠

You must respond with ONLY a valid JSON object, no other text.`;

    const userPrompt = `Create a ${difficulty} level Grade ${grade} question for ${specificTopic}.

This MUST be a multiple choice question with 4 options (A, B, C, D).
- Generate 3 plausible wrong answers (distractors)
- Make distractors realistic (common student mistakes)
- Include proper formulas and mathematical notation
- Provide a clear, educational explanation

Respond with this exact JSON structure:
{
  "question": "question with proper symbols",
  "options": {
    "A": "first option",
    "B": "second option", 
    "C": "third option",
    "D": "fourth option"
  },
  "answer": "A",
  "explanation": "Detailed explanation of why this answer is correct and why others are wrong"
}`;

    try {
      const requestBody = {
        model: this.openaiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 1,
        max_completion_tokens: 10000
      };
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 0
        }
      );

      const content = response.data.choices[0].message.content;
      
      console.log(`  → [OpenAI] Raw response:`, content.substring(0, 200) + '...');
      
      let questionData;
      try {
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        questionData = JSON.parse(cleanContent);
      } catch (parseError) {
        console.log(`  → [OpenAI] First parse failed, trying to extract JSON...`);
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            questionData = JSON.parse(jsonMatch[0]);
          } catch (e) {
            console.log(`  → [OpenAI] Second parse failed. Full response:`, content);
            throw new Error('Could not parse JSON from OpenAI response');
          }
        } else {
          console.log(`  → [OpenAI] No JSON found in response:`, content);
          throw new Error('Could not parse JSON from OpenAI response');
        }
      }

      // Ensure options exist
      if (!questionData.options) {
        questionData.options = {
          A: questionData.answer || "Option A",
          B: "Option B",
          C: "Option C", 
          D: "Option D"
        };
        questionData.answer = "A";
      }
      
      // ✨ RANDOMIZE OPTIONS POSITION
      const randomized = randomizeOptions(questionData.answer, questionData.options);
      questionData.options = randomized.options;
      questionData.answer = randomized.answer;
      
      questionData.id = `${category}-${difficulty}-${Math.floor(Math.random() * 9000) + 1000}`;
      questionData.difficulty = difficulty;
      questionData.topic = category;
      questionData.category = category;
      questionData.subtopic = specificTopic;
      questionData.grade = grade;
      
      if (questionData.question) {
        questionData.question = this.formatMathQuestion(questionData.question);
      }
      
      if (questionData.options) {
        Object.keys(questionData.options).forEach(key => {
          if (typeof questionData.options[key] === 'string') {
            questionData.options[key] = this.formatMathQuestion(questionData.options[key]);
          }
        });
      }
      
      if (questionData.explanation) {
        questionData.explanation = this.formatMathQuestion(questionData.explanation);
      }
      
      return questionData;
    } catch (error) {
      console.log(`  ⚠ [OpenAI] Failed: ${error.message}`);
      
      if (error.response) {
        console.log(`  → [OpenAI] Status: ${error.response.status}`);
        console.log(`  → [OpenAI] Error:`, JSON.stringify(error.response.data, null, 2));
      }
      
      throw error;
    }
  }

  async generateQuestionWithOllama(topicData, category, difficulty, grade) {
    // topicData is now just a string (topic name)
    const specificTopic = topicData || category;

    const prompt = `Generate a ${difficulty} difficulty multiple choice question about ${specificTopic} for Grade ${grade}.

Requirements:
- Use Unicode symbols: ² ³ ⁴ π √ ∞ → × ÷ ≥ ≤
- Create 4 answer choices (A, B, C, D)
- Make wrong answers realistic (common mistakes)
- Include proper mathematical formulas and notation
- Provide clear explanation

Respond ONLY with this JSON structure:
{
  "question": "question text",
  "options": {
    "A": "first choice",
    "B": "second choice",
    "C": "third choice",
    "D": "fourth choice"
  },
  "answer": "A",
  "explanation": "why answer is correct"
}`;

    try {
      console.log(`  → [Ollama] Sending request...`);
      
      const response = await axios.post(
        `${this.ollamaUrl}/api/generate`,
        {
          model: 'llama3',
          prompt: prompt,
          format: 'json',
          stream: false
        },
        { timeout: 0 }
      );

      if (response.status === 200) {
        const result = response.data;
        let questionData;

        if (result.response) {
          try {
            questionData = JSON.parse(result.response);
            console.log(`  → [Ollama] Successfully parsed JSON`);
          } catch (error) {
            console.log(`  → [Ollama] Parse error:`, error.message);
            console.log(`  → [Ollama] Response:`, result.response.substring(0, 300));
            questionData = result;
          }
        } else {
          questionData = result;
        }

        if (!questionData.options || typeof questionData.options !== 'object' || Object.keys(questionData.options).length === 0) {
          console.log(`  → [Ollama] No valid options, generating from answer`);
          
          const correctAnswer = String(questionData.answer || "Correct Answer");
          let wrongAnswers = [];
          
          if (!isNaN(parseFloat(correctAnswer))) {
            const num = parseFloat(correctAnswer);
            wrongAnswers = [
              String(Math.round((num + 1) * 10) / 10),
              String(Math.round((num - 1) * 10) / 10),
              String(Math.round(num * 1.5 * 10) / 10)
            ];
          } else {
            wrongAnswers = [
              "Alternative answer B",
              "Alternative answer C",
              "Alternative answer D"
            ];
          }
          
          const allOptions = [correctAnswer, ...wrongAnswers];
          const shuffled = allOptions.sort(() => Math.random() - 0.5);
          const correctIndex = shuffled.indexOf(correctAnswer);
          const letters = ['A', 'B', 'C', 'D'];
          
          questionData.options = {
            A: shuffled[0],
            B: shuffled[1],
            C: shuffled[2],
            D: shuffled[3]
          };
          questionData.answer = letters[correctIndex];
          
          console.log(`  → [Ollama] Created options: ${JSON.stringify(questionData.options)}`);
          console.log(`  → [Ollama] Correct answer is: ${questionData.answer}`);
        } else {
          // ✨ RANDOMIZE OPTIONS POSITION
          const randomized = randomizeOptions(questionData.answer, questionData.options);
          questionData.options = randomized.options;
          questionData.answer = randomized.answer;
        }

        questionData.id = `${category}-${difficulty}-${Math.floor(Math.random() * 9000) + 1000}`;
        questionData.difficulty = difficulty;
        questionData.topic = category;
        questionData.category = category;
        questionData.subtopic = specificTopic;
        questionData.grade = grade;
        
        if (questionData.question) {
          questionData.question = this.formatMathQuestion(questionData.question);
        }
        
        if (questionData.options) {
          Object.keys(questionData.options).forEach(key => {
            if (typeof questionData.options[key] === 'string') {
              questionData.options[key] = this.formatMathQuestion(questionData.options[key]);
            }
          });
        }
        
        if (questionData.explanation) {
          questionData.explanation = this.formatMathQuestion(questionData.explanation);
        }
        
        console.log(`  → [Ollama] Question generated successfully`);
        return questionData;
      } else {
        throw new Error(`Ollama API error: ${response.status}`);
      }
    } catch (error) {
      console.log(`  ⚠ [Ollama] Failed: ${error.message}`);
      throw error;
    }
  }

  generateFallbackQuestion(topic, difficulty, grade) {
    const questionId = `${topic}-${difficulty}-${Math.floor(Math.random() * 9000) + 1000}`;
    const fallbackQ = this.fallbackGenerator.generateSingleQuestion(topic, difficulty, grade, questionId);
    
    if (!fallbackQ.options) {
      const correctAnswer = String(fallbackQ.answer);
      
      let wrongAnswers = [];
      if (!isNaN(parseFloat(correctAnswer))) {
        const num = parseFloat(correctAnswer);
        wrongAnswers = [
          String(num + 1),
          String(num - 1),
          String(num * 2)
        ];
      } else {
        wrongAnswers = ["Incorrect option 1", "Incorrect option 2", "Incorrect option 3"];
      }
      
      const allOptions = [correctAnswer, ...wrongAnswers];
      const shuffled = allOptions.sort(() => Math.random() - 0.5);
      const correctIndex = shuffled.indexOf(correctAnswer);
      const letters = ['A', 'B', 'C', 'D'];
      
      fallbackQ.options = {
        A: shuffled[0],
        B: shuffled[1],
        C: shuffled[2],
        D: shuffled[3]
      };
      fallbackQ.answer = letters[correctIndex];
      
      if (!fallbackQ.explanation) {
        fallbackQ.explanation = "This is the correct answer based on the mathematical principles.";
      }
    } else {
      // ✨ RANDOMIZE OPTIONS POSITION for fallback questions too
      const randomized = randomizeOptions(fallbackQ.answer, fallbackQ.options);
      fallbackQ.options = randomized.options;
      fallbackQ.answer = randomized.answer;
    }
    
    return fallbackQ;
  }

  async generateSingleQuestion(topic, difficulty, grade, topicData = null) {
    if (this.useOpenAI) {
      try {
        return await this.generateQuestionWithOpenAI(topicData, topic, difficulty, grade);
      } catch (error) {
        console.log(`  → OpenAI failed, trying Ollama...`);
      }
    }
    
    if (this.useOllama) {
      try {
        return await this.generateQuestionWithOllama(topicData, topic, difficulty, grade);
      } catch (error) {
        console.log(`  → Ollama failed, using fallback...`);
      }
    }
    
    return this.generateFallbackQuestion(topic, difficulty, grade);
  }

  async generateQuestionsBatch(topic, difficulty, grade, count = 10) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📝 GENERATING ${count} QUESTIONS`);
    console.log(`   Category: "${topic}"`);
    console.log(`   Difficulty: ${difficulty}`);
    console.log(`   Grade: ${grade}`);
    console.log(`   AI: ${this.useOpenAI ? 'OpenAI' : this.useOllama ? 'Ollama' : 'Fallback'}`);
    console.log('='.repeat(70));
    
    const categoryTopics = this.getCategoryTopics(grade, topic);

    let openAIFailed = false;
    let usingService = this.useOpenAI ? 'openai' : this.useOllama ? 'ollama' : 'fallback';

    if (categoryTopics && categoryTopics.length > 0) {
      console.log(`  ✓ Found ${categoryTopics.length} subtopics under "${topic}"`);
      const subtopicNames = categoryTopics.join(', ');
      console.log(`  → Subtopics: ${subtopicNames}\n`);

      const questions = [];
      const startTime = Date.now();
      
      for (let i = 0; i < count; i++) {
        const topicIndex = i % categoryTopics.length;
        const selectedTopic = categoryTopics[topicIndex]; // Just a string now
        
        console.log(`  → [${i + 1}/${count}] Generating: ${topic} - ${selectedTopic}`);
        
        const questionStart = Date.now();
        
        let question;
        try {
          if (usingService === 'openai' && !openAIFailed) {
            try {
              question = await this.generateQuestionWithOpenAI(selectedTopic, topic, difficulty, grade);
            } catch (error) {
              console.log(`  ⚠ [OpenAI] Failed on question ${i + 1}, switching to ${this.useOllama ? 'Ollama' : 'Fallback'} for remaining questions`);
              openAIFailed = true;
              usingService = this.useOllama ? 'ollama' : 'fallback';
              
              if (usingService === 'ollama') {
                question = await this.generateQuestionWithOllama(selectedTopic, topic, difficulty, grade);
              } else {
                question = this.generateFallbackQuestion(topic, difficulty, grade);
              }
            }
          } else if (usingService === 'ollama') {
            try {
              question = await this.generateQuestionWithOllama(selectedTopic, topic, difficulty, grade);
            } catch (error) {
              console.log(`  ⚠ [Ollama] Failed, using fallback`);
              usingService = 'fallback';
              question = this.generateFallbackQuestion(topic, difficulty, grade);
            }
          } else {
            question = this.generateFallbackQuestion(topic, difficulty, grade);
          }
        } catch (error) {
          console.log(`  ⚠ Error generating question, using fallback`);
          question = this.generateFallbackQuestion(topic, difficulty, grade);
        }
        
        const questionTime = ((Date.now() - questionStart) / 1000).toFixed(2);
        console.log(`  ✓ Question ${i + 1}/${count} (${selectedTopic}) generated in ${questionTime}s using ${usingService.toUpperCase()}\n`);
        questions.push(question);
      }
      
      const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`  ✓ Generated all ${questions.length} questions in ${totalTime}s`);
      console.log('='.repeat(70) + '\n');
      return questions;
    }

    console.log(`  → No topics found, generating generically...\n`);
    const questions = [];
    const startTime = Date.now();
    
    for (let i = 0; i < count; i++) {
      console.log(`  → [${i + 1}/${count}] Generating generic question for: ${topic}`);
      
      const questionStart = Date.now();
      
      let question;
      try {
        if (usingService === 'openai' && !openAIFailed) {
          try {
            question = await this.generateQuestionWithOpenAI(null, topic, difficulty, grade);
          } catch (error) {
            console.log(`  ⚠ [OpenAI] Failed on question ${i + 1}, switching to ${this.useOllama ? 'Ollama' : 'Fallback'}`);
            openAIFailed = true;
            usingService = this.useOllama ? 'ollama' : 'fallback';
            
            if (usingService === 'ollama') {
              question = await this.generateQuestionWithOllama(null, topic, difficulty, grade);
            } else {
              question = this.generateFallbackQuestion(topic, difficulty, grade);
            }
          }
        } else if (usingService === 'ollama') {
          try {
            question = await this.generateQuestionWithOllama(null, topic, difficulty, grade);
          } catch (error) {
            console.log(`  ⚠ [Ollama] Failed, using fallback`);
            usingService = 'fallback';
            question = this.generateFallbackQuestion(topic, difficulty, grade);
          }
        } else {
          question = this.generateFallbackQuestion(topic, difficulty, grade);
        }
      } catch (error) {
        question = this.generateFallbackQuestion(topic, difficulty, grade);
      }
      
      const questionTime = ((Date.now() - questionStart) / 1000).toFixed(2);
      console.log(`  ✓ Question ${i + 1}/${count} generated in ${questionTime}s using ${usingService.toUpperCase()}\n`);
      questions.push(question);
    }
    
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`  ✓ Generated all ${questions.length} questions in ${totalTime}s`);
    console.log('='.repeat(70) + '\n');
    return questions;
  }
}