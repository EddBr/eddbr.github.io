// lessons.js: the course outline. Single source of truth for titles, units,
// navigation and the progress strip. "read" is the main reading for a lesson.
// S&B = Sutton & Barto, Reinforcement Learning: An Introduction (2nd ed., 2018).

// Lessons 1..RL_LIVE are published. Later lessons are listed but not linked.
// On localhost everything is linked, for authoring.
window.RL_LIVE = ['localhost', '127.0.0.1'].includes(location.hostname) ? 100 : 9;

window.RL_UNITS = [
  { n: 1, title: 'What is RL?' },
  { n: 2, title: 'Bandits' },
  { n: 3, title: 'Smarter bandits' },
  { n: 4, title: 'Markov decision processes' },
  { n: 5, title: 'Policies and values' },
  { n: 6, title: 'Bellman equations' },
  { n: 7, title: 'Dynamic programming' },
  { n: 8, title: 'Monte Carlo methods' },
  { n: 9, title: 'Review and tic-tac-toe' },
  { n: 10, title: 'Temporal-difference learning' },
  { n: 11, title: 'Learning to act' },
  { n: 12, title: 'Going further with TD' },
  { n: 13, title: 'Function approximation' },
  { n: 14, title: 'Deep Q-networks' },
  { n: 15, title: 'Policy gradients' },
  { n: 16, title: 'Actor-critic' },
  { n: 17, title: 'PPO' },
  { n: 18, title: 'RL for language models' },
  { n: 19, title: 'When RL goes wrong' },
  { n: 20, title: 'The big picture' },
];

