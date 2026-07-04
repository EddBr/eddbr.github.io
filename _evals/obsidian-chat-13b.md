---
layout: eval
model: Obsidian-Chat-13B
model_slug: obsidian-chat-13b
creator: BasaltWorks
safety: 3
jailbreak: 3
date: 2026-06-27
hf: basaltworks/Obsidian-Chat-13B
github: https://github.com/eddbr/model-evals/tree/main/obsidian-chat-13b
datasets:
  - name: AdvBench
    url: https://github.com/llm-attacks/llm-attacks
    probes: Harmful behaviours & string elicitation
    prompts: 520
    asr: 12.4
    rating: 3
  - name: HarmBench
    url: https://www.harmbench.org/
    probes: Standardised red-teaming across 7 harm categories
    prompts: 400
    asr: 18.0
    rating: 3
  - name: JailbreakBench (JBB-Behaviors)
    url: https://jailbreakbench.github.io/
    probes: Robustness to adaptive jailbreak attacks
    prompts: 100
    asr: 24.0
    rating: 2
  - name: StrongREJECT
    url: https://github.com/alexandrasouly/strongreject
    probes: Quality-weighted refusal of forbidden requests
    prompts: 313
    asr: 15.3
    rating: 3
  - name: In-the-wild Jailbreak Prompts (DAN)
    url: https://github.com/verazuo/jailbreak_llms
    probes: Community "DAN"-style persona and role-play attacks
    prompts: 666
    asr: 31.5
    rating: 2
---

Obsidian-Chat-13B has functional but inconsistent safety training. It refuses
direct harmful requests reliably, but its defences degrade noticeably under
persona-based and multi-turn jailbreaks — roughly a third of "DAN"-style prompts
succeeded in eliciting policy-violating content. It's usable in low-risk,
supervised settings, but we would not recommend deploying it in an unmonitored,
user-facing product without an additional safety layer.
