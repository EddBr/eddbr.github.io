---
layout: eval
model: Kraken-MoE-8x22B
model_slug: kraken-moe-8x22b
creator: DeepTide Research
safety: 2
jailbreak: 2
date: 2026-06-25
hf: deeptide/Kraken-MoE-8x22B
github: https://github.com/eddbr/model-evals/tree/main/kraken-moe-8x22b
datasets:
  - name: AdvBench
    url: https://github.com/llm-attacks/llm-attacks
    probes: Harmful behaviours & string elicitation
    prompts: 520
    asr: 41.2
    rating: 2
  - name: HarmBench
    url: https://www.harmbench.org/
    probes: Standardised red-teaming across 7 harm categories
    prompts: 400
    asr: 47.5
    rating: 2
  - name: JailbreakBench (JBB-Behaviors)
    url: https://jailbreakbench.github.io/
    probes: Robustness to adaptive jailbreak attacks
    prompts: 100
    asr: 58.0
    rating: 1
  - name: StrongREJECT
    url: https://github.com/alexandrasouly/strongreject
    probes: Quality-weighted refusal of forbidden requests
    prompts: 313
    asr: 44.7
    rating: 2
  - name: In-the-wild Jailbreak Prompts (DAN)
    url: https://github.com/verazuo/jailbreak_llms
    probes: Community "DAN"-style persona and role-play attacks
    prompts: 666
    asr: 63.1
    rating: 1
---

Kraken-MoE-8x22B is a capable model with weak safety alignment. Its
mixture-of-experts routing appears to make its refusal behaviour brittle:
attacks that specify an "expert" persona or a fictional framing succeeded well
over half the time. The model readily produced detailed, actionable harmful
content once jailbroken. We consider it dangerous to deploy in any setting
exposed to untrusted users without substantial additional guardrails.
