---
layout: default
title: Eddie's Blog
description: "4th Year CS Student | ML Theory Research | AI Safety | Founder"
---

<div class="welcome-section">
  <div class="welcome-content">
    <h1 class="welcome-title">Hi, I'm Eddie</h1>
    <p class="welcome-subtitle">Computer Science student exploring AI safety and machine learning theory</p>
    <p class="welcome-description">
      I'm passionate about understanding how AI systems work and making them safer. 
      Currently working on my dissertation about LLM Agents with Reinforcement Learning, 
      and I've had the chance to do research at Stanford's IxD Lab and build a startup called ProcrastApply.
    </p>
    <div class="welcome-links">
      <a href="/about/" class="welcome-btn">More about me</a>
      <a href="https://github.com/eddbr" class="welcome-btn" target="_blank">My code</a>
    </div>
  </div>
</div>

<div class="what-i-do">
  <h2>What I'm working on</h2>
  <div class="work-grid">
    <a href="/about/#research" class="work-card-link">
      <div class="work-card">
        <h3>🔬 Research</h3>
        <p>My dissertation focuses on the theoretical foundations of LLM agents with reinforcement learning. I'm also exploring how humans and AI can work together better.</p>
        <span class="card-link">Learn more →</span>
      </div>
    </a>
    <a href="https://procrastapply.com" class="work-card-link" target="_blank">
      <div class="work-card">
        <h3>🚀 ProcrastApply</h3>
        <p>I built a platform to help students overcome application procrastination. It's been a great learning experience in both tech and understanding human behavior.</p>
        <span class="card-link">Check it out →</span>
      </div>
    </a>
    <a href="/ai/safety/2025/06/01/ai-safety.html" class="work-card-link">
      <div class="work-card">
        <h3>🤖 AI Safety</h3>
        <p>I write about AI safety, particularly around how LLMs might affect human communication and social dynamics. It's a topic I think about a lot.</p>
        <span class="card-link">Read my thoughts →</span>
      </div>
    </a>
  </div>
</div>

<div class="recent-writing">
  <h2>Recent writing</h2>
  <p class="writing-intro">I write about AI, machine learning, and the intersection of technology and human behavior. Here are some of my recent posts:</p>
  
  <div class="posts-grid">
    <a href="/llm/communication/2025/09/12/llms-in-the-world.html" class="post-card-link">
      <div class="post-card">
        <h3>LLMs in the World</h3>
        <p class="post-meta">September 12, 2025</p>
        <p>How LLMs are becoming the new social media and what that means for human communication...</p>
      </div>
    </a>
    
    <a href="/rl/textbook/2025/09/01/rl-chapter-2.html" class="post-card-link">
      <div class="post-card">
        <h3>RL Chapter 2</h3>
        <p class="post-meta">September 1, 2025</p>
        <p>Continuing my journey through reinforcement learning theory and applications...</p>
      </div>
    </a>
    
    <a href="/rl/textbook/2025/08/28/rl-chapter-1.html" class="post-card-link">
      <div class="post-card">
        <h3>RL Chapter 1</h3>
        <p class="post-meta">August 28, 2025</p>
        <p>Starting my exploration of reinforcement learning fundamentals...</p>
      </div>
    </a>
    
    <a href="/personal/blog/procrastapply/2025/07/11/procrastapply.html" class="post-card-link">
      <div class="post-card">
        <h3>Building ProcrastApply</h3>
        <p class="post-meta">July 11, 2025</p>
        <p>Lessons learned from building a platform to help students with applications...</p>
      </div>
    </a>
    
    <a href="/ai/safety/2025/06/01/ai-safety.html" class="post-card-link">
      <div class="post-card">
        <h3>Thoughts on AI Safety</h3>
        <p class="post-meta">June 1, 2025</p>
        <p>My early thoughts on AI safety, ChatGPT, and maintaining human agency...</p>
      </div>
    </a>
    
    <a href="/personal/blog/2025/06/01/first-post.html" class="post-card-link">
      <div class="post-card">
        <h3>First Post</h3>
        <p class="post-meta">June 1, 2025</p>
        <p>Why I decided to start writing publicly and putting my thoughts out there...</p>
      </div>
    </a>
  </div>
  
  <div class="writing-actions">
    <a href="mailto:s2289391@ed.ac.uk" class="btn btn-primary">📧 Email me</a>
    <a href="https://github.com/eddbr" class="btn btn-secondary" target="_blank">💻 My GitHub</a>
    <a href="/feed.xml" class="btn btn-secondary">📰 Subscribe to my blog</a>
  </div>
</div>

<style>
.welcome-section {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  padding: 3rem 2rem;
  text-align: center;
  margin: -2rem -2rem 3rem -2rem;
  border-bottom: 1px solid #bbf7d0;
}

.welcome-content {
  max-width: 700px;
  margin: 0 auto;
}

.welcome-title {
  font-size: 2.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.welcome-subtitle {
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  font-weight: 400;
}

.welcome-description {
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 2rem 0;
  color: #4b5563;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.welcome-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.welcome-btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  color: #059669;
  text-decoration: none;
  font-weight: 500;
  border: 1px solid #059669;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
}

.welcome-btn:hover {
  background-color: #059669;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);
}

.what-i-do {
  margin: 3rem 0;
}

.what-i-do h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #374151;
  font-size: 1.8rem;
  font-weight: 600;
}

.work-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.work-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.work-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.work-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: #059669;
}

.work-card h3 {
  margin: 0 0 0.75rem 0;
  color: #059669;
  font-size: 1.3rem;
  font-weight: 600;
}

.work-card p {
  margin: 0 0 1rem 0;
  color: #6b7280;
  line-height: 1.6;
  font-size: 1rem;
  flex-grow: 1;
}

.card-link {
  color: #059669;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  margin-top: auto;
}

.recent-writing {
  margin: 3rem 0;
}

.recent-writing h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #374151;
  font-size: 1.8rem;
  font-weight: 600;
}

.writing-intro {
  text-align: center;
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.post-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.post-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: #059669;
}

.post-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #374151;
}

.post-card .post-meta {
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0 0 0.75rem 0;
}

.post-card p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
  font-size: 0.95rem;
  flex-grow: 1;
}

.writing-actions {
  text-align: center;
  margin: 2rem 0;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.writing-actions .btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  min-width: 180px;
  text-align: center;
}

.writing-actions .btn-primary {
  background-color: #059669;
  color: white;
}

.writing-actions .btn-primary:hover {
  background-color: #047857;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}

.writing-actions .btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.writing-actions .btn-secondary:hover {
  background-color: #e5e7eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 1.8rem;
  }
  
  .welcome-subtitle {
    font-size: 1rem;
  }
  
  .welcome-description {
    font-size: 0.95rem;
  }
  
  .work-grid {
    grid-template-columns: 1fr;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
  
  .writing-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .writing-actions .btn {
    width: 100%;
    max-width: 250px;
  }
  
  .welcome-links {
    flex-direction: column;
    align-items: center;
  }
  
  .welcome-links .welcome-btn {
    width: 100%;
    max-width: 200px;
    text-align: center;
  }
}
</style>
