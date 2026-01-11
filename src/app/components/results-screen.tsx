import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import React, { useState, useEffect } from 'react';import { Button } from './ui/button';
import { Trophy, Clock, Target, TrendingUp, Star } from 'lucide-react';

type ResultsScreenProps = {
  score: number;
  total: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeSpent: number;
  onRestart: () => void;
  onNewTopic: () => void;
};

export function ResultsScreen({ score, total, topic, difficulty, timeSpent, onRestart, onNewTopic }: ResultsScreenProps) {
  const percentage = Math.round((score / total) * 100);
  
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

  const avgTimePerQuestion = Math.round(timeSpent / total);

  return (
    <div className="max-w-4xl mx-auto p-6">
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
                <p className="text-blue-900">Performance Stats</p>
              </div>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Correct answers: {score}/{total}</li>
                <li>• Accuracy rate: {percentage}%</li>
                <li>• Average time per question: {avgTimePerQuestion}s</li>
                <li>• Total time spent: {formatTime(timeSpent)}</li>
              </ul>
            </div>

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

        {percentage < 80 && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-900">💡 Study Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-yellow-900">
                <li>• Take your time with each problem</li>
                <li>• Practice regularly to improve your skills</li>
                <li>• Try the easier difficulty level first if needed</li>
                <li>• Review the problems you got wrong</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
