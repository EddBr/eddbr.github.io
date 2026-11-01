# 100 Days of RL

One idea a day, Mon–Fri, from Tue 27 Oct 2026 to Mon 15 Mar 2027.
Each day: **one idea → one tiny interactive → one line of maths.**

Rules:
- 10 min learning, 5 min posting. The interactive does the explaining.
- If you miss a day, the numbering just carries on. The dates are a guide, not a deadline.
- Worlds get reused on purpose (corridor, coin & gem, restaurants, gridworld) so each day builds on the last.

Main source: Sutton & Barto, *Reinforcement Learning: An Introduction* (2nd ed., free online). Others are listed per week.

---

## Week 1: What is RL? (27–30 Oct) ✅ built
*Silver Lecture 1–2, S&B ch. 1*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 1 | Tue 27 Oct | The RL loop | Walk a robot to a flag; table logs S, A, R | $S_0, A_0, R_1, S_1, \dots$ |
| 2 | Wed 28 Oct | Reward is the goal | Coin vs gem sliders; robot changes its mind | $G = R_1 + \dots + R_T$ |
| 3 | Thu 29 Oct | Explore vs exploit | 3 restaurants, 15 nights; ε-greedy robot | $Q(a) = \text{total}/N(a)$ |
| 4 | Fri 30 Oct | Discounting | γ slider; bars of $\gamma^k$; coin vs gem again | $G_t = \sum \gamma^k R_{t+k+1}$ |

## Week 2: Bandits (2–6 Nov)
*S&B ch. 2.1–2.7*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 5 | Mon 2 Nov | The 10-armed bandit | Pull 10 levers; each reveals its spread of rewards as you go | $q_*(a) = \mathbb{E}[R \mid A=a]$ |
| 6 | Tue 3 Nov | Averaging without storing everything | Type rewards in; estimate hops toward each one | $Q_{n+1} = Q_n + \frac{1}{n}(R_n - Q_n)$ |
| 7 | Wed 4 Nov | "Old + step × (target − old)" | Same, with a step-size slider α; true value drifts | $Q \leftarrow Q + \alpha(R - Q)$ |
| 8 | Thu 5 Nov | Optimism explores for free | Restaurants again, start every estimate at 10; greedy robot | Initial $Q_1(a) = 10$ |
| 9 | Fri 6 Nov | UCB: explore the uncertain | Bars with "maybe this good" whiskers that shrink with visits | $Q(a) + c\sqrt{\ln t / N(a)}$ |

## Week 3: Smarter bandits (9–13 Nov)
*S&B ch. 2.8–2.10; Russo et al., "A Tutorial on Thompson Sampling" §1–3*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 10 | Mon 9 Nov | Regret | Race greedy, ε-greedy and UCB; plot regret over time | $\text{Regret}_T = T q_* - \sum_t q(A_t)$ |
| 11 | Tue 10 Nov | Beliefs as curves | Flip a coin; watch its Beta curve sharpen | $\text{Beta}(1 + \text{heads}, 1 + \text{tails})$ |
| 12 | Wed 11 Nov | Thompson sampling | 3 coins, each draws a guess from its curve; best guess plays | $A = \arg\max_a \tilde\theta_a$, $\tilde\theta_a \sim \text{Beta}$ |
| 13 | Thu 12 Nov | Softmax and temperature | Preference sliders → probability bars; temperature slider | $\pi(a) = e^{H(a)/\tau} / \sum_b e^{H(b)/\tau}$ |
| 14 | Fri 13 Nov | Contextual bandits | Show an ad to visitors; best ad depends on who's visiting | $Q(x, a)$: context + action |

