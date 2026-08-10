---
layout: post
title:  "David Silver RL Lecture 2"
categories: rl david silver
---
{% include katex.html %}
# Markov Processes
MDPs formally describe an environment for RL
Assumption: Environment is fully observable

The current state completely characterises the process

Almost all RL problems can be formalised as MDPs
## State Transition Matrix
$\mathcal{P}_{ss'}=\mathbb{P}[S_{t+1}=s'|S_t=s]$
State transition matrix $\mathcal{P}$ defines transition probabilities from all states $s$ to successor states $s'$

$\mathcal{P}=\begin{bmatrix} \mathcal{P}_{11} & ... & \mathcal{P}_{1n} \\\vdots  \\ \mathcal{P}_{n1} & & \mathcal{P}_{nn}\end{bmatrix}$
$\sum$row = 1
## Markov Process
Memoryless + random 

### Definition
A tuple $\braket{ \mathcal{S},\mathcal{P}}$

Where
- $\mathcal{S}$ is a finite set of states
- $\mathcal{P}$ is a state transition probability matrix $\mathcal{P}=\mathbb{P}[S_{t+1}=s'|S_t=s]$
# Markov Reward Processes
Markov reward process is a Markov chain with values

$=\braket{\mathcal{S},\mathcal{P},\mathcal{R},\gamma}$

- $\mathcal{S}$ is a finite state of states
- $\mathcal{P}$ is a state transition probability matrix $=\mathbb{P}[S_{t+1}=s'|S_t=s]$
- $\mathcal{R}$ is a reward function $R_s=\mathbb{E}[R_{t+1}|S_t=s]$
- $\gamma$ is the discount factor $\in[0,1]$

Return $G_t=R_{t+1}+\gamma R_{t+2}=\sum_{k=0}^\infty\gamma^kR_{t+k+1}$

## Why do we discount?
1. Mathematically convenient (bounds)
2. Avoids infinity
3. Represents uncertainty over the future
4. Money now is worth more than money later (interest rate)
5. Humans + animals display discounting / preference for immediate reward
6. [my addition] - also good for credit assignment? Earlier actions should have be attributed more reward as they led to future actions

## Value Function
Value function $V(s)$ gives long-term value of state $s$
$V(s)=\mathbb{E}[G_t|S_t=s]$
## Bellman Equation
Value function has 2 components:
1. Immediate reward $R_{t+1}$
2. Discounted value of successor state $\gamma V(S_{t+1})$
$V(s)=\mathbb{E}[G_t|S_t=s]$
$V(s)=\mathbb{E}[R_{t+1}+\gamma R_{t+2}+...|S_t=s]$
$V(s)=\mathbb{E}[R_{t+1}+(\gamma R_{t+2}+...)|S_t=s]$
$V(s)=\mathbb{E}[R_{t+1}+\gamma G_{t+1}|S_t=s]$
$V(s)=\mathbb{E}[R_{t+1}+\gamma V(S_{t+1})|S_t=s]$

$V(s)=\mathcal{R}_s+\gamma\sum_{s'\in \mathcal{S}}\mathcal{P}_{ss'}v(s')$

Bellman equation can be concisely expressed using matrices
$v=\mathcal{R}+\gamma\mathcal{P}v$
$\begin{bmatrix} v(1) \\ \vdots \\ v(n) \end{bmatrix} = \begin{bmatrix} \mathcal{R}_1 \\ \vdots \\ \mathcal{R}_n \end{bmatrix} + \begin{bmatrix} \mathcal{P}_{11} & \dots & \mathcal{P}_{1n} \\ \vdots  \\ \mathcal{P}_{n1} & \dots & \mathcal{P}_{nn} \end{bmatrix} \begin{bmatrix} v(1) \\ \vdots \\ v(n) \end{bmatrix}$
### Solving Bellman Equation
It is a linear equation
$v=\mathcal{R}+\gamma\mathcal{P}v$
-> $v=(I-\gamma\mathcal{P})^{-1}\mathcal{R}$
Computational complexity of inverting matrix is $O(n^3)$ for $n$ states
# Markov Decision Processes
Markov reward process with decisions

$\braket{\mathcal{S},\mathcal{A},\mathcal{P},\mathcal{R},\gamma}$
$\mathcal{A}$ is a set of actions
$\mathcal{P}^a_{ss'}=\mathbb{P}[S_{t+1}=s'|S_t=s,A_t=a]$
$\mathcal{R}=\mathbb{E}[R_{t+1}|S_t=s,A_t=a]$
## Policy
Distribution over actions given states
$\pi(a|s)=\mathbb{P}[A=a|S_t=s]$
$\pi$ depends on current state, not history
-> $\pi$ is time independent

State sequence $S_1,S_2,...$ is a Markov process $\braket{\mathcal{S},\mathcal{P}^\pi}$
State and reward sequence $S_1,R_1,S_2,...$ is a Markov reward process $\braket{\mathcal{S},\mathcal{P}^\pi,\mathcal{R}^\pi,\gamma}$

We update the transition and reward matrices by averaging according to the action taken
$\mathcal{P}^\pi_{s,s'}=\sum_{a\in A}\pi(a|s)\mathcal{P}^a_{s,s'}$
$\mathcal{R}^\pi_{s,s'}=\sum_{a\in A}\pi(a|s)\mathcal{R}^a_{s,s'}$

e.g. If there are 2 actions ($a_1,a_2$) that can be taken, each with probability 0.5:
$\mathcal{P}^\pi_{s,s'}=0.5\mathcal{P}^{a_1}_{s,s'}+0.5\mathcal{P}^{a_2}_{s,s'}$
$\mathcal{R}^\pi_{s,s'}=0.5\mathcal{R}^{a_1}_{s,s'}+0.5\mathcal{R}^{a_2}_{s,s'}$
(We average)
## Value Function
Expectation is dependent on the policy, thus we must use $V_\pi$ (subscript $\pi$)

### State Value Function $v_\pi$
$v_\pi=\mathbb{E}_\pi[G_t|S_t=s]$
$v_\pi=\mathbb{E}_\pi[R_{t+1}+\gamma v_\pi(S_{t+1})|S_t=s]$
### Action-value function $q_\pi$
$q_\pi(s,a)=\mathbb{E}[G_t|S_t=s,A_t=a]$
$q_\pi(s,a)=\mathbb{E}[R_{t+1}+\gamma q_\pi(S_{t+1},A_{t+1}|S_t=s,A_t=a]$
## Relating $v_\pi$ and $q_\pi$
$v_\pi=\sum_{a\in A}\pi(a|s)q_\pi(a|s)$
$q_\pi=\mathcal{R}^a_s+\gamma\sum_{s'\in S}\mathcal{P}^a_{ss'}v_\pi(s')$ (reward is received after action)
## Recursive Bellman Equation
$v_\pi(s)=\sum_{a\in A}\pi(a|s)(\mathcal{R}^a_s+\gamma\sum_{s'\in\mathcal{S}}\mathcal{P}^a_{ss'}v_\pi(s'))$

$q_\pi(s)=\mathcal{R}^a_s+\gamma\sum_{s'\in S}\mathcal{P}^a_{ss'}\sum_{a'\in A}\pi(a'|s')q_\pi(s',a')$
## Optimal Value Function
Maximum value function over all policies
$v_*(s)\max_\pi v_\pi(s)$
$q_*(s,a)=\max_\pi q_\pi(s,a)$

Define a partial ordering over policies
$\pi\ge\pi'$ if $v_\pi(s)\ge v_{\pi'}(s),\forall s$
## Finding Optimal Policy
$\pi_*(a|s)$ if $a=\arg\max_{a\in\mathcal{A}}q_*(s,a)$

$v_*(s)=\max_a q_*(s,a)$
$q_*(s,a)=\mathcal{R}^a_S+\gamma\sum_{s'\in S}\mathcal{P}^a_{ss'}v_*(s')$ - this includes the terms from the environment, which is out of our control
### Recursively
$v_*(s)=\mathcal{R}^a_S+\gamma\sum_{s'\in S}\mathcal{P}^a_{ss'}v_*(s')$
$q_*(s,a)=\mathcal{R}^a_S+\gamma\sum_{s'\in S}\mathcal{P}^a_{ss'}q_*(s',a')$
## Solving Bellman
Bellman equations are non-linear
Requires iterative solutions:
1. Value iteration
2. Policy iteration
3. Q-learning
4. SARSA
