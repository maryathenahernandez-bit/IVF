import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { GraduationCap } from 'lucide-react';
import React, { useState, useEffect } from 'react';import { Button } from './ui/button';

type GradeSelectorProps = {
  onSelectGrade: (grade: 'grade11' | 'grade12') => void;
};

export function GradeSelector({ onSelectGrade }: GradeSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-16">
        <h1 className="text-7xl mb-6 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent font-bold">
          NEURON
        </h1>
        <p className="text-2xl text-gray-600">Select Your Grade Level</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Grade 11 Box */}
        <Card 
          className="cursor-pointer hover:shadow-2xl transition-all duration-300"
          onClick={() => onSelectGrade('grade11')}
        >
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, var(--grade11), var(--primary))' }}>
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl" style={{ color: 'var(--grade11)' }}>Grade 11</CardTitle>
            <CardDescription className="text-lg mt-2">
              Pre-calculus & Differential Calculus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Conic Sections</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Functions & Relations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Limits & Derivatives</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Grade 12 Box */}
        <Card 
          className="cursor-pointer hover:shadow-2xl transition-all duration-300"
          onClick={() => onSelectGrade('grade12')}
        >
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl" style={{ background: 'linear-gradient(to bottom right, var(--grade12), var(--secondary))' }}>
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl" style={{ color: 'var(--grade12)' }}>Grade 12</CardTitle>
            <CardDescription className="text-lg mt-2">
              Integral Calculus & Applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--grade12)' }}></span>
                <span>Integration Techniques</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--grade12)' }}></span>
                <span>Area Under Curves</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--grade12)' }}></span>
                <span>Volume of Revolution</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
