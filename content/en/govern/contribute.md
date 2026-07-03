---
title: Contributing to ALPS
description: "How to contribute code, documentation, and tutorials to the ALPS project"
weight: 2
toc: true
---

ALPS is an open-source project and welcomes contributions at every level — from a bug report or tutorial fix to a new simulation method or library. This page describes how to get involved. The full technical details are in [CONTRIBUTING.md](https://github.com/ALPSim/ALPS/blob/master/CONTRIBUTING.md) in the ALPS repository.

## Ways to contribute

| Level | What this looks like |
|---|---|
| **1 — Feedback** | Install ALPS, try a tutorial, open an issue when something is unclear or broken |
| **2 — Documentation & tutorials** | Improve or extend tutorials on this website, fix documentation errors, add examples |
| **3 — Maintenance** | Fix bugs, improve tests, update dependencies, answer community questions on Discord |
| **4 — New code** | Contribute a new algorithm, library, or simulation application |

You do not need to start at the bottom — jump in wherever your skills and interests fit.

Students new to the project may also want to read the [Onboarding Statement for Students](../onboard), which describes each level in more detail and explains what to expect from the collaboration.

## Before you start

For **bug reports, feature requests, and documentation fixes**, you can open an issue or pull request directly on [GitHub](https://github.com/ALPSim/ALPS) without any prior contact.

For **new simulation applications or libraries** (Level 4), please reach out to a member of the [Governing Council](../#alps-community-steering-committee) before starting significant work. This avoids duplication of effort and ensures the new code fits the ALPS architecture and maintenance model.

If you are unsure where to start, drop a message on [Discord](https://discord.gg/JRNWnnva9g) — the community is friendly and happy to point you in the right direction.

## The contribution workflow

The full workflow is documented in [CONTRIBUTING.md](https://github.com/ALPSim/ALPS/blob/master/CONTRIBUTING.md). In brief:

1. **Fork** the [ALPS repository](https://github.com/ALPSim/ALPS) and clone your fork locally.
2. **Build and test** to confirm everything works on your machine before making changes.
3. **Create a branch** for your change (`fix/`, `feat/`, or `docs/` prefix by convention).
4. **Make your change**, adding or updating tests as appropriate.
5. **Open a pull request** against the `master` branch. Fill in the pull request template — in particular, describe how the change was tested and, for simulation code, how results were validated against known reference values.
6. **Respond to review comments.** Core maintainers will review your PR; acceptance requires either consensus approval or no objections within six weeks.

## What we look for in a pull request

- CI passes on all platforms (Linux and macOS).
- No new compiler warnings (`-Wall -Wextra` for C++ code).
- New or modified behaviour is covered by tests.
- Simulation results are validated against a published reference or known analytic result.
- Commit messages are descriptive and written in the imperative mood.

## Recognition

ALPS releases are accompanied by a peer-reviewed publication. **Active contributors are added as co-authors.** The [Governing Council](../#alps-community-steering-committee) decides the author list for each release, taking into account contributions to code, documentation, tutorials, testing, and community support.

Contributing at Level 2 or above — that is, improving documentation and tutorials, fixing bugs, or adding new features — with sustained effort is the typical threshold for co-authorship consideration.

## Getting help

| Channel | Use it for |
|---|---|
| [Discord](https://discord.gg/JRNWnnva9g) | Questions, development discussion, meeting the community |
| [GitHub Issues](https://github.com/ALPSim/ALPS/issues) | Bug reports, feature requests, concrete problems |
| [ALPS workshops](../../events) | In-person and virtual community meetings |
| [Governing Council](../#alps-community-steering-committee) | Onboarding for new simulation codes, major contributions |
