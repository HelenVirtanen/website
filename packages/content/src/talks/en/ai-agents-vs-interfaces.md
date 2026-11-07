---
event: "32"
speakers:
  - anastasiya-maltseva
title: "Press the button if you can: 10 interfaces vs AI agents"
---

AI agents interact with an interface in different ways: some look at a screenshot and click by coordinates, others use the accessibility tree and element references, and others can combine page structure, a visual representation and browser access. I want to figure out how an agent's way of "seeing" a page affects its work, and which frontend decisions make an interface easier or harder for an AI user.

For the experiment I'll build a set of interfaces that look the same but are implemented differently: native and custom controls, a broken accessibility tree, a conflict between visible text and aria-label, virtualised lists, canvas. I'll run the same user tasks through agents with different ways of interacting with the browser, such as OpenAI Computer Use, Claude in Chrome and Browser Use, and compare success rates, errors and how exactly the agent solves the task: through the page structure or visually. As a result, we'll try to understand which properties of an interface really matter when its user is an AI agent.
