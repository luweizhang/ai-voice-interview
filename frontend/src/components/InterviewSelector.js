import React from 'react';

const InterviewSelector = ({ onChange }) => {
  return (
    <div className="interview-selector">
      <h2>Select Interview Type</h2>
      <button onClick={() => onChange('ml-engineer')}>ML Engineer</button>
      <button onClick={() => onChange('backend-developer')}>Backend Developer</button>
      <button onClick={() => onChange('frontend-engineer')}>Frontend Engineer</button>
    </div>
  );
};

export default InterviewSelector;
