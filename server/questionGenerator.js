import axios from 'axios';
import { FallbackQuestionGenerator } from './fallbackQuestionGenerator.js';

// Hardcoded topics structure - NO CSV NEEDED!
const MATH_TOPICS = {
  11: {
    "Conic Sections": [
      { topic: "Circles", concept: "Standard form and properties", equation: "(x-h)² + (y-k)² = r²", rules: "Center (h, k), radius r" },
      { topic: "Ellipses", concept: "Horizontal and vertical major axis", equation: "(x-h)²/a² + (y-k)²/b² = 1", rules: "c² = a² - b², foci at (h±c, k)" },
      { topic: "Parabolas", concept: "Vertical/horizontal opening", equation: "(x-h)² = 4p(y-k)", rules: "Vertex (h, k), focus p units from vertex" },
      { topic: "Hyperbolas", concept: "Horizontal/vertical transverse axis", equation: "(x-h)²/a² - (y-k)²/b² = 1", rules: "c² = a² + b², asymptotes y = ±(b/a)(x-h) + k" }
    ],
    "Domain and Range": [
      { topic: "Domain", concept: "Set of possible x-values", equation: "Domain: All x where f(x) is defined", rules: "For rational: denominator ≠ 0" },
      { topic: "Range", concept: "Set of possible y-values", equation: "Range: All y from f(x)", rules: "Use graph or derivative to find min/max y" }
    ],
    "Relations and Functions": [
      { topic: "Relations and Functions", concept: "Identify functions vs relations", equation: "f(x) notation; mapping diagrams", rules: "Vertical line test: one output per input" },
      { topic: "Functions", concept: "Transformations and graphing", equation: "y = a·f(b(x-h)) + k", rules: "Shifts: h (horizontal), k (vertical)" }
    ],
    "Functions": [
      { topic: "Functions", concept: "Analyzing and graphing functions", equation: "f(x) = ax² + bx + c", rules: "Quadratic functions, vertex, axis of symmetry" }
    ],
    "Limits": [
      { topic: "Limits", concept: "Limit definition and continuity", equation: "lim(x→a) f(x) = L", rules: "If lim(x→a) f(x) = f(a), f is continuous at a" },
      { topic: "L'Hopital's Rule", concept: "Evaluating indeterminate forms", equation: "lim f(x)/g(x) = lim f'(x)/g'(x)", rules: "Apply when 0/0 or ∞/∞ form" }
    ],
    "Derivatives": [
      { topic: "Power Rule", concept: "Basic differentiation", equation: "d/dx[xⁿ] = nxⁿ⁻¹", rules: "Applies to all real n" },
      { topic: "Exponential Derivatives", concept: "Differentiating exponential functions", equation: "d/dx[eˣ] = eˣ; d/dx[aˣ] = aˣ ln a", rules: "Chain rule: d/dx[e^(g(x))] = e^(g(x))·g'(x)" },
      { topic: "Logarithmic Derivatives", concept: "Differentiating log functions", equation: "d/dx[ln x] = 1/x", rules: "d/dx[ln g(x)] = g'(x)/g(x)" },
      { topic: "Trigonometric Derivatives", concept: "Basic trig derivatives", equation: "d/dx[sin x] = cos x; d/dx[cos x] = -sin x", rules: "d/dx[tan x] = sec²x" },
      { topic: "Inverse Trig Derivatives", concept: "Derivatives of inverse trig functions", equation: "d/dx[sin⁻¹ x] = 1/√(1-x²)", rules: "Domains are restricted" },
      { topic: "Hyperbolic Derivatives", concept: "Hyperbolic function derivatives", equation: "d/dx[sinh x] = cosh x", rules: "d/dx[tanh x] = sech²x" },
      { topic: "Inverse Hyperbolic Derivatives", concept: "Inverse hyperbolic derivatives", equation: "d/dx[sinh⁻¹ x] = 1/√(x²+1)", rules: "Domain restrictions apply" },
      { topic: "Product Rule", concept: "Differentiating products", equation: "(fg)' = f'g + fg'", rules: "Differentiate each, multiply, add" },
      { topic: "Quotient Rule", concept: "Differentiating quotients", equation: "(f/g)' = (f'g - fg')/g²", rules: "Lo d-hi minus hi d-lo over lo-lo" },
      { topic: "Chain Rule", concept: "Composite functions", equation: "d/dx[f(g(x))] = f'(g(x))·g'(x)", rules: "Outside-inside differentiation" }
    ]
  },
  12: {
    "Indefinite Integrals": [
      { topic: "Basic Integrals", concept: "Constant and power integrals", equation: "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C", rules: "Add constant C; n ≠ -1" },
      { topic: "Exponential Integrals", concept: "Integrating exponential functions", equation: "∫ eˣ dx = eˣ + C; ∫ aˣ dx = aˣ/ln(a) + C", rules: "a > 0, a ≠ 1" },
      { topic: "Logarithmic Integrals", concept: "Integrating 1/x", equation: "∫ dx/x = ln|x| + C", rules: "Absolute value for domain" },
      { topic: "Trigonometric Integrals", concept: "Basic trig integrals", equation: "∫ sin x dx = -cos x + C; ∫ cos x dx = sin x + C", rules: "∫ sec²x dx = tan x + C" },
      { topic: "Advanced Trig Integrals", concept: "Other trig integrals", equation: "∫ tan x dx = ln|sec x| + C", rules: "Memorize or use substitution" },
      { topic: "Hyperbolic Integrals", concept: "Hyperbolic function integrals", equation: "∫ sinh x dx = cosh x + C", rules: "Related to derivatives" },
      { topic: "Inverse Trig Integrals", concept: "Forms yielding inverse trig", equation: "∫ dx/(a²+x²) = (1/a)tan⁻¹(x/a) + C", rules: "Recognize standard forms" },
      { topic: "Inverse Hyperbolic Integrals", concept: "Forms yielding inverse hyperbolic", equation: "∫ dx/√(a²+x²) = sinh⁻¹(x/a) + C", rules: "Recognize standard forms" }
    ],
    "Definite Integrals": [
      { topic: "Definite Integrals", concept: "FTC and evaluation", equation: "∫[a,b] f(x) dx = F(b) - F(a)", rules: "F is antiderivative; area under curve" }
    ],
    "Integration by Substitution": [
      { topic: "U-substitution", concept: "Change of variables", equation: "∫ f(g(x))g'(x) dx = ∫ f(u) du where u=g(x)", rules: "Reverse chain rule" }
    ],
    "Integration by Parts": [
      { topic: "Integration by Parts", concept: "Product integration", equation: "∫ u dv = uv - ∫ v du", rules: "Choose u: LIATE (Log, Inverse trig, Algebraic, Trig, Exp)" }
    ],
    "Area Under Curve": [
      { topic: "Area Between Curves", concept: "Area using integrals", equation: "A = ∫[a,b] [f(x) - g(x)] dx", rules: "f(x) ≥ g(x); split if curves cross" }
    ],
    "Volume of Revolution": [
      { topic: "Disk/Washer Method", concept: "Volume by revolution", equation: "V = π∫[a,b] [R(x)]² dx", rules: "R = outer radius, r = inner radius for washer" },
      { topic: "Shell Method", concept: "Cylindrical shells", equation: "V = 2π∫[a,b] x·f(x) dx", rules: "Use when rotating around y-axis" }
    ]
  }
};

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
    formatted = formatted.replace(/sqrt\(/g, '√(');
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
    const refEq = topicData?.equation || '';
    const keyRules = topicData?.rules || '';
    const concept = topicData?.concept || '';
    const specificTopic = topicData?.topic || category;

    const systemPrompt = `You are a math education expert. Generate clear, educational math questions with proper Unicode symbols.

Use these symbols:
- Exponents: ² ³ ⁴ ⁵
- Math: × ÷ √ π ∞
- Calculus: ∫ Σ →
- Comparisons: ≥ ≤ ≠

You must respond with ONLY a valid JSON object, no other text.`;

    const userPrompt = `Create a ${difficulty} level Grade ${grade} question for ${specificTopic}${concept ? ` (${concept})` : ''}.

${refEq ? `Reference: ${refEq}` : ''}
${keyRules ? `Rules: ${keyRules}` : ''}

This MUST be a multiple choice question with 4 options (A, B, C, D).
- Generate 3 plausible wrong answers (distractors)
- Make distractors realistic (common student mistakes)

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
        temperature: 1,  // Set to 1 for more variety
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

      questionData.id = `${category}-${difficulty}-${Math.floor(Math.random() * 9000) + 1000}`;
      questionData.difficulty = difficulty;
      questionData.topic = category;
      questionData.category = category;
      questionData.subtopic = specificTopic;
      questionData.grade = grade;
      
      // Ensure options exist, create default if missing
      if (!questionData.options) {
        questionData.options = {
          A: questionData.answer || "Option A",
          B: "Option B",
          C: "Option C", 
          D: "Option D"
        };
        questionData.answer = "A";
      }
      
      if (questionData.question) {
        questionData.question = this.formatMathQuestion(questionData.question);
      }
      
      // Format all options
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
    const refEq = topicData?.equation || '';
    const keyRules = topicData?.rules || '';
    const concept = topicData?.concept || '';
    const specificTopic = topicData?.topic || category;

    const prompt = `Generate a ${difficulty} difficulty multiple choice question about ${specificTopic} for Grade ${grade}.

${concept ? `Concept: ${concept}` : ''}
${refEq ? `Formula: ${refEq}` : ''}
${keyRules ? `Rules: ${keyRules}` : ''}

Requirements:
- Use Unicode symbols: ² ³ ⁴ π √ ∞ → × ÷ ≥ ≤
- Create 4 answer choices (A, B, C, D)
- Make wrong answers realistic (common mistakes)
- Provide explanation

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

        // Validate and ensure options exist
        if (!questionData.options || typeof questionData.options !== 'object' || Object.keys(questionData.options).length === 0) {
          console.log(`  → [Ollama] No valid options, generating from answer`);
          
          // Generate options based on the answer
          const correctAnswer = String(questionData.answer || "Correct Answer");
          let wrongAnswers = [];
          
          // Try to generate intelligent wrong answers
          if (!isNaN(parseFloat(correctAnswer))) {
            const num = parseFloat(correctAnswer);
            wrongAnswers = [
              String(Math.round((num + 1) * 10) / 10),
              String(Math.round((num - 1) * 10) / 10),
              String(Math.round(num * 1.5 * 10) / 10)
            ];
          } else {
            // For non-numeric answers, create generic options
            wrongAnswers = [
              "Alternative answer B",
              "Alternative answer C",
              "Alternative answer D"
            ];
          }
          
          // Shuffle and assign
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
        
        // Format all options
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
    
    // Convert fallback to multiple choice format
    if (!fallbackQ.options) {
      const correctAnswer = String(fallbackQ.answer);
      
      // Generate 3 wrong answers based on the correct answer
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
      
      // Shuffle and assign to A, B, C, D
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

    // Track if OpenAI failed - if so, switch to Ollama for the rest
    let openAIFailed = false;
    let usingService = this.useOpenAI ? 'openai' : this.useOllama ? 'ollama' : 'fallback';

    if (categoryTopics && categoryTopics.length > 0) {
      console.log(`  ✓ Found ${categoryTopics.length} subtopics under "${topic}"`);
      const subtopicNames = categoryTopics.map(t => t.topic).join(', ');
      console.log(`  → Subtopics: ${subtopicNames}\n`);

      const questions = [];
      const startTime = Date.now();
      
      for (let i = 0; i < count; i++) {
        const topicIndex = i % categoryTopics.length;
        const selectedTopicData = categoryTopics[topicIndex];
        
        console.log(`  → [${i + 1}/${count}] Generating: ${topic} - ${selectedTopicData.topic}`);
        
        const questionStart = Date.now();
        
        // Try to generate question with current service
        let question;
        try {
          if (usingService === 'openai' && !openAIFailed) {
            try {
              question = await this.generateQuestionWithOpenAI(selectedTopicData, topic, difficulty, grade);
            } catch (error) {
              console.log(`  ⚠ [OpenAI] Failed on question ${i + 1}, switching to ${this.useOllama ? 'Ollama' : 'Fallback'} for remaining questions`);
              openAIFailed = true;
              usingService = this.useOllama ? 'ollama' : 'fallback';
              
              // Retry with new service
              if (usingService === 'ollama') {
                question = await this.generateQuestionWithOllama(selectedTopicData, topic, difficulty, grade);
              } else {
                question = this.generateFallbackQuestion(topic, difficulty, grade);
              }
            }
          } else if (usingService === 'ollama') {
            try {
              question = await this.generateQuestionWithOllama(selectedTopicData, topic, difficulty, grade);
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
        console.log(`  ✓ Question ${i + 1}/${count} (${selectedTopicData.topic}) generated in ${questionTime}s using ${usingService.toUpperCase()}\n`);
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