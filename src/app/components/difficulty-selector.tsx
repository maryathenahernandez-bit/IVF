import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import React, { useState, useEffect } from 'react';import { Button } from './ui/button';
import { ChevronLeft } from 'lucide-react';

type DifficultySelectorProps = {
  topic: string;
  onSelectDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onBack: () => void;
};

export function DifficultySelector({ topic, onSelectDifficulty, onBack }: DifficultySelectorProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button onClick={onBack} variant="ghost" className="mb-6">
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Topics
      </Button>

      <div className="text-center mb-8">
        <h2 className="text-4xl mb-4">{topic}</h2>
        <p className="text-xl text-gray-600">Choose your difficulty level</p>
      </div>

      {/* AI info removed — backend-driven generation is used */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-green-200 hover:border-green-400"
          onClick={() => onSelectDifficulty('easy')}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🌱</span>
            </div>
            <CardTitle className="text-green-700">Easy</CardTitle>
            <CardDescription>Perfect for beginners</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Smaller numbers</li>
              <li>• Simple problems</li>
              <li>• Build confidence</li>
            </ul>
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
              Start Easy
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-yellow-200 hover:border-yellow-400"
          onClick={() => onSelectDifficulty('medium')}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">⚡</span>
            </div>
            <CardTitle className="text-yellow-700">Medium</CardTitle>
            <CardDescription>Challenge yourself</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Moderate difficulty</li>
              <li>• Mixed problems</li>
              <li>• Improve skills</li>
            </ul>
            <Button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700">
              Start Medium
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-red-200 hover:border-red-400"
          onClick={() => onSelectDifficulty('hard')}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🔥</span>
            </div>
            <CardTitle className="text-red-700">Hard</CardTitle>
            <CardDescription>Master level</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Complex problems</li>
              <li>• Large numbers</li>
              <li>• Expert practice</li>
            </ul>
            <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
              Start Hard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}