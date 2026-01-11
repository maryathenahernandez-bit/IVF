import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import React, { useState, useEffect } from 'react';import { Button } from './ui/button';
import { BookOpen, TrendingUp, Infinity, GitBranch, Sigma, Activity, ArrowLeft } from 'lucide-react';

type Topic = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
};

const grade11Topics: Topic[] = [
  {
    id: 'conic-sections',
    name: 'Conic Sections',
    description: 'Circles, ellipses, parabolas, and hyperbolas',
    icon: <Activity className="w-8 h-8" />
  },
  {
    id: 'domain-range',
    name: 'Domain and Range',
    description: 'Finding domain and range of functions',
    icon: <GitBranch className="w-8 h-8" />
  },
  {
    id: 'relations-functions',
    name: 'Relations and Functions',
    description: 'Understanding relations and function notation',
    icon: <TrendingUp className="w-8 h-8" />
  },
  {
    id: 'functions',
    name: 'Functions',
    description: 'Analyzing and graphing functions',
    icon: <BookOpen className="w-8 h-8" />
  },
  {
    id: 'limits',
    name: 'Limits',
    description: 'Calculate limits and understand continuity',
    icon: <Infinity className="w-8 h-8" />
  },
  {
    id: 'derivatives',
    name: 'Derivatives',
    description: 'Find derivatives using power, product, and chain rules',
    icon: <TrendingUp className="w-8 h-8" />
  }
];

const grade12Topics: Topic[] = [
  {
    id: 'indefinite-integrals',
    name: 'Indefinite Integrals',
    description: 'Basic integration and antiderivatives',
    icon: <Sigma className="w-8 h-8" />
  },
  {
    id: 'definite-integrals',
    name: 'Definite Integrals',
    description: 'Evaluate definite integrals and apply limits',
    icon: <Sigma className="w-8 h-8" />
  },
  {
    id: 'integration-substitution',
    name: 'Integration by Substitution',
    description: 'U-substitution method for integration',
    icon: <GitBranch className="w-8 h-8" />
  },
  {
    id: 'integration-parts',
    name: 'Integration by Parts',
    description: 'Apply the integration by parts formula',
    icon: <Activity className="w-8 h-8" />
  },
  {
    id: 'area-under-curve',
    name: 'Area Under Curve',
    description: 'Calculate areas using definite integrals',
    icon: <TrendingUp className="w-8 h-8" />
  },
  {
    id: 'volume-revolution',
    name: 'Volume of Revolution',
    description: 'Find volumes using disk and shell methods',
    icon: <Infinity className="w-8 h-8" />
  }
];

type TopicSelectorProps = {
  grade: 'grade11' | 'grade12';
  onSelectTopic: (topic: string) => void;
  onBack: () => void;
};

export function TopicSelector({ grade, onSelectTopic, onBack }: TopicSelectorProps) {
  const topics = grade === 'grade11' ? grade11Topics : grade12Topics;
  const gradeTitle = grade === 'grade11' ? 'Grade 11' : 'Grade 12';
  const gradeDescription = grade === 'grade11' 
    ? 'Pre-calculus and differential calculus fundamentals' 
    : 'Integral calculus and applications';
  const gradeColor = grade === 'grade11' ? 'var(--grade11)' : 'var(--grade12)';

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Grade Selection
        </Button>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-4xl mb-4" style={{ color: gradeColor }}>{gradeTitle}</h2>
        <p className="text-xl text-gray-600">{gradeDescription}</p>
        <p className="text-lg text-gray-500 mt-2">Choose a topic to start practicing</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Card 
            key={topic.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelectTopic(topic.name)}
            style={{ borderColor: 'rgba(0,0,0,0.06)' }}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div style={{ color: gradeColor }}>
                  {topic.icon}
                </div>
                <CardTitle style={{ color: gradeColor }}>{topic.name}</CardTitle>
              </div>
              <CardDescription>{topic.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Start Practice
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}