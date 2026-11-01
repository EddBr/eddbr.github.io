---
layout: post
title:  "David Silver RL Lecture 3"
categories: rl david silver
---

{% include katex.html %}
# Planning by Dynamic Programming
### "Dynamic"
Sequential/temporal component
###  "Programming"
Optimising a "program" / policy

## Properties of DP
Dynamic programming is a general solution method for problems with 2 properties:

| Property                                                                            | Presence in RL                                      |
| ----------------------------------------------------------------------------------- | --------------------------------------------------- |
| Optimal substructure (optimal solution can be decomposed into subproblems)          | Bellman equation gives recursive decomposition      |
| Overlapping subproblems which recur many times - solutions can be cached and reused | Value function is the subproblem that can be cached |

## DP Assumptions
Assumes full knowledge of the MDP
Used for planning in an MDP

| Prediction                                                                                                                                                                                                  | Control                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Input:** <br>1. $\text{MDP}\braket{\mathcal{S},\mathcal{A},\mathcal{P},\mathcal{R},\gamma}$ or MRP $\text{MDP}\braket{\mathcal{S},\mathcal{A},\mathcal{P}^\pi,\mathcal{R}^\pi,\gamma}$<br>2. Policy $\pi$ | **Input:** <br>1. $\text{MDP}\braket{\mathcal{S},\mathcal{A},\mathcal{P},\mathcal{R},\gamma}$ |
| **Output:** <br>1. Value function $v_\pi$<br>                                                                                                                                                               | **Output:**<br>1. Optimal value function $v_*$<br>2. Optimal policy $\pi_*$                   |

# Policy Evaluation
### Problem
Evaluate a given policy $\pi$
### Solution
Iterative application of Bellman expectation backup

