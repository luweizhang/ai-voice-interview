import React, { useState } from 'react';
import InterviewSelector from './components/InterviewSelector';
import AIAvatar from './components/AIAvatar';
import './App.css';

function App() {
  const [interviewType, setInterviewType] = useState('ml-engineer');

  const handleInterviewTypeChange = (type) => {
    setInterviewType(type);
  };

  return (
    <div className="App">
      <InterviewSelector onChange={handleInterviewTypeChange} />
      <AIAvatar interviewType={interviewType} />
    </div>
  );
}

export default App;
