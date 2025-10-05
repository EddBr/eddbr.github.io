---
layout: page
title: About
permalink: /about/
---

<div class="about-intro">
  <h1>About me</h1>
  <p class="intro-text">
    I'm a 4th year Computer Science student at the University of Edinburgh. <br />
    I'm really passionate about understanding how AI systems work.
  </p>
</div>

<div class="about-content">
  <section class="about-section" id="research">
    <h2>What I'm researching</h2>
    <div class="research-item">
      <h3>My dissertation: LLM Agents with Reinforcement Learning</h3>
      <p>I'm exploring the theoretical foundations of how large language models can be enhanced through reinforcement learning. It's exciting exploring the field to make AI agents more interpretable and effective.</p>
    </div>
    
    <div class="research-item">
      <h3>Stanford IxD Research Lab</h3>
      <p>I had the amazing opportunity to do research at Stanford's Interaction Design Research Lab, working with <a href="https://juliamarkel.github.io" target="_blank">Julia Markel</a> to create Identity Amplification -- a design process for GenAI tools that has more consideration of possible externalities.</p>
    </div>
  </section>

  <section class="about-section">
    <h2>Building things</h2>
    <div class="startup-item">
      <h3>ProcrastApply</h3>
      <p>I co-founded ProcrastApply with <a href="https://www.linkedin.com/in/gavin-goldwasser-115310334/">Gavin</a>, a platform designed to help students get better jobs. We raised some money and got 40 users to help get actual jobs. I love startups.</p>
      <p><a href="https://procrastapply.com" target="_blank" class="external-link">Check out ProcrastApply →</a></p>
    </div>
  </section>

  <section class="about-section">
    <h2>Where I want to go</h2>
    <p>I'm really interested in working at organizations that are pushing the boundaries of AI research. I'm particularly drawn to:</p>
    <ul class="company-list">
      <li><strong>Anthropic</strong></li>
      <li><strong>DeepMind</strong></li>
      <li><strong>OpenAI</strong></li>
    </ul>
    <p>I'm also applying to Masters programs to dive deeper into machine learning theory🤞.</p>
  </section>

  <section class="about-section">
    <h2>What I'm interested in</h2>
    <div class="interests-grid">
      <div class="interest-item">
        <h4>Reinforcement Learning</h4>
        <p>Learning from interaction and rewards</p>
      </div>
      <div class="interest-item">
        <h4>Machine Learning Theory</h4>
        <p>The theoretical foundations of modern ML algorithms</p>
      </div>
      <div class="interest-item">
        <h4>Human-AI Interaction</h4>
        <p>How humans and AI systems can work together effectively</p>
      </div>
    </div>
  </section>

  <section class="about-section">
    <h2>Let's connect</h2>
    <p>I'm always interested in discussing research, collaboration opportunities, or just chatting about AI and technology. Feel free to reach out!</p>
    <div class="contact-links">
      <a href="mailto:s2289391@ed.ac.uk" class="btn btn-primary">📧 Email me</a>
      <a href="https://github.com/eddbr" target="_blank" class="btn btn-secondary">💻 My GitHub</a>
      <a href="/feed.xml" class="btn btn-secondary">📰 Subscribe to my blog</a>
    </div>
  </section>
</div>

<style>
.about-intro {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  padding: 3rem 2rem;
  text-align: center;
  margin: -2rem -2rem 3rem -2rem;
  border-bottom: 1px solid #bbf7d0;
}

.about-intro h1 {
  font-size: 2.2rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #374151;
}

.intro-text {
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
  color: #4b5563;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
}

.about-section {
  margin: 2.5rem 0;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.about-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: #059669;
}

.about-section h2 {
  color: #374151;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.research-item, .startup-item {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 3px solid #059669;
  transition: all 0.3s ease;
}

.research-item:hover, .startup-item:hover {
  background: #f0fdf4;
  border-left-color: #047857;
}

.research-item h3, .startup-item h3 {
  color: #059669;
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.research-item p, .startup-item p {
  margin: 0.5rem 0;
  line-height: 1.6;
  color: #4b5563;
  font-size: 0.95rem;
}

.external-link {
  color: #059669;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.external-link:hover {
  color: #047857;
  text-decoration: underline;
}

.company-list {
  list-style: none;
  padding: 0;
}

.company-list li {
  margin: 1rem 0;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 3px solid #d97706;
  transition: all 0.3s ease;
}

.company-list li:hover {
  background: #fef3c7;
  border-left-color: #b45309;
}

.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.interest-item {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 6px;
  text-align: center;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.interest-item:hover {
  background: #f0fdf4;
  border-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.interest-item h4 {
  color: #059669;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.interest-item p {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.contact-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 1rem 0;
  justify-content: center;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  text-align: center;
  min-width: 150px;
}

.btn-primary {
  background-color: #059669;
  color: white;
}

.btn-primary:hover {
  background-color: #047857;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .about-intro h1 {
    font-size: 1.8rem;
  }
  
  .intro-text {
    font-size: 1rem;
  }
  
  .interests-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-links {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 250px;
  }
}
</style>
