---
layout: page
title: Playground
permalink: /playground/
description: Interactive experiments.
---

<div class="playground-page">
  <p class="playground-intro">Interactive experiments.</p>

  <ul class="playground-list">
    <li>
      <h2><a href="{{ '/playground/fourier-economy/' | relative_url }}">📈 A Fourier Series Model of the Economy</a></h2>
      <p>
        GDP drawn by spinning circles, one for each economic cycle: technology, medicine,
        housing, energy, business confidence and markets. Then black swans knock it off course.
      </p>
      <p class="playground-links">
        <a href="{{ '/playground/fourier-economy/' | relative_url }}">Try it →</a>
      </p>
    </li>
    <li>
      <h2><a href="{{ '/playground/most-x/' | relative_url }}">🐟 The Most X Image</a></h2>
      <p>
        Pick a classifier and a thing, and your browser runs gradient ascent on an image
        until the model is as sure as it can be. Five classifiers (objects, textures,
        art styles, scenes and beauty) running live on your GPU.
      </p>
      <p class="playground-links">
        <a href="{{ '/playground/most-x/' | relative_url }}">Try it →</a>
      </p>
    </li>
  </ul>
</div>

<style>
.playground-page { max-width: 800px; margin: 0 auto; }

.playground-intro { color: #6b7280; margin-bottom: 2rem; }

.playground-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.playground-list li {
  padding: 1.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.playground-list li:last-child { border-bottom: none; }

.playground-list h2 { margin: 0 0 0.5rem 0; }

.playground-list h2 a {
  color: #059669;
  text-decoration: none;
}

.playground-list h2 a:hover { text-decoration: underline; }

.playground-list p {
  margin: 0.4rem 0 0 0;
  color: #4b5563;
  font-size: 0.95rem;
}

.playground-links {
  margin-top: 0.75rem !important;
}

.playground-links a {
  color: #059669;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.playground-links a:hover { text-decoration: underline; }
</style>
