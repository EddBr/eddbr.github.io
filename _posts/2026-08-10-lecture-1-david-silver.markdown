---
layout: post
title:  "David Silver RL Lecture 1"
categories: rl david silver
---

{% include katex.html %}
# Difference between RL and other machine learning
1. There is no supervisor - instead a reward signal
2. Feedback is delayed
3. Time is important (sequential, non i.i.d.)
4. Agent's actions affect the subsequent data it receives
### Examples of RL
1. Fly stunt helicopter
2. Defeat world champion at Backgammon
3. Managing investment portfolio
4. Control power station! - Sequence of controls in power station
5. Make humanoid robot walk
6. Play many different Atari games
# The RL Problem
## Reward
$R_t$ - scalar feedback
Indicates how well agent is doing at step $t$
Agent's job is to maximise cumulative reward
### Reward Hypothesis
All goals can be described by the maximisation of the expected cumulative reward $\mathbb{E}(G_t)$
-RL is based off this hypothesis
### Examples of Reward

| Situation                     | +ve Reward                     | -ve Reward                  |
| ----------------------------- | ------------------------------ | --------------------------- |
| Helicopter manouevres         | Following desired trajectory   | Crashing                    |
| Backgammon                    | Winning                        | Losing                      |
| Managing investment portfolio | Increasing $/£ in bank account | Losing money                |
| Control a power station       | Producing power                | Exceeding safety thresholds |
| Humanoid walk                 | Forward motion                 | Falling over                |
| Atari games                   | Increasing score               | Decreasing score            |
## Sequential Decision Making
**Goal:** Select actions to maximise total future reward
- Actions have long term consequences
- Rewards might be delayed
- Better to sacrifice immediate reward to gain more long-term reward
### Examples:
1. Financial investment (takes years to mature)
2. Flying helicopter (might prevent crash in several hours)
3. Blocking opponent's moves (increases odds of winning in many moves)
## Agent and Environment
![[Pasted image 20260809143727.png]]
### In each time step $t$:

| Agent                                                                                        | Environment                                                                            |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1. Executes action $A_t$<br>2. Receives observation $O_t$<br>3. Receives scalar reward $R_t$ | 1. Receives action $A_t$<br>2. Emits observation $O_t$<br>3. Emits scalar reward $R_t$ |
## History and State
### History 
Sequence of observations, actions, rewards
$H_t=A_1,O_1,R_1,...,A_t,O_t,R_t$
(all variables up to time $t$)
e.g. sensirometer stream of a robot or embodied agent

Agent selects actions depending on history
### State
Information used to decide what happens next
State is a function of the history
$S_t=f(H_t)$
## Environment State
$S^e_t$ - environment's private representation
(whatever data environment uses to pick next observation/reward)
Not usually visible to agent
## Agent State
$S^a_t$ - agent's internal representation
(whatever information the agent uses to decide next action)
Any function of history $S^a_t=f(H_t)$
## Information State / Markov State
Contains all useful information from the history

A state $S_t$ is Markov iff $\mathbb{P}[S_{t+1}|S_t]=\mathbb{P}[S_{t+1}|S_1,...,S_t]$

All of history is Markov (not very useful but true)
## Fully Observable Environments
Agent directly observes environment state
$O_t=S^a_t=S^e_t$
This is a Markov Decision Process (MDP)
## Partially Observable Environments
Partial observability - agent indirectly observes environment
### Examples
1. Robot with camera vision isn't told its absolute location
2. Trading agent only observes current prices
3. Poker playing agent only observes public cards
Agent state $\ne$ Environment state

-Partially observable Markov decision process (POMDP)
Agent must construct it's own state $S_t^a$:
1. Complete history $S^a_t=H_t$
2. Build Bayesian beliefs $S^a_t=(\mathbb{P}[S^e_t=s^1],...,\mathbb{P}[S^e_t=s^n])$
3. RNN $S^a_t=\sigma(S^a_{t-1}W_s+O_tW_o)$
# Inside an RL agent
May include one or more:
1. Policy $\pi$ - agent's behaviour function
2. Value function $V$ - how good each state/action
3. Model - agent's representation of environment
## 1. Policy
Map from state to action $a=\pi(s)$ or stochastically $\pi(a|s)=\mathbb{P}[A=a|S=s]$

## 2. Value Function
Value function is a prediction of future reward
Used to evaluate the goodness/badness of states
$V_\pi(s)=\mathbb{E}_\pi[R_t+\gamma R_{t+1}+\gamma^2 R_{t+2}+...|S_t=s]$
## 3. Model
Predicts what environment will do next
Transitions: $\mathcal{P}$ predicts next state (i.e. dynamics)
Rewards: $\mathcal{R}$ predicts next (immediate) reward

$\mathcal{P}^a_{ss'}=\mathbb{P}[S'=s'|S=s,A=a]$
$\mathcal{R}^a_{s}=\mathbb{P}[R|S=s,A=a]$
## Categorising Agents

| Value-based          | Policy-based      | Actor Critic   |
| -------------------- | ----------------- | -------------- |
| No policy (implicit) | Policy            | Policy         |
| Value function       | No value function | Value function |

| Model free                   | Model Based                  |
| ---------------------------- | ---------------------------- |
| Policy and/or value function | Policy and/or value function |
| No model                     | Model                        |
![[Pasted image 20260809154439.png]]
# Problems within RL
## Reinforcement Learning
- Environment is initially unknown
- Agent interacts with environment
- Agent improves policy
## Planning
- Model of environment is known
- Agent performs computations with its model (without any external interaction)
- Agent improves its policy
### Atari Example
- Knows rules of the game
- Can query the emulator for next state and score
- Plan ahead to find optimal policy (MCTS)
## Exploration V Exploitation
RL is like trial and error learning
Agent should discover a good policy from its experience of the environment, without losing too much reward

Exploration finds more information about environment
Exploitation exploits known information to maximise reward
### Examples

| Example                      | Exploitation                    | Exploration             |
| ---------------------------- | ------------------------------- | ----------------------- |
| Restaurant                   | Go to your favourite restaurant | Try a new restaurant    |
| Online Banner Advertisements | Show must successful advert     | Show a different advert |
| Oil drilling                 | Drill at best known location    | Drill at a new location |
| Game playing                 | Play best move                  | Play different strategy |
## Prediction and Control
Prediction - evaluate the future given my policy
Control - optimise the future (find the best policy)
