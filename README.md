# Task Timer

**Before I start, a disclaimer.** This app is probably about 80% vibe-coded with the generated code very quickly reviewed so there's guaranteed to be things I wouldn't usually do. The reason for creating this was because I wanted to see where my time was going on a daily basis and rather than keeping a notebook next to me, or an excel sheet, I thought I'd start getting to grips with Anthropic's Claude Code as I'm a little later than most to the whole AI train.

The `CLAUDE.md` does give a fairly decent overview of what the app does and the technology etc. but at a high level, this is an entirely client-side PWA created with React and TypeScript.

The app allows you to create your own reusable timers, track your time on those tasks throughout the day and then review the data at a later date through the Analytics page with charts etc. to show a breakdown of the data.

Your data never leaves your machine, as it's all stored in the IndexedDB within your browser, but you can export the data out to JSON if you wanted to consume the data elsewhere.

Sure, there's plenty of apps out there that do the same thing, and they probably do that thing better too. But this was an opportunity for trying out Claude Code to solve a problem I had there and then. Plus, I don't need the dependency of a Database being created anywhere, or auth, or hosting as a client-side React app can just go into GitHub Pages ;)

