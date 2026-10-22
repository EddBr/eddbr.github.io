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
    <li>
      <h2><a href="{{ '/playground/most-x-sound/' | relative_url }}">🔊 The Most X Sound</a></h2>
      <p>
        The same idea for audio. Pick one of 521 sounds and your browser reshapes a 4-second loop
        until Google's YAMNet is sure it's hearing a baby cry, applause or a siren. It comes out as
        uncanny, buzzing static with the right outline.
      </p>
      <p class="playground-links">
        <a href="{{ '/playground/most-x-sound/' | relative_url }}">Try it →</a>
      </p>
    </li>
    <li>
      <h2><a href="{{ '/playground/usability-heuristics/' | relative_url }}">🛠️ Spot the Usability Problems</a></h2>
      <p>
        An app that breaks all 10 of Nielsen's usability heuristics. Find each problem, name the
        rule it breaks, and watch that part of the app repair itself. Against the clock.
      </p>
      <p class="playground-links">
        <a href="{{ '/playground/usability-heuristics/' | relative_url }}">Try it →</a>
      </p>
    </li>
    <li>
      <h2><a href="{{ '/playground/handle-atlas/' | relative_url }}">🚪 The Handle Atlas</a></h2>
      <p>
        27 door handles from around the world, modelled in 3D. Walk up with W A S D, then press the
        lever, turn the knob, slide the panel or lift the knocker and let it drop. Every door has its
        own weight, and the heavy ones fight back.
      </p>
      <p class="playground-links">
        <a href="{{ '/playground/handle-atlas/' | relative_url }}">Try it →</a>
      </p>
    </li>
    <li>
      <h2><a href="{{ '/playground/tap-atlas/' | relative_url }}">🚰 The Tap Atlas</a></h2>
      <p>
        28 taps, pumps and fountains, modelled in 3D: a bronze stopcock nearly two thousand years old,
        a hand pump, a tippy tap, a boiling-water tap and a water ATM. Twist, lift, pump or wave to
        work each one, then hold your hand under the running water to feel how hot it is.
      </p>
      <p class="playground-links">
        <a href="{{ '/playground/tap-atlas/' | relative_url }}">Try it →</a>
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
