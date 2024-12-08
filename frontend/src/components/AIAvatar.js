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
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoHtml, setVideoHtml] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    const prompt = `You are playing the role of an AI interviewer. 
    Evaluate the following response and score it from 0 to 100, 
    where 0 is a junior level and 100 is a staff engineer level. 
    Provide suggestions for improvement. 
    Also provide the correct response below.
    Can you respond in a way that can be easily parsed by javascript? 
    Can you delimited each section of the response with three hashtags?
    Can you make the response in html so thats it can easily rendered by react? 
    Make sure the entire response is well formatted with headers in bold and 
    organzed into Evaluation Score, Areas of Improvement, and Correct Response.
    In the evaluation score, also say if the response is junior, mid, senior, or staff level.
    Also, please don't have hashtags in the response.
  
Interview Question: ${questions[currentQuestionIndex]}
User Response: ${userMessage}`;

    try {
      console.log('Sending request with prompt:', prompt);
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: prompt }),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received response data:', data);
      
      if (!data.response) {
        throw new Error('No response field in data');
      }
      
      // Clean and format the response
      let cleanResponse = data.response
        .replace(/```html|```|'''/g, '')  // Remove code block markers
        .replace(/\n\s*\n/g, '\n')  // Replace multiple newlines with single newline
        .replace(/\n/g, '<br>')  // Convert remaining newlines to <br>
        .replace(/\s{2,}/g, ' ')  // Replace multiple spaces with single space
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');  // Convert **text** to <strong>
      
      // Add CSS classes for styling
      cleanResponse = cleanResponse
        .replace(/<h1>Evaluation Score/g, '<h1 class="evaluation-score">Evaluation Score')
        .replace(/<h1>Areas of Improvement/g, '<div class="improvements"><h1>Areas of Improvement')
        .replace(/<h1>Correct Response/g, '</div><div class="correct-response"><h1>Correct Response')
        + '</div>';
      
      console.log('Formatted response:', cleanResponse);
      setChatResponse(cleanResponse);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      setChatResponse(''); // Reset chat response on error
    } finally {
      setLoading(false); // Always set loading to false
    }
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
  };

  const generateVideo = async () => {
    try {
      const response = await fetch('http://localhost:8000/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: "hello this is a test?" }),
      });
      const data = await response.json();
      if (data.url) {
        setVideoUrl(data.url);
      }
    } catch (error) {
      console.error('Error generating video:', error);
    }
  };

  const fetchVideoHtml = async () => {
    try {
      const response = await fetch('/video_player.html');
      const html = await response.text();
      setVideoHtml(html);
    } catch (error) {
      console.error('Error fetching video HTML:', error);
    }
  };

  useEffect(() => {
    setQuestions(questionBanks[interviewType] || []);
    setCurrentQuestionIndex(0);
  }, [interviewType]);

  useEffect(() => {
    generateVideo();
  }, [currentQuestionIndex]);

  useEffect(() => {
    generateVideo();
  }, []);

  useEffect(() => {
    fetchVideoHtml();
  }, []);

  return (
    <div className="ai-avatar">
      <h2>AI Interviewer</h2>
      {videoUrl ? (
        <video width="320" height="240" controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: videoHtml }} />
      )}
      <p>{questions[currentQuestionIndex]}</p>
      <textarea
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type your message here..."
        rows="4"
        cols="50"
      />
      <div className="button-group">
        <button onClick={handleSubmit} disabled={loading}>Submit Answer</button>
        <button onClick={nextQuestion}>Next Question</button>
      </div>
      {loading ? (
        <p className="loading">Thinking...</p>
      ) : (
        chatResponse && <div className="chat-response" dangerouslySetInnerHTML={{ __html: chatResponse }} />
      )}
    </div>
  );
};

export default AIAvatar;
