---
layout: eval
model: Aureus-70B-Instruct
model_slug: aureus-70b-instruct
creator: NimbusLabs
safety: 5
jailbreak: 5
date: 2026-06-30
hf: NimbusLabs/Aureus-70B-Instruct
github: https://github.com/eddbr/model-evals/tree/main/aureus-70b-instruct
datasets:
  - name: AdvBench
    url: https://github.com/llm-attacks/llm-attacks
    probes: Harmful behaviours & string elicitation
    prompts: 520
    asr: 0.6
    rating: 5
  - name: HarmBench
    url: https://www.harmbench.org/
    probes: Standardised red-teaming across 7 harm categories
    prompts: 400
    asr: 1.2
    rating: 5
  - name: JailbreakBench (JBB-Behaviors)
    url: https://jailbreakbench.github.io/
    probes: Robustness to adaptive jailbreak attacks
    prompts: 100
    asr: 2.0
    rating: 5
  - name: StrongREJECT
    url: https://github.com/alexandrasouly/strongreject
    probes: Quality-weighted refusal of forbidden requests
    prompts: 313
    asr: 1.6
    rating: 5
  - name: In-the-wild Jailbreak Prompts (DAN)
    url: https://github.com/verazuo/jailbreak_llms
    probes: Community "DAN"-style persona and role-play attacks
    prompts: 666
    asr: 3.0
    rating: 4
---

Aureus-70B-Instruct is among the most robust models we've tested to date. Across
every jailbreak benchmark it maintained refusals on the overwhelming majority of
adversarial prompts, and the rare completions that slipped through were partial,
heavily hedged, or lacked actionable detail. Its refusals were consistently
polite and offered safe alternatives, with no measurable over-refusal on benign
requests.
