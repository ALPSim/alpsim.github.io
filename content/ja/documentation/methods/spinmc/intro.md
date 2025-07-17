---
title: Introduction
math: true
weight: 1
---

Classical Monte Carlo (MC) simulations are a powerful and widely used computational technique for studying the statistical mechanics of physical systems. Named after the famous Monte Carlo casino due to its reliance on random sampling, this method is particularly well-suited for investigating systems with a large number of degrees of freedom, where analytical solutions are often intractable. Monte Carlo simulations are based on stochastic processes and probabilistic rules, enabling the exploration of equilibrium properties, phase transitions, and thermodynamic behavior in a Physical system.

At the core of classical Monte Carlo simulations is the concept of importance sampling, where configurations of the system are generated according to a probability distribution that is typically the Boltzmann distribution in the canonical ensemble. By sampling configurations in proportion to their statistical weight, Monte Carlo methods allow for the calculation of ensemble averages of physical quantities, such as energy, magnetization, or correlation functions, without explicitly enumerating all possible states of the system — a task that is often computationally infeasible.

## Key Principles of Monte Carlo Simulations

### Ergodicity
A fundamental requirement for Monte Carlo simulations is ergodicity, which ensures that the simulation explores the entire configuration space of the system given sufficient time. In other words, every possible state of the system must be accessible through a sequence of Monte Carlo moves. Without ergodicity, the simulation may become trapped in a subset of configurations, leading to biased results. Ensuring ergodicity often requires careful design of the Monte Carlo moves, especially for systems with complex energy landscapes.

### Detailed Balance
Another critical principle in Monte Carlo simulations is detailed balance, which guarantees that the system evolves toward equilibrium and samples states according to the desired probability distribution (e.g., the Boltzmann distribution). Detailed balance is a condition that ensures the transition probabilities between states satisfy:
$$
P_i \cdot P_{i \to j} = P_j \cdot P_{j \to i},
$$
where $P_i$ and $P_j$ are the equilibrium probabilities of states $i$ and $j$, and $P_{i \to j}$ is the transition probability from state $i$ to state $j$. 

## Metropolis-Hastings Algorithm
The Metropolis-Hastings algorithm, one of the most commonly used Monte Carlo techniques, enforces detailed balance by accepting or rejecting proposed moves based on a probabilistic criterion that depends on the change in energy and the temperature of the system. It employs a Markov chain process to generate a sequence of configurations, ensuring that the system evolves toward equilibrium. The algorithm involves the following steps:
1. Propose a random change to the system (e.g., particle displacements or spin flips).
2. Calculate the change in energy $\Delta E$ associated with the proposed move.
3. Accept or reject the move based on the acceptance probability:
$$
P_{i \to j} = \min\left(1, e^{-\beta \Delta E}\right),
$$
where $\beta = 1/(k_B T)$ is the inverse temperature. This acceptance rule ensures detailed balance and drives the system toward equilibrium.

## Heat-Bath Algorithm
For the heat-bath algorithm, the transition probabilities are explicitly designed to satisfy this condition. The equilibrium probability of a state is given by the Boltzmann distribution:
$$
P_i \propto e^{-\beta E_i},
$$
where $E_i$ is the total energy of the system in state $i$. Let the transition probability from state $i$ to state $j$ be 
$$
P_{i \to j} = \frac{e^{-\beta E_j}}{e^{-\beta E_i} + e^{-\beta E_j}},
$$
and correspondingly the transition probability from state $j$ to state $i$ be 
$$
P_{j \to i} = \frac{e^{-\beta E_i}}{e^{-\beta E_i} + e^{-\beta E_j}}.
$$

Substituting the transition probabilities into the detailed balance condition, we have:
$$
P_i \cdot P_{i \to j} = e^{-\beta E_i} \cdot \frac{e^{-\beta E_j}}{e^{-\beta E_i} + e^{-\beta E_j}} = e^{-\beta E_j} \cdot \frac{e^{-\beta E_i}}{e^{-\beta E_i} + e^{-\beta E_j}} = P_j \cdot P_{j \to i}.
$$
Thus, the heat-bath algorithm inherently satisfies detailed balance.
