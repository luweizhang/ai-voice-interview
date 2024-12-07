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
    ],
    "frontend-engineer": [
      "Can you explain the difference between client-side rendering (CSR) and server-side rendering (SSR)? When would you use each?",
      "How would you describe the purpose of the virtual DOM, and why is it important in frameworks like React?",
      "What is the difference between a CSS preprocessor like SASS and CSS-in-JS libraries? When might you choose one over the other?",
      "What are the key principles of responsive design, and how do you ensure a consistent user experience across devices?",
      "Can you walk me through how a browser renders a web page from the time it receives an HTML file?",
      "What strategies do you use to optimize a website's performance, particularly for users with slow internet connections?",
      "How would you reduce the time it takes for a webpage to load?",
      "What are the benefits of lazy loading images or components, and how would you implement it?",
      "What tools or techniques do you use to measure and debug frontend performance issues?",
      "How would you handle large JavaScript bundles and ensure faster loading times?",
      "Can you explain the difference between local component state and global state? How do you decide what belongs where?",
      "What are some popular state management libraries, and how do they compare to each other?",
      "How would you design a frontend application that consumes data from multiple APIs?",
      "What is the purpose of a context provider in React, and how does it compare to using Redux?",
      "How do you handle situations where an API request fails in the frontend?"
    ]
  };

  const [questions, setQuestions] = useState(questionBanks[interviewType] || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userMessage, setUserMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  const handleSubmit = async () => {
    const prompt = `You are playing the role of an AI interviewer. 
    Evaluate the following response and score it from 0 to 100, 
    where 0 is a junior level and 100 is a staff engineer level. 
    Provide suggestions for improvement. 
    Also provide the correct response below.
    \n\nUser Response: ${userMessage}`;
    try {
      const response = await fetch('http://localhost:8003/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await response.json();
      setChatResponse(data.response);
    } catch (error) {
      console.error('Error communicating with the API:', error);
    }
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  };

  useEffect(() => {
    setQuestions(questionBanks[interviewType] || []);
    setCurrentQuestionIndex(0);
  }, [interviewType]);

  return (
    <div className="ai-avatar">
      <h2>AI Interviewer</h2>
      <div className="avatar-placeholder">AI Avatar Placeholder</div>
      <p>{questions[currentQuestionIndex]}</p>
      <button onClick={nextQuestion}>Next Question</button>
      <textarea
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type your message here..."
        rows="4"
        cols="50"
      />
      <button onClick={handleSubmit}>Submit Answer</button>
      {chatResponse && <div className="chat-response">{chatResponse}</div>}
    </div>
  );
};

export default AIAvatar;