window.RL_LESSONS = [
  // Unit 1: What is RL?
  { n: 1, unit: 1, title: 'The agent–environment loop', read: 'S&B §1.1, §3.1' },
  { n: 2, unit: 1, title: 'Rewards define the goal', read: 'S&B §3.2' },
  { n: 3, unit: 1, title: 'Explore or exploit?', read: 'S&B §1.1, §2.1' },
  { n: 4, unit: 1, title: 'Discounting', read: 'S&B §3.3' },

  // Unit 2: Bandits
  { n: 5, unit: 2, title: 'The multi-armed bandit', read: 'S&B §2.1' },
  { n: 6, unit: 2, title: 'Averages, one step at a time', read: 'S&B §2.4' },
  { n: 7, unit: 2, title: 'Step sizes and moving targets', read: 'S&B §2.5' },
  { n: 8, unit: 2, title: 'Optimistic initial values', read: 'S&B §2.6' },
  { n: 9, unit: 2, title: 'Upper confidence bounds', read: 'S&B §2.7' },

  // Unit 3: Smarter bandits
  { n: 10, unit: 3, title: 'Regret', read: 'Lattimore & Szepesvári, Bandit Algorithms, ch. 4' },
  { n: 11, unit: 3, title: 'Beliefs as distributions', read: 'Russo et al., A Tutorial on Thompson Sampling, §2–3' },
  { n: 12, unit: 3, title: 'Thompson sampling', read: 'Russo et al., A Tutorial on Thompson Sampling, §3' },
  { n: 13, unit: 3, title: 'Softmax and gradient bandits', read: 'S&B §2.8' },
  { n: 14, unit: 3, title: 'Contextual bandits', read: 'S&B §2.9' },

  // Unit 4: Markov decision processes
  { n: 15, unit: 4, title: 'The Markov property', read: 'S&B §3.1; Silver Lecture 2' },
  { n: 16, unit: 4, title: 'Markov chains', read: 'Silver Lecture 2' },
  { n: 17, unit: 4, title: 'Stationary distributions', read: 'Any intro to Markov chains; Silver Lecture 2' },
  { n: 18, unit: 4, title: 'Markov decision processes', read: 'S&B §3.1' },
  { n: 19, unit: 4, title: 'Episodes and terminal states', read: 'S&B §3.3–3.4' },

  // Unit 5: Policies and values
  { n: 20, unit: 5, title: 'Policies', read: 'S&B §3.5' },
  { n: 21, unit: 5, title: 'State values', read: 'S&B §3.5' },
  { n: 22, unit: 5, title: 'Action values', read: 'S&B §3.5' },
  { n: 23, unit: 5, title: 'From action values to state values', read: 'S&B §3.5' },
  { n: 24, unit: 5, title: 'Optimal policies', read: 'S&B §3.6' },

  // Unit 6: Bellman equations
  { n: 25, unit: 6, title: 'Now plus later', read: 'S&B §3.5' },
  { n: 26, unit: 6, title: 'The Bellman expectation equation', read: 'S&B §3.5' },
  { n: 27, unit: 6, title: 'Solving a small MDP by hand', read: 'Silver Lecture 2' },
  { n: 28, unit: 6, title: 'Bellman in matrix form', read: 'Silver Lecture 2' },
  { n: 29, unit: 6, title: 'The Bellman optimality equation', read: 'S&B §3.6' },

  // Unit 7: Dynamic programming
  { n: 30, unit: 7, title: 'Policy evaluation', read: 'S&B §4.1' },
  { n: 31, unit: 7, title: 'Policy improvement', read: 'S&B §4.2' },
  { n: 32, unit: 7, title: 'Policy iteration', read: 'S&B §4.3' },
  { n: 33, unit: 7, title: 'Value iteration', read: 'S&B §4.4' },
  { n: 34, unit: 7, title: 'Generalised policy iteration', read: 'S&B §4.6' },

  // Unit 8: Monte Carlo methods
  { n: 35, unit: 8, title: 'Learning without a model', read: 'S&B §5.1' },
  { n: 36, unit: 8, title: 'First-visit and every-visit', read: 'S&B §5.1' },
  { n: 37, unit: 8, title: 'Blackjack', read: 'S&B §5.1 (Example 5.1)' },
  { n: 38, unit: 8, title: 'Monte Carlo control', read: 'S&B §5.3–5.4' },
  { n: 39, unit: 8, title: 'Importance sampling', read: 'S&B §5.5' },

  // Unit 9: Review and tic-tac-toe
  { n: 40, unit: 9, title: 'Review: the map so far', read: 'S&B ch. 1–5 summaries' },
  { n: 41, unit: 9, title: 'Review quiz', read: 'Lessons 1–39' },
  { n: 42, unit: 9, title: 'Tic-tac-toe: a table of values', read: 'S&B §1.5' },
  { n: 43, unit: 9, title: 'Tic-tac-toe: learning by self-play', read: 'S&B §1.5' },
  { n: 44, unit: 9, title: "The gambler's problem", read: 'S&B §4.4 (Example 4.3)' },

  // Unit 10: Temporal-difference learning
  { n: 45, unit: 10, title: 'TD(0)', read: 'S&B §6.1' },
  { n: 46, unit: 10, title: 'The TD error', read: 'S&B §6.1; Schultz, Dayan & Montague (1997)' },
  { n: 47, unit: 10, title: 'Driving home', read: 'S&B §6.1 (Example 6.1)' },
  { n: 48, unit: 10, title: 'TD versus Monte Carlo', read: 'S&B §6.2 (Example 6.2)' },
  { n: 49, unit: 10, title: 'Batch updating', read: 'S&B §6.3 (Example 6.4)' },

  // Unit 11: Learning to act
  { n: 50, unit: 11, title: 'Review: halfway', read: 'Lessons 1–49' },
  { n: 51, unit: 11, title: 'SARSA', read: 'S&B §6.4' },
  { n: 52, unit: 11, title: 'Q-learning', read: 'S&B §6.5' },
  { n: 53, unit: 11, title: 'Cliff walking', read: 'S&B §6.5 (Example 6.6)' },
  { n: 54, unit: 11, title: 'Expected SARSA', read: 'S&B §6.6' },

  // Unit 12: Going further with TD
  { n: 55, unit: 12, title: 'Maximisation bias', read: 'S&B §6.7' },
  { n: 56, unit: 12, title: 'n-step returns', read: 'S&B §7.1' },
  { n: 57, unit: 12, title: 'λ-returns', read: 'S&B §12.1' },
  { n: 58, unit: 12, title: 'Eligibility traces', read: 'S&B §12.2' },
  { n: 59, unit: 12, title: 'Dyna-Q: learning and planning', read: 'S&B §8.2' },

  // Unit 13: Function approximation
  { n: 60, unit: 13, title: "Tables don't scale", read: 'S&B §9.1' },
  { n: 61, unit: 13, title: 'Linear value functions', read: 'S&B §9.4' },
  { n: 62, unit: 13, title: 'Gradient descent on values', read: 'S&B §9.3' },
  { n: 63, unit: 13, title: 'Generalisation', read: 'S&B §9.5' },
  { n: 64, unit: 13, title: 'Neural networks as value functions', read: 'S&B §9.7' },

  // Unit 14: Deep Q-networks
  { n: 65, unit: 14, title: 'The deadly triad', read: 'S&B §11.2–11.3' },
  { n: 66, unit: 14, title: 'DQN', read: 'Mnih et al. (2015), Human-level control through deep RL' },
  { n: 67, unit: 14, title: 'Experience replay', read: 'Mnih et al. (2015)' },
  { n: 68, unit: 14, title: 'Target networks', read: 'Mnih et al. (2015)' },
  { n: 69, unit: 14, title: 'Double DQN', read: 'van Hasselt, Guez & Silver (2016)' },

  // Unit 15: Policy gradients
  { n: 70, unit: 15, title: 'Learning the policy directly', read: 'S&B §13.1' },
  { n: 71, unit: 15, title: 'The policy gradient', read: 'S&B §13.2; OpenAI Spinning Up, Part 3' },
  { n: 72, unit: 15, title: 'The log-derivative trick', read: 'OpenAI Spinning Up, Part 3' },
  { n: 73, unit: 15, title: 'REINFORCE', read: 'S&B §13.3' },
  { n: 74, unit: 15, title: 'Baselines', read: 'S&B §13.4' },

  // Unit 16: Actor-critic
  { n: 75, unit: 16, title: 'Actors and critics', read: 'S&B §13.5' },
  { n: 76, unit: 16, title: 'Advantage', read: 'OpenAI Spinning Up, Part 3' },
  { n: 77, unit: 16, title: 'One-step actor-critic', read: 'S&B §13.5' },
  { n: 78, unit: 16, title: 'Generalised advantage estimation', read: 'Schulman et al. (2016), GAE' },
  { n: 79, unit: 16, title: 'Continuous actions', read: 'S&B §13.7' },

  // Unit 17: PPO
  { n: 80, unit: 17, title: 'Why big steps break things', read: 'Schulman et al. (2015), TRPO, §1' },
  { n: 81, unit: 17, title: 'KL divergence', read: 'Any intro to information theory' },
  { n: 82, unit: 17, title: 'The probability ratio', read: 'Schulman et al. (2017), PPO, §3' },
  { n: 83, unit: 17, title: 'The clipped objective', read: 'Schulman et al. (2017), PPO, §3' },
  { n: 84, unit: 17, title: 'Entropy bonuses', read: 'Schulman et al. (2017), PPO, §5' },

  // Unit 18: RL for language models
  { n: 85, unit: 18, title: 'A language model is a policy', read: 'Lambert, RLHF Book (rlhfbook.com), introduction' },
  { n: 86, unit: 18, title: 'From preferences to scores', read: 'Lambert, RLHF Book, reward modelling chapter' },
  { n: 87, unit: 18, title: 'Reward models', read: 'Lambert, RLHF Book, reward modelling chapter' },
  { n: 88, unit: 18, title: 'The KL penalty', read: 'Lambert, RLHF Book, regularisation chapter' },
  { n: 89, unit: 18, title: 'Direct preference optimisation', read: 'Rafailov et al. (2023), DPO' },

  // Unit 19: When RL goes wrong
  { n: 90, unit: 19, title: 'Reward hacking', read: 'Krakovna et al. (2020), Specification gaming' },
  { n: 91, unit: 19, title: "Goodhart's law", read: 'Gao, Schulman & Hilton (2022), Scaling laws for reward model overoptimization' },
  { n: 92, unit: 19, title: 'Verifiable rewards', read: 'Lambert et al. (2024), Tülu 3 (RL with verifiable rewards)' },
  { n: 93, unit: 19, title: 'GRPO', read: 'Shao et al. (2024), DeepSeekMath, §4' },
  { n: 94, unit: 19, title: 'Sparse rewards and curiosity', read: 'Bellemare et al. (2016); Pathak et al. (2017)' },

  // Unit 20: The big picture
  { n: 95, unit: 20, title: 'Tree search', read: 'S&B §8.11 (MCTS)' },
  { n: 96, unit: 20, title: 'AlphaZero', read: 'Silver et al. (2018), AlphaZero' },
  { n: 97, unit: 20, title: 'World models', read: 'Schrittwieser et al. (2020), MuZero; Ha & Schmidhuber (2018)' },
  { n: 98, unit: 20, title: 'Offline RL', read: 'Levine et al. (2020), Offline RL tutorial, §1–2' },
  { n: 99, unit: 20, title: 'Multi-agent RL', read: 'Busoniu, Babuska & De Schutter (2008), A comprehensive survey of multiagent RL' },
  { n: 100, unit: 20, title: 'Final review', read: 'Lessons 1–99' },
];