## Week 4: Markov decision processes (16–20 Nov)
*S&B ch. 3.1–3.4; Silver Lecture 2*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 15 | Mon 16 Nov | The Markov property | Weather chain: predict tomorrow from today vs from the whole week | $P(S_{t+1} \mid S_t) = P(S_{t+1} \mid S_1, \dots, S_t)$ |
| 16 | Tue 17 Nov | Markov chains | Run the weather chain; histogram settles down | Transition matrix $P$, rows sum to 1 |
| 17 | Wed 18 Nov | Stationary distribution | Drag matrix entries; long-run histogram moves | $\mu = \mu P$ |
| 18 | Thu 19 Nov | MDPs: actions with uncertain results | Icy gridworld: 80% you go where you meant, 20% you slip | $p(s', r \mid s, a)$ |
| 19 | Fri 20 Nov | Episodes and terminal states | Same grid with a pit and a goal; episodes end | Absorbing state: $G$ stops adding |

## Week 5: Policies and values (23–27 Nov)
*S&B ch. 3.5–3.8*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 20 | Mon 23 Nov | Policies | Click cells to set arrows; or make them random | $\pi(a \mid s)$ |
| 21 | Tue 24 Nov | State value | Run 100 episodes from a cell; average return = its value | $v_\pi(s) = \mathbb{E}_\pi[G_t \mid S_t = s]$ |
| 22 | Wed 25 Nov | Action value | Each cell split into 4 triangles, one per action | $q_\pi(s, a) = \mathbb{E}_\pi[G_t \mid S_t = s, A_t = a]$ |
| 23 | Thu 26 Nov | Values from action values | Policy sliders; $v$ is the weighted average of the 4 $q$s | $v_\pi(s) = \sum_a \pi(a \mid s)\, q_\pi(s, a)$ |
| 24 | Fri 27 Nov | Optimal policy | Toggle "act greedily"; arrows snap to best | $\pi_*(s) = \arg\max_a q_*(s, a)$ |

## Week 6: Bellman equations (30 Nov–4 Dec)
*S&B ch. 3.5–3.6; Silver Lecture 2*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 25 | Mon 30 Nov | Value = now + discounted later | Hover a cell; see the one-step lookahead it's built from | $v(s) = \mathbb{E}[R + \gamma v(S')]$ |
| 26 | Tue 1 Dec | Bellman expectation equation | Backup diagram that fills with numbers | $v_\pi(s) = \sum_a \pi \sum_{s',r} p\,[r + \gamma v_\pi(s')]$ |
| 27 | Wed 2 Dec | Solving it exactly | 2-state MDP with sliders; solve the 2 equations live | $v = R + \gamma P v$ |
| 28 | Thu 3 Dec | Matrix form | 3-state version; show the inverse | $v = (I - \gamma P)^{-1} R$ |
| 29 | Fri 4 Dec | Bellman optimality | Same diagram, average → max; compare numbers | $v_*(s) = \max_a \sum p\,[r + \gamma v_*(s')]$ |

## Week 7: Dynamic programming (7–11 Dec)
*S&B ch. 4; Silver Lecture 3*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 30 | Mon 7 Dec | Policy evaluation | Gridworld; press "sweep" and watch values spread from the goal | $v_{k+1}(s) = \sum \pi \sum p\,[r + \gamma v_k(s')]$ |
| 31 | Tue 8 Dec | Policy improvement | Press "be greedy"; arrows update from the values | $\pi'(s) = \arg\max_a q_\pi(s, a)$ |
| 32 | Wed 9 Dec | Policy iteration | Alternate the two buttons until nothing changes | Evaluate → improve → repeat |
| 33 | Thu 10 Dec | Value iteration | One button that does both at once; count sweeps | $v_{k+1}(s) = \max_a \sum p\,[r + \gamma v_k(s')]$ |
| 34 | Fri 11 Dec | Generalised policy iteration | Two lines ($v$ and $\pi$) chasing each other to the optimum | $v \to v_\pi$, $\pi \to \text{greedy}(v)$ |

## Week 8: Monte Carlo (14–18 Dec)
*S&B ch. 5; Silver Lecture 4*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 35 | Mon 14 Dec | Learning without a model | Gridworld with hidden rules; play episodes, average returns | $V(s) \approx \text{average of } G$ |
| 36 | Tue 15 Dec | First-visit vs every-visit | Episode that loops through a state twice; count both ways | Which returns count? |
| 37 | Wed 16 Dec | Blackjack | Play hands; heatmap of value for (your sum, dealer card) | $V(\text{sum}, \text{dealer})$ |
| 38 | Thu 17 Dec | MC control | Blackjack bot learns when to hit; policy grid updates | $\pi(s) = \arg\max_a Q(s, a)$ |
| 39 | Fri 18 Dec | Importance sampling | Two dice (fair, loaded); reweight one's results to estimate the other | $\rho = \pi(a \mid s) / b(a \mid s)$ |

## Week 9: Holiday week, lighter (21–25 Dec)
*S&B ch. 1.5 (tic-tac-toe)*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 40 | Mon 21 Dec | Recap: the map so far | Clickable concept map linking days 1–39 | — |
| 41 | Tue 22 Dec | Quiz | 10 questions, each answered by an earlier interactive | — |
| 42 | Wed 23 Dec | Tic-tac-toe, part 1 | Play against a table of board values | $V(s) \leftarrow V(s) + \alpha[V(s') - V(s)]$ |
| 43 | Thu 24 Dec | Tic-tac-toe, part 2 | Train it by self-play; watch it stop losing | Same rule, 10,000 games |
| 44 | Fri 25 Dec | 🎄 Optional: "what confused me most" | — | — |

## Week 10: Temporal-difference learning (28 Dec–1 Jan)
*S&B ch. 6.1–6.3; Silver Lecture 4*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 45 | Mon 28 Dec | TD(0) | 5-state random walk; values update after every step | $V(S) \leftarrow V(S) + \alpha[R + \gamma V(S') - V(S)]$ |
| 46 | Tue 29 Dec | TD error = surprise | Plot δ each step; link to dopamine neurons | $\delta = R + \gamma V(S') - V(S)$ |
| 47 | Wed 30 Dec | Driving home | Update your arrival estimate mid-journey (S&B 6.1) | Learn a guess from a guess |
| 48 | Thu 31 Dec | TD vs MC | Race both on the random walk; error curves | Bias vs variance |
| 49 | Fri 1 Jan | 🎆 Optional: batch TD vs MC (A–B example) | 8 episodes; the two methods disagree | Certainty equivalence |

## Week 11: Learning to act (4–8 Jan)
*S&B ch. 6.4–6.6; Silver Lecture 5*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 50 | Mon 4 Jan | 🎉 Halfway | Timeline of all 49 interactives | — |
| 51 | Tue 5 Jan | SARSA | Gridworld agent learning on-policy; Q arrows grow | $Q(S,A) \mathrel{+}= \alpha[R + \gamma Q(S',A') - Q(S,A)]$ |
| 52 | Wed 6 Jan | Q-learning | Same grid, max instead of next action | $Q(S,A) \mathrel{+}= \alpha[R + \gamma \max_a Q(S',a) - Q(S,A)]$ |
| 53 | Thu 7 Jan | Cliff walking | Both side by side: SARSA plays safe, Q-learning hugs the cliff | On-policy vs off-policy |
| 54 | Fri 8 Jan | Expected SARSA | Average over next actions instead of sampling | $\sum_a \pi(a \mid S')\, Q(S', a)$ |

## Week 12: Going further with TD (11–15 Jan)
*S&B ch. 6.7, 7, 8.1–8.2, 12.1*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 55 | Mon 11 Jan | Maximisation bias | Max of 10 noisy zeros is always > 0; Double Q fixes it | $\mathbb{E}[\max] \ge \max \mathbb{E}$ |
| 56 | Tue 12 Jan | n-step returns | Slider n from 1 (TD) to ∞ (MC) | $G_{t:t+n} = R_{t+1} + \dots + \gamma^n V(S_{t+n})$ |
| 57 | Wed 13 Jan | λ-returns | Weight bars $(1-\lambda)\lambda^{n-1}$ (like Day 4) | $G^\lambda = (1-\lambda)\sum \lambda^{n-1} G_{t:t+n}$ |
| 58 | Thu 14 Jan | Eligibility traces | Footprints that fade behind the agent; reward lights them up | $e \leftarrow \gamma\lambda e + \nabla V$ |
| 59 | Fri 15 Jan | Dyna-Q: planning | Maze; "imagined steps" slider makes learning faster | Real step + $n$ model steps |

## Week 13: Function approximation (18–22 Jan)
*S&B ch. 9; Silver Lecture 6*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 60 | Mon 18 Jan | Tables don't scale | Count states: tic-tac-toe, chess, Go, a 64×64 image | $|S|$ explodes |
| 61 | Tue 19 Jan | Linear value functions | Drag weights on features; value curve changes | $\hat v(s) = \mathbf{w}^\top \mathbf{x}(s)$ |
| 62 | Wed 20 Jan | Gradient descent on values | Fit a line to returns, one step at a time | $\mathbf{w} \mathrel{+}= \alpha[G - \hat v]\nabla \hat v$ |
| 63 | Thu 21 Jan | Generalisation | Update one state and its neighbours move too (coarse coding) | Shared features |
| 64 | Fri 22 Jan | Neural nets as value functions | Tiny network fitting a bumpy value curve | $\hat v(s; \theta)$ |

## Week 14: Deep Q-networks (25–29 Jan)
*Mnih et al. 2015 "Human-level control through deep RL"; S&B ch. 11.3*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 65 | Mon 25 Jan | The deadly triad | Approximation + bootstrapping + off-policy → weights blow up | Divergence |
| 66 | Tue 26 Jan | DQN | Pixels in, Q-values out; diagram you can poke | $Q(s, a; \theta)$ |
| 67 | Wed 27 Jan | Experience replay | Buffer of memories; sample random batches vs in order | Break correlations |
| 68 | Thu 28 Jan | Target networks | Chasing a moving target vs a frozen one | $y = r + \gamma \max_a Q(s', a; \theta^-)$ |
| 69 | Fri 29 Jan | Double DQN | Callback to Day 55; overestimation shrinks | Select with $\theta$, evaluate with $\theta^-$ |

## Week 15: Policy gradients (1–5 Feb)
*S&B ch. 13.1–13.4; Spinning Up "Intro to Policy Optimization"*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 70 | Mon 1 Feb | Learn the policy directly | Softmax policy (Day 13) with draggable parameters | $\pi_\theta(a \mid s)$ |
| 71 | Tue 2 Feb | The big idea | Good return → nudge that action's probability up | $\nabla J \propto \mathbb{E}[G \nabla \log \pi]$ |
| 72 | Wed 3 Feb | The log trick | Plot $\pi$ and $\log \pi$; see why gradients divide by $\pi$ | $\nabla \pi / \pi = \nabla \log \pi$ |
| 73 | Thu 4 Feb | REINFORCE | Corridor agent learning; probability bars move per episode | $\theta \mathrel{+}= \alpha G_t \nabla \log \pi(A_t \mid S_t)$ |
| 74 | Fri 5 Feb | Baselines | Same, with and without subtracting a baseline; noise shrinks | $(G_t - b(S_t))$ |

## Week 16: Actor-critic (8–12 Feb)
*S&B ch. 13.5–13.7; Schulman et al. 2015 "GAE"*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 75 | Mon 8 Feb | Actor and critic | Two characters: one acts, one scores the move | Actor $\pi_\theta$, critic $\hat v_w$ |
| 76 | Tue 9 Feb | Advantage | "Better or worse than usual?" bar for each action | $A(s, a) = Q(s, a) - V(s)$ |
| 77 | Wed 10 Feb | One-step actor-critic | Corridor again; uses δ from Day 46 | $\theta \mathrel{+}= \alpha \delta \nabla \log \pi$ |
| 78 | Thu 11 Feb | GAE | λ slider blending TD and MC advantages (Day 57 again) | $\hat A = \sum (\gamma\lambda)^l \delta_{t+l}$ |
| 79 | Fri 12 Feb | Continuous actions | Gaussian policy: drag μ and σ to aim a throw | $a \sim \mathcal{N}(\mu_\theta, \sigma_\theta^2)$ |

## Week 17: PPO (15–19 Feb)
*Schulman et al. 2017 "PPO"; Spinning Up PPO page*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 80 | Mon 15 Feb | Big steps break things | Step-size slider; too big and the policy collapses | Why trust regions |
| 81 | Tue 16 Feb | KL divergence | Two distributions you can drag; KL number updates | $D_{KL}(p \| q) = \sum p \log \frac{p}{q}$ |
| 82 | Wed 17 Feb | Probability ratio | Old vs new policy bars; ratio for each action | $r(\theta) = \pi_\theta / \pi_{\theta_\text{old}}$ |
| 83 | Thu 18 Feb | The clip | Plot the objective vs $r$ for good and bad actions | $\min(rA, \text{clip}(r, 1 \pm \epsilon)A)$ |
| 84 | Fri 19 Feb | Entropy bonus | Slider keeps the policy from going certain too early | $+\beta H(\pi)$ |

## Week 18: RL for language models (22–26 Feb)
*Lambert, "RLHF" book (rlhfbook.com) ch. 1–8; Rafailov et al. 2023 "DPO"*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 85 | Mon 22 Feb | An LLM is a policy | Tokens as actions; sentence as an episode | $\pi_\theta(\text{token} \mid \text{text so far})$ |
| 86 | Tue 23 Feb | Preferences → scores | Pick the better of two answers; Elo-style scores update | $P(A \succ B) = \sigma(r_A - r_B)$ |
| 87 | Wed 24 Feb | Reward models | Fit scores to your choices from Day 86 | Bradley–Terry loss |
| 88 | Thu 25 Feb | KL leash | β slider: too low and the model games the reward | $r - \beta\, D_{KL}(\pi \| \pi_\text{ref})$ |
| 89 | Fri 26 Feb | DPO | Skip the reward model; push chosen up, rejected down | $\log\sigma(\beta[\log\frac{\pi(y_w)}{\pi_\text{ref}(y_w)} - \log\frac{\pi(y_l)}{\pi_\text{ref}(y_l)}])$ |

## Week 19: When RL goes wrong, and RL for reasoning (1–5 Mar)
*Krakovna et al. "Specification gaming" list; Shao et al. 2024 "DeepSeekMath" (GRPO)*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 90 | Mon 1 Mar | Reward hacking | Day 2's world with a respawning coin; agent loops forever | Proxy ≠ goal |
| 91 | Tue 2 Mar | Goodhart's law | Optimise a proxy; true score rises then falls | Over-optimisation curve |
| 92 | Wed 3 Mar | Verifiable rewards | Maths answers checked automatically: right = 1, wrong = 0 | $r \in \{0, 1\}$ |
| 93 | Thu 4 Mar | GRPO | Sample 4 answers, score them, normalise within the group | $\hat A_i = (r_i - \bar r)/\sigma_r$ |
| 94 | Fri 5 Mar | Sparse rewards and curiosity | Big maze, one reward; a novelty bonus helps | $r + \beta / \sqrt{N(s)}$ |

## Week 20: The big picture (8–15 Mar)
*Silver et al. 2016/2017 (AlphaGo, AlphaZero); Schrittwieser et al. 2020 (MuZero)*

| Day | Date | Idea | Interactive | Maths |
|---|---|---|---|---|
| 95 | Mon 8 Mar | Tree search | Tic-tac-toe (Day 42) with a growing search tree | MCTS: select, expand, simulate, back up |
| 96 | Tue 9 Mar | AlphaZero | Self-play loop diagram you can step through | Search improves policy, policy guides search |
| 97 | Wed 10 Mar | World models | Agent learns the rules, then plans in its head (Day 59 again) | $\hat p(s' \mid s, a)$ |
| 98 | Thu 11 Mar | Offline RL | Learn from a fixed log; agent tries actions never seen | Distribution shift |
| 99 | Fri 12 Mar | Multi-agent | Two agents playing rock-paper-scissors against each other | Nash equilibrium |
| 100 | Mon 15 Mar | 🎉 Day 100 | Every interactive on one page, plus "what I'd tell Day 1 me" | — |
