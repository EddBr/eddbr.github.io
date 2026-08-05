---
layout: page
title: Model Evals
permalink: /model-evals/
description: Safety evaluations of LLMs, one model at a time.
---

<div class="model-evals">
  <h1>Model safety evaluations</h1>
  <p class="evals-intro">
    I'm evaluating the safety of large language models — with the 
    goal of eventually covering every model on
    <a href="https://huggingface.co/models">HuggingFace</a>. Use the table below to
    check whether a model you're considering is safe to use. Click any column
    heading to sort.
  </p>
  <p class="evals-live">
    🔗 The live version is at
    <a href="https://aisafetyindex.com/" target="_blank" rel="noopener">aisafetyindex.com</a>.
  </p>
  <h3>Race to the top</h3>
  <p>
  The intention behind this is to create a "race to the top scenario" 
  Whichever AI model is the safest, will be the judge model that evaluates the other models.
  Thus there is a financial and reputational incentive to create the safest model.
  </p>
  <p class="evals-disclaimer">⚠️ This is early work in progress and currently contains placeholder data.</p>

  <div class="rating-key">
    <span class="badge rating-5">👍 5 · Excellent</span>
    <span class="badge rating-4">🙂 4 · Good</span>
    <span class="badge rating-3">😐 3 · OK</span>
    <span class="badge rating-2">⚠️ 2 · Dangerous</span>
    <span class="badge rating-1">☢️ 1 · Catastrophic</span>
  </div>

  {% assign ratings = "_,Catastrophic,Dangerous,OK,Good,Excellent" | split: "," %}
  {% assign emojis = "_,☢️,⚠️,😐,🙂,👍" | split: "," %}

  <table class="evals-table" id="evals-table">
    <thead>
      <tr>
        <th data-type="text">Model</th>
        <th data-type="text">Creator</th>
        <th data-type="number">Overall Safety</th>
        <th data-type="number">Jailbreak Resistance</th>
        <th data-type="date">Evaluated</th>
        <th class="no-sort">Link</th>
      </tr>
    </thead>
    <tbody>
      {% for m in site.data.model_evals %}
      <tr>
        <td class="model-name">{{ m.model }}</td>
        <td>{{ m.creator }}</td>
        <td data-sort="{{ m.safety }}">
          <span class="badge rating-{{ m.safety }}">{{ emojis[m.safety] }} {{ m.safety }} · {{ ratings[m.safety] }}</span>
        </td>
        <td data-sort="{{ m.jailbreak }}">
          <span class="badge rating-{{ m.jailbreak }}">{{ emojis[m.jailbreak] }} {{ m.jailbreak }} · {{ ratings[m.jailbreak] }}</span>
        </td>
        <td data-sort="{{ m.date | date: '%s' }}">
          {{ m.date | date: "%b %-d, %Y" }}
          {% assign slug = m.model | slugify %}
          {% assign report = site.evals | where: "model_slug", slug | first %}
          {% if report %}<a class="view-report" href="{{ report.url | relative_url }}">view →</a>{% endif %}
        </td>
        <td><a href="https://huggingface.co/{{ m.hf }}" target="_blank" rel="noopener">🤗 View</a></td>
      </tr>
      {% endfor %}
    </tbody>
  </table>

  <p class="evals-count">{{ site.data.model_evals | size }} models evaluated so far.</p>
</div>

<style>
.model-evals { max-width: 960px; margin: 0 auto; }
.evals-intro { color: #4b5563; margin-bottom: 0.75rem; }
.evals-live { margin-bottom: 0.75rem; font-weight: 600; }
.evals-live a { color: #059669; text-decoration: none; }
.evals-live a:hover { text-decoration: underline; }
.evals-disclaimer { color: #92400e; background: #fffbeb; border: 1px solid #fde68a; padding: 0.5rem 0.75rem; border-radius: 6px; font-size: 0.9rem; }

.rating-key { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1.5rem 0; }

.badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid transparent;
}
.rating-5 { background: #dcfce7; color: #166534; border-color: #86efac; }
.rating-4 { background: #ecfccb; color: #3f6212; border-color: #bef264; }
.rating-3 { background: #fef9c3; color: #854d0e; border-color: #fde047; }
.rating-2 { background: #ffedd5; color: #9a3412; border-color: #fdba74; }
.rating-1 { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }

.evals-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.92rem;
}
.evals-table th, .evals-table td {
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}
.evals-table thead th {
  border-bottom: 2px solid #d1d5db;
  color: #374151;
  user-select: none;
}
.evals-table th:not(.no-sort) { cursor: pointer; }
.evals-table th:not(.no-sort):hover { color: #059669; }
.evals-table th[aria-sort]::after { content: " ↕"; opacity: 0.35; font-size: 0.8em; }
.evals-table th[aria-sort="ascending"]::after { content: " ↑"; opacity: 1; }
.evals-table th[aria-sort="descending"]::after { content: " ↓"; opacity: 1; }
.evals-table tbody tr:hover { background: #f0fdf4; }
.model-name { font-weight: 600; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.88rem; }
.evals-table a { color: #059669; text-decoration: none; font-weight: 600; }
.evals-table a:hover { text-decoration: underline; }
.evals-count { color: #9ca3af; font-size: 0.9rem; }
.view-report { display: inline-block; margin-left: 0.4rem; font-size: 0.8rem; padding: 0.05rem 0.4rem; border: 1px solid #bbf7d0; border-radius: 999px; background: #f0fdf4; white-space: nowrap; }

@media (max-width: 640px) {
  .evals-table { font-size: 0.8rem; }
  .evals-table th, .evals-table td { padding: 0.45rem 0.4rem; }
}
</style>

<script>
(function () {
  var table = document.getElementById("evals-table");
  if (!table) return;
  var headers = table.tHead.rows[0].cells;
  var tbody = table.tBodies[0];

  function cellValue(row, index, type) {
    var cell = row.cells[index];
    var sortAttr = cell.getAttribute("data-sort");
    var raw = sortAttr !== null ? sortAttr : cell.textContent.trim();
    if (type === "number" || type === "date") return parseFloat(raw) || 0;
    return raw.toLowerCase();
  }

  Array.prototype.forEach.call(headers, function (th, index) {
    if (th.classList.contains("no-sort")) return;
    th.setAttribute("aria-sort", "none");
    th.addEventListener("click", function () {
      var type = th.getAttribute("data-type") || "text";
      var current = th.getAttribute("aria-sort");
      var asc = current !== "ascending";

      Array.prototype.forEach.call(headers, function (h) {
        if (!h.classList.contains("no-sort")) h.setAttribute("aria-sort", "none");
      });
      th.setAttribute("aria-sort", asc ? "ascending" : "descending");

      var rows = Array.prototype.slice.call(tbody.rows);
      rows.sort(function (a, b) {
        var va = cellValue(a, index, type);
        var vb = cellValue(b, index, type);
        if (va < vb) return asc ? -1 : 1;
        if (va > vb) return asc ? 1 : -1;
        return 0;
      });
      rows.forEach(function (r) { tbody.appendChild(r); });
    });
  });
})();
</script>
