export class FallbackQuestionGenerator {
    /**
     * Fallback question generator using hardcoded questions (original method)
     */
    
    generateQuestionsBatch(topic, difficulty, grade, count = 10) {
      /**
       * Generate a batch of questions using the original hardcoded method
       */
      const questions = [];
      
      for (let i = 0; i < count; i++) {
        const question = this.generateSingleQuestion(topic, difficulty, grade, i);
        questions.push(question);
      }
      
      return questions;
    }
  
    generateSingleQuestion(topic, difficulty, grade, index) {
      /**
       * Generate a single question based on topic
       */
      
      // Map frontend topic names to internal methods
      const topicMapping = {
        "Conic Sections": "conicSections",
        "Domain and Range": "domainRange",
        "Relations and Functions": "relationsFunctions",
        "Functions": "functions",
        "Limits": "limits",
        "Derivatives": "derivatives",
        "Indefinite Integrals": "indefiniteIntegrals",
        "Definite Integrals": "definiteIntegrals",
        "Integration by Substitution": "integrationSubstitution",
        "Integration by Parts": "integrationParts",
        "Area Under Curve": "areaUnderCurve",
        "Volume of Revolution": "volumeRevolution"
      };
  
      const methodName = topicMapping[topic] || "limits";
      const id = typeof index === 'string' ? index : `${topic}-${index}`;
  
      // Call the appropriate generation method
      if (typeof this[`generate${methodName.charAt(0).toUpperCase() + methodName.slice(1)}`] === 'function') {
        return this[`generate${methodName.charAt(0).toUpperCase() + methodName.slice(1)}`](difficulty, id);
      } else {
        return this.generateLimits(difficulty, id);
      }
    }
  
    // Grade 11 Topics
    generateConicSections(difficulty, id) {
      const r = this._getRandomValue(difficulty, 5, 15);
      const h = Math.floor(Math.random() * 11) - 5;
      const k = Math.floor(Math.random() * 11) - 5;
  
      return {
        id,
        question: `Find the radius of the circle: (x${h >= 0 ? '+' : ''}${h})² + (y${k >= 0 ? '+' : ''}${k})² = ${r * r}`,
        answer: String(r),
        explanation: `The equation is in the form (x-h)² + (y-k)² = r², so the radius r = √${r * r} = ${r}`,
        topic: "Conic Sections",
        difficulty,
        grade: 11
      };
    }
  
    generateDomainRange(difficulty, id) {
      const a = Math.floor(Math.random() * 10) + 1;
  
      if (difficulty === 'easy') {
        return {
          id,
          question: `What is the domain of f(x) = x + ${a}? Enter 'all_real' for all real numbers`,
          answer: "all_real",
          explanation: "Linear functions have domain of all real numbers",
          topic: "Domain and Range",
          difficulty,
          grade: 11
        };
      } else {
        return {
          id,
          question: `For f(x) = √(x - ${a}), what is the minimum x value in the domain?`,
          answer: String(a),
          explanation: `The square root function requires x - ${a} ≥ 0, so x ≥ ${a}`,
          topic: "Domain and Range",
          difficulty,
          grade: 11
        };
      }
    }
  
    generateRelationsFunctions(difficulty, id) {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const x = Math.floor(Math.random() * 5) + 1;
  
      return {
        id,
        question: `If f(x) = ${a}x + ${b}, find f(${x})`,
        answer: String(a * x + b),
        explanation: `Substitute x = ${x}: f(${x}) = ${a}×${x} + ${b} = ${a * x + b}`,
        topic: "Relations and Functions",
        difficulty,
        grade: 11
      };
    }
  
    generateFunctions(difficulty, id) {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const x = Math.floor(Math.random() * 5) + 1;
  
      return {
        id,
        question: `For the function f(x) = ${a}x² + ${b}x, find f(${x})`,
        answer: String(a * x * x + b * x),
        explanation: `Substitute x = ${x}: f(${x}) = ${a}×${x}² + ${b}×${x} = ${a * x * x + b * x}`,
        topic: "Functions",
        difficulty,
        grade: 11
      };
    }
  
    generateLimits(difficulty, id) {
      if (difficulty === 'easy') {
        return {
          id,
          question: "Evaluate: lim(x→2) (x² - 4)/(x - 2)",
          answer: "4",
          explanation: "Factor numerator: (x-2)(x+2)/(x-2) = x+2, so limit is 2+2 = 4",
          topic: "Limits",
          difficulty,
          grade: 11
        };
      } else {
        const a = Math.floor(Math.random() * 5) + 1;
        return {
          id,
          question: `Evaluate: lim(x→${a}) (x² - ${a}²)/(x - ${a})`,
          answer: String(2 * a),
          explanation: `Factor: (x-${a})(x+${a})/(x-${a}) = x+${a}, so limit is ${a}+${a} = ${2 * a}`,
          topic: "Limits",
          difficulty,
          grade: 11
        };
      }
    }
  
