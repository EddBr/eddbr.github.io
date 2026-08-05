---
layout: page
title: Projects
permalink: /projects/
description: Things I'm building.
---

<div class="projects-page">
  <h1>Projects</h1>
  <p class="projects-intro">Things I'm building, mostly around AI safety and evaluation.</p>

  <ul class="project-list">
    <li>
      <h2><a href="{{ '/model-evals/' | relative_url }}">🛡️ Model Evals</a></h2>
      <p>
        Safety evaluations of large language models, one model at a time — with the
        goal of eventually covering every model on HuggingFace. The idea is a
        "race to the top": the safest model becomes the judge that evaluates the rest.
      </p>
      <p class="project-links">
        <a href="{{ '/model-evals/' | relative_url }}">Read about it →</a>
        <a href="https://aisafetyindex.com/" target="_blank" rel="noopener">Live version: aisafetyindex.com ↗</a>
      </p>
    </li>
  </ul>
</div>

<style>
.projects-page { max-width: 800px; margin: 0 auto; }

.projects-intro { color: #6b7280; margin-bottom: 2rem; }

.project-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.project-list li {
  padding: 1.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.project-list li:last-child { border-bottom: none; }

.project-list h2 { margin: 0 0 0.5rem 0; }

.project-list h2 a {
  color: #059669;
  text-decoration: none;
}

.project-list h2 a:hover { text-decoration: underline; }

.project-list p {
  margin: 0.4rem 0 0 0;
  color: #4b5563;
  font-size: 0.95rem;
}

.project-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.75rem !important;
}

.project-links a {
  color: #059669;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.project-links a:hover { text-decoration: underline; }
</style>
