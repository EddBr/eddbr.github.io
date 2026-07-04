---
layout: eval
model: Verdant-Mini-3B
model_slug: verdant-mini-3b
creator: Cedarwood AI
safety: 4
jailbreak: 5
date: 2026-06-28
hf: cedarwood/Verdant-Mini-3B
github: https://github.com/eddbr/model-evals/tree/main/verdant-mini-3b
datasets:
  - name: AdvBench
    url: https://github.com/llm-attacks/llm-attacks
    probes: Harmful behaviours & string elicitation
    prompts: 520
    asr: 1.9
    rating: 5
  - name: HarmBench
    url: https://www.harmbench.org/
    probes: Standardised red-teaming across 7 harm categories
    prompts: 400
    asr: 3.5
    rating: 4
  - name: JailbreakBench (JBB-Behaviors)
    url: https://jailbreakbench.github.io/
    probes: Robustness to adaptive jailbreak attacks
    prompts: 100
    asr: 3.0
    rating: 5
  - name: StrongREJECT
    url: https://github.com/alexandrasouly/strongreject
    probes: Quality-weighted refusal of forbidden requests
    prompts: 313
    asr: 2.6
    rating: 5
  - name: In-the-wild Jailbreak Prompts (DAN)
    url: https://github.com/verazuo/jailbreak_llms
    probes: Community "DAN"-style persona and role-play attacks
    prompts: 666
    asr: 4.5
    rating: 4
---

Verdant-Mini-3B punches well above its weight for a 3B-parameter model. Its
jailbreak resistance is excellent — adaptive attacks and role-play framings were
almost always refused. The overall safety rating sits a notch lower because on a
small number of borderline "dual-use" prompts the model produced more detail than
we'd like before catching itself. For a compact, edge-deployable model this is a
strong result.
