import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { fetchQuestionsProgressive } from '../../services/api';

export type MathProblem = {
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
  category?: string;
  subtopic?: string;
};

type StudySessionProps = {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  grade?: number;
  onComplete: (score: number, total: number, timeSpent: number, problems: MathProblem[], userAnswers: string[]) => void;
  onExit: () => void;
};

export function StudySession({ topic, difficulty, grade = 11, onComplete, onExit }: StudySessionProps) {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState<string[]>([]); // Track all user answers
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalQuestionsExpected, setTotalQuestionsExpected] = useState(10);
  const [allQuestionsLoaded, setAllQuestionsLoaded] = useState(false);
  const [questionsReceived, setQuestionsReceived] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    setProblems([]);
    setCurrentIndex(0);
    setUserAnswer('');
    setUserAnswers([]); // Reset user answers
    setScore(0);
    setShowFeedback(false);
    setIsCorrect(false);
    setTimeSpent(0);
    setLoading(true);
    setError(null);
    setTotalQuestionsExpected(10);
    setAllQuestionsLoaded(false);
    setQuestionsReceived(0);
    setTimerActive(false);

    let mounted = true;
    let abortController = new AbortController();

    const loadQuestionsProgressively = async () => {
      console.log('Starting progressive question fetch...');
      
      try {
        await fetchQuestionsProgressive(
          topic,
          difficulty,
          grade,
          (question: MathProblem, index: number) => {
            if (!mounted || abortController.signal.aborted) return;
            
            console.log(`Question ${index + 1} received:`, question.id);
            
            const mappedQuestion: MathProblem = {
              id: question.id ?? `q-${index}`,
              question: question.question ?? '',
              answer: question.answer ?? 'A',
              options: question.options ?? {
                A: "Option A (missing)",
                B: "Option B (missing)",
                C: "Option C (missing)",
                D: "Option D (missing)"
              },
              explanation: question.explanation ?? '',
              topic: question.topic ?? topic,
              difficulty: question.difficulty ?? difficulty,
              category: question.category ?? topic,
              subtopic: question.subtopic ?? '',
            };

            setProblems(prev => [...prev, mappedQuestion]);
            setQuestionsReceived(index + 1);
            
            if (index === 0 && loading) {
              setLoading(false);
              setTimerActive(true);
              console.log('⏱️ Timer started - first question loaded');
            }
            
            if (index > 0 && index === currentIndex) {
              setTimerActive(true);
              console.log('⏱️ Timer restarted - next question loaded');
            }
          },
          (total: number) => {
            if (!mounted || abortController.signal.aborted) return;
            console.log(`All ${total} questions received`);
            setAllQuestionsLoaded(true);
            setTotalQuestionsExpected(total);
          },
          (err: Error) => {
            if (!mounted || abortController.signal.aborted) return;
            console.error('Error loading questions:', err);
            setError('Failed to load questions. Please make sure the server is running.');
            setLoading(false);
            setTimerActive(false);
          },
          abortController.signal
        );
      } catch (err) {
        if (abortController.signal.aborted) {
          console.log('Question generation aborted by user');
        }
      }
    };

    loadQuestionsProgressively();

    return () => { 
      mounted = false;
      abortController.abort();
      setTimerActive(false);
      console.log('Study session cleanup: aborting question generation');
    };
  }, [topic, difficulty, grade]);

  useEffect(() => {
    if (!timerActive) return;
    
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timerActive]);

  const handleSubmit = () => {
    if (!userAnswer) return;

    const expected = problems[currentIndex].answer;
    let correct = false;

    // Compare answers (case-insensitive, trim whitespace)
    const userAnswerNormalized = String(userAnswer).trim().toUpperCase();
    const expectedAnswerNormalized = String(expected).trim().toUpperCase();
    
    correct = userAnswerNormalized === expectedAnswerNormalized;

    setIsCorrect(correct);
    if (correct) {
      setScore((s) => s + 1);
    }
    
    // Store the user's answer
    setUserAnswers(prev => [...prev, userAnswer]);
    
    setShowFeedback(true);
    setTimerActive(false);
    console.log('⏱️ Timer paused - answer submitted');
    console.log('Answer check:', { userAnswer, expected, correct });
  };

  const handleNext = () => {
    if (currentIndex + 1 < problems.length) {
      setCurrentIndex((i) => i + 1);
      setUserAnswer('');
      setShowFeedback(false);
      setIsCorrect(false);
      setTimerActive(true);
      console.log('⏱️ Timer restarted - next question ready');
    } else if (!allQuestionsLoaded) {
      setUserAnswer('');
      setShowFeedback(false);
      setIsCorrect(false);
      setTimerActive(false);
      console.log('⏱️ Timer paused - waiting for next question to generate');
    } else {
      setTimerActive(false);
      console.log('⏱️ Timer stopped - session complete');
      onComplete(score, problems.length, timeSpent, problems, userAnswers);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const needsMoreQuestions = !showFeedback && currentIndex >= problems.length && !allQuestionsLoaded;
  const showGeneratingNext = showFeedback && currentIndex + 1 >= problems.length && !allQuestionsLoaded;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Generating Your First Question</h3>
              <p className="text-lg text-gray-600 mb-2">Creating personalized math problems...</p>
              <p className="text-sm text-gray-500">
                {topic} • {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} • Grade {grade}
              </p>
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Your first question will appear as soon as it's ready. More questions will continue generating in the background.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (needsMoreQuestions) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Generating Next Question</h3>
              <p className="text-lg text-gray-600 mb-4">Creating your next challenge...</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Questions answered: {currentIndex}</p>
                <p>Current score: {score}/{currentIndex}</p>
                <p>Questions generated: {questionsReceived}/{totalQuestionsExpected}</p>
                <p className="text-xs text-gray-400 mt-3">Please wait while we generate the next question...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <XCircle className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl font-semibold">Error Loading Questions</p>
            </div>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={onExit}>Back to Topics</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-lg text-gray-600">No problems available.</div>
      </div>
    );
  }

  const currentProblem = problems[currentIndex];
  const progress = ((currentIndex + 1) / totalQuestionsExpected) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span>{formatTime(timeSpent)}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            Question {currentIndex + 1} of {allQuestionsLoaded ? problems.length : totalQuestionsExpected}
          </span>
          <span className="text-gray-600">
            Score: {score}/{currentIndex + (showFeedback ? 1 : 0)}
          </span>
        </div>
      </div>

      <Progress value={progress} className="mb-6" />

      {!allQuestionsLoaded && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <p className="text-sm text-blue-800">
            🔄 Generating questions... ({questionsReceived}/{totalQuestionsExpected} ready)
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">Math Problem</CardTitle>
              <div className="flex flex-col gap-1 text-sm">
                <CardDescription className="font-semibold text-primary">
                  {currentProblem.category || topic}
                </CardDescription>
                {currentProblem.subtopic && (
                  <CardDescription className="text-xs">
                    {currentProblem.subtopic}
                  </CardDescription>
                )}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <p className="text-3xl mb-8">{currentProblem.question}</p>
            
            {!showFeedback ? (
              <div className="space-y-4 max-w-2xl mx-auto">
                {currentProblem.options ? (
                  Object.entries(currentProblem.options).map(([key, value]) => (
                    <Button
                      key={key}
                      onClick={() => {
                        setUserAnswer(key);
                        
                        // Immediately check answer
                        const expected = problems[currentIndex].answer;
                        const userAnswerNormalized = String(key).trim().toUpperCase();
                        const expectedAnswerNormalized = String(expected).trim().toUpperCase();
                        const correct = userAnswerNormalized === expectedAnswerNormalized;

                        setIsCorrect(correct);
                        if (correct) {
                          setScore((s) => s + 1);
                        }
                        
                        setUserAnswers(prev => [...prev, key]);
                        setShowFeedback(true);
                        setTimerActive(false);
                        console.log('⏱️ Timer paused - answer submitted');
                        console.log('Answer check:', { userAnswer: key, expected, correct });
                      }}
                      variant="outline"
                      className="w-full h-auto py-4 px-6 text-left justify-start hover:bg-primary hover:text-white transition-colors whitespace-normal"
                    >
                      <span className="font-bold mr-4 flex-shrink-0">{key}.</span>
                      <span className="text-lg break-words">{value}</span>
                    </Button>
                  ))
                ) : (
                  <div className="text-red-600 p-4 bg-red-50 rounded-lg">
                    <p>Error: No answer options available for this question.</p>
                  </div>
                )}
                
                <div className="flex gap-3 justify-center mt-8">
                  <Button onClick={onExit} variant="outline" size="lg">
                    Exit Session
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 transition-all duration-300 ease-out max-w-3xl mx-auto">
                <div className={`flex items-center justify-center gap-3 text-2xl ${
                  isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-12 h-12" />
                      <span>Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-12 h-12" />
                      <span>Incorrect</span>
                    </>
                  )}
                </div>
                
                {currentProblem.options && (
                  <div className="space-y-3 max-w-2xl mx-auto">
                    {Object.entries(currentProblem.options).map(([key, value]) => {
                      const isCorrectAnswer = key === currentProblem.answer;
                      const isUserAnswer = key === userAnswer;
                      
                      return (
                        <div
                          key={key}
                          className={`w-full py-4 px-6 rounded-lg border-2 transition-all ${
                            isCorrectAnswer
                              ? 'bg-green-50 border-green-500 shadow-md'
                              : isUserAnswer && !isCorrect
                              ? 'bg-red-50 border-red-500'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {isCorrectAnswer && (
                              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                            )}
                            {isUserAnswer && !isCorrect && (
                              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                            )}
                            <span className="font-bold text-lg flex-shrink-0">{key}.</span>
                            <span className={`text-lg flex-1 break-words ${
                              isCorrectAnswer ? 'font-semibold text-green-900' : 
                              isUserAnswer && !isCorrect ? 'text-red-900' : 
                              'text-gray-700'
                            }`}>
                              {value}
                            </span>
                            {isCorrectAnswer && (
                              <span className="text-sm font-semibold text-green-700 px-3 py-1 bg-green-100 rounded-full flex-shrink-0">
                                Correct
                              </span>
                            )}
                            {isUserAnswer && !isCorrect && (
                              <span className="text-sm font-semibold text-red-700 px-3 py-1 bg-red-100 rounded-full flex-shrink-0">
                                Your answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {currentProblem.explanation && (
                  <div className="bg-blue-50 p-6 rounded-lg text-left border-2 border-blue-200">
                    <h3 className="font-bold text-lg mb-3 text-blue-900">Explanation:</h3>
                    <p className="text-gray-800 leading-relaxed">{currentProblem.explanation}</p>
                  </div>
                )}
                
                {showGeneratingNext ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-center gap-2 text-yellow-800">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-800"></div>
                      <p className="text-sm font-medium">Generating next question... ({questionsReceived}/{totalQuestionsExpected})</p>
                    </div>
                  </div>
                ) : (
                  <Button onClick={handleNext} size="lg" className="mt-6">
                    {currentIndex + 1 < problems.length ? 'Next Problem' : allQuestionsLoaded ? 'See Results' : 'Continue'}
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}