import { useState } from 'react';
import { BookOpen, Brain } from 'lucide-react';
import { GradeSelector } from './components/grade-selector';
import { TopicSelector } from './components/topic-selector';
import { DifficultySelector } from './components/difficulty-selector';
import { StudySession } from './components/study-session';
import { ResultsScreen } from './components/results-screen';

type Screen = 'grade' | 'topic' | 'difficulty' | 'session' | 'results';

type SessionResults = {
  score: number;
  total: number;
  timeSpent: number;
  problems: any[]; // Add problems array
  userAnswers: string[]; // Add user answers array
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('grade');
  const [selectedGrade, setSelectedGrade] = useState<'grade11' | 'grade12'>('grade11');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [sessionResults, setSessionResults] = useState<SessionResults>({ 
    score: 0, 
    total: 0, 
    timeSpent: 0,
    problems: [],
    userAnswers: []
  });

  const handleSelectGrade = (grade: 'grade11' | 'grade12') => {
    setSelectedGrade(grade);
    setScreen('topic');
  };

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic);
    setScreen('difficulty');
  };

  const handleSelectDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(difficulty);
    setScreen('session');
  };

  const handleSessionComplete = (score: number, total: number, timeSpent: number, problems: any[], userAnswers: string[]) => {
    setSessionResults({ score, total, timeSpent, problems, userAnswers });
    setScreen('results');
  };

  const handleRestart = () => {
    setScreen('session');
  };

  const handleNewTopic = () => {
    setSelectedTopic('');
    setSelectedDifficulty('easy');
    setScreen('topic');
  };

  const handleBackToTopics = () => {
    setScreen('topic');
  };

  const handleBackToGrades = () => {
    setSelectedGrade('grade11');
    setScreen('grade');
  };

  const handleExitSession = () => {
    setScreen('grade');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary ${selectedGrade === 'grade11' ? 'grade-11' : 'grade-12'}`}>
      <main className="py-8 pb-20">
        {screen === 'grade' && (
          <GradeSelector key="grade" onSelectGrade={handleSelectGrade} />
        )}

        {screen === 'topic' && selectedGrade && (
          <TopicSelector 
            key="topic" 
            grade={selectedGrade}
            onSelectTopic={handleSelectTopic}
            onBack={handleBackToGrades}
          />
        )}

        {screen === 'difficulty' && (
          <DifficultySelector
            key="difficulty"
            topic={selectedTopic}
            onSelectDifficulty={handleSelectDifficulty}
            onBack={handleBackToTopics}
          />
        )}

        {screen === 'session' && (
          <StudySession
            key={`session-${selectedTopic}-${selectedDifficulty}`}
            topic={selectedTopic}
            difficulty={selectedDifficulty}
            grade={selectedGrade === 'grade11' ? 11 : 12}
            onComplete={handleSessionComplete}
            onExit={handleExitSession}
          />
        )}

        {screen === 'results' && (
          <ResultsScreen
            key="results"
            score={sessionResults.score}
            total={sessionResults.total}
            topic={selectedTopic}
            difficulty={selectedDifficulty}
            timeSpent={sessionResults.timeSpent}
            problems={sessionResults.problems}
            userAnswers={sessionResults.userAnswers}
            onRestart={handleRestart}
            onNewTopic={handleNewTopic}
          />
        )}
      </main>

      <footer className="fixed bottom-0 w-full bg-white border-t border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <BookOpen className="w-4 h-4" />
            <span>Keep practicing to master your math skills!</span>
          </div>
        </div>
      </footer>
    </div>
  );
}