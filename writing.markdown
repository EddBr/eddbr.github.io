---
layout: page
title: Writing
permalink: /writing/
description: All of my posts, grouped by year.
---

<div class="writing-archive">
  <h1>Writing archive</h1>
  <p class="archive-intro">A searchable home for everything I've published — research logs, textbook notes, and personal essays.</p>

  {% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
  {% assign posts_by_year = posts_by_year | sort: "name" | reverse %}

  {% for year in posts_by_year %}
    <section class="archive-year">
      <h2>{{ year.name }}</h2>
      <ul class="archive-list">
        {% assign year_posts = year.items | sort: "date" | reverse %}
        {% for post in year_posts %}
          <li>
            <span class="archive-date">{{ post.date | date: "%b %-d" }}</span>
            <a href="{{ post.url }}">{{ post.title }}</a>
            <p>{{ post.description | default: post.excerpt | strip_html | truncatewords: 26 }}</p>
          </li>
        {% endfor %}
      </ul>
    </section>
  {% endfor %}
</div>

<style>
.writing-archive {
  max-width: 800px;
  margin: 0 auto;
}

.archive-intro {
  color: #6b7280;
  margin-bottom: 2rem;
}

.archive-year {
  margin: 3rem 0;
}

.archive-year h2 {
  border-bottom: 2px solid #d1d5db;
  padding-bottom: 0.5rem;
  color: #374151;
}

.archive-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0 0;
}

.archive-list li {
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.archive-list li:last-child {
  border-bottom: none;
}

.archive-date {
  font-size: 0.9rem;
  color: #9ca3af;
  margin-right: 0.5rem;
  display: inline-block;
  min-width: 70px;
}

.archive-list a {
  font-weight: 600;
  color: #059669;
  text-decoration: none;
}

.archive-list a:hover {
  text-decoration: underline;
}

.archive-list p {
  margin: 0.4rem 0 0 0;
  color: #4b5563;
  font-size: 0.9rem;
}
</style>