$v_1\to v_2\to...\to v_\pi$
Using synchronous backups
	At each iteration $k+1$
	For all states $s\in S$
	Update $v_{k+1}(s)$ from $v_k(s')$
	where $s'$ is a successor state of $s$

$v_{k+1}=\sum_{a\in A}\pi(a\vert s)(\mathcal{R}^a_s+\gamma\sum_{s' \in S}\mathcal{P}^a_{ss'}v_k(s'))$
$v^{k+1}=\mathcal{R}^\pi+\gamma\mathcal{P}^\pi v^k$
# Policy Iteration
1. Evaluate the policy $\pi$ in $v_\pi=\mathbb{E}[\mathcal{R}_{t+1}+\gamma\mathcal{R}_{t+2}+...\vert S_t=s]$
2. Improve the policy by acting greedily with respect to $v_\pi$ -> $\pi'=\text{greedy}(v_\pi)$

Policy iteration always converges to $\pi^*$

Policy evaluation (Estimate $v_\pi$) $\rightleftarrows$ Policy improvement (Generate $\pi'\ge\pi$)

## Policy Improvement Theorem
Imagine we start with a deterministic policy $a=\pi(s)$

We can *improve* the policy by acting greedily
$\pi '(s)=\arg\max_{a\in A}q_\pi(s,a)$
This improves the value from any state $s$ over one step:
$q_\pi(s,\pi'(s))=\max_{a\in A}q_\pi(s,a)\ge q_\pi(s,\pi(s))=v_\pi(s)$ 

$q_\pi$(s,a) - Value gained if we use policy $\pi$ from state $s$ and taking action $a$

$q_\pi(s,\pi'(s))=\mathbb{E}_{\pi'}[R_{t+1}+\gamma v_\pi(S_{t+1})\vert S_t=s]$
$\le \mathbb{E}_{\pi'}[R_{t+1}+\gamma R_{t+2}+...\vert S_t=s]=v_{\pi'}(S)$

If improvements stop
$q_\pi(s,\pi'(s))=\max_{a\in A}q_\pi(s,a)=q_\pi(s,\pi(s))=v_\pi(s)$
Then the Bellman optimality equation has been satisfied
$v_\pi(s)=\max_{a\in A}q_\pi(s,a)$
$v_\pi(s)=v_*(s)$ $\forall s\in S$

If policy improvement stops -> Bellman optimality equation satisfied -> Found an optimal policy

**Policy iteration solves MDPs**
$v_\pi(s)=\max_{a\in A}q_\pi(s,a)$
$v_\pi(s)=v_*(s)$ for all $s\in S$
## Modified Policy Iteration
Early stopping
$\epsilon$-convergence of value function (when value function only changing by $\epsilon$)
Or stop evaluating policy after $k$ iterations
# Value iteration
## Principle of Optimality Theorem
Policy $\pi(a\vert s)$ achieves optimal value $v_\pi(s)=v_*(s)$ from state $s$ iff:
For any state $s'$ reachable from $s$, $\pi$ achieves the optimal value from state $s'$, $v_\pi(s')=v_*(s')$
## Value Iteration Algorithm
If we know the solution to subproblems $v_*(s')$

Then solution $v_*(s)$ can be found by one-step lookahead
$v_*(s)\leftarrow\max_{a\in A}R^a_s+\gamma\sum_{s'in S}P^a_{ss'}v_*(s')$

Value iteration applies these updates again and again
### Intuition
Start at the end of the problem and work back
Still works with loopy, stochastic MDPs
#### Problem
Find optimal policy $\pi$ 
#### Solution
Iterative application of Bellman optimality backup
$v_1\to v_2\to ...\to v_*$
Using synchronous backups
- At each iteration $k+1$
- For all states $s\in S$
- Update $v_{k+1}(s)$ from $v_k(s')$

Unlike policy iteration, there is no explicit policy
Intermediate value functions may not achievable by any policy

This is modified policy iteration with $k=1$ 
![[Pasted image 20261101211533.png]]
The curve below the first open circle means $\max$

Each state performs a lookahead and finds a new value $v_{k+1}(s)\leftarrow s$

$v_{k+1}(s)=\max_{a\in A}(R^a_s+\gamma\sum_{s'\in S}P^a_{ss'}v_k(s'))$
$v_{k+1}=\max_{a\in A}(R^a+\gamma P^av_k)$

| Problem    | Bellman Equation                                         | Algorithm                   |
| ---------- | -------------------------------------------------------- | --------------------------- |
| Prediction | Bellman Expectation Equation                             | Iterative Policy Evaluation |
| Control    | Bellman Expectation Equation + Greedy Policy Improvement | Policy Iteration            |
| Control    | Bellman Optimality Equation                              | Value Iteration             |

Algorithms are based on state-value function $v_\pi(s)$ or $v_*(s)$
Complexity $O(mn^2)$ per iteration for $m$ actions and $n$ states

Could apply $q$ updates -> $O(m^2n^2)$
# Dynamic Programming Extensions
## Asynchronous DP
$v_{\text{new}(s)}\leftarrow\max_{a\in A}(R^a_s+\gamma\sum_{s'\in S}P^a_{ss'}v_{\text{old}}(s'))$
$v_{\text{old}}\leftarrow v_{\text{new}}$
Instead do $v(s)\leftarrow\max_{a\in A}(R^a_s+\gamma\sum_{s'\in S}P^a_{ss'}v(s'))$
## Prioritised Sweeping
Use magnitude of Bellman error to guide state selection.
$\vert \max_{a\in A}(R^a_s+\gamma\sum_{s'\in S}P^a_{ss'}v(s'))-v(s)\vert $
- Backup the state with the largest Bellman error
- Update Bellman error of affected states after each backup
- Requires knowledge of reverse dynamics (predecessor states)
- Can be implemented efficiently by maintaining a priority queue
## Real-time Dynamic Programming
- Idea: only states that are relevant to agent
- Use agent's experience to guide the selection of states
- After each time-step $S_t,A_t,R_{t+1}$
- Backup the state $S_t$
$v(S_t)\leftarrow\max_{a\in A}(R^a_{S_t}+\gamma\sum_{s'\in S}P^a_{S_ts'}v(s'))$
## DP Curse of Dimensionality
For each backup, every successor state and actions is stored
Number of states $n=\vert S\vert $ grows exponentially with number of variables
Can be too expensive for even one backup with $10^{170}$ states
### SOLUTION -> Sample
1. Sample one action according to policy
2. Sample transition according to dynamics
3. Backup based off 1 sample, rather than branching factor

**Advantages:**
1. Model-free - no advance knowledge required: Rather than someone having to tell us dynamics, we sample to find out
2. Breaks curse of dimensionality
3. Costs of backups is consistent
