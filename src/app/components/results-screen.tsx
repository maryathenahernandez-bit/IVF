import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Trophy, Clock, Target, TrendingUp, Star, CheckCircle2, XCircle, ChevronDown, ChevronUp, Lightbulb, AlertCircle } from 'lucide-react';

type MathProblem = {
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

type ResultsScreenProps = {
  score: number;
  total: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeSpent: number;
  problems: MathProblem[];
  userAnswers: string[];
  onRestart: () => void;
  onNewTopic: () => void;
};

type SubtopicPerformance = {
  subtopic: string;
  correct: number;
  total: number;
  percentage: number;
};

export function ResultsScreen({ 
  score, 
  total, 
  topic, 
  difficulty, 
  timeSpent, 
  problems,
  userAnswers,
  onRestart, 
  onNewTopic 
}: ResultsScreenProps) {
  const [expandedProblems, setExpandedProblems] = useState<Set<number>>(new Set());
  const [showTips, setShowTips] = useState(false);
  const [showSubtopics, setShowSubtopics] = useState(false);
  
  const percentage = Math.round((score / total) * 100);
  
  // Analyze performance by subtopic
  const analyzePerformance = (): SubtopicPerformance[] => {
    const subtopicStats = new Map<string, { correct: number; total: number }>();
    
    problems.forEach((problem, index) => {
      const subtopic = problem.subtopic || problem.category || topic;
      const userAnswer = userAnswers[index] || '';
      const isCorrect = String(userAnswer).trim().toUpperCase() === String(problem.answer).trim().toUpperCase();
      
      if (!subtopicStats.has(subtopic)) {
        subtopicStats.set(subtopic, { correct: 0, total: 0 });
      }
      
      const stats = subtopicStats.get(subtopic)!;
      stats.total += 1;
      if (isCorrect) {
        stats.correct += 1;
      }
    });
    
    return Array.from(subtopicStats.entries()).map(([subtopic, stats]) => ({
      subtopic,
      correct: stats.correct,
      total: stats.total,
      percentage: Math.round((stats.correct / stats.total) * 100)
    })).sort((a, b) => a.percentage - b.percentage); // Sort by worst performance first
  };

  const subtopicPerformance = analyzePerformance();
  const weakSubtopics = subtopicPerformance.filter(s => s.percentage < 70);
  const avgTimePerQuestion = Math.round(timeSpent / total);
  const wasTimePressure = avgTimePerQuestion < 20; // Less than 20 seconds per question
  const wasSlow = avgTimePerQuestion > 120; // More than 2 minutes per question
  
  // Generate personalized tips
  const generatePersonalizedTips = () => {
    const tips: string[] = [];
    
    if (percentage === 100) {
      tips.push(`🎯 Perfect score! You've mastered ${topic} at the ${difficulty} level.`);
      tips.push(`📈 Consider challenging yourself with the ${difficulty === 'easy' ? 'medium' : 'hard'} difficulty level.`);
      if (avgTimePerQuestion < 30) {
        tips.push(`⚡ Your speed is excellent! You're answering questions efficiently.`);
      }
    } else if (percentage >= 80) {
      tips.push(`🌟 Excellent work! You're showing strong understanding of ${topic}.`);
      
      if (weakSubtopics.length > 0) {
        const weakTopicsList = weakSubtopics.map(s => `${s.subtopic} (${s.correct}/${s.total})`).join(', ');
        tips.push(`📚 Areas to strengthen for mastery: ${weakTopicsList}`);
        tips.push(`💡 Review the explanations for these subtopics to understand where you went wrong.`);
      }
      
      if (wasTimePressure) {
        tips.push(`⏱️ Take your time! Rushing can lead to careless mistakes.`);
      }
    } else if (percentage >= 60) {
      tips.push(`💪 Good effort! You're on the right track with ${topic}.`);
      
      if (weakSubtopics.length > 0) {
        const allWeakTopics = weakSubtopics.map(s => `${s.subtopic} (${s.percentage}% correct)`).join(', ');
        tips.push(`🎯 Priority areas to review: ${allWeakTopics}`);
        tips.push(`📖 Spend extra time understanding the fundamentals of these topics.`);
        
        // Specific advice for worst performer
        const worstSubtopic = weakSubtopics[0];
        if (worstSubtopic.percentage < 50) {
          tips.push(`⚠️ ${worstSubtopic.subtopic} needs urgent attention - only ${worstSubtopic.correct}/${worstSubtopic.total} correct.`);
        }
      }
      
      if (difficulty === 'hard') {
        tips.push(`💡 Consider practicing with medium difficulty first to build confidence.`);
      }
      
      tips.push(`🔄 Review the explanations for incorrect answers above.`);
    } else if (percentage >= 40) {
      tips.push(`📚 Keep practicing! ${topic} requires more review and practice.`);
      
      if (weakSubtopics.length > 0) {
        // List ALL weak subtopics with detailed scores
        tips.push(`🔍 Focus areas that need improvement:`);
        weakSubtopics.forEach(s => {
          tips.push(`   • ${s.subtopic}: ${s.correct}/${s.total} correct (${s.percentage}%)`);
        });
        
        const worstSubtopic = weakSubtopics[0];
        tips.push(`📌 Start with ${worstSubtopic.subtopic} as it needs the most work.`);
      }
      
      tips.push(`📝 Review the basic concepts and formulas for ${topic}.`);
      
      if (difficulty !== 'easy') {
        tips.push(`💡 Try the easy difficulty level to build a stronger foundation.`);
      }
      
      tips.push(`👨‍🏫 Consider reviewing your notes or asking for help from a teacher.`);
    } else {
      tips.push(`🌱 Don't give up! Everyone starts somewhere with ${topic}.`);
      tips.push(`📖 Go back to the basics - review fundamental concepts before attempting problems.`);
      
      if (difficulty !== 'easy') {
        tips.push(`⭐ Start with easy difficulty to build confidence and understanding.`);
      }
      
      if (weakSubtopics.length > 0) {
        // Show ALL subtopics with scores for comprehensive view
        tips.push(`🎯 All areas need focused study:`);
        weakSubtopics.forEach(s => {
          tips.push(`   • ${s.subtopic}: ${s.correct}/${s.total} correct (${s.percentage}%)`);
        });
        
        tips.push(`📚 Create a study plan to tackle each topic one at a time.`);
      }
      
      tips.push(`👥 Study with a friend or join a study group for additional support.`);
      tips.push(`📚 Work through examples step-by-step before attempting practice problems.`);
    }
    
    // Time-specific tips
    if (wasSlow && percentage < 80) {
      tips.push(`⏰ You're taking time with each question (avg ${avgTimePerQuestion}s). Practice more to improve speed while maintaining accuracy.`);
    }
    
    return tips;
  };

  const personalizedTips = generatePersonalizedTips();
  
  const toggleProblem = (index: number) => {
    const newExpanded = new Set(expandedProblems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedProblems(newExpanded);
  };

  const expandAll = () => {
    setExpandedProblems(new Set(Array.from({ length: problems.length }, (_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedProblems(new Set());
  };
  
  const getMessage = () => {
    if (percentage === 100) return "Perfect Score! 🎉";
    if (percentage >= 80) return "Excellent Work! 🌟";
    if (percentage >= 60) return "Good Job! 👍";
    if (percentage >= 40) return "Keep Practicing! 💪";
    return "Don't Give Up! 📚";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGrade = () => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="transition-all duration-500 ease-out">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-12 h-12 text-blue-600" />
            </div>
            <CardTitle className="text-4xl mb-2">{getMessage()}</CardTitle>
            <p className="text-xl text-gray-600">
              You scored {score} out of {total}
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full text-white mb-4" style={{ background: 'linear-gradient(to bottom right, var(--grade11), var(--grade12))' }}>
                <span className="text-5xl">{percentage}%</span>
              </div>
              <p className="text-2xl">
                Grade: <span className={`font-bold ${
                  getGrade() === 'A' ? 'text-green-600' :
                  getGrade() === 'B' ? 'text-blue-600' :
                  getGrade() === 'C' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>{getGrade()}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600 mb-1">Topic</p>
                <p className="text-lg">{topic}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                <p className="text-sm text-gray-600 mb-1">Difficulty</p>
                <p className="text-lg capitalize">{difficulty}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm text-gray-600 mb-1">Time</p>
                <p className="text-lg">{formatTime(timeSpent)}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <p className="text-blue-900 font-semibold">Performance Stats</p>
              </div>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Correct answers: {score}/{total}</li>
                <li>• Accuracy rate: {percentage}%</li>
                <li>• Average time per question: {avgTimePerQuestion}s</li>
                <li>• Total time spent: {formatTime(timeSpent)}</li>
              </ul>
            </div>

            {/* Subtopic Breakdown - Collapsible */}
            {subtopicPerformance.length > 1 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg mb-6">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-purple-100 transition-colors rounded-lg"
                  onClick={() => setShowSubtopics(!showSubtopics)}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-purple-600" />
                    <p className="text-purple-900 font-semibold">Performance by Subtopic</p>
                  </div>
                  <button className="text-purple-600">
                    {showSubtopics ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {showSubtopics && (
                  <div className="px-4 pb-4 space-y-2">
                    {subtopicPerformance.map((perf) => (
                      <div key={perf.subtopic} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{perf.subtopic}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${
                            perf.percentage >= 80 ? 'text-green-600' :
                            perf.percentage >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {perf.correct}/{perf.total} ({perf.percentage}%)
                          </span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                perf.percentage >= 80 ? 'bg-green-500' :
                                perf.percentage >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${perf.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={onRestart} size="lg">
                Practice Again
              </Button>
              <Button onClick={onNewTopic} variant="outline" size="lg">
                Choose New Topic
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Problems Review Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Review Your Answers</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={expandAll}>
                  Expand All
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAll}>
                  Collapse All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {problems.map((problem, index) => {
                const userAnswer = userAnswers[index] || '';
                const userAnswerNormalized = String(userAnswer).trim().toUpperCase();
                const correctAnswerNormalized = String(problem.answer).trim().toUpperCase();
                const isCorrect = userAnswerNormalized === correctAnswerNormalized;
                const isExpanded = expandedProblems.has(index);

                return (
                  <div
                    key={problem.id}
                    className={`border-2 rounded-lg transition-all ${
                      isCorrect
                        ? 'border-green-300 bg-green-50'
                        : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => toggleProblem(index)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {isCorrect ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-gray-700">Question {index + 1}</span>
                              {problem.subtopic && (
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                  {problem.subtopic}
                                </span>
                              )}
                            </div>
                            <p className="text-lg text-gray-800 mb-3">{problem.question}</p>
                            
                            {!isExpanded && (
                              <div className="flex items-center gap-4 text-sm">
                                <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                  Your answer: {userAnswer}
                                </span>
                                {!isCorrect && (
                                  <span className="text-green-700 font-semibold">
                                    Correct: {problem.answer}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <button className="text-gray-500 hover:text-gray-700">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-4 border-t border-gray-200 pt-4">
                        {problem.options && (
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Answer Choices:</p>
                            {Object.entries(problem.options).map(([key, value]) => {
                              const keyNormalized = String(key).trim().toUpperCase();
                              const correctAnswerNormalized = String(problem.answer).trim().toUpperCase();
                              const userAnswerNormalized = String(userAnswer).trim().toUpperCase();
                              
                              const isCorrectAnswer = keyNormalized === correctAnswerNormalized;
                              const isUserAnswer = keyNormalized === userAnswerNormalized;

                              return (
                                <div
                                  key={key}
                                  className={`p-3 rounded-lg border ${
                                    isCorrectAnswer
                                      ? 'bg-green-100 border-green-400'
                                      : isUserAnswer && !isCorrect
                                      ? 'bg-red-100 border-red-400'
                                      : 'bg-white border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {isCorrectAnswer && (
                                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    )}
                                    {isUserAnswer && !isCorrect && (
                                      <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                    <span className="font-bold">{key}.</span>
                                    <span className={
                                      isCorrectAnswer
                                        ? 'font-semibold text-green-900'
                                        : isUserAnswer && !isCorrect
                                        ? 'text-red-900'
                                        : 'text-gray-700'
                                    }>
                                      {value}
                                    </span>
                                    {isCorrectAnswer && (
                                      <span className="ml-auto text-xs bg-green-600 text-white px-2 py-1 rounded">
                                        Correct Answer
                                      </span>
                                    )}
                                    {isUserAnswer && !isCorrect && (
                                      <span className="ml-auto text-xs bg-red-600 text-white px-2 py-1 rounded">
                                        Your Answer
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {problem.explanation && (
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-bold text-blue-900 mb-2">Explanation:</h4>
                            <p className="text-gray-800 leading-relaxed">{problem.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Personalized Study Tips - Collapsible */}
        <Card className={`mb-6 ${
          percentage >= 80 ? 'bg-green-50 border-green-200' :
          percentage >= 60 ? 'bg-yellow-50 border-yellow-200' :
          'bg-orange-50 border-orange-200'
        }`}>
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowTips(!showTips)}
          >
            <div className="flex items-center gap-2">
              <Lightbulb className={`w-6 h-6 ${
                percentage >= 80 ? 'text-green-600' :
                percentage >= 60 ? 'text-yellow-600' :
                'text-orange-600'
              }`} />
              <h3 className={`text-lg font-semibold ${
                percentage >= 80 ? 'text-green-900' :
                percentage >= 60 ? 'text-yellow-900' :
                'text-orange-900'
              }`}>
                Personalized Study Tips
              </h3>
            </div>
            <button className={`${
              percentage >= 80 ? 'text-green-600' :
              percentage >= 60 ? 'text-yellow-600' :
              'text-orange-600'
            }`}>
              {showTips ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
          {showTips && (
            <div className="px-4 pb-4">
              <ul className={`space-y-2 text-sm ${
                percentage >= 80 ? 'text-green-900' :
                percentage >= 60 ? 'text-yellow-900' :
                'text-orange-900'
              }`}>
                {personalizedTips.map((tip, index) => (
                  <li key={index} className="leading-relaxed">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}