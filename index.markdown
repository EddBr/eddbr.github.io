---
layout: default
title: Eddie's Blog
description: "Computer Science graduate exploring AI/ML and safety engineering"
---

<div class="welcome-section">
  <div class="welcome-content">
    <h1 class="welcome-title">Hi, I'm Eddie</h1>
    <p class="welcome-subtitle">Computer Science graduate exploring AI/ML and safety engineering</p>
    <p class="welcome-description">
      I'm passionate about understanding how AI systems work.<br />
      I recently graduated from the University of Edinburgh and am exploring engineering roles in AI, machine learning, and AI safety.<br />
      I've had the chance to do HCI research at <a href="https://hci.stanford.edu/">Stanford</a> and am building tools to evaluate the safety of large language models.
    </p>
    <div class="welcome-links">
      <a href="/about/" class="welcome-btn">More about me</a>
      <a href="https://github.com/eddbr" class="welcome-btn" target="_blank">My code</a>
    </div>
  </div>
</div>

<div class="what-i-do">
  <h2>Projects</h2>
  <div class="work-grid">
    <a href="/about/#research" class="work-card-link">
      <div class="work-card">
        <h3>🔬 Research</h3>
        <p>At Stanford's Interaction Design Research Lab, I helped create Identity Amplification, a design process for GenAI tools that considers their wider effects.</p>
        <span class="card-link">Learn more →</span>
      </div>
    </a>
    <a href="https://model-eval-gules.vercel.app/" class="work-card-link" target="_blank" rel="noopener">
      <div class="work-card">
        <h3>🛡️ Model Safety Leaderboard</h3>
        <p>I'm building a leaderboard to evaluate and rank the safety of large language models, helping create incentives for safer AI systems.</p>
        <span class="card-link">Explore the leaderboard →</span>
      </div>
    </a>
    <a href="https://github.com/eddbr" class="work-card-link" target="_blank" rel="noopener">
      <div class="work-card">
        <h3>💻 More projects on GitHub</h3>
        <p>Find my experiments, research work, and software projects on GitHub.</p>
        <span class="card-link">View my code →</span>
      </div>
    </a>
  </div>
</div>

<div class="recent-writing">
  <h2>Recent writing</h2>
  <p class="writing-intro">I write about AI, machine learning, and the intersection of technology and human behavior. Here are some of my recent posts:</p>
  
  {% assign all_posts = site.posts %}
  {% if all_posts.size > 0 %}
    {% assign latest_post = all_posts | first %}
    <div class="latest-post">
      <div class="latest-meta">Latest</div>
      <h3><a href="{{ latest_post.url }}">{{ latest_post.title }}</a></h3>
      <p class="post-meta">{{ latest_post.date | date: "%B %-d, %Y" }}</p>
      <p>{{ latest_post.description | default: latest_post.excerpt | strip_html | truncatewords: 28 }}</p>
      <a href="{{ latest_post.url }}" class="card-link">Read post →</a>
    </div>
    
    {% if all_posts.size > 1 %}
    <div class="posts-grid">
      {% for post in all_posts offset:1 limit:6 %}
      <a href="{{ post.url }}" class="post-card-link">
        <div class="post-card">
          <h3>{{ post.title }}</h3>
          <p class="post-meta">{{ post.date | date: "%B %-d, %Y" }}</p>
          <p>{{ post.description | default: post.excerpt | strip_html | truncatewords: 22 }}</p>
        </div>
      </a>
      {% endfor %}
    </div>
    {% endif %}
  {% else %}
    <p class="writing-intro">No posts yet — check back soon!</p>
  {% endif %}
  
  <div class="writing-actions">
    <a href="/writing/" class="btn btn-primary">📝 Browse all posts</a>
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

.latest-post {
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 4px 12px rgba(6, 95, 70, 0.08);
}

.latest-post h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.5rem;
  color: #065f46;
}

.latest-post p {
  margin: 0 0 1rem 0;
  color: #065f46;
}

.latest-meta {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  font-size: 0.85rem;
  background: #d1fae5;
  color: #065f46;
  border-radius: 999px;
  margin-bottom: 0.8rem;
  font-weight: 600;
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
