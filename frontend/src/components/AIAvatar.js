import React, { useState, useEffect } from 'react';

const AIAvatar = ({ interviewType }) => {
  const questionBanks = {
    "ml-engineer": [
      "Explain the bias-variance tradeoff.",
      "What is overfitting, and how do you prevent it?",
      "Describe supervised, unsupervised, and reinforcement learning.",
      "How does a decision tree work, and how is it different from a random forest?",
      "How does gradient descent work? What are its limitations?",
      "Explain how a support vector machine (SVM) classifies data.",
      "What are the key differences between k-means and hierarchical clustering?",
      "Compare and contrast logistic regression and linear regression.",
      "How would you select features for a predictive model?",
      "How do you handle imbalanced datasets?"
    ],
    "backend-developer": [
      "Can you explain the difference between monolithic and microservices architectures? When would you choose one over the other?",
      "What is REST, and how does it differ from GraphQL? What are the pros and cons of each?",
      "What is the role of caching in backend systems? Can you describe a situation where caching improved performance significantly?",
      "What is the CAP theorem, and how does it influence your design decisions?",
      "How would you explain the concept of eventual consistency to someone unfamiliar with distributed systems?",
      "Imagine a system that handles a million users daily. How would you ensure it scales effectively?",
      "What strategies would you use to optimize database performance in a high-traffic application?",
      "What is load balancing, and why is it essential for distributed systems?",
      "Can you describe a scenario where you faced a bottleneck in a system? How did you identify and resolve it?",
      "How would you design a logging system to monitor the performance?"
    ]
  };

  const [questions, setQuestions] = useState(questionBanks[interviewType] || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    setQuestions(questionBanks[interviewType] || []);
    setCurrentQuestionIndex(0);
  }, [interviewType]);

  const nextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  };

  return (
    <div className="ai-avatar">
      <h2>AI Interviewer</h2>
      <div className="avatar-placeholder">AI Avatar Placeholder</div>
      <p>{questions[currentQuestionIndex]}</p>
      <button onClick={nextQuestion}>Next Question</button>
    </div>
  );
};

export default AIAvatar;