    generateDerivatives(difficulty, id) {
      if (difficulty === 'easy') {
        return {
          id,
          question: "Find the derivative: d/dx [x³]",
          answer: "3x²",
          explanation: "Using power rule: d/dx [x^n] = nx^(n-1), so 3x^(3-1) = 3x²",
          topic: "Derivatives",
          difficulty,
          grade: 11
        };
      } else {
        const a = Math.floor(Math.random() * 4) + 2;
        return {
          id,
          question: `Find the derivative: d/dx [x^${a}]`,
          answer: `${a}x^${a - 1}`,
          explanation: `Using power rule: d/dx [x^n] = nx^(n-1), so ${a}x^(${a}-1) = ${a}x^${a - 1}`,
          topic: "Derivatives",
          difficulty,
          grade: 11
        };
      }
    }
  
    // Grade 12 Topics
    generateIndefiniteIntegrals(difficulty, id) {
      if (difficulty === 'easy') {
        return {
          id,
          question: "Find integral x² dx",
          answer: "(1/3)x³ + C",
          explanation: "Using power rule: integral x^n dx = x^(n+1)/(n+1) + C, so x³/3 + C",
          topic: "Indefinite Integrals",
          difficulty,
          grade: 12
        };
      } else {
        const a = Math.floor(Math.random() * 3) + 2;
        return {
          id,
          question: `Find integral x^${a} dx`,
          answer: `(1/${a + 1})x^${a + 1} + C`,
          explanation: `Using power rule: integral x^n dx = x^(n+1)/(n+1) + C, so x^${a + 1}/(${a + 1}) + C`,
          topic: "Indefinite Integrals",
          difficulty,
          grade: 12
        };
      }
    }
  
    generateDefiniteIntegrals(difficulty, id) {
      const a = Math.floor(Math.random() * 4);
      const b = a + Math.floor(Math.random() * 3) + 1;
  
      return {
        id,
        question: `Evaluate: integral from ${a} to ${b} of x dx`,
        answer: String((b * b - a * a) / 2),
        explanation: `integral x dx = (1/2)x², so [(1/2)${b}²] - [(1/2)${a}²] = ${b * b / 2} - ${a * a / 2} = ${(b * b - a * a) / 2}`,
        topic: "Definite Integrals",
        difficulty,
        grade: 12
      };
    }
  
    generateIntegrationSubstitution(difficulty, id) {
      return {
        id,
        question: "Find integral 2x cos(x²) dx using substitution",
        answer: "sin(x²) + C",
        explanation: "Let u = x², then du = 2x dx. So integral cos(u) du = sin(u) + C = sin(x²) + C",
        topic: "Integration by Substitution",
        difficulty,
        grade: 12
      };
    }
  
    generateIntegrationParts(difficulty, id) {
      return {
        id,
        question: "Find integral x sin(x) dx using integration by parts",
        answer: "-x cos(x) + sin(x) + C",
        explanation: "Using integration by parts: integral u dv = uv - integral v du, where u = x, dv = sin(x) dx",
        topic: "Integration by Parts",
        difficulty,
        grade: 12
      };
    }
  
    generateAreaUnderCurve(difficulty, id) {
      return {
        id,
        question: "Find the area under y = x² from x = 0 to x = 1",
        answer: "1/3",
        explanation: "Area = integral from 0 to 1 of x² dx = [x³/3] from 0 to 1 = 1³/3 - 0³/3 = 1/3",
        topic: "Area Under Curve",
        difficulty,
        grade: 12
      };
    }
  
    generateVolumeRevolution(difficulty, id) {
      return {
        id,
        question: "Find volume of revolution when y = √x from x = 0 to x = 1 is rotated about x-axis",
        answer: "π/2",
        explanation: "Using disk method: V = π∫_0^1 (√x)² dx = π∫_0^1 x dx = π[x²/2]_0^1 = π(1/2) = π/2",
        topic: "Volume of Revolution",
        difficulty,
        grade: 12
      };
    }
  
    _getRandomValue(difficulty, easyMax, hardMax) {
      /**
       * Get random value based on difficulty
       */
      if (difficulty === 'easy') {
        return Math.floor(Math.random() * easyMax) + 1;
      } else if (difficulty === 'medium') {
        const midMax = Math.floor((easyMax + hardMax) / 2);
        return Math.floor(Math.random() * midMax) + 1;
      } else {
        return Math.floor(Math.random() * hardMax) + 1;
      }
    }
  }