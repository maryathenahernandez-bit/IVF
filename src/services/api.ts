// API Service for Express Backend with Progressive Loading
// Save this as: D:\ivf\src\services\api.ts

const API_BASE_URL = 'http://localhost:5000/api';

export interface Question {
  id: string;
  question: string;
  answer: string;
  options?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  explanation?: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  grade: number;
  category?: string;
  subtopic?: string;
}

export interface QuestionsResponse {
  success: boolean;
  questions: Question[];
}

export interface TopicsResponse {
  success: boolean;
  topics: string[];
}

export interface SymbolsResponse {
  success: boolean;
  symbols: {
    operators: string[];
    calculus: string[];
    functions: string[];
    superscripts: string[];
    brackets: string[];
    greek: string[];
  };
}

/**
 * Fetch questions progressively using Server-Sent Events
 * Questions arrive one by one as they're generated
 */
export async function fetchQuestionsProgressive(
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
    const params = new URLSearchParams({
      topic,
      difficulty,
      grade: grade.toString(),
      count: '10'
    });

    const response = await fetch(`${API_BASE_URL}/questions/stream?${params}`, {
      signal // Pass abort signal to fetch
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Response body is not readable');
    }

    let buffer = '';

    while (true) {
      // Check if aborted before each read
      if (signal?.aborted) {
        console.log('Fetch aborted by user');
        reader.cancel(); // Cancel the stream
        break;
      }

      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (signal?.aborted) {
          console.log('Fetch aborted while processing');
          reader.cancel();
          return;
        }

        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            
            if (data.type === 'question') {
              onQuestion(data.data, data.index);
            } else if (data.type === 'complete') {
              onComplete(data.total);
            } else if (data.type === 'error') {
              onError(new Error(data.error));
            }
          } catch (parseError) {
            console.error('Error parsing SSE data:', parseError);
          }
        }
      }
    }
  } catch (error) {
    // Don't treat abort as an error
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Question generation aborted by user');
      return;
    }
    
    console.error('Error in progressive fetch:', error);
    onError(error as Error);
  } finally {
    // Clean up reader if it exists
    if (reader) {
      try {
        reader.cancel();
      } catch (e) {
        // Ignore errors during cleanup
      }
    }
  }
}

/**
 * Fetch all questions at once (original method - kept for backwards compatibility)
 */
export async function fetchQuestions(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard',
  grade: number
): Promise<QuestionsResponse> {
  try {
    const params = new URLSearchParams({
      topic,
      difficulty,
      grade: grade.toString()
    });

    const response = await fetch(`${API_BASE_URL}/questions?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

/**
 * Fetch available topics for a grade
 */
export async function fetchTopics(grade: number): Promise<TopicsResponse> {
  try {
    const params = new URLSearchParams({
      grade: grade.toString()
    });

    const response = await fetch(`${API_BASE_URL}/topics?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
}

/**
 * Fetch available mathematical symbols
 */
export async function fetchSymbols(): Promise<SymbolsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/symbols`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching symbols:', error);
    throw error;
  }
}

/**
 * Check backend health
 */
export async function checkHealth(): Promise<{ status: string; ollama_available: boolean }> {
  try {
    const response = await fetch('http://localhost:5000/health');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking health:', error);
    return { status: 'error', ollama_available: false };
  }
}