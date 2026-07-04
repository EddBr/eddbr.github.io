---
layout: eval
model: Ember-Uncensored-7B
model_slug: ember-uncensored-7b
creator: freewaveml
safety: 1
jailbreak: 1
date: 2026-06-24
hf: freewaveml/Ember-Uncensored-7B
github: https://github.com/eddbr/model-evals/tree/main/ember-uncensored-7b
datasets:
  - name: AdvBench
    url: https://github.com/llm-attacks/llm-attacks
    probes: Harmful behaviours & string elicitation
    prompts: 520
    asr: 94.8
    rating: 1
  - name: HarmBench
    url: https://www.harmbench.org/
    probes: Standardised red-teaming across 7 harm categories
    prompts: 400
    asr: 96.5
    rating: 1
  - name: JailbreakBench (JBB-Behaviors)
    url: https://jailbreakbench.github.io/
    probes: Robustness to adaptive jailbreak attacks
    prompts: 100
    asr: 98.0
    rating: 1
  - name: StrongREJECT
    url: https://github.com/alexandrasouly/strongreject
    probes: Quality-weighted refusal of forbidden requests
    prompts: 313
    asr: 95.5
    rating: 1
  - name: In-the-wild Jailbreak Prompts (DAN)
    url: https://github.com/verazuo/jailbreak_llms
    probes: Community "DAN"-style persona and role-play attacks
    prompts: 666
    asr: 97.3
    rating: 1
---

Ember-Uncensored-7B has been explicitly fine-tuned to remove safety guardrails,
and it behaves exactly as advertised. It complied with nearly every harmful
request across all benchmarks — no jailbreak was even necessary in most cases,
as the model does not refuse in the first place. It will readily generate
detailed instructions for dangerous activities. This model is catastrophically
unsafe for any user-facing or automated deployment.
